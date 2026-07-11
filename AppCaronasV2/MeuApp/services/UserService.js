import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '../FirebaseConfig';

const USERS_COLLECTION = 'Users';

export async function autenticarUsuario(email, senha) {
  const emailNormalizado = String(email || '').trim().toLowerCase();
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
    (item) => String(item.data().senha) === senhaInformada
  );

  if (!documento) {
    return null;
  }

  return {
    id: documento.id,
    ...documento.data(),
  };
}
