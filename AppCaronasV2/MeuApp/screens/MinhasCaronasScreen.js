import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';
import { formatarMoeda } from '../utils/formatters';

export default function MinhasCaronasScreen({
  reservas,
  carregandoReservas,
  onAtualizar,
  onCancelar,
}) {
  return (
    <View style={commonStyles.card}>
      <View style={commonStyles.sectionHeader}>
        <Text style={commonStyles.cardTitle}>Minhas caronas</Text>

        <TouchableOpacity onPress={onAtualizar}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      {carregandoReservas ? (
        <ActivityIndicator color={colors.secondary} size="large" />
      ) : reservas.length === 0 ? (
        <Text style={commonStyles.emptyText}>
          Você ainda não solicitou nenhuma vaga.
        </Text>
      ) : (
        reservas.map((reserva) => {
          const reservaConfirmada = reserva.status === 'Confirmada';

          return (
            <View key={reserva.id} style={styles.reservaCard}>
              <Text style={styles.routeTitle}>
                {reserva.origem} → {reserva.destino}
              </Text>

              <Text style={styles.reservaText}>
                Motorista: {reserva.motorista}
              </Text>
              <Text style={styles.reservaText}>
                Horário: {reserva.horario}
              </Text>
              <Text style={styles.reservaText}>
                Valor: {formatarMoeda(reserva.valor)}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  reservaConfirmada
                    ? styles.statusConfirmada
                    : styles.statusCancelada,
                ]}
              >
                <Text style={styles.statusText}>{reserva.status}</Text>
              </View>

              {reservaConfirmada && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => onCancelar(reserva)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar reserva</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  refreshText: {
    color: colors.secondary,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  reservaCard: {
    borderWidth: 1,
    borderColor: '#d8e0e8',
    borderRadius: 10,
    padding: 13,
    marginBottom: 11,
    backgroundColor: '#f8fbfd',
  },
  routeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 7,
    color: colors.primary,
  },
  reservaText: {
    color: '#304c61',
    marginBottom: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
  },
  statusConfirmada: {
    backgroundColor: '#dcefe2',
  },
  statusCancelada: {
    backgroundColor: '#f2dddd',
  },
  statusText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  cancelButton: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: '#a83f3f',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 11,
  },
  cancelButtonText: {
    color: '#8f3030',
    fontWeight: 'bold',
  },
});
