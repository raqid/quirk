import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const COLOR_MAP = {
  green:  { bg: colors.primaryDim,  text: colors.primary },
  amber:  { bg: colors.amberDim,    text: colors.amber   },
  red:    { bg: colors.redDim,      text: colors.red     },
  blue:   { bg: colors.blueDim,     text: colors.blue    },
  gray:   { bg: '#2A2A2A',          text: colors.textSecondary },
};

export default function Badge({ label, color = 'gray', style }) {
  const c = COLOR_MAP[color] || COLOR_MAP.gray;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, style]}>
      <Text style={[styles.text, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: { ...typography.caption, fontWeight: '600', textTransform: 'capitalize' },
});
