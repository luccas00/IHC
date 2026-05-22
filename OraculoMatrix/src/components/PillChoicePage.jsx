function PillChoicePage({ pills, suggestedPill, onChoose, onBack }) {
  return (
    <section className="page-card wide-card">
      <p className="eyebrow">Escolha Da Pílula</p>
      <h1>Selecione sua dose de realidade</h1>
      <p className="lead">
        Com base nas respostas, a sugestão do sistema é <strong>{suggestedPill.name}</strong>. Você ainda pode escolher qualquer uma das opções.
      </p>

      <div className="pill-grid">
        {pills.map((pill) => (
          <button
            key={pill.id}
            type="button"
            className={pill.id === suggestedPill.id ? `pill-card ${pill.id} suggested` : `pill-card ${pill.id}`}
            onClick={() => onChoose(pill.id)}
            aria-label={`Escolher ${pill.name}: ${pill.description}`}
          >
            <span className="pill-shape" />
            <span className="pill-name">{pill.name}</span>
            <span className="pill-tone">{pill.tone}</span>
            <span className="pill-description">{pill.description}</span>
            {pill.id === suggestedPill.id && <span className="suggested-badge">Sugestão</span>}
          </button>
        ))}
      </div>

      <div className="page-actions left-only">
        <button type="button" className="secondary-button" onClick={onBack}>Voltar</button>
      </div>
    </section>
  );
}

export default PillChoicePage;
