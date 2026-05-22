function QuestionPage({ question, currentQuestionIndex, totalQuestions, onAnswer, onBack }) {
  return (
    <section className="page-card">
      <p className="eyebrow">Pergunta {currentQuestionIndex + 1} de {totalQuestions}</p>
      <h1>{question.title}</h1>
      <p className="helper-text">Escolha uma alternativa. O avanço será automático após a seleção.</p>

      <div className="option-list" role="list">
        {question.options.map((option) => (
          <button
            key={option.label}
            type="button"
            className="option-button"
            onClick={() => onAnswer(option)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="page-actions left-only">
        <button type="button" className="secondary-button" onClick={onBack}>Voltar</button>
      </div>
    </section>
  );
}

export default QuestionPage;
