import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CaronaCard from '../components/CaronaCard';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

export default function ResultadosScreen({
  caronasFiltradas,
  onReservar,
  onVoltar,
}) {
  return (
    <View style={commonStyles.card}>
      <View style={commonStyles.sectionHeader}>
        <Text style={commonStyles.cardTitle}>Resultado da busca</Text>

        <Text style={styles.resultCount}>{caronasFiltradas.length}</Text>
      </View>

      {caronasFiltradas.length === 0 ? (
        <Text style={commonStyles.emptyText}>
          Nenhuma carona corresponde aos filtros.
        </Text>
      ) : (
        caronasFiltradas.map((carona) => (
          <CaronaCard
            key={carona.id}
            carona={carona}
            permitirReserva
            onReservar={onReservar}
          />
        ))
      )}

      <TouchableOpacity
        style={commonStyles.secondaryButton}
        onPress={onVoltar}
      >
        <Text style={commonStyles.secondaryButtonText}>
          Voltar para busca
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  resultCount: {
    minWidth: 30,
    textAlign: 'center',
    color: colors.surface,
    fontWeight: 'bold',
    backgroundColor: colors.secondary,
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
