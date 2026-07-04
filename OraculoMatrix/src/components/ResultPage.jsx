import { useMemo } from "react";

function ResultPage({ selectedPill, onRestart, onAbout }) {
  const oracleMessage = useMemo(() => {
    const messages = selectedPill.results || [selectedPill.result];
    const randomIndex = Math.floor(Math.random() * messages.length);

    return messages[randomIndex];
  }, [selectedPill]);

  return (
    <section className="page-card result-card">
      <p className="eyebrow">Resultado</p>
      <h1>{selectedPill.name}</h1>
      <p className="lead">{selectedPill.tone}</p>

      <blockquote className="oracle-message">
        “{oracleMessage}”
      </blockquote>

      <div className="page-actions">
        <button type="button" className="secondary-button" onClick={onRestart}>
          Refazer Caminho
        </button>
        <button type="button" className="primary-button" onClick={onAbout}>
          Conceitos de IHC
        </button>
      </div>
    </section>
  );
}

export default ResultPage;