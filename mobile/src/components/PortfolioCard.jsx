import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/formatting';

export default function PortfolioCard({ portfolio }) {
  const isUp = portfolio.trend_direction === 'up';
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total Earned</Text>
      <Text style={styles.totalAmount}>{formatCurrency(portfolio.total_earned)}</Text>

      <View style={styles.monthRow}>
        <Text style={styles.monthAmount}>{formatCurrency(portfolio.royalties_this_month)} this month</Text>
        <Text style={[styles.trend, { color: isUp ? colors.primary : colors.red }]}>
          {isUp ? '↑' : '↓'} {portfolio.trend_percent}%
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.breakdown}>
        {[
          { label: 'Photos', icon: '📷', data: portfolio.photos },
          { label: 'Videos', icon: '🎥', data: portfolio.videos },
          { label: 'Audio',  icon: '🎙️', data: portfolio.audio  },
        ].map(({ label, icon, data }) => (
          <View key={label} style={styles.breakdownItem}>
            <Text style={styles.breakdownIcon}>{icon}</Text>
            <Text style={styles.breakdownCount}>{data.count}</Text>
            <Text style={styles.breakdownLabel}>{label}</Text>
            <Text style={styles.breakdownEarned}>{formatCurrency(data.monthly_royalties)}/mo</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginHorizontal: spacing.md,
  },
  label: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  totalAmount: { ...typography.heading1, color: colors.text, marginBottom: spacing.xs },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  monthAmount: { ...typography.bodySmall, color: colors.textSecondary },
  trend: { ...typography.bodySmall, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.md },
  breakdown: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownItem: { flex: 1, alignItems: 'center' },
  breakdownIcon: { fontSize: 20, marginBottom: 4 },
  breakdownCount: { ...typography.body, color: colors.text, fontWeight: '700' },
  breakdownLabel: { ...typography.caption, color: colors.textTertiary },
  breakdownEarned: { ...typography.caption, color: colors.primary, marginTop: 2 },
});
