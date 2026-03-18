"use client";
import { useState, useRef } from "react";

export default function UploadStep({ onDone }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function uploadFile(file) {
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setError("El archivo debe tener extensión .csv");
      return;
    }
    setError(null);
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      onDone(data);
    } catch (e) {
      setError(e.message || "Error al subir el archivo.");
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    uploadFile(e.dataTransfer.files[0]);
  }

  return (
    <div>
      <h2 className="section-title">Subir archivo CSV</h2>
      <p className="section-subtitle">
        Selecciona o arrastra un archivo CSV. La primera fila debe contener los nombres de las columnas.
      </p>
      <div
        className={`drop-zone ${dragging ? "dragging" : ""} ${loading ? "loading" : ""}`}
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => uploadFile(e.target.files[0])}
        />
        {loading ? (
          <div className="drop-inner">
            <div className="spinner" />
            <p>Procesando CSV...</p>
          </div>
        ) : (
          <div className="drop-inner">
            <span className="drop-icon">📂</span>
            <p className="drop-text">Haz clic o arrastra tu CSV aquí</p>
            <p className="drop-hint">Solo archivos .csv separados por comas</p>
          </div>
        )}
      </div>
      {error && <div className="error-msg">⚠️ {error}</div>}
    </div>
  );
}
