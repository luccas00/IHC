import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/colors';

const HORARIOS = [
  '07:00',
  '07:30',
  '08:00',
  '12:00',
  '13:00',
  '17:30',
  '18:00',
  '18:30',
  '22:00',
];

export default function TimePickerModal({ visible, onSelect, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Selecionar horário</Text>

          <View style={styles.timeGrid}>
            {HORARIOS.map((time) => (
              <TouchableOpacity
                key={time}
                style={styles.timeButton}
                onPress={() => onSelect(time)}
              >
                <Text style={styles.timeText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
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
    marginBottom: 14,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: '31%',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: 9,
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    color: colors.surface,
    fontWeight: 'bold',
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
