"use client";
import { useState } from "react";

export default function ColumnStep({ csvInfo, onDone, onBack }) {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    if (!selected) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ column: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      onDone(selected);
    } catch (e) {
      setError(e.message || "Error al configurar la columna.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="section-title">Selecciona la columna de búsqueda</h2>
      <p className="section-subtitle">
        Archivo: <strong style={{ color: "#a5b4fc" }}>{csvInfo.filename}</strong> —{" "}
        {csvInfo.rows} filas · {csvInfo.columns.length} columnas
      </p>
      <div className="column-grid">
        {csvInfo.columns.map((col) => (
          <button
            key={col}
            className={`column-card ${selected === col ? "selected" : ""}`}
            onClick={() => setSelected(col)}
          >
            <span className="col-icon">#</span>
            <span className="col-name">{col}</span>
            {selected === col && <span className="col-check">✓</span>}
          </button>
        ))}
      </div>
      {error && <div className="error-msg">⚠️ {error}</div>}
      <div className="step-actions">
        <button className="btn btn-ghost" onClick={onBack}>← Volver</button>
        <button
          className="btn btn-primary"
          disabled={!selected || loading}
          onClick={handleConfirm}
        >
          {loading ? "Configurando..." : "Confirmar columna →"}
        </button>
      </div>
    </div>
  );
}
