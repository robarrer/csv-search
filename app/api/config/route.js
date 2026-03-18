import { NextResponse } from "next/server";
import { store, ensureStoreLoaded } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  await ensureStoreLoaded();

  if (!store.data) {
    return NextResponse.json({ detail: "Primero debes subir un CSV." }, { status: 400 });
  }

  const body = await request.json();
  const { column } = body;

  if (!column || !store.columns.includes(column)) {
    return NextResponse.json(
      { detail: `La columna '${column}' no existe. Columnas: ${store.columns.join(", ")}` },
      { status: 400 }
    );
  }

  // Actualizar memoria y Supabase
  store.searchColumn = column;

  await supabase
    .from("csv_config")
    .update({ search_column: column, updated_at: new Date().toISOString() })
    .eq("id", 1);

  return NextResponse.json({ message: `Columna de búsqueda configurada: '${column}'` });
}
