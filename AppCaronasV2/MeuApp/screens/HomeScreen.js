import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

export default function HomeScreen({
  usuarioAtual,
  perfil,
  onPerfilChange,
  caronasDisponiveis,
}) {
  return (
    <>
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Bem-vindo</Text>

        <Text style={commonStyles.text}>
          Olá, {usuarioAtual?.nome}. Este protótipo permite buscar e publicar
          caronas com origem ou destino no ICEA.
        </Text>

        <Text style={styles.userInfo}>Usuário: {usuarioAtual?.email}</Text>

        <Text style={styles.label}>Perfil de uso</Text>

        <View style={styles.profileRow}>
          {['Passageiro', 'Motorista', 'Ambos'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.profileButton,
                perfil === item && styles.profileSelected,
              ]}
              onPress={() => onPerfilChange(item)}
            >
              <Text
                style={[
                  styles.profileText,
                  perfil === item && styles.profileSelectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Indicadores</Text>

        <View style={styles.indicatorRow}>
          <View style={styles.indicator}>
            <Text style={styles.indicatorNumber}>
              {caronasDisponiveis.length}
            </Text>
            <Text style={styles.indicatorLabel}>Caronas</Text>
          </View>

          <View style={styles.indicator}>
            <Text style={styles.indicatorNumber}>
              {caronasDisponiveis.reduce(
                (total, carona) => total + Number(carona.vagas || 0),
                0
              )}
            </Text>
            <Text style={styles.indicatorLabel}>Vagas</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    fontSize: 13,
    color: '#567085',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: colors.primary,
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
    color: colors.secondaryDark,
    fontWeight: 'bold',
  },
  indicatorLabel: {
    color: colors.textMuted,
    marginTop: 3,
  },
});
