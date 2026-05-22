function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000, #0f2027)",
        color: "#e0e0e0",
        fontFamily: "Segoe UI, Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          padding: "30px",
          borderRadius: "12px",
          background: "rgba(0, 0, 0, 0.7)",
          boxShadow: "0 0 20px rgba(0, 255, 100, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 style={{ color: "#00ff88", marginBottom: "10px" }}>
          Aluno: Luccas Vinicius - 20.1.8015
        </h2>

        <h2 style={{ marginBottom: "20px" }}>
          Ideia: Oráculo "Pílula Vermelha ou Azul"
        </h2>

        <p style={{ lineHeight: "1.6" }}>
          Inspirado no filme Matrix, o sistema apresenta ao usuário duas opções:
          <span style={{ color: "#ff4c4c" }}> pílula vermelha</span> e
          <span style={{ color: "#4c8bff" }}> pílula azul</span>.
        </p>

        <p style={{ lineHeight: "1.6" }}>
          Ao escolher a pílula vermelha, o usuário recebe uma resposta mais
          direta e confrontadora (verdade). Ao escolher a pílula azul, recebe uma
          resposta mais confortável e tranquilizadora.
        </p>

        <p style={{ lineHeight: "1.6" }}>
          O objetivo é explorar a interação simples por escolha binária e o
          impacto emocional das respostas no usuário.
        </p>

        <div
          style={{
            marginTop: "20px",
            height: "2px",
            background: "linear-gradient(to right, #00ff88, transparent)",
          }}
        />
      </div>
    </div>
  );
}

export default App;
