import { NextResponse } from "next/server";
import { store, ensureStoreLoaded } from "@/lib/store";

export async function GET() {
  await ensureStoreLoaded();

  return NextResponse.json({
    csv_loaded: store.data !== null,
    filename: store.filename,
    rows: store.rows,
    columns: store.columns,
    search_column: store.searchColumn,
  });
}
