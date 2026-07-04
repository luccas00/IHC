// Prática 5 - React Native
// Aluno: Luccas Vinicius
// App: Caronas ICEA

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('Passageiro');

  const [origemBusca, setOrigemBusca] = useState('');
  const [destinoBusca, setDestinoBusca] = useState('ICEA');
  const [horarioBusca, setHorarioBusca] = useState('');

  const [origemPublicar, setOrigemPublicar] = useState('');
  const [destinoPublicar, setDestinoPublicar] = useState('ICEA');
  const [horarioPublicar, setHorarioPublicar] = useState('');
  const [valor, setValor] = useState('');
  const [regras, setRegras] = useState('');

  const [timeTarget, setTimeTarget] = useState('');
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const caronasDisponiveis = [
    {
      id: 1,
      origem: 'Centro',
      destino: 'ICEA',
      motorista: 'Ana Paula',
      horario: '07:30',
      valor: 'R$ 5,00',
      avaliacao: '★★★★★',
    },
    {
      id: 2,
      origem: 'ICEA',
      destino: 'Carneirinhos',
      motorista: 'Marcos Silva',
      horario: '18:30',
      valor: 'R$ 4,00',
      avaliacao: '★★★★☆',
    },
    {
      id: 3,
      origem: 'João Monlevade Centro',
      destino: 'ICEA',
      motorista: 'Bruno Henrique',
      horario: '12:00',
      valor: 'R$ 6,00',
      avaliacao: '★★★★☆',
    },
    {
      id: 4,
      origem: 'ICEA',
      destino: 'Bairro República',
      motorista: 'Carla Mendes',
      horario: '22:00',
      valor: 'R$ 7,00',
      avaliacao: '★★★★★',
    },
  ];

  function emailValido() {
    return (
      email.endsWith('@aluno.ufop.edu.br') ||
      email.endsWith('@ufop.edu.br')
    );
  }

  function handleLogin() {
    if (!emailValido()) {
      Alert.alert(
        'E-mail inválido',
        'Use um e-mail institucional @aluno.ufop.edu.br ou @ufop.edu.br.'
      );
      return;
    }

    if (!senha) {
      Alert.alert('Senha obrigatória', 'Informe a senha para continuar.');
      return;
    }

    setScreen('home');
  }

  function rotaContemIcea(origem, destino) {
    return (
      origem.trim().toUpperCase() === 'ICEA' ||
      destino.trim().toUpperCase() === 'ICEA'
    );
  }

  function handleBuscarCarona() {
    if (!rotaContemIcea(origemBusca, destinoBusca)) {
      Alert.alert('Rota inválida', 'A origem ou o destino deve ser ICEA.');
      return;
    }

    if (!horarioBusca) {
      Alert.alert('Horário obrigatório', 'Selecione um horário.');
      return;
    }

    Alert.alert('Busca realizada', 'Caronas compatíveis encontradas.');
    setScreen('resultados');
  }

  function handlePublicarCarona() {
    if (!rotaContemIcea(origemPublicar, destinoPublicar)) {
      Alert.alert('Rota inválida', 'A origem ou o destino deve ser ICEA.');
      return;
    }

    if (!horarioPublicar) {
      Alert.alert('Horário obrigatório', 'Selecione um horário.');
      return;
    }

    Alert.alert('Carona publicada', 'Sua carona foi cadastrada com sucesso.');
    setScreen('home');
  }

  function openTimePicker(target) {
    setTimeTarget(target);
    setTimeModalVisible(true);
  }

  function selectTime(time) {
    if (timeTarget === 'busca') {
      setHorarioBusca(time);
    }

    if (timeTarget === 'publicar') {
      setHorarioPublicar(time);
    }

    setTimeModalVisible(false);
  }

  function Header({ title }) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>Caronas universitárias do ICEA/UFOP</Text>
      </View>
    );
  }

  function Menu() {
    return (
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setScreen('home')}>
          <Text style={styles.menuText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => setScreen('buscar')}>
          <Text style={styles.menuText}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => setScreen('publicar')}>
          <Text style={styles.menuText}>Publicar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => setScreen('sobre')}>
          <Text style={styles.menuText}>Sobre</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function TimeModal() {
    const horarios = ['07:00', '07:30', '08:00', '12:00', '13:00', '17:30', '18:00', '18:30', '22:00'];

    return (
      <Modal visible={timeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.cardTitle}>Selecionar horário</Text>

            <View style={styles.timeGrid}>
              {horarios.map((time) => (
                <TouchableOpacity key={time} style={styles.timeButton} onPress={() => selectTime(time)}>
                  <Text style={styles.timeText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setTimeModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#102f4a" />

        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Caronas ICEA</Text>
          <Text style={styles.loginSubtitle}>Acesse com seu e-mail institucional</Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail UFOP"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Domínios aceitos: @aluno.ufop.edu.br ou @ufop.edu.br
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#102f4a" />

      <Header title="Caronas ICEA" />
      <Menu />

      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        {screen === 'home' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bem-vindo</Text>
            <Text style={styles.text}>
              Este protótipo permite buscar e publicar caronas com origem ou destino obrigatório no ICEA.
            </Text>

            <Text style={styles.label}>Perfil</Text>

            <View style={styles.profileRow}>
              {['Passageiro', 'Motorista', 'Ambos'].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.profileButton, perfil === item && styles.profileSelected]}
                  onPress={() => setPerfil(item)}
                >
                  <Text style={[styles.profileText, perfil === item && styles.profileSelectedText]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {screen === 'buscar' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Buscar carona</Text>

              <TextInput
                style={styles.input}
                placeholder="Origem"
                value={origemBusca}
                onChangeText={setOrigemBusca}
              />

              <TextInput
                style={styles.input}
                placeholder="Destino"
                value={destinoBusca}
                onChangeText={setDestinoBusca}
              />

              <TouchableOpacity style={styles.timeInput} onPress={() => openTimePicker('busca')}>
                <Text style={horarioBusca ? styles.timeInputText : styles.placeholderText}>
                  {horarioBusca || 'Selecionar horário'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryButton} onPress={handleBuscarCarona}>
                <Text style={styles.buttonText}>Filtrar Caronas</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Todas as caronas</Text>

              {caronasDisponiveis.map((carona) => (
                <View key={carona.id} style={styles.rideItem}>
                  <Text style={styles.rideTitle}>
                    {carona.origem} → {carona.destino}
                  </Text>
                  <Text>Motorista: {carona.motorista}</Text>
                  <Text>Horário: {carona.horario}</Text>
                  <Text>Valor: {carona.valor}</Text>
                  <Text>Avaliação: {carona.avaliacao}</Text>

                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => Alert.alert('Reserva solicitada', 'Solicitação enviada ao motorista.')}
                  >
                    <Text style={styles.smallButtonText}>Solicitar vaga</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {screen === 'publicar' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Publicar carona</Text>

            <TextInput
              style={styles.input}
              placeholder="Origem"
              value={origemPublicar}
              onChangeText={setOrigemPublicar}
            />

            <TextInput
              style={styles.input}
              placeholder="Destino"
              value={destinoPublicar}
              onChangeText={setDestinoPublicar}
            />

            <TouchableOpacity style={styles.timeInput} onPress={() => openTimePicker('publicar')}>
              <Text style={horarioPublicar ? styles.timeInputText : styles.placeholderText}>
                {horarioPublicar || 'Selecionar horário'}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Valor sugerido"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />

            <TextInput
              style={styles.input}
              placeholder="Regras da carona"
              value={regras}
              onChangeText={setRegras}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handlePublicarCarona}>
              <Text style={styles.buttonText}>Publicar Carona</Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === 'resultados' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Caronas disponíveis</Text>

            <View style={styles.rideItem}>
              <Text style={styles.rideTitle}>Centro → ICEA</Text>
              <Text>Motorista: Ana Paula</Text>
              <Text>Horário: {horarioBusca}</Text>
              <Text>Valor: R$ 5,00</Text>
              <Text>Avaliação: ★★★★★</Text>
            </View>

            <View style={styles.rideItem}>
              <Text style={styles.rideTitle}>ICEA → Carneirinhos</Text>
              <Text>Motorista: Marcos Silva</Text>
              <Text>Horário: 18:30</Text>
              <Text>Valor: R$ 4,00</Text>
              <Text>Avaliação: ★★★★☆</Text>
            </View>
          </View>
        )}

        {screen === 'sobre' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sobre</Text>
            <Text style={styles.text}>Aplicativo acadêmico para conexão entre motoristas e passageiros do ICEA/UFOP.</Text>
            <Text style={styles.text}>Aluno: Luccas Vinicius - 20.1.8015</Text>
            <Text style={styles.text}>Tecnologia: React Native + Expo Snack</Text>
          </View>
        )}
      </ScrollView>

      <TimeModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#102f4a',
  },
  page: {
    flex: 1,
    backgroundColor: '#eef3f8',
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#102f4a',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#d7e4ef',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  menu: {
    flexDirection: 'row',
    backgroundColor: '#173f61',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#eef3f8',
  },
  loginTitle: {
    color: '#102f4a',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginSubtitle: {
    color: '#46647a',
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#102f4a',
  },
  text: {
    fontSize: 15,
    color: '#263d50',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c8d2dc',
    borderRadius: 9,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  helperText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#46647a',
    fontSize: 12,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#102f4a',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileButton: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 9,
    backgroundColor: '#d9e1e8',
    alignItems: 'center',
  },
  profileSelected: {
    backgroundColor: '#1d5c87',
  },
  profileText: {
    color: '#6a7d8c',
    fontWeight: 'bold',
  },
  profileSelectedText: {
    color: '#ffffff',
  },
  primaryButton: {
    backgroundColor: '#1d5c87',
    padding: 15,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#c8d2dc',
    borderRadius: 9,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  timeInputText: {
    color: '#102f4a',
    fontSize: 15,
  },
  placeholderText: {
    color: '#888888',
    fontSize: 15,
  },
  rideItem: {
    borderWidth: 1,
    borderColor: '#d8e0e8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8fbfd',
  },
  rideTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#102f4a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: '30%',
    backgroundColor: '#1d5c87',
    padding: 12,
    borderRadius: 9,
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#1d5c87',
    fontWeight: 'bold',
  },
  smallButton: {
    backgroundColor: '#173f61',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});