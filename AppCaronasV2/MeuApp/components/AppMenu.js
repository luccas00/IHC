import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/colors';

export default function AppMenu({ screen, onNavigate }) {
  const menuItems = [
    { key: 'home', label: 'Início' },
    { key: 'buscar', label: 'Buscar' },
    { key: 'publicar', label: 'Publicar' },
    { key: 'sobre', label: 'Sobre' },
  ];

  return (
    <View style={styles.menu}>
      {menuItems.map((item) => {
        const active =
          screen === item.key ||
          (item.key === 'buscar' && screen === 'resultados');

        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.menuButton, active && styles.menuButtonActive]}
            onPress={() => onNavigate(item.key)}
          >
            <Text style={[styles.menuText, active && styles.menuTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryDark,
    paddingHorizontal: 6,
  },
  menuButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  menuButtonActive: {
    backgroundColor: '#1d4f73',
    borderBottomColor: '#9dc5e4',
  },
  menuText: {
    color: '#cbd9e5',
    fontWeight: 'bold',
    fontSize: 12,
  },
  menuTextActive: {
    color: colors.surface,
  },
});
