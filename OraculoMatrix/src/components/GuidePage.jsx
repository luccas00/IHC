function GuidePage({ onBack, onStart }) {
  return (
    <section className="page-card">
      <p className="eyebrow">Orientação</p>
      <h1>Como funciona?</h1>
      <p className="lead">
        O sistema não classifica respostas como certas ou erradas. Ele apenas interpreta sua preferência de interação: mais conforto, mais equilíbrio ou mais confronto com a realidade.
      </p>

      {/* <div className="info-grid">
        <article className="info-card">
          <h2>Affordance</h2>
          <p>Botões grandes e textos objetivos indicam claramente onde clicar e qual ação será executada.</p>
        </article>
        <article className="info-card">
          <h2>Feedback</h2>
          <p>Cada escolha avança o fluxo e atualiza a barra de progresso, reduzindo incerteza para o usuário.</p>
        </article>
        <article className="info-card">
          <h2>Acessibilidade</h2>
          <p>Contraste alto, foco visível, navegação por teclado e rótulos semânticos foram considerados na interface.</p>
        </article>
      </div> */}

      <div className="page-actions">
        <button type="button" className="secondary-button" onClick={onBack}>Voltar</button>
        <button type="button" className="primary-button" onClick={onStart}>Começar Teste</button>
      </div>
    </section>
  );
}

export default GuidePage;
