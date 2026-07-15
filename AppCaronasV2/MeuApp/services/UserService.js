import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from '../FirebaseConfig';

const USERS_COLLECTION = 'Users';

export async function autenticarUsuario(email, senha) {
  const emailNormalizado = String(email || '')
    .trim()
    .toLowerCase();

  const senhaInformada = String(senha || '');

  const consulta = query(
    collection(db, USERS_COLLECTION),
    where('email', '==', emailNormalizado)
  );

  const snapshot = await getDocs(consulta);

  if (snapshot.empty) {
    return null;
  }

  const documento = snapshot.docs.find(
    (item) =>
      String(item.data().senha) === senhaInformada
  );

  if (!documento) {
    return null;
  }

  return {
    id: documento.id,
    ...documento.data(),
  };
}

export async function emailJaCadastrado(email) {
  const emailNormalizado = String(email || '')
    .trim()
    .toLowerCase();

  const consulta = query(
    collection(db, USERS_COLLECTION),
    where('email', '==', emailNormalizado)
  );

  const snapshot = await getDocs(consulta);

  return !snapshot.empty;
}

export async function cadastrarUsuario({
  nome,
  email,
  senha,
  perfil,
}) {
  const nomeNormalizado = String(nome || '').trim();

  const emailNormalizado = String(email || '')
    .trim()
    .toLowerCase();

  const senhaInformada = String(senha || '');

  const emailEmUso = await emailJaCadastrado(
    emailNormalizado
  );

  if (emailEmUso) {
    const error = new Error(
      'Este e-mail já está cadastrado.'
    );

    error.code = 'EMAIL_JA_CADASTRADO';

    throw error;
  }

  const novoUsuario = {
    nome: nomeNormalizado,
    email: emailNormalizado,
    senha: senhaInformada,
    perfil: perfil || 'Passageiro',
    administrador: false,
    ativo: true,
    criadoEm: serverTimestamp(),
  };

  const referencia = await addDoc(
    collection(db, USERS_COLLECTION),
    novoUsuario
  );

  return {
    id: referencia.id,
    nome: nomeNormalizado,
    email: emailNormalizado,
    senha: senhaInformada,
    perfil: perfil || 'Passageiro',
    administrador: false,
    ativo: true,
  };
}