import { NextResponse } from "next/server";
import { store, ensureStoreLoaded } from "@/lib/store";
import { checkApiKey } from "@/lib/auth";

export async function GET(request) {
  const authError = checkApiKey(request);
  if (authError) return authError;

  await ensureStoreLoaded();

  return NextResponse.json({
    csv_loaded: store.data !== null,
    filename: store.filename,
    rows: store.rows,
    columns: store.columns,
    search_column: store.searchColumn,
  });
}
