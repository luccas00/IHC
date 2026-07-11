import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 14,
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 14,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#29485f',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: colors.surface,
    color: colors.primary,
  },
  multilineInput: {
    minHeight: 90,
  },
  primaryButton: {
    minHeight: 49,
    backgroundColor: colors.secondary,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryActionButton: {
    flex: 2,
    minHeight: 48,
    backgroundColor: colors.secondary,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: colors.secondaryDark,
    fontWeight: 'bold',
  },
  clearButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#7a91a3',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#456176',
    fontWeight: 'bold',
  },
  buttonText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  helperText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#46647a',
    fontSize: 12,
    lineHeight: 18,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
