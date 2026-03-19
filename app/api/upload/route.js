import { NextResponse } from "next/server";
import Papa from "papaparse";
import { store } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { checkApiKey } from "@/lib/auth";

const BATCH_SIZE = 500;

export async function POST(request) {
  const authError = checkApiKey(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ detail: "No se recibió ningún archivo." }, { status: 400 });
    }
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ detail: "El archivo debe tener extensión .csv" }, { status: 400 });
    }

    const text = await file.text();
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    if (!result.data || result.data.length === 0) {
      return NextResponse.json({ detail: "El CSV está vacío o no tiene registros." }, { status: 422 });
    }

    const parsedRows = result.data;
    const columns = result.meta.fields ?? [];

    // 1. Actualizar cache en memoria
    store.data = parsedRows;
    store.columns = columns;
    store.searchColumn = null;
    store.filename = file.name;
    store.rows = parsedRows.length;

    // 2. Limpiar filas anteriores en Supabase
    await supabase.from("csv_rows").delete().gte("id", 0);

    // 3. Insertar nuevas filas en lotes
    for (let i = 0; i < parsedRows.length; i += BATCH_SIZE) {
      const batch = parsedRows.slice(i, i + BATCH_SIZE).map((row) => ({ data: row }));
      const { error } = await supabase.from("csv_rows").insert(batch);
      if (error) throw new Error(`Error insertando filas: ${error.message}`);
    }

    // 4. Guardar configuración
    const { error: configError } = await supabase.from("csv_config").upsert({
      id: 1,
      filename: file.name,
      columns,
      search_column: null,
      updated_at: new Date().toISOString(),
    });
    if (configError) throw new Error(`Error guardando config: ${configError.message}`);

    return NextResponse.json({
      filename: file.name,
      rows: parsedRows.length,
      columns,
    });
  } catch (e) {
    return NextResponse.json({ detail: e.message }, { status: 500 });
  }
}
