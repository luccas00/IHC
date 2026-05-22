// Aluno: Luccas Vinicius - 20.1.8015

import { useMemo, useState } from "react";
import MatrixBackground from "./components/MatrixBackground.jsx";
import Header from "./components/Header.jsx";
import StartPage from "./components/StartPage.jsx";
import GuidePage from "./components/GuidePage.jsx";
import QuestionPage from "./components/QuestionPage.jsx";
import PillChoicePage from "./components/PillChoicePage.jsx";
import ResultPage from "./components/ResultPage.jsx";
import AboutPage from "./components/AboutPage.jsx";
import Footer from "./components/Footer.jsx";

const progressPages = ["inicio", "orientacao", "perguntas", "pilulas", "resultado"];

const questions = [
  {
    id: 1,
    title: "Diante de uma situação difícil, o que você prefere receber primeiro?",
    options: [
      { label: "Uma verdade direta, mesmo que seja desconfortável.", value: 2 },
      { label: "Uma visão equilibrada, com contexto antes da resposta.", value: 0 },
      { label: "Uma resposta mais cuidadosa, para reduzir o impacto emocional.", value: -2 },
    ],
  },
  {
    id: 2,
    title: "Quando precisa decidir, qual caminho costuma fazer mais sentido?",
    options: [
      { label: "Encarar o problema de frente e resolver logo.", value: 2 },
      { label: "Analisar os dois lados antes de agir.", value: 0 },
      { label: "Evitar decisões bruscas e preservar estabilidade.", value: -2 },
    ],
  },
  {
    id: 3,
    title: "Qual tipo de resposta parece mais útil para você agora?",
    options: [
      { label: "Resposta objetiva, sem rodeios.", value: 2 },
      { label: "Resposta ponderada, sem extremos.", value: 0 },
      { label: "Resposta tranquila, com foco em segurança emocional.", value: -2 },
    ],
  },
];

