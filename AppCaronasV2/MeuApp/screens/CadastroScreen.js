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

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  cadastrarUsuario,
} from '../services/UserService';

import { colors } from '../styles/colors';
import {
  commonStyles,
} from '../styles/commonStyles';

import {
  emailTemDominioPermitido,
} from '../utils/validators';

export default function CadastroScreen({
  onCadastroConcluido,
  onVoltar,
}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState('');

  const [perfil, setPerfil] =
    useState('Passageiro');

  const [
    cadastroEmAndamento,
    setCadastroEmAndamento,
  ] = useState(false);

  async function handleCadastro() {
    const nomeNormalizado = nome.trim();

    const emailNormalizado = email
      .trim()
      .toLowerCase();

    if (!nomeNormalizado) {
      Alert.alert(
        'Nome obrigatório',
        'Informe seu nome para continuar.'
      );

      return;
    }

    if (
      !emailTemDominioPermitido(
        emailNormalizado
      )
    ) {
      Alert.alert(
        'E-mail inválido',
        'Use um e-mail institucional @aluno.ufop.edu.br ou @ufop.edu.br.'
      );

      return;
    }

    if (!senha) {
      Alert.alert(
        'Senha obrigatória',
        'Informe uma senha para continuar.'
      );

      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        'Senhas diferentes',
        'A senha e a confirmação não são iguais.'
      );

      return;
    }

    try {
      setCadastroEmAndamento(true);

      const usuario = await cadastrarUsuario({
        nome: nomeNormalizado,
        email: emailNormalizado,
        senha,
        perfil,
      });

      Alert.alert(
        'Cadastro concluído',
        'Sua conta foi criada com sucesso.'
      );

      onCadastroConcluido(usuario);
    } catch (error) {
      console.error(
        'Erro ao cadastrar usuário:',
        error
      );

      if (
        error.code ===
        'EMAIL_JA_CADASTRADO'
      ) {
        Alert.alert(
          'E-mail já cadastrado',
          'Já existe um usuário utilizando este e-mail.'
        );

        return;
      }

      Alert.alert(
        'Erro no cadastro',
        'Não foi possível cadastrar o usuário no Firestore.'
      );
    } finally {
      setCadastroEmAndamento(false);
    }
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

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>
            Criar conta
          </Text>

          <Text style={styles.subtitle}>
            Cadastre-se usando seu e-mail
            institucional
          </Text>

          <Text style={commonStyles.inputLabel}>
            Nome
          </Text>

          <TextInput
            style={commonStyles.input}
            placeholder="Nome completo"
            autoCapitalize="words"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={commonStyles.inputLabel}>
            E-mail institucional
          </Text>

          <TextInput
            style={commonStyles.input}
            placeholder="usuario@aluno.ufop.edu.br"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={commonStyles.inputLabel}>
            Perfil
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

          <Text style={commonStyles.inputLabel}>
            Senha
          </Text>

          <TextInput
            style={commonStyles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text style={commonStyles.inputLabel}>
            Confirmar senha
          </Text>

          <TextInput
            style={commonStyles.input}
            placeholder="Digite novamente a senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <TouchableOpacity
            style={[
              commonStyles.primaryButton,
              cadastroEmAndamento &&
                commonStyles.disabledButton,
            ]}
            disabled={cadastroEmAndamento}
            onPress={handleCadastro}
          >
            {cadastroEmAndamento ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <Text
                style={commonStyles.buttonText}
              >
                Criar conta
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={commonStyles.secondaryButton}
            disabled={cadastroEmAndamento}
            onPress={onVoltar}
          >
            <Text
              style={
                commonStyles.secondaryButtonText
              }
            >
              Voltar para login
            </Text>
          </TouchableOpacity>

          <Text style={commonStyles.helperText}>
            Domínios aceitos:
            {' '}
            @aluno.ufop.edu.br ou @ufop.edu.br
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    backgroundColor: colors.background,
  },
  card: {
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
  title: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#46647a',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  profileRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  profileButton: {
    flex: 1,
    minHeight: 44,
    marginHorizontal: 3,
    borderRadius: 9,
    backgroundColor: '#d9e1e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSelected: {
    backgroundColor: colors.secondary,
  },
  profileText: {
    color: '#6a7d8c',
    fontWeight: 'bold',
    fontSize: 12,
  },
  profileSelectedText: {
    color: colors.surface,
  },
});