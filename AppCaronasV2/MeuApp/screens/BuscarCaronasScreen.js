import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CaronaCard from '../components/CaronaCard';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

export default function BuscarCaronasScreen({
  origemBusca,
  destinoBusca,
  horarioBusca,
  onOrigemChange,
  onDestinoChange,
  onOpenTimePicker,
  onLimparFiltros,
  onFiltrar,
  caronasDisponiveis,
  carregandoCaronas,
  onAtualizar,
  onReservar,
}) {
  return (
    <>
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Buscar carona</Text>

        <Text style={commonStyles.inputLabel}>Origem</Text>

        <TextInput
          style={commonStyles.input}
          placeholder="Ex.: Centro ou ICEA"
          value={origemBusca}
          onChangeText={onOrigemChange}
        />

        <Text style={commonStyles.inputLabel}>Destino</Text>

        <TextInput
          style={commonStyles.input}
          placeholder="Ex.: ICEA"
          value={destinoBusca}
          onChangeText={onDestinoChange}
        />

        <Text style={commonStyles.inputLabel}>Horário</Text>

        <TouchableOpacity style={styles.timeInput} onPress={onOpenTimePicker}>
          <Text
            style={
              horarioBusca ? styles.timeInputText : styles.placeholderText
            }
          >
            {horarioBusca || 'Todos os horários'}
          </Text>
        </TouchableOpacity>

        <View style={commonStyles.actionRow}>
          <TouchableOpacity
            style={commonStyles.clearButton}
            onPress={onLimparFiltros}
          >
            <Text style={commonStyles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={commonStyles.primaryActionButton}
            onPress={onFiltrar}
          >
            <Text style={commonStyles.buttonText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.sectionHeader}>
          <Text style={commonStyles.cardTitle}>Todas as caronas</Text>

          <TouchableOpacity onPress={onAtualizar}>
            <Text style={styles.refreshText}>Atualizar</Text>
          </TouchableOpacity>
        </View>

        {carregandoCaronas ? (
          <ActivityIndicator color={colors.secondary} size="large" />
        ) : caronasDisponiveis.length === 0 ? (
          <Text style={commonStyles.emptyText}>Nenhuma carona cadastrada.</Text>
        ) : (
          caronasDisponiveis.map((carona) => (
            <CaronaCard
              key={carona.id}
              carona={carona}
              permitirReserva
              onReservar={onReservar}
            />
          ))
        )}
      </View>
    </>
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
  refreshText: {
    color: colors.secondary,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
});
