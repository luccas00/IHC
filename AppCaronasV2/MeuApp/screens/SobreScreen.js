import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

export default function SobreScreen() {
  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.cardTitle}>Sobre</Text>

      <Text style={commonStyles.text}>
        Aplicativo acadêmico para conexão entre motoristas e passageiros do
        ICEA/UFOP.
      </Text>

      <Text style={commonStyles.text}>
        Aluno: Luccas Vinicius - 20.1.8015
      </Text>

      <Text style={commonStyles.text}>
        Tecnologias: React Native, Expo e Firebase Cloud Firestore.
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  securityNotice: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.warningBackground,
    color: colors.warningText,
    lineHeight: 20,
  },
});
