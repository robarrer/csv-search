import { NextResponse } from "next/server";
import { store, ensureStoreLoaded } from "@/lib/store";
import { checkApiKey } from "@/lib/auth";

export async function GET(request, { params }) {
  const authError = checkApiKey(request);
  if (authError) return authError;

  await ensureStoreLoaded();

  if (!store.data) {
    return NextResponse.json({ detail: "Primero debes subir un CSV." }, { status: 400 });
  }
  if (!store.searchColumn) {
    return NextResponse.json({ detail: "Primero debes configurar la columna de búsqueda." }, { status: 400 });
  }

  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode).trim().toLowerCase();
  const col = store.searchColumn;

  const results = store.data.filter(
    (row) => (row[col] ?? "").toString().trim().toLowerCase() === code
  );

  return NextResponse.json({
    query: rawCode,
    search_column: col,
    total_results: results.length,
    results,
  });
}
