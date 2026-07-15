export const HORA_INICIAL = 0;
export const HORA_FINAL = 23;

export const MINUTO_INICIAL = 0;
export const MINUTO_FINAL = 59;

// 1 disponibiliza todos os minutos.
// Pode alterar para 5, 10, 15 ou 30.
export const INTERVALO_MINUTOS = 10;

export const HORA_PADRAO = 7;
export const MINUTO_PADRAO = 0;

function formatarParteHorario(valor) {
  return String(valor).padStart(2, '0');
}

export function gerarHorasDisponiveis() {
  const horas = [];

  for (
    let hora = HORA_INICIAL;
    hora <= HORA_FINAL;
    hora += 1
  ) {
    horas.push(formatarParteHorario(hora));
  }

  return horas;
}

export function gerarMinutosDisponiveis() {
  const minutos = [];

  for (
    let minuto = MINUTO_INICIAL;
    minuto <= MINUTO_FINAL;
    minuto += INTERVALO_MINUTOS
  ) {
    minutos.push(formatarParteHorario(minuto));
  }

  return minutos;
}

export function obterHorarioPadrao() {
  return `${formatarParteHorario(HORA_PADRAO)}:${formatarParteHorario(
    MINUTO_PADRAO
  )}`;
}