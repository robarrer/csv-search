"use client";
import { useState } from "react";

export default function SearchStep({ csvInfo, searchColumn, onReset }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    const code = query.trim();
    if (!code) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/search/${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setResult(data);
    } catch (e) {
      setError(e.message || "Error al realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  }

  const columns = csvInfo?.columns ?? [];

  return (
    <div>
      <div className="info-bar">
        <div className="info-item">
          <span className="info-label">Archivo</span>
          <span className="info-value">{csvInfo?.filename}</span>
        </div>
        <div className="info-sep" />
        <div className="info-item">
          <span className="info-label">Filas</span>
          <span className="info-value">{csvInfo?.rows}</span>
        </div>
        <div className="info-sep" />
        <div className="info-item">
          <span className="info-label">Columna de búsqueda</span>
          <span className="info-value highlight">{searchColumn}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onReset}>Cambiar CSV</button>
      </div>

      <h2 className="section-title" style={{ marginTop: 24 }}>Buscar registro</h2>
      <p className="section-subtitle">
        Ingresa el código a buscar en la columna <strong style={{ color: "#a5b4fc" }}>{searchColumn}</strong>.
      </p>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="search-input"
          type="text"
          placeholder={`Código en "${searchColumn}"...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button className="btn btn-primary" type="submit" disabled={loading || !query.trim()}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <div className="error-msg">⚠️ {error}</div>}

      {result && (
        <div className="results-section">
          <div className="results-header">
            <span className="results-count">
              {result.total_results === 0
                ? "Sin resultados"
                : `${result.total_results} resultado${result.total_results !== 1 ? "s" : ""} para "${result.query}"`}
            </span>
          </div>
          {result.total_results === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <p>No se encontró ningún registro con ese código.</p>
            </div>
          ) : (
            <div className="results-list">
              {result.results.map((row, i) => (
                <div key={i} className="result-card">
                  <div className="result-index">#{i + 1}</div>
                  <div className="result-fields">
                    {columns.map((col) => (
                      <div key={col} className={`result-field ${col === searchColumn ? "highlight-field" : ""}`}>
                        <span className="field-key">{col}</span>
                        <span className="field-value">{row[col] || <em className="empty-val">—</em>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
