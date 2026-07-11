export function formatarMoeda(valorInformado) {
  const valorNumerico = Number(valorInformado || 0);

  return `R$ ${valorNumerico.toFixed(2).replace('.', ',')}`;
}

export function formatarAvaliacao(valorInformado) {
  const avaliacao = Math.max(0, Math.min(5, Number(valorInformado || 0)));

  return `${'★'.repeat(avaliacao)}${'☆'.repeat(5 - avaliacao)}`;
}
