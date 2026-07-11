export function normalizarTexto(texto) {
  return String(texto || '').trim().toUpperCase();
}

export function emailTemDominioPermitido(emailInformado) {
  const emailNormalizado = String(emailInformado || '').trim().toLowerCase();

  return (
    emailNormalizado.endsWith('@aluno.ufop.edu.br') ||
    emailNormalizado.endsWith('@ufop.edu.br')
  );
}

export function rotaContemIcea(origem, destino) {
  return (
    normalizarTexto(origem) === 'ICEA' ||
    normalizarTexto(destino) === 'ICEA'
  );
}
