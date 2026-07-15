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

import {
  horarioParaMinutos,
  intervaloHorarioValido,
} from './utils/time';

import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import BuscarCaronasScreen from './screens/BuscarCaronasScreen';
import PublicarCaronaScreen from './screens/PublicarCaronaScreen';
import ResultadosScreen from './screens/ResultadosScreen';
import MinhasCaronasScreen from './screens/MinhasCaronasScreen';
import SobreScreen from './screens/SobreScreen';

import {
  buscarCaronas,
  criarCarona,
} from './services/CaronaService';
import {
  buscarReservasDoUsuario,
  cancelarReserva,
  solicitarReserva,
} from './services/ReservaService';

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

  const [
    horarioInicioBusca,
    setHorarioInicioBusca,
  ] = useState('');

  const [
    horarioFimBusca,
    setHorarioFimBusca,
  ] = useState('');

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

  const [reservasUsuario, setReservasUsuario] = useState([]);
  const [carregandoReservas, setCarregandoReservas] = useState(false);

  useEffect(() => {
    carregarCaronas();
  }, []);

  const caronasFiltradas = useMemo(() => {
    const origem = normalizarTexto(origemBusca);
    const destino = normalizarTexto(destinoBusca);

    const inicioEmMinutos =
      horarioParaMinutos(horarioInicioBusca);

    const fimEmMinutos =
      horarioParaMinutos(horarioFimBusca);

    return caronasDisponiveis.filter(
      (carona) => {
        if (carona.ativa === false) {
          return false;
        }

        const correspondeOrigem =
          !origem ||
          normalizarTexto(carona.origem).includes(
            origem
          );

        const correspondeDestino =
          !destino ||
          normalizarTexto(carona.destino).includes(
            destino
          );

        const horarioCaronaEmMinutos =
          horarioParaMinutos(carona.horario);

        const correspondeHorarioInicio =
          inicioEmMinutos === null ||
          (
            horarioCaronaEmMinutos !== null &&
            horarioCaronaEmMinutos >=
              inicioEmMinutos
          );

        const correspondeHorarioFim =
          fimEmMinutos === null ||
          (
            horarioCaronaEmMinutos !== null &&
            horarioCaronaEmMinutos <=
              fimEmMinutos
          );

        return (
          correspondeOrigem &&
          correspondeDestino &&
          correspondeHorarioInicio &&
          correspondeHorarioFim
        );
      }
    );
  }, [
    caronasDisponiveis,
    destinoBusca,
    horarioFimBusca,
    horarioInicioBusca,
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

  async function carregarReservas(emailUsuario = usuarioAtual?.email) {
    if (!emailUsuario) {
      setReservasUsuario([]);
      return;
    }

    try {
      setCarregandoReservas(true);
      const lista = await buscarReservasDoUsuario(emailUsuario);
      setReservasUsuario(lista);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);

      Alert.alert(
        'Erro ao carregar',
        'Não foi possível carregar suas reservas do Firestore.'
      );
    } finally {
      setCarregandoReservas(false);
    }
  }

  function handleLogin(usuario) {
    setUsuarioAtual(usuario);
    setPerfil(usuario.perfil || 'Passageiro');
    setScreen('home');
    carregarReservas(usuario.email);
  }

  function handleLogout() {
    setUsuarioAtual(null);
    setReservasUsuario([]);
    setScreen('login');
  }

  function handleNavigate(screenDestino) {
    if (screenDestino === 'minhasCaronas') {
      carregarReservas();
    }

    setScreen(screenDestino);
  }

  function handleBuscarCarona() {
    if (
      !rotaContemIcea(
        origemBusca,
        destinoBusca
      )
    ) {
      Alert.alert(
        'Rota inválida',
        'A origem ou o destino deve ser exatamente ICEA.'
      );
      return;
    }

    if (
      !intervaloHorarioValido(
        horarioInicioBusca,
        horarioFimBusca
      )
    ) {
      Alert.alert(
        'Intervalo inválido',
        'O horário inicial não pode ser maior que o horário final.'
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

  function handleSolicitarVaga(carona) {
    const vagasTotais = Number(carona.vagas || 0);
    const vagasPreenchidas = Number(carona.vagasPreenchidas || 0);
    const vagasDisponiveis = Math.max(0, vagasTotais - vagasPreenchidas);

    if (vagasDisponiveis <= 0) {
      Alert.alert(
        'Sem vagas',
        'Não há vagas disponíveis nessa carona.'
      );
      return;
    }

    Alert.alert(
      'Confirmar reserva',
      `${carona.origem} → ${carona.destino}\nHorário: ${carona.horario}\n\nDeseja solicitar uma vaga?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => executarSolicitacaoVaga(carona),
        },
      ]
    );
  }

  async function executarSolicitacaoVaga(carona) {
    try {
      await solicitarReserva(carona, usuarioAtual);
      await Promise.all([
        carregarCaronas(),
        carregarReservas(usuarioAtual?.email),
      ]);

      Alert.alert(
        'Reserva confirmada',
        'Sua vaga foi reservada com sucesso.',
        [
          {
            text: 'Continuar',
            style: 'cancel',
          },
          {
            text: 'Ver minhas caronas',
            onPress: () => setScreen('minhasCaronas'),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao solicitar vaga:', error);

      Alert.alert(
        'Não foi possível reservar',
        error.message || 'Tente novamente.'
      );
    }
  }

  function handleCancelarReserva(reserva) {
    Alert.alert(
      'Cancelar reserva',
      `${reserva.origem} → ${reserva.destino}\nHorário: ${reserva.horario}\n\nDeseja realmente cancelar esta reserva?`,
      [
        {
          text: 'Manter reserva',
          style: 'cancel',
        },
        {
          text: 'Cancelar reserva',
          style: 'destructive',
          onPress: () => executarCancelamentoReserva(reserva),
        },
      ]
    );
  }

  async function executarCancelamentoReserva(reserva) {
    try {
      await cancelarReserva(reserva);
      await Promise.all([
        carregarCaronas(),
        carregarReservas(usuarioAtual?.email),
      ]);

      Alert.alert(
        'Reserva cancelada',
        'A vaga foi liberada novamente.'
      );
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);

      Alert.alert(
        'Não foi possível cancelar',
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
    setHorarioInicioBusca('');
    setHorarioFimBusca('');
  }

  function openTimePicker(target) {
    setTimeTarget(target);
    setTimeModalVisible(true);
  }

  function selectTime(time) {
    if (timeTarget === 'buscaInicio') {
      setHorarioInicioBusca(time);
    }

    if (timeTarget === 'buscaFim') {
      setHorarioFimBusca(time);
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
            horarioInicioBusca={horarioInicioBusca}
            horarioFimBusca={horarioFimBusca}
            onOrigemChange={setOrigemBusca}
            onDestinoChange={setDestinoBusca}
            onOpenTimePickerInicio={() =>
              openTimePicker('buscaInicio')
            }
            onOpenTimePickerFim={() =>
              openTimePicker('buscaFim')
            }
            onLimparHorarioInicio={() =>
              setHorarioInicioBusca('')
            }
            onLimparHorarioFim={() =>
              setHorarioFimBusca('')
            }
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

      case 'minhasCaronas':
        return (
          <MinhasCaronasScreen
            reservas={reservasUsuario}
            carregandoReservas={carregandoReservas}
            onAtualizar={() => carregarReservas()}
            onCancelar={handleCancelarReserva}
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
        onOpenCadastro={() =>
          setScreen('cadastro')
        }
      />
    );
  }

  if (screen === 'cadastro') {
    return (
      <CadastroScreen
        onCadastroConcluido={handleLogin}
        onVoltar={() => setScreen('login')}
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
      <AppMenu screen={screen} onNavigate={handleNavigate} />

      <ScrollView
        style={commonStyles.page}
        contentContainerStyle={commonStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        {renderScreen()}
      </ScrollView>

      <TimePickerModal
        visible={timeModalVisible}
        title={
          timeTarget === 'buscaInicio'
            ? 'Selecionar horário inicial'
            : timeTarget === 'buscaFim'
              ? 'Selecionar horário final'
              : 'Selecionar hora de partida'
        }
        selectedTime={
          timeTarget === 'buscaInicio'
            ? horarioInicioBusca
            : timeTarget === 'buscaFim'
              ? horarioFimBusca
              : horarioPublicar
        }
        onSelect={selectTime}
        onClose={() =>
          setTimeModalVisible(false)
        }
      />
    </SafeAreaView>
  );
}
