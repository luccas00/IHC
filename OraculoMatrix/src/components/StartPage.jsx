function StartPage({ onStart }) {
  return (
    <section className="page-card hero-card">
      <p className="eyebrow">IHC · Interface Web</p>
      <h1>Oráculo Matrix</h1>
      <p className="lead">
        Uma experiência interativa inspirada na escolha entre conforto e verdade.
      </p>

      <div className="hero-actions">
        <button type="button" className="primary-button" onClick={onStart}>
          Iniciar Jornada
        </button>
      </div>

      <div className="pill-preview" aria-label="Prévia das opções de pílula">
        <span className="pill-dot blue-dark" />
        <span className="pill-dot blue-light" />
        <span className="pill-dot purple" />
        <span className="pill-dot red-light" />
        <span className="pill-dot red-dark" />
      </div>
    </section>
  );
}

export default StartPage;
