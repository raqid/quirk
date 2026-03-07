import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/formatting';

const TYPE_ICONS = { Photos: 'camera', Videos: 'video', Audio: 'mic' };

export default function PortfolioCard({ portfolio }) {
  const isUp = portfolio.trend_direction === 'up';
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>Total Earned</Text>
      <Text style={styles.totalAmount}>{formatCurrency(portfolio.total_earned)}</Text>

      <View style={styles.monthRow}>
        <Text style={styles.monthAmount}>{formatCurrency(portfolio.royalties_this_month)} this month</Text>
        <View style={styles.trendRow}>
          <Icon name={isUp ? 'arrowUp' : 'arrowDown'} size={14} color={isUp ? colors.text : colors.red} />
          <Text style={[styles.trend, { color: isUp ? colors.text : colors.red }]}>
            {portfolio.trend_percent}%
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.breakdown}>
        {[
          { label: 'Photos', iconName: 'camera', data: portfolio.photos },
          { label: 'Videos', iconName: 'video',  data: portfolio.videos },
          { label: 'Audio',  iconName: 'mic',    data: portfolio.audio  },
        ].map(({ label, iconName, data }) => (
          <View key={label} style={styles.breakdownItem}>
            <Icon name={iconName} size={20} color={colors.textSecondary} />
            <Text style={styles.breakdownCount}>{data.count}</Text>
            <Text style={styles.breakdownLabel}>{label}</Text>
            <Text style={styles.breakdownEarned}>{formatCurrency(data.monthly_royalties)}/mo</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: spacing.md },
  label: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  totalAmount: { ...typography.heading1, color: colors.text, marginBottom: spacing.xs },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  monthAmount: { ...typography.bodySmall, color: colors.textSecondary },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  trend: { ...typography.bodySmall, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.md },
  breakdown: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownItem: { flex: 1, alignItems: 'center', gap: 2 },
  breakdownCount: { ...typography.body, color: colors.text, fontWeight: '700' },
  breakdownLabel: { ...typography.caption, color: colors.textTertiary },
  breakdownEarned: { ...typography.caption, color: colors.text, marginTop: 2 },
});
