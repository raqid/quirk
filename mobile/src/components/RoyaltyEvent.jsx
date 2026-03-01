import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatRelativeTime, formatCurrency } from '../utils/formatting';

export default function RoyaltyEvent({ event }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <View style={styles.info}>
        <Text style={styles.company}>{event.company_name}</Text>
        <Text style={styles.time}>{formatRelativeTime(event.created_at)}</Text>
      </View>
      <Text style={styles.amount}>+{formatCurrency(event.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginRight: spacing.sm },
  info: { flex: 1 },
  company: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  time: { ...typography.caption, color: colors.textTertiary },
  amount: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
});
