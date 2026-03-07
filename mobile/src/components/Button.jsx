import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function Button({ title, onPress, variant = 'primary', size = 'default', disabled, loading, style }) {
  const isPrimary = variant === 'primary';
  const isSmall = size === 'small';
  return (
    <TouchableOpacity
      style={[
        styles.base,
        isSmall && styles.small,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={isPrimary ? colors.ctaText : colors.text} size="small" />
        : <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  small: { height: 36, paddingHorizontal: 16 },
  primary: { backgroundColor: colors.ctaBackground },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: { opacity: 0.4 },
  text: { ...typography.body, fontWeight: '600' },
  textPrimary: { color: colors.ctaText },
  textSecondary: { color: colors.text },
});
