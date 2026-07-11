// Prática 5 - React Native
// Aluno: Luccas Vinicius - 20.1.8015
// App: Caronas ICEA

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import AppHeader from './components/AppHeader';
import AppMenu from './components/AppMenu';
import TimePickerModal from './components/TimePickerModal';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import BuscarCaronasScreen from './screens/BuscarCaronasScreen';
import PublicarCaronaScreen from './screens/PublicarCaronaScreen';
import ResultadosScreen from './screens/ResultadosScreen';
import SobreScreen from './screens/SobreScreen';

import {
  buscarCaronas,
  criarCarona,
  solicitarVaga,
} from './services/CaronaService';

import { colors } from './styles/colors';
import { commonStyles } from './styles/commonStyles';
import {
  normalizarTexto,
  rotaContemIcea,
} from './utils/validators';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [screen, setScreen] = useState('login');
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  const [perfil, setPerfil] = useState('Passageiro');

  const [origemBusca, setOrigemBusca] = useState('');
  const [destinoBusca, setDestinoBusca] = useState('ICEA');
  const [horarioBusca, setHorarioBusca] = useState('');

  const [origemPublicar, setOrigemPublicar] = useState('');
  const [destinoPublicar, setDestinoPublicar] = useState('ICEA');
  const [horarioPublicar, setHorarioPublicar] = useState('');
  const [valor, setValor] = useState('');
  const [vagas, setVagas] = useState('1');
  const [regras, setRegras] = useState('');

  const [timeTarget, setTimeTarget] = useState('');
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const [caronasDisponiveis, setCaronasDisponiveis] = useState([]);
  const [carregandoCaronas, setCarregandoCaronas] = useState(false);
  const [publicandoCarona, setPublicandoCarona] = useState(false);

  useEffect(() => {
    carregarCaronas();
  }, []);

  const caronasFiltradas = useMemo(() => {
    const origem = normalizarTexto(origemBusca);
    const destino = normalizarTexto(destinoBusca);
    const horario = horarioBusca.trim();

    return caronasDisponiveis.filter((carona) => {
      if (carona.ativa === false) {
        return false;
      }

      const correspondeOrigem =
        !origem || normalizarTexto(carona.origem).includes(origem);

      const correspondeDestino =
        !destino || normalizarTexto(carona.destino).includes(destino);

      const correspondeHorario =
        !horario || String(carona.horario) === horario;

      return correspondeOrigem && correspondeDestino && correspondeHorario;
    });
  }, [
    caronasDisponiveis,
    destinoBusca,
    horarioBusca,
    origemBusca,
  ]);

  async function carregarCaronas() {
    try {
      setCarregandoCaronas(true);
      const lista = await buscarCaronas();
      setCaronasDisponiveis(lista);
    } catch (error) {
      console.error('Erro ao carregar caronas:', error);

      Alert.alert(
        'Erro ao carregar',
        'Não foi possível carregar as caronas do Firestore. Verifique as regras do banco e sua conexão.'
      );
    } finally {
      setCarregandoCaronas(false);
    }
  }

  function handleLogin(usuario) {
    setUsuarioAtual(usuario);
    setPerfil(usuario.perfil || 'Passageiro');
    setScreen('home');
  }

  function handleLogout() {
    setUsuarioAtual(null);
    setScreen('login');
  }

  function handleBuscarCarona() {
    if (!rotaContemIcea(origemBusca, destinoBusca)) {
      Alert.alert(
        'Rota inválida',
        'A origem ou o destino deve ser exatamente ICEA.'
      );
      return;
    }

    setScreen('resultados');
  }

  async function handlePublicarCarona() {
    if (!rotaContemIcea(origemPublicar, destinoPublicar)) {
      Alert.alert(
        'Rota inválida',
        'A origem ou o destino deve ser exatamente ICEA.'
      );
      return;
    }

    if (!origemPublicar.trim() || !destinoPublicar.trim()) {
      Alert.alert(
        'Campos obrigatórios',
        'Informe a origem e o destino.'
      );
      return;
    }

    if (!horarioPublicar) {
      Alert.alert(
        'Horário obrigatório',
        'Selecione um horário.'
      );
      return;
    }

    const valorNumerico = Number(String(valor).replace(',', '.'));
    const vagasNumericas = Number(vagas);

    if (!Number.isFinite(valorNumerico) || valorNumerico < 0) {
      Alert.alert(
        'Valor inválido',
        'Informe um valor numérico válido.'
      );
      return;
    }

    if (!Number.isInteger(vagasNumericas) || vagasNumericas < 1) {
      Alert.alert(
        'Vagas inválidas',
        'Informe pelo menos uma vaga.'
      );
      return;
    }

    try {
      setPublicandoCarona(true);

      await criarCarona({
        motorista: usuarioAtual?.nome || usuarioAtual?.email?.split('@')[0],
        emailMotorista: usuarioAtual?.email,
        origem: origemPublicar,
        destino: destinoPublicar,
        horario: horarioPublicar,
        valor: valorNumerico,
        vagas: vagasNumericas,
        avaliacao: 5,
        regras,
      });

      limparFormularioPublicacao();
      await carregarCaronas();
      setScreen('buscar');

      Alert.alert(
        'Carona publicada',
        'Sua carona foi cadastrada com sucesso.'
      );
    } catch (error) {
      console.error('Erro ao publicar carona:', error);

      Alert.alert(
        'Erro na publicação',
        'Não foi possível cadastrar a carona.'
      );
    } finally {
      setPublicandoCarona(false);
    }
  }

  async function handleSolicitarVaga(carona) {
    try {
      await solicitarVaga(carona.id);
      await carregarCaronas();

      Alert.alert(
        'Reserva solicitada',
        `Uma vaga foi reservada na rota ${carona.origem} → ${carona.destino}.`
      );
    } catch (error) {
      console.error('Erro ao solicitar vaga:', error);

      Alert.alert(
        'Não foi possível reservar',
        error.message || 'Tente novamente.'
      );
    }
  }

  function limparFormularioPublicacao() {
    setOrigemPublicar('');
    setDestinoPublicar('ICEA');
    setHorarioPublicar('');
    setValor('');
    setVagas('1');
    setRegras('');
  }

  function limparFiltros() {
    setOrigemBusca('');
    setDestinoBusca('ICEA');
    setHorarioBusca('');
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

  function renderScreen() {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            usuarioAtual={usuarioAtual}
            perfil={perfil}
            onPerfilChange={setPerfil}
            caronasDisponiveis={caronasDisponiveis}
          />
        );

      case 'buscar':
        return (
          <BuscarCaronasScreen
            origemBusca={origemBusca}
            destinoBusca={destinoBusca}
            horarioBusca={horarioBusca}
            onOrigemChange={setOrigemBusca}
            onDestinoChange={setDestinoBusca}
            onOpenTimePicker={() => openTimePicker('busca')}
            onLimparFiltros={limparFiltros}
            onFiltrar={handleBuscarCarona}
            caronasDisponiveis={caronasDisponiveis}
            carregandoCaronas={carregandoCaronas}
            onAtualizar={carregarCaronas}
            onReservar={handleSolicitarVaga}
          />
        );

      case 'publicar':
        return (
          <PublicarCaronaScreen
            origemPublicar={origemPublicar}
            destinoPublicar={destinoPublicar}
            horarioPublicar={horarioPublicar}
            valor={valor}
            vagas={vagas}
            regras={regras}
            onOrigemChange={setOrigemPublicar}
            onDestinoChange={setDestinoPublicar}
            onValorChange={setValor}
            onVagasChange={setVagas}
            onRegrasChange={setRegras}
            onOpenTimePicker={() => openTimePicker('publicar')}
            onPublicar={handlePublicarCarona}
            publicandoCarona={publicandoCarona}
          />
        );

      case 'resultados':
        return (
          <ResultadosScreen
            caronasFiltradas={caronasFiltradas}
            onReservar={handleSolicitarVaga}
            onVoltar={() => setScreen('buscar')}
          />
        );

      case 'sobre':
        return <SobreScreen />;

      default:
        return null;
    }
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onSeedCompleted={carregarCaronas}
      />
    );
  }

  return (
    <SafeAreaView
      style={commonStyles.safeArea}
      edges={['top', 'bottom']}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
      />

      <AppHeader onLogout={handleLogout} />
      <AppMenu screen={screen} onNavigate={setScreen} />

      <ScrollView
        style={commonStyles.page}
        contentContainerStyle={commonStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        {renderScreen()}
      </ScrollView>

      <TimePickerModal
        visible={timeModalVisible}
        onSelect={selectTime}
        onClose={() => setTimeModalVisible(false)}
      />
    </SafeAreaView>
  );
}
