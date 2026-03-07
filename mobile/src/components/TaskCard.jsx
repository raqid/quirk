import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency, formatDeadline } from '../utils/formatting';

const TYPE_ICONS = { photo: 'camera', video: 'video', audio: 'mic' };

export default function TaskCard({ task, onPress, compact }) {
  const fill = Math.round((task.quantity_filled / task.quantity_needed) * 100);
  const fillColor = fill >= 80 ? colors.amber : colors.primary;
  const spotsLeft = task.quantity_needed - task.quantity_filled;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Icon name={TYPE_ICONS[task.data_type] || 'camera'} size={22} color={colors.textSecondary} />
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>{task.title}</Text>
          <Text style={styles.category}>{task.category}</Text>
        </View>
        <View style={styles.payBadge}>
          <Text style={styles.payAmount}>{formatCurrency(task.pay_per_submission)}</Text>
          <Text style={styles.payLabel}>each</Text>
        </View>
      </View>

      {!compact && (
        <>
          <View style={styles.fillRow}>
            <View style={styles.fillBg}>
              <View style={[styles.fillBar, { width: `${fill}%`, backgroundColor: fillColor }]} />
            </View>
            <Text style={[styles.fillPct, { color: fillColor }]}>{fill}%</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.spots}>{spotsLeft.toLocaleString()} spots left</Text>
            <Text style={styles.deadline}>{formatDeadline(task.deadline)}</Text>
            {task.is_hot && (
              <View style={styles.hotBadge}>
                <Icon name="flame" size={12} color={colors.amber} />
                <Text style={styles.hot}>Hot</Text>
              </View>
            )}
          </View>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  headerText: { flex: 1 },
  title: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: 2 },
  category: { ...typography.caption, color: colors.textSecondary },
  payBadge: { alignItems: 'flex-end' },
  payAmount: { ...typography.body, color: colors.text, fontWeight: '700' },
  payLabel: { ...typography.caption, color: colors.textTertiary },
  fillRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  fillBg: { flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  fillBar: { height: '100%', borderRadius: 2 },
  fillPct: { ...typography.caption, fontWeight: '600', width: 36, textAlign: 'right' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  spots: { ...typography.caption, color: colors.textSecondary },
  deadline: { ...typography.caption, color: colors.textTertiary },
  hotBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: 'auto' },
  hot: { ...typography.caption, color: colors.amber },
});
