import { supabase } from "./supabase";

// Cache en memoria: sobrevive hot-reloads en desarrollo
if (!globalThis._csvStore) {
  globalThis._csvStore = {
    data: null,
    columns: [],
    searchColumn: null,
    filename: null,
    rows: 0,
  };
}

export const store = globalThis._csvStore;

// Carga el store desde Supabase si la memoria está vacía (cold start / serverless)
export async function ensureStoreLoaded() {
  if (store.data !== null) return;

  const { data: config, error: configErr } = await supabase
    .from("csv_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (configErr || !config) return;

  const { data: rowsResult, error: rowsErr } = await supabase
    .from("csv_rows")
    .select("data")
    .order("id", { ascending: true });

  if (rowsErr || !rowsResult || rowsResult.length === 0) return;

  store.data = rowsResult.map((r) => r.data);
  store.columns = config.columns;
  store.searchColumn = config.search_column;
  store.filename = config.filename;
  store.rows = rowsResult.length;
}
