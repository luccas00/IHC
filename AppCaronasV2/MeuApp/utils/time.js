export function horarioParaMinutos(horario) {
  if (!horario) {
    return null;
  }

  const partes = String(horario).split(':');

  if (partes.length !== 2) {
    return null;
  }

  const hora = Number(partes[0]);
  const minuto = Number(partes[1]);

  if (
    !Number.isInteger(hora) ||
    !Number.isInteger(minuto) ||
    hora < 0 ||
    hora > 23 ||
    minuto < 0 ||
    minuto > 59
  ) {
    return null;
  }

  return hora * 60 + minuto;
}

export function intervaloHorarioValido(
  horarioInicio,
  horarioFim
) {
  if (!horarioInicio || !horarioFim) {
    return true;
  }

  const inicioEmMinutos =
    horarioParaMinutos(horarioInicio);
  const fimEmMinutos =
    horarioParaMinutos(horarioFim);

  if (
    inicioEmMinutos === null ||
    fimEmMinutos === null
  ) {
    return false;
  }

  return inicioEmMinutos <= fimEmMinutos;
}