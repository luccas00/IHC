import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/colors';
import { formatarAvaliacao, formatarMoeda } from '../utils/formatters';

export default function CaronaCard({ carona, permitirReserva, onReservar }) {
  const vagasTotais = Number(carona.vagas || 0);
  const vagasPreenchidas = Number(carona.vagasPreenchidas || 0);
  const vagasDisponiveis = Math.max(0, vagasTotais - vagasPreenchidas);

  return (
    <View style={styles.rideItem}>
      <Text style={styles.rideTitle}>
        {carona.origem} → {carona.destino}
      </Text>

      <Text style={styles.rideText}>Motorista: {carona.motorista}</Text>
      <Text style={styles.rideText}>Horário: {carona.horario}</Text>
      <Text style={styles.rideText}>Valor: {formatarMoeda(carona.valor)}</Text>
      <Text style={styles.rideText}>
        Vagas disponíveis: {vagasDisponiveis} de {vagasTotais}
      </Text>
      <Text style={styles.rideText}>
        Avaliação: {formatarAvaliacao(carona.avaliacao)}
      </Text>

      {!!carona.regras && (
        <Text style={styles.rideRules}>Regras: {carona.regras}</Text>
      )}

      {permitirReserva && (
        <TouchableOpacity
          style={[
            styles.smallButton,
            vagasDisponiveis <= 0 && styles.disabledButton,
          ]}
          disabled={vagasDisponiveis <= 0}
          onPress={() => onReservar(carona)}
        >
          <Text style={styles.smallButtonText}>
            {vagasDisponiveis > 0 ? 'Solicitar vaga' : 'Sem vagas'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: colors.primary,
  },
  rideText: {
    color: '#304c61',
    marginBottom: 3,
  },
  rideRules: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },
  smallButton: {
    minHeight: 42,
    backgroundColor: colors.secondaryDark,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 11,
  },
  smallButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
