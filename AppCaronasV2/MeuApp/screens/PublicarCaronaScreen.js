import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

export default function PublicarCaronaScreen({
  origemPublicar,
  destinoPublicar,
  horarioPublicar,
  valor,
  vagas,
  regras,
  onOrigemChange,
  onDestinoChange,
  onValorChange,
  onVagasChange,
  onRegrasChange,
  onOpenTimePicker,
  onPublicar,
  publicandoCarona,
}) {
  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.cardTitle}>Publicar carona</Text>

      <Text style={commonStyles.inputLabel}>Origem</Text>

      <TextInput
        style={commonStyles.input}
        placeholder="Ex.: Centro ou ICEA"
        value={origemPublicar}
        onChangeText={onOrigemChange}
      />

      <Text style={commonStyles.inputLabel}>Destino</Text>

      <TextInput
        style={commonStyles.input}
        placeholder="Ex.: ICEA"
        value={destinoPublicar}
        onChangeText={onDestinoChange}
      />

      <Text style={commonStyles.inputLabel}>
        Hora de partida
      </Text>

      <TouchableOpacity
        style={styles.timeInput}
        onPress={onOpenTimePicker}
      >
        <Text
          style={
            horarioPublicar
              ? styles.timeInputText
              : styles.placeholderText
          }
        >
          {horarioPublicar || 'Selecionar hora de partida'}
        </Text>
      </TouchableOpacity>

      <Text style={commonStyles.inputLabel}>Valor por passageiro</Text>

      <TextInput
        style={commonStyles.input}
        placeholder="Ex.: 5,00"
        keyboardType="decimal-pad"
        value={valor}
        onChangeText={onValorChange}
      />

      <Text style={commonStyles.inputLabel}>Quantidade de vagas</Text>

      <TextInput
        style={commonStyles.input}
        placeholder="Ex.: 3"
        keyboardType="number-pad"
        value={vagas}
        onChangeText={onVagasChange}
      />

      <Text style={commonStyles.inputLabel}>Regras</Text>

      <TextInput
        style={[commonStyles.input, commonStyles.multilineInput]}
        placeholder="Ex.: sem bagagem grande"
        value={regras}
        onChangeText={onRegrasChange}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[
          commonStyles.primaryButton,
          publicandoCarona && commonStyles.disabledButton,
        ]}
        disabled={publicandoCarona}
        onPress={onPublicar}
      >
        {publicandoCarona ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={commonStyles.buttonText}>Publicar carona</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  timeInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  timeInputText: {
    color: colors.primary,
    fontSize: 15,
  },
  placeholderText: {
    color: '#888888',
    fontSize: 15,
  },
});
