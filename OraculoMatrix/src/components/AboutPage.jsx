function AboutPage({ onBack }) {
  return (
    <section className="page-card wide-card">
      <p className="eyebrow">Sobre O Projeto</p>
      <h1>Oráculo Matrix</h1>
      <p className="lead">
        Projeto desenvolvido por Luccas Vinicius - 20.1.8015 para a disciplina de Interação Humano-Computador.
      </p>

      <div className="info-grid two-columns">
        <article className="info-card">
          <h2>Proposta</h2>
          <p>Dar continuidade à prática anterior, evoluindo a escolha binária entre pílula vermelha e azul para uma interface com dosagem, orientação e fluxo guiado.</p>
        </article>
        <article className="info-card">
          <h2>Componentização</h2>
          <p>A interface foi dividida em componentes React independentes: cabeçalho, fundo, telas, perguntas, seleção de pílulas, resultado e rodapé.</p>
        </article>
        <article className="info-card">
          <h2>Navegação</h2>
          <p>A experiência usa múltiplas telas controladas por estado, evitando uma página única longa e criando um caminho claro para o usuário.</p>
        </article>
        <article className="info-card">
          <h2>Boas Práticas De IHC</h2>
          <p>Foram considerados affordance, feedback, consistência visual, prevenção de erro, contraste, foco visível e linguagem objetiva.</p>
        </article>
      </div>

      <div className="page-actions left-only">
        <button type="button" className="secondary-button" onClick={onBack}>Voltar Para Início</button>
      </div>
    </section>
  );
}

export default AboutPage;
