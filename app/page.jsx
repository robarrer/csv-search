"use client";
import { useState } from "react";
import UploadStep from "@/components/UploadStep";
import ColumnStep from "@/components/ColumnStep";
import SearchStep from "@/components/SearchStep";

const STEPS = ["Subir CSV", "Columna de búsqueda", "Buscar"];

export default function Home() {
  const [step, setStep] = useState(0);
  const [csvInfo, setCsvInfo] = useState(null);
  const [searchColumn, setSearchColumn] = useState(null);

  function handleUploadDone(info) {
    setCsvInfo(info);
    setSearchColumn(null);
    setStep(1);
  }

  function handleColumnDone(col) {
    setSearchColumn(col);
    setStep(2);
  }

  function handleReset() {
    setCsvInfo(null);
    setSearchColumn(null);
    setStep(0);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="logo">📄</span>
          <h1>CSV Search</h1>
        </div>
      </header>

      <main className="app-main">
        <div className="stepper">
          {STEPS.map((label, i) => (
            <div key={i} className={`step-item ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
              <div className="step-bubble">{i < step ? "✓" : i + 1}</div>
              <span className="step-label">{label}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="step-content">
          {step === 0 && <UploadStep onDone={handleUploadDone} />}
          {step === 1 && csvInfo && (
            <ColumnStep csvInfo={csvInfo} onDone={handleColumnDone} onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <SearchStep csvInfo={csvInfo} searchColumn={searchColumn} onReset={handleReset} />
          )}
        </div>
      </main>
    </div>
  );
}
