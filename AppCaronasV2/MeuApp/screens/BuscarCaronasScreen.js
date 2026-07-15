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

function TimeRangeField({
  label,
  value,
  placeholder,
  onOpen,
  onClear,
}) {
  return (
    <View style={styles.timeRangeColumn}>
      <Text style={commonStyles.inputLabel}>
        {label}
      </Text>

      <View style={styles.timeInput}>
        <TouchableOpacity
          style={styles.timeInputContent}
          onPress={onOpen}
        >
          <Text
            style={
              value
                ? styles.timeInputText
                : styles.placeholderText
            }
          >
            {value || placeholder}
          </Text>
        </TouchableOpacity>

        {!!value && (
          <TouchableOpacity
            style={styles.clearTimeButton}
            onPress={onClear}
            accessibilityLabel={`Limpar ${label}`}
          >
            <Text style={styles.clearTimeText}>
              ×
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function BuscarCaronasScreen({
  origemBusca,
  destinoBusca,
  horarioInicioBusca,
  horarioFimBusca,
  onOrigemChange,
  onDestinoChange,
  onOpenTimePickerInicio,
  onOpenTimePickerFim,
  onLimparHorarioInicio,
  onLimparHorarioFim,
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
        <Text style={commonStyles.cardTitle}>
          Buscar carona
        </Text>

        <Text style={commonStyles.inputLabel}>
          Origem
        </Text>

        <TextInput
          style={commonStyles.input}
          placeholder="Ex.: Centro ou ICEA"
          value={origemBusca}
          onChangeText={onOrigemChange}
        />

        <Text style={commonStyles.inputLabel}>
          Destino
        </Text>

        <TextInput
          style={commonStyles.input}
          placeholder="Ex.: ICEA"
          value={destinoBusca}
          onChangeText={onDestinoChange}
        />

        <Text style={styles.intervalTitle}>
          Intervalo de horário
        </Text>

        <View style={styles.timeRangeRow}>
          <TimeRangeField
            label="Início"
            value={horarioInicioBusca}
            placeholder="00:00"
            onOpen={onOpenTimePickerInicio}
            onClear={onLimparHorarioInicio}
          />

          <TimeRangeField
            label="Fim"
            value={horarioFimBusca}
            placeholder="23:59"
            onOpen={onOpenTimePickerFim}
            onClear={onLimparHorarioFim}
          />
        </View>

        <Text style={styles.intervalHelper}>
          Deixe os horários vazios para buscar em
          qualquer horário.
        </Text>

        <View style={commonStyles.actionRow}>
          <TouchableOpacity
            style={commonStyles.clearButton}
            onPress={onLimparFiltros}
          >
            <Text
              style={commonStyles.clearButtonText}
            >
              Limpar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              commonStyles.primaryActionButton
            }
            onPress={onFiltrar}
          >
            <Text style={commonStyles.buttonText}>
              Filtrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.sectionHeader}>
          <Text style={commonStyles.cardTitle}>
            Todas as caronas
          </Text>

          <TouchableOpacity
            onPress={onAtualizar}
          >
            <Text style={styles.refreshText}>
              Atualizar
            </Text>
          </TouchableOpacity>
        </View>

        {carregandoCaronas ? (
          <ActivityIndicator
            color={colors.secondary}
            size="large"
          />
        ) : caronasDisponiveis.length === 0 ? (
          <Text style={commonStyles.emptyText}>
            Nenhuma carona cadastrada.
          </Text>
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
  intervalTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeRangeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeRangeColumn: {
    flex: 1,
  },
  timeInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    marginBottom: 8,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputContent: {
    flex: 1,
    minHeight: 46,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  timeInputText: {
    color: colors.primary,
    fontSize: 15,
  },
  placeholderText: {
    color: '#888888',
    fontSize: 15,
  },
  clearTimeButton: {
    width: 38,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearTimeText: {
    color: colors.textMuted,
    fontSize: 26,
    lineHeight: 28,
  },
  intervalHelper: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  refreshText: {
    color: colors.secondary,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
});