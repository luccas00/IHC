import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from '../FirebaseConfig';

const CARONAS_COLLECTION = 'Caronas';
const RESERVAS_COLLECTION = 'Reservas';

function gerarReservaId(caronaId, passageiroId) {
  return `${caronaId}__${passageiroId}`.replace(/\//g, '_');
}

export async function buscarReservasDoUsuario(passageiroEmail) {
  const emailNormalizado = String(passageiroEmail || '')
    .trim()
    .toLowerCase();

  if (!emailNormalizado) {
    return [];
  }

  const consulta = query(
    collection(db, RESERVAS_COLLECTION),
    where('passageiroEmail', '==', emailNormalizado)
  );

  const snapshot = await getDocs(consulta);

  return snapshot.docs
    .map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }))
    .sort((a, b) => String(a.horario).localeCompare(String(b.horario)));
}

export async function solicitarReserva(carona, usuario) {
  const passageiroId = String(usuario?.id || usuario?.email || '').trim();
  const passageiroEmail = String(usuario?.email || '').trim().toLowerCase();
  const passageiroNome = String(usuario?.nome || '').trim();

  if (!passageiroId || !passageiroEmail) {
    throw new Error('Usuário inválido para realizar a reserva.');
  }

  const reservaId = gerarReservaId(carona.id, passageiroId);
  const caronaRef = doc(db, CARONAS_COLLECTION, carona.id);
  const reservaRef = doc(db, RESERVAS_COLLECTION, reservaId);

  await runTransaction(db, async (transaction) => {
    const caronaSnapshot = await transaction.get(caronaRef);
    const reservaSnapshot = await transaction.get(reservaRef);

    if (!caronaSnapshot.exists()) {
      throw new Error('Carona não encontrada.');
    }

    const dadosCarona = caronaSnapshot.data();
    const emailMotorista = String(dadosCarona.emailMotorista || '')
      .trim()
      .toLowerCase();

    if (emailMotorista && emailMotorista === passageiroEmail) {
      throw new Error('Você não pode reservar uma vaga na própria carona.');
    }

    if (
      reservaSnapshot.exists() &&
      reservaSnapshot.data().status === 'Confirmada'
    ) {
      throw new Error('Você já possui uma reserva confirmada nesta carona.');
    }

    const vagasTotais = Number(dadosCarona.vagas || 0);
    const vagasPreenchidas = Number(dadosCarona.vagasPreenchidas || 0);

    if (vagasPreenchidas >= vagasTotais) {
      throw new Error('Não há vagas disponíveis nessa carona.');
    }

    transaction.set(
      reservaRef,
      {
        caronaId: carona.id,
        passageiroId,
        passageiroNome,
        passageiroEmail,
        motorista: String(dadosCarona.motorista || '').trim(),
        motoristaEmail: emailMotorista,
        origem: String(dadosCarona.origem || '').trim(),
        destino: String(dadosCarona.destino || '').trim(),
        horario: String(dadosCarona.horario || '').trim(),
        valor: Number(dadosCarona.valor || 0),
        status: 'Confirmada',
        criadoEm: serverTimestamp(),
        canceladoEm: null,
      },
      { merge: true }
    );

    transaction.update(caronaRef, {
      vagasPreenchidas: vagasPreenchidas + 1,
    });
  });

  return reservaId;
}

export async function cancelarReserva(reserva) {
  const reservaRef = doc(db, RESERVAS_COLLECTION, reserva.id);
  const caronaRef = doc(db, CARONAS_COLLECTION, reserva.caronaId);

  await runTransaction(db, async (transaction) => {
    const reservaSnapshot = await transaction.get(reservaRef);
    const caronaSnapshot = await transaction.get(caronaRef);

    if (!reservaSnapshot.exists()) {
      throw new Error('Reserva não encontrada.');
    }

    const dadosReserva = reservaSnapshot.data();

    if (dadosReserva.status !== 'Confirmada') {
      throw new Error('Esta reserva já foi cancelada.');
    }

    if (!caronaSnapshot.exists()) {
      throw new Error('A carona vinculada à reserva não foi encontrada.');
    }

    const dadosCarona = caronaSnapshot.data();
    const vagasPreenchidas = Number(dadosCarona.vagasPreenchidas || 0);

    transaction.update(reservaRef, {
      status: 'Cancelada',
      canceladoEm: serverTimestamp(),
    });

    transaction.update(caronaRef, {
      vagasPreenchidas: Math.max(0, vagasPreenchidas - 1),
    });
  });
}
