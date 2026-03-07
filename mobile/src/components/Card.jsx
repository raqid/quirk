import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function Card({ children, variant = 'default', onPress, style }) {
  const variantStyle = variant === 'outlined'
    ? styles.outlined
    : variant === 'highlighted'
      ? styles.highlighted
      : styles.default;

  const content = (
    <View style={[styles.base, variantStyle, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
  },
  default: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  highlighted: {
    backgroundColor: colors.primaryDim,
    borderColor: colors.borderLight,
  },
});
