import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { autenticarUsuario } from '../services/UserService';
import { seedDatabase } from '../seed';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';
import { emailTemDominioPermitido } from '../utils/validators';

export default function LoginScreen({ onLogin, onSeedCompleted }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loginEmAndamento, setLoginEmAndamento] = useState(false);
  const [seedEmAndamento, setSeedEmAndamento] = useState(false);

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
      Alert.alert('Senha obrigatória', 'Informe a senha para continuar.');
      return;
    }

    try {
      setLoginEmAndamento(true);

      const usuario = await autenticarUsuario(emailNormalizado, senha);

      if (!usuario) {
        Alert.alert(
          'Acesso negado',
          'E-mail ou senha inválidos. Execute o seed caso o banco ainda esteja vazio.'
        );
        return;
      }

      if (usuario.ativo === false) {
        Alert.alert('Usuário inativo', 'Este usuário está desativado.');
        return;
      }

      onLogin(usuario);
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

      if (onSeedCompleted) {
        await onSeedCompleted();
      }

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

  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Caronas ICEA</Text>

          <Text style={styles.loginSubtitle}>
            Acesse com seu usuário acadêmico
          </Text>

          <TextInput
            style={commonStyles.input}
            placeholder="E-mail UFOP"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={commonStyles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity
            style={[
              commonStyles.primaryButton,
              loginEmAndamento && commonStyles.disabledButton,
            ]}
            disabled={loginEmAndamento}
            onPress={handleLogin}
          >
            {loginEmAndamento ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={commonStyles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <Text style={commonStyles.helperText}>
            Domínios aceitos: @aluno.ufop.edu.br ou @ufop.edu.br
          </Text>

          <View style={styles.seedArea}>
            <Text style={styles.seedTitle}>Ambiente acadêmico</Text>

            <Text style={styles.seedText}>
              Use o botão abaixo somente para cadastrar os dados iniciais no
              Firestore.
            </Text>

            <TouchableOpacity
              style={[
                commonStyles.secondaryButton,
                seedEmAndamento && commonStyles.disabledButton,
              ]}
              disabled={seedEmAndamento}
              onPress={handleSeed}
            >
              {seedEmAndamento ? (
                <ActivityIndicator color={colors.secondaryDark} />
              ) : (
                <Text style={commonStyles.secondaryButtonText}>
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

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    backgroundColor: colors.background,
  },
  loginCard: {
    backgroundColor: colors.surface,
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
    color: colors.primary,
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
  seedArea: {
    borderTopWidth: 1,
    borderTopColor: '#dbe3ea',
    marginTop: 20,
    paddingTop: 16,
  },
  seedTitle: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  seedText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
});
