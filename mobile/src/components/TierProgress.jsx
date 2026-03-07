import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '../utils/icons';
import Card from './Card';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const TIER_META = {
  bronze:   { label: 'Bronze',   iconName: 'medal', color: colors.textSecondary,  next: 'Silver'   },
  silver:   { label: 'Silver',   iconName: 'medal', color: colors.textSecondary,  next: 'Gold'     },
  gold:     { label: 'Gold',     iconName: 'medal', color: colors.amber,          next: 'Platinum' },
  platinum: { label: 'Platinum', iconName: 'gem',   color: colors.primary,        next: null       },
};

export default function TierProgress({ tier = 'bronze', nextTier, progress = 0, uploadsNeeded, earnedNeeded }) {
  const meta     = TIER_META[tier]     || TIER_META.bronze;
  const nextMeta = TIER_META[nextTier] || null;

  return (
    <Card>
      <View style={styles.row}>
        <Icon name={meta.iconName} size={28} color={meta.color} />
        <View style={styles.info}>
          <View style={styles.labelRow}>
            <Text style={[styles.tierName, { color: meta.color }]}>{meta.label}</Text>
            {nextMeta && <Text style={styles.nextLabel}>→ {nextMeta.label}</Text>}
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.min(progress, 100)}%`, backgroundColor: meta.color }]} />
          </View>
          {nextMeta && (
            <Text style={styles.hint}>
              {uploadsNeeded != null ? `${uploadsNeeded} more uploads` : `$${earnedNeeded?.toFixed(0)} more earned`} to {nextMeta.label}
            </Text>
          )}
        </View>
        <Text style={styles.pct}>{nextMeta ? `${progress}%` : 'Max'}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  info:      { flex: 1 },
  labelRow:  { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  tierName:  { ...typography.body, fontWeight: '700' },
  nextLabel: { ...typography.caption, color: colors.textTertiary },
  track:     { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  fill:      { height: '100%', borderRadius: 3 },
  hint:      { ...typography.caption, color: colors.textTertiary },
  pct:       { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600', minWidth: 36, textAlign: 'right' },
});
