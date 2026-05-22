import { useEffect, useState } from "react";

const MATRIX_URL = "https://rezmason.github.io/matrix/?version=resurrections&skipIntro=false&fps=32&raindropLength=1&fallSpeed=0.5&animationSpeed=0.2&cycleSpeed=0.006";

function MatrixBackground() {
  const [matrixEnabled, setMatrixEnabled] = useState(() => {
    return localStorage.getItem("matrix_active") !== "0";
  });

  useEffect(() => {
    localStorage.setItem("matrix_active", matrixEnabled ? "1" : "0");
  }, [matrixEnabled]);

  return (
    <>
      {matrixEnabled && (
        <iframe
          className="matrix-background"
          title="Plano de fundo animado Matrix"
          src={MATRIX_URL}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        className="matrix-toggle-button"
        onClick={() => setMatrixEnabled(!matrixEnabled)}
        aria-pressed={matrixEnabled}
      >
        {matrixEnabled ? "Desativar Fundo" : "Ativar Fundo"}
      </button>
    </>
  );
}

export default MatrixBackground;