const pills = [
  {
    id: "azul-intenso",
    name: "Azul Intenso",
    tone: "Conforto Máximo",
    score: -4,
    description: "Prioriza acolhimento, estabilidade e redução de impacto.",
    results: [
      "Nem toda resposta precisa ser uma ruptura. Às vezes, preservar energia também é uma escolha racional.",
      "Hoje, o melhor caminho é reduzir o ruído. Você não precisa resolver tudo no impacto da emoção.",
      "Buscar conforto não significa fugir da realidade. Significa ganhar fôlego antes de enfrentá-la.",
      "A estabilidade também é uma decisão. Em alguns momentos, manter-se inteiro vale mais do que ter razão.",
      "Você não precisa encarar tudo de uma vez. Algumas verdades podem ser processadas em partes.",
    ],
  },
  {
    id: "azul-claro",
    name: "Azul Claro",
    tone: "Conforto Moderado",
    score: -2,
    description: "Entrega uma verdade suavizada, sem confronto direto.",
    results: [
      "Você já percebeu parte da verdade, mas ainda prefere avançar em ritmo seguro. Isso não é fuga: é gestão de impacto.",
      "A resposta existe, mas não precisa vir como choque. Um passo consciente ainda é avanço.",
      "Você está próximo da clareza, mas prefere uma transição menos agressiva. Esse cuidado também tem valor.",
      "Nem toda decisão precisa ser radical. Às vezes, ajustar a rota é melhor do que romper com tudo.",
      "A verdade pode ser entregue com cuidado. O importante é não transformar conforto em paralisia.",
    ],
  },
  {
    id: "roxa",
    name: "Roxa",
    tone: "Equilíbrio",
    score: 0,
    description: "Mistura clareza e cuidado, sem pender para extremos.",
    results: [
      "A resposta está no meio do caminho: enxergar a realidade sem abandonar o controle emocional.",
      "Você não precisa escolher entre conforto e verdade. O melhor caminho é transformar clareza em ação possível.",
      "Equilíbrio não é indecisão. É analisar impacto, consequência e timing antes de agir.",
      "A melhor resposta talvez não seja a mais dura nem a mais confortável, mas a mais útil.",
      "Você está buscando lucidez sem perder estabilidade. Esse é um ponto forte, desde que não vire adiamento.",
    ],
  },
  {
    id: "vermelha-clara",
    name: "Vermelha Clara",
    tone: "Verdade Moderada",
    score: 2,
    description: "Traz confronto controlado, com direcionamento prático.",
    results: [
      "Você está pronto para ouvir o essencial. A verdade não precisa destruir conforto, mas precisa movimentar decisão.",
      "O problema já está visível. Agora a diferença está entre reconhecer e agir.",
      "Você não precisa de uma resposta perfeita. Precisa de uma decisão suficientemente clara para sair do lugar.",
      "A realidade está pedindo posicionamento. Ainda há espaço para cuidado, mas não para omissão.",
      "A verdade moderada ainda é verdade. Ela apenas chega com direção, não com agressão.",
    ],
  },
  {
    id: "vermelha-intensa",
    name: "Vermelha Intensa",
    tone: "Verdade Direta",
    score: 4,
    description: "Apresenta a resposta mais objetiva e confrontadora.",
    results: [
      "A resposta é simples: você já sabe o que precisa fazer, mas ainda procura permissão para adiar.",
      "O desconforto não é o problema. O problema é continuar negociando com uma situação que já mostrou o limite.",
      "A realidade não ficou mais difícil agora. Ela só ficou impossível de ignorar.",
      "Você não precisa de mais sinais. Precisa decidir o que vai fazer com os sinais que já recebeu.",
      "A verdade direta raramente é confortável, mas costuma economizar tempo.",
    ],
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState("inicio");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedPillId, setSelectedPillId] = useState(null);

  const currentProgressIndex = progressPages.indexOf(currentPage);
  const progressPercent =
    currentProgressIndex >= 0
      ? Math.round(((currentProgressIndex + 1) / progressPages.length) * 100)
      : 100;

  const totalScore = answers.reduce((total, answer) => total + answer.value, 0);

  const suggestedPill = useMemo(() => {
    return pills.reduce((closest, pill) => {
      const currentDistance = Math.abs(pill.score - totalScore);
      const closestDistance = Math.abs(closest.score - totalScore);
      return currentDistance < closestDistance ? pill : closest;
    }, pills[0]);
  }, [totalScore]);

  const selectedPill = pills.find((pill) => pill.id === selectedPillId) || suggestedPill;

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const startJourney = () => {
    setCurrentPage("orientacao");
  };

  const startQuestions = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedPillId(null);
    setCurrentPage("perguntas");
  };

  const answerQuestion = (option) => {
    const updatedAnswers = [
      ...answers.filter((answer) => answer.questionId !== questions[currentQuestionIndex].id),
      { questionId: questions[currentQuestionIndex].id, value: option.value, label: option.label },
    ];

    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentPage("pilulas");
    }
  };

  const goBackQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      return;
    }

    setCurrentPage("orientacao");
  };

  const choosePill = (pillId) => {
    setSelectedPillId(pillId);
    setCurrentPage("resultado");
  };

  const restart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedPillId(null);
    setCurrentPage("inicio");
  };

  return (
    <div className="app-shell">
      <MatrixBackground />
      <Header currentPage={currentPage} goToPage={goToPage} />

      <main className="app-content" aria-live="polite">
        {currentPage !== "sobre" && (
          <div className="progress-wrapper" aria-label="Progresso da jornada">
            <div className="progress-info">
              <span>Etapa {currentProgressIndex + 1} de {progressPages.length}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {currentPage === "inicio" && <StartPage onStart={startJourney} />}
        {currentPage === "orientacao" && <GuidePage onBack={() => goToPage("inicio")} onStart={startQuestions} />}
        {currentPage === "perguntas" && (
          <QuestionPage
            question={questions[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onAnswer={answerQuestion}
            onBack={goBackQuestion}
          />
        )}
        {currentPage === "pilulas" && (
          <PillChoicePage
            pills={pills}
            suggestedPill={suggestedPill}
            onChoose={choosePill}
            onBack={() => setCurrentPage("perguntas")}
          />
        )}
        {currentPage === "resultado" && (
          <ResultPage selectedPill={selectedPill} onRestart={restart} onAbout={() => goToPage("sobre")} />
        )}
        {currentPage === "sobre" && <AboutPage onBack={() => goToPage("inicio")} />}
      </main>

      <Footer />
    </div>
  );
}

export default App;