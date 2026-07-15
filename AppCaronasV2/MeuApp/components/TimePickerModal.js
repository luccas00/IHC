import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  gerarHorasDisponiveis,
  gerarMinutosDisponiveis,
  obterHorarioPadrao,
} from '../constants/time';
import { colors } from '../styles/colors';

export default function TimePickerModal({
  visible,
  selectedTime,
  title = 'Selecionar horário',
  onSelect,
  onClose,
}) {
  const horasDisponiveis =
    gerarHorasDisponiveis();
  const minutosDisponiveis =
    gerarMinutosDisponiveis();

  const horarioPadrao = obterHorarioPadrao();
  const [horaPadrao, minutoPadrao] =
    horarioPadrao.split(':');

  const [horaSelecionada, setHoraSelecionada] =
    useState(horaPadrao);
  const [
    minutoSelecionado,
    setMinutoSelecionado,
  ] = useState(minutoPadrao);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const horarioInicial =
      selectedTime || horarioPadrao;

    const [hora, minuto] =
      horarioInicial.split(':');

    setHoraSelecionada(
      horasDisponiveis.includes(hora)
        ? hora
        : horasDisponiveis[0]
    );

    setMinutoSelecionado(
      minutosDisponiveis.includes(minuto)
        ? minuto
        : minutosDisponiveis[0]
    );
  }, [visible, selectedTime]);

  function handleConfirmar() {
    onSelect(
      `${horaSelecionada}:${minutoSelecionado}`
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.selectedTime}>
            {horaSelecionada}:{minutoSelecionado}
          </Text>

          <View style={styles.rollupContainer}>
            <View style={styles.rollupColumn}>
              <Text style={styles.columnTitle}>
                Hora
              </Text>

              <ScrollView
                style={styles.rollup}
                showsVerticalScrollIndicator
              >
                {horasDisponiveis.map((hora) => (
                  <TouchableOpacity
                    key={hora}
                    style={[
                      styles.rollupItem,
                      horaSelecionada === hora &&
                        styles.rollupItemSelected,
                    ]}
                    onPress={() =>
                      setHoraSelecionada(hora)
                    }
                  >
                    <Text
                      style={[
                        styles.rollupItemText,
                        horaSelecionada === hora &&
                          styles.rollupItemTextSelected,
                      ]}
                    >
                      {hora}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.separator}>
              :
            </Text>

            <View style={styles.rollupColumn}>
              <Text style={styles.columnTitle}>
                Minuto
              </Text>

              <ScrollView
                style={styles.rollup}
                showsVerticalScrollIndicator
              >
                {minutosDisponiveis.map(
                  (minuto) => (
                    <TouchableOpacity
                      key={minuto}
                      style={[
                        styles.rollupItem,
                        minutoSelecionado ===
                          minuto &&
                          styles.rollupItemSelected,
                      ]}
                      onPress={() =>
                        setMinutoSelecionado(
                          minuto
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.rollupItemText,
                          minutoSelecionado ===
                            minuto &&
                            styles.rollupItemTextSelected,
                        ]}
                      >
                        {minuto}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmar}
          >
            <Text
              style={styles.confirmButtonText}
            >
              Confirmar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  selectedTime: {
    color: colors.secondary,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  rollupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rollupColumn: {
    width: '40%',
  },
  columnTitle: {
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  rollup: {
    height: 220,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
  },
  rollupItem: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rollupItemSelected: {
    backgroundColor: colors.secondary,
  },
  rollupItemText: {
    color: colors.primary,
    fontSize: 17,
  },
  rollupItemTextSelected: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  separator: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: 12,
    marginTop: 28,
  },
  confirmButton: {
    minHeight: 48,
    backgroundColor: colors.secondary,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  confirmButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
});