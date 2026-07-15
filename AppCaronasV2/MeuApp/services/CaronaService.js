import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../FirebaseConfig';

const CARONAS_COLLECTION = 'Caronas';

export async function buscarCaronas() {
  const caronasRef = collection(db, CARONAS_COLLECTION);

  try {
    const snapshot = await getDocs(
      query(caronasRef, orderBy('horario', 'asc'))
    );

    return snapshot.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));
  } catch (error) {
    const snapshot = await getDocs(caronasRef);

    return snapshot.docs
      .map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }))
      .sort((a, b) => String(a.horario).localeCompare(String(b.horario)));
  }
}

export async function criarCarona(carona) {
  const documento = {
    motorista: String(carona.motorista || '').trim(),
    emailMotorista: String(carona.emailMotorista || '').trim().toLowerCase(),
    origem: String(carona.origem || '').trim(),
    destino: String(carona.destino || '').trim(),
    horario: String(carona.horario || '').trim(),
    valor: Number(carona.valor),
    vagas: Number(carona.vagas),
    vagasPreenchidas: 0,
    avaliacao: Number(carona.avaliacao || 5),
    regras: String(carona.regras || '').trim(),
    ativa: true,
    criadoEm: serverTimestamp(),
  };

  const referencia = await addDoc(
    collection(db, CARONAS_COLLECTION),
    documento
  );

  return referencia.id;
}
