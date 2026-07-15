import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import { db } from './FirebaseConfig';

const users = [
  {
    id: 'luccas-carneiro',
    nome: 'Luccas Carneiro',
    email: 'luccas.carneiro@aluno.ufop.edu.br',
    senha: 'luccas123',
    perfil: 'Ambos',
    administrador: false,
    ativo: true,
  },
  {
    id: 'admin',
    nome: 'Administrador ICEA',
    email: 'admin@ufop.edu.br',
    senha: 'admin123',
    perfil: 'Administrador',
    administrador: true,
    ativo: true,
  },
];

const caronas = [
  {
    id: 'carona-centro-icea-0730',
    motorista: 'Ana Paula',
    emailMotorista: 'ana.paula@aluno.ufop.edu.br',
    origem: 'Centro',
    destino: 'ICEA',
    horario: '07:30',
    valor: 5,
    vagas: 3,
    avaliacao: 5,
    regras: 'Pontualidade e mochila pequena.',
    ativa: true,
  },
  {
    id: 'carona-icea-carneirinhos-1830',
    motorista: 'Marcos Silva',
    emailMotorista: 'marcos.silva@aluno.ufop.edu.br',
    origem: 'ICEA',
    destino: 'Carneirinhos',
    horario: '18:30',
    valor: 4,
    vagas: 2,
    avaliacao: 4,
    regras: 'Sem animais.',
    ativa: true,
  },
  {
    id: 'carona-loanda-icea-1200',
    motorista: 'Bruno Henrique',
    emailMotorista: 'bruno.henrique@aluno.ufop.edu.br',
    origem: 'Loanda',
    destino: 'ICEA',
    horario: '12:00',
    valor: 6,
    vagas: 4,
    avaliacao: 4,
    regras: 'Aceita bagagem pequena.',
    ativa: true,
  },
  {
    id: 'carona-icea-cruzeiro-2200',
    motorista: 'Carla Mendes',
    emailMotorista: 'carla.mendes@ufop.edu.br',
    origem: 'ICEA',
    destino: 'Cruzeiro Celeste',
    horario: '22:00',
    valor: 7,
    vagas: 3,
    avaliacao: 5,
    regras: 'Saída cinco minutos após o fim da aula.',
    ativa: true,
  },
  {
    id: 'carona-centro-icea-1300',
    motorista: 'João Pedro',
    emailMotorista: 'joao.pedro@aluno.ufop.edu.br',
    origem: 'Centro',
    destino: 'ICEA',
    horario: '13:00',
    valor: 5,
    vagas: 1,
    avaliacao: 4,
    regras: 'Confirmar até 30 minutos antes.',
    ativa: true,
  },
  {
    id: 'carona-icea-areia-preta-1730',
    motorista: 'Fernanda Souza',
    emailMotorista: 'fernanda.souza@aluno.ufop.edu.br',
    origem: 'ICEA',
    destino: 'Areia Preta',
    horario: '17:30',
    valor: 5.5,
    vagas: 2,
    avaliacao: 5,
    regras: 'Sem restrições.',
    ativa: true,
  },
];

export async function seedDatabase() {
  const batch = writeBatch(db);

  users.forEach((user) => {
    const { id, ...dados } = user;

    batch.set(
      doc(db, 'Users', id),
      {
        ...dados,
        atualizadoEm: serverTimestamp(),
      },
      { merge: true }
    );
  });

  const caronasComOcupacao = await Promise.all(
    caronas.map(async (carona) => {
      const caronaRef = doc(db, 'Caronas', carona.id);
      const snapshot = await getDoc(caronaRef);

      return {
        ...carona,
        vagasPreenchidas: snapshot.exists()
          ? Number(snapshot.data().vagasPreenchidas || 0)
          : 0,
      };
    })
  );

  caronasComOcupacao.forEach((carona) => {
    const { id, ...dados } = carona;

    batch.set(
      doc(db, 'Caronas', id),
      {
        ...dados,
        atualizadoEm: serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();

  return {
    users: users.length,
    caronas: caronas.length,
  };
}
