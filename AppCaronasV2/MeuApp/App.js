// Prática 5 - React Native
// Aluno: Luccas Vinicius - 20.1.8015
// App: Caronas ICEA

import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  buscarCaronas,
  criarCarona,
  solicitarVaga,
} from './services/CaronaService';
import { autenticarUsuario } from './services/UserService';
import { seedDatabase } from './seed';

const HORARIOS = [
  '07:00',
  '07:30',
  '08:00',
  '12:00',
  '13:00',
  '17:30',
  '18:00',
  '18:30',
  '22:00',
];

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

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loginEmAndamento, setLoginEmAndamento] = useState(false);
  const [seedEmAndamento, setSeedEmAndamento] = useState(false);

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

  function normalizarTexto(texto) {
    return String(texto || '').trim().toUpperCase();
  }

  function emailTemDominioPermitido(emailInformado) {
    const emailNormalizado = String(emailInformado || '')
      .trim()
      .toLowerCase();

    return (
      emailNormalizado.endsWith('@aluno.ufop.edu.br') ||
      emailNormalizado.endsWith('@ufop.edu.br')
    );
  }

  function rotaContemIcea(origem, destino) {
    return (
      normalizarTexto(origem) === 'ICEA' ||
      normalizarTexto(destino) === 'ICEA'
    );
  }

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

  async function handleLogin() {
    const emailNormalizado = email.trim().toLowerCase();

    if (!emailTemDominioPermitido(emailNormalizado)) {
      Alert.alert(
        'E-mail inválido',
        'Use um e-mail institucional @aluno.ufop.edu.br ou @ufop.edu.br.'
      );
      return;
    }

    if (!senha) {
      Alert.alert(
        'Senha obrigatória',
        'Informe a senha para continuar.'
      );
      return;
    }

    try {
      setLoginEmAndamento(true);

      const usuario = await autenticarUsuario(
        emailNormalizado,
        senha
      );

      if (!usuario) {
        Alert.alert(
          'Acesso negado',
          'E-mail ou senha inválidos. Execute o seed caso o banco ainda esteja vazio.'
        );
        return;
      }

      if (usuario.ativo === false) {
        Alert.alert(
          'Usuário inativo',
          'Este usuário está desativado.'
        );
        return;
      }

      setUsuarioAtual(usuario);
      setPerfil(usuario.perfil || 'Passageiro');
      setScreen('home');
    } catch (error) {
      console.error('Erro no login:', error);

      Alert.alert(
        'Erro no login',
        'Não foi possível consultar os usuários no Firestore.'
      );
    } finally {
      setLoginEmAndamento(false);
    }
  }

  async function handleSeed() {
    try {
      setSeedEmAndamento(true);

      const resultado = await seedDatabase();

      await carregarCaronas();

      Alert.alert(
        'Seed concluído',
        `${resultado.users} usuários e ${resultado.caronas} caronas foram cadastrados/atualizados.`
      );
    } catch (error) {
      console.error('Erro ao executar seed:', error);

      Alert.alert(
        'Erro no seed',
        'Não foi possível gravar os dados. Verifique as regras de escrita do Firestore.'
      );
    } finally {
      setSeedEmAndamento(false);
    }
  }

  function handleLogout() {
    setUsuarioAtual(null);
    setEmail('');
    setSenha('');
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

    const valorNumerico = Number(
      String(valor).replace(',', '.')
    );
    const vagasNumericas = Number(vagas);

    if (
      !Number.isFinite(valorNumerico) ||
      valorNumerico < 0
    ) {
      Alert.alert(
        'Valor inválido',
        'Informe um valor numérico válido.'
      );
      return;
    }

    if (
      !Number.isInteger(vagasNumericas) ||
      vagasNumericas < 1
    ) {
      Alert.alert(
        'Vagas inválidas',
        'Informe pelo menos uma vaga.'
      );
      return;
    }

    try {
      setPublicandoCarona(true);

      await criarCarona({
        motorista:
          usuarioAtual?.nome ||
          email.split('@')[0],
        emailMotorista:
          usuarioAtual?.email ||
          email.trim().toLowerCase(),
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

  function Header() {
    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Caronas ICEA
          </Text>
          <Text style={styles.headerSubtitle}>
            Caronas universitárias do ICEA/UFOP
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function Menu() {
    return (
      <View style={styles.menu}>
        <MenuButton
          label="Início"
          active={screen === 'home'}
          onPress={() => setScreen('home')}
        />

        <MenuButton
          label="Buscar"
          active={
            screen === 'buscar' ||
            screen === 'resultados'
          }
          onPress={() => setScreen('buscar')}
        />

        <MenuButton
          label="Publicar"
          active={screen === 'publicar'}
          onPress={() => setScreen('publicar')}
        />

        <MenuButton
          label="Sobre"
          active={screen === 'sobre'}
          onPress={() => setScreen('sobre')}
        />
      </View>
    );
  }

  function MenuButton({ label, active, onPress }) {
    return (
      <TouchableOpacity
        style={[
          styles.menuButton,
          active && styles.menuButtonActive,
        ]}
        onPress={onPress}
      >
        <Text
          style={[
            styles.menuText,
            active && styles.menuTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  function TimeModal() {
    return (
      <Modal
        visible={timeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setTimeModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.cardTitle}>
              Selecionar horário
            </Text>

            <View style={styles.timeGrid}>
              {HORARIOS.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={styles.timeButton}
                  onPress={() => selectTime(time)}
                >
                  <Text style={styles.timeText}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                setTimeModalVisible(false)
              }
            >
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function CaronaCard({ carona, permitirReserva }) {
    const avaliacao = Math.max(
      0,
      Math.min(5, Number(carona.avaliacao || 0))
    );
    const vagasDisponiveis = Number(carona.vagas || 0);

    return (
      <View style={styles.rideItem}>
        <Text style={styles.rideTitle}>
          {carona.origem} → {carona.destino}
        </Text>

        <Text style={styles.rideText}>
          Motorista: {carona.motorista}
        </Text>

        <Text style={styles.rideText}>
          Horário: {carona.horario}
        </Text>

        <Text style={styles.rideText}>
          Valor: {formatarMoeda(carona.valor)}
        </Text>

        <Text style={styles.rideText}>
          Vagas: {vagasDisponiveis}
        </Text>

        <Text style={styles.rideText}>
          Avaliação: {'★'.repeat(avaliacao)}
          {'☆'.repeat(5 - avaliacao)}
        </Text>

        {!!carona.regras && (
          <Text style={styles.rideRules}>
            Regras: {carona.regras}
          </Text>
        )}

        {permitirReserva && (
          <TouchableOpacity
            style={[
              styles.smallButton,
              vagasDisponiveis <= 0 &&
                styles.disabledButton,
            ]}
            disabled={vagasDisponiveis <= 0}
            onPress={() =>
              handleSolicitarVaga(carona)
            }
          >
            <Text style={styles.smallButtonText}>
              {vagasDisponiveis > 0
                ? 'Solicitar vaga'
                : 'Sem vagas'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function formatarMoeda(valorInformado) {
    const valorNumerico = Number(valorInformado || 0);

    return `R$ ${valorNumerico
      .toFixed(2)
      .replace('.', ',')}`;
  }

  if (screen === 'login') {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'bottom']}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="#102f4a"
        />

        <View style={styles.loginContainer}>
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>
              Caronas ICEA
            </Text>

            <Text style={styles.loginSubtitle}>
              Acesse com seu usuário acadêmico
            </Text>

            <TextInput
              style={styles.input}
              placeholder="E-mail UFOP"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
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

            <TouchableOpacity
              style={[
                styles.primaryButton,
                loginEmAndamento &&
                  styles.disabledButton,
              ]}
              disabled={loginEmAndamento}
              onPress={handleLogin}
            >
              {loginEmAndamento ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.helperText}>
              Domínios aceitos:
              {' '}
              @aluno.ufop.edu.br ou @ufop.edu.br
            </Text>

            <View style={styles.seedArea}>
              <Text style={styles.seedTitle}>
                Ambiente acadêmico
              </Text>

              <Text style={styles.seedText}>
                Use o botão abaixo somente para cadastrar
                os dados iniciais no Firestore.
              </Text>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  seedEmAndamento &&
                    styles.disabledButton,
                ]}
                disabled={seedEmAndamento}
                onPress={handleSeed}
              >
                {seedEmAndamento ? (
                  <ActivityIndicator color="#173f61" />
                ) : (
                  <Text
                    style={styles.secondaryButtonText}
                  >
                    Popular banco de teste
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#102f4a"
      />

      <Header />
      <Menu />

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {screen === 'home' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Bem-vindo
              </Text>

              <Text style={styles.text}>
                Olá, {usuarioAtual?.nome}. Este
                protótipo permite buscar e publicar
                caronas com origem ou destino no ICEA.
              </Text>

              <Text style={styles.userInfo}>
                Usuário: {usuarioAtual?.email}
              </Text>

              <Text style={styles.label}>
                Perfil de uso
              </Text>

              <View style={styles.profileRow}>
                {[
                  'Passageiro',
                  'Motorista',
                  'Ambos',
                ].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.profileButton,
                      perfil === item &&
                        styles.profileSelected,
                    ]}
                    onPress={() => setPerfil(item)}
                  >
                    <Text
                      style={[
                        styles.profileText,
                        perfil === item &&
                          styles.profileSelectedText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Indicadores
              </Text>

              <View style={styles.indicatorRow}>
                <View style={styles.indicator}>
                  <Text style={styles.indicatorNumber}>
                    {caronasDisponiveis.length}
                  </Text>
                  <Text style={styles.indicatorLabel}>
                    Caronas
                  </Text>
                </View>

                <View style={styles.indicator}>
                  <Text style={styles.indicatorNumber}>
                    {caronasDisponiveis.reduce(
                      (total, carona) =>
                        total +
                        Number(carona.vagas || 0),
                      0
                    )}
                  </Text>
                  <Text style={styles.indicatorLabel}>
                    Vagas
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {screen === 'buscar' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Buscar carona
              </Text>

              <Text style={styles.inputLabel}>
                Origem
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Ex.: Centro ou ICEA"
                value={origemBusca}
                onChangeText={setOrigemBusca}
              />

              <Text style={styles.inputLabel}>
                Destino
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Ex.: ICEA"
                value={destinoBusca}
                onChangeText={setDestinoBusca}
              />

              <Text style={styles.inputLabel}>
                Horário
              </Text>

              <TouchableOpacity
                style={styles.timeInput}
                onPress={() =>
                  openTimePicker('busca')
                }
              >
                <Text
                  style={
                    horarioBusca
                      ? styles.timeInputText
                      : styles.placeholderText
                  }
                >
                  {horarioBusca ||
                    'Todos os horários'}
                </Text>
              </TouchableOpacity>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={limparFiltros}
                >
                  <Text style={styles.clearButtonText}>
                    Limpar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryActionButton}
                  onPress={handleBuscarCarona}
                >
                  <Text style={styles.buttonText}>
                    Filtrar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.cardTitle}>
                  Todas as caronas
                </Text>

                <TouchableOpacity
                  onPress={carregarCaronas}
                >
                  <Text style={styles.refreshText}>
                    Atualizar
                  </Text>
                </TouchableOpacity>
              </View>

              {carregandoCaronas ? (
                <ActivityIndicator
                  color="#1d5c87"
                  size="large"
                />
              ) : caronasDisponiveis.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhuma carona cadastrada.
                </Text>
              ) : (
                caronasDisponiveis.map((carona) => (
                  <CaronaCard
                    key={carona.id}
                    carona={carona}
                    permitirReserva
                  />
                ))
              )}
            </View>
          </>
        )}

        {screen === 'publicar' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Publicar carona
            </Text>

            <Text style={styles.inputLabel}>
              Origem
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: Centro ou ICEA"
              value={origemPublicar}
              onChangeText={setOrigemPublicar}
            />

            <Text style={styles.inputLabel}>
              Destino
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: ICEA"
              value={destinoPublicar}
              onChangeText={setDestinoPublicar}
            />

            <Text style={styles.inputLabel}>
              Horário
            </Text>

            <TouchableOpacity
              style={styles.timeInput}
              onPress={() =>
                openTimePicker('publicar')
              }
            >
              <Text
                style={
                  horarioPublicar
                    ? styles.timeInputText
                    : styles.placeholderText
                }
              >
                {horarioPublicar ||
                  'Selecionar horário'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>
              Valor por passageiro
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: 5,00"
              keyboardType="decimal-pad"
              value={valor}
              onChangeText={setValor}
            />

            <Text style={styles.inputLabel}>
              Quantidade de vagas
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: 3"
              keyboardType="number-pad"
              value={vagas}
              onChangeText={setVagas}
            />

            <Text style={styles.inputLabel}>
              Regras
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
              ]}
              placeholder="Ex.: sem bagagem grande"
              value={regras}
              onChangeText={setRegras}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                publicandoCarona &&
                  styles.disabledButton,
              ]}
              disabled={publicandoCarona}
              onPress={handlePublicarCarona}
            >
              {publicandoCarona ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>
                  Publicar carona
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {screen === 'resultados' && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>
                Resultado da busca
              </Text>

              <Text style={styles.resultCount}>
                {caronasFiltradas.length}
              </Text>
            </View>

            {caronasFiltradas.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhuma carona corresponde aos filtros.
              </Text>
            ) : (
              caronasFiltradas.map((carona) => (
                <CaronaCard
                  key={carona.id}
                  carona={carona}
                  permitirReserva
                />
              ))
            )}

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setScreen('buscar')}
            >
              <Text
                style={styles.secondaryButtonText}
              >
                Voltar para busca
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === 'sobre' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Sobre
            </Text>

            <Text style={styles.text}>
              Aplicativo acadêmico para conexão
              entre motoristas e passageiros do
              ICEA/UFOP.
            </Text>

            <Text style={styles.text}>
              Aluno: Luccas Vinicius - 20.1.8015
            </Text>

            <Text style={styles.text}>
              Tecnologias: React Native, Expo e
              Firebase Cloud Firestore.
            </Text>

            <Text style={styles.securityNotice}>
              Observação acadêmica: as senhas estão
              armazenadas em texto simples apenas para
              fins de protótipo. Essa abordagem não deve
              ser usada em produção.
            </Text>
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
    paddingBottom: 32,
  },
  header: {
    minHeight: 86,
    backgroundColor: '#102f4a',
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 27,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#d7e4ef',
    fontSize: 13,
    marginTop: 4,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#6f91ac',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  menu: {
    flexDirection: 'row',
    backgroundColor: '#173f61',
    paddingHorizontal: 6,
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  menuButtonActive: {
    backgroundColor: '#1d4f73',
    borderBottomColor: '#9dc5e4',
  },
  menuText: {
    color: '#cbd9e5',
    fontWeight: 'bold',
    fontSize: 12,
  },
  menuTextActive: {
    color: '#ffffff',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    backgroundColor: '#eef3f8',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 22,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
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
    marginBottom: 26,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 14,
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#102f4a',
    marginBottom: 14,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#263d50',
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 13,
    color: '#567085',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#29485f',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#c8d2dc',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    color: '#102f4a',
  },
  multilineInput: {
    minHeight: 90,
  },
  helperText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#46647a',
    fontSize: 12,
    lineHeight: 18,
  },
  seedArea: {
    borderTopWidth: 1,
    borderTopColor: '#dbe3ea',
    marginTop: 20,
    paddingTop: 16,
  },
  seedTitle: {
    fontWeight: 'bold',
    color: '#102f4a',
    marginBottom: 4,
  },
  seedText: {
    color: '#60788b',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#102f4a',
  },
  profileRow: {
    flexDirection: 'row',
  },
  profileButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 3,
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
    fontSize: 12,
  },
  profileSelectedText: {
    color: '#ffffff',
  },
  primaryButton: {
    minHeight: 49,
    backgroundColor: '#1d5c87',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#1d5c87',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#173f61',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  timeInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#c8d2dc',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 14,
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
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  clearButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#7a91a3',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#456176',
    fontWeight: 'bold',
  },
  primaryActionButton: {
    flex: 2,
    minHeight: 48,
    backgroundColor: '#1d5c87',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  refreshText: {
    color: '#1d5c87',
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  resultCount: {
    minWidth: 30,
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    backgroundColor: '#1d5c87',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rideItem: {
    borderWidth: 1,
    borderColor: '#d8e0e8',
    borderRadius: 10,
    padding: 13,
    marginBottom: 11,
    backgroundColor: '#f8fbfd',
  },
  rideTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 7,
    color: '#102f4a',
  },
  rideText: {
    color: '#304c61',
    marginBottom: 3,
  },
  rideRules: {
    color: '#60788b',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },
  emptyText: {
    color: '#60788b',
    textAlign: 'center',
    paddingVertical: 20,
  },
  smallButton: {
    minHeight: 42,
    backgroundColor: '#173f61',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 11,
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
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
    width: '31%',
    backgroundColor: '#1d5c87',
    paddingVertical: 12,
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
  indicatorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  indicator: {
    flex: 1,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#eef5fa',
  },
  indicatorNumber: {
    fontSize: 28,
    color: '#173f61',
    fontWeight: 'bold',
  },
  indicatorLabel: {
    color: '#60788b',
    marginTop: 3,
  },
  securityNotice: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff6dc',
    color: '#705817',
    lineHeight: 20,
  },
});
