import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/colors';

export default function AppHeader({ onLogout }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Caronas ICEA</Text>
        <Text style={styles.headerSubtitle}>
          Caronas universitárias do ICEA/UFOP
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 86,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 27,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#d7e4ef',
    fontSize: 13,
    marginTop: 4,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#6f91ac',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
});
