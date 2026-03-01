import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity,
} from 'react-native';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency, formatDeadline } from '../utils/formatting';
import { mockTasks } from '../mocks/mockData';

const TYPE_ICONS = { photo: '📷', video: '🎥', audio: '🎙️' };
const DIFFICULTY_COLOR = { easy: 'green', medium: 'amber', hard: 'red' };

export default function TaskDetailScreen({ navigation, route }) {
  const { taskId } = route.params;
  const task = mockTasks.find((t) => t.id === taskId);
  if (!task) return null;

  const fill = Math.round((task.quantity_filled / task.quantity_needed) * 100);
  const spotsLeft = task.quantity_needed - task.quantity_filled;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.badges}>
          <Badge label={task.data_type} color="gray" />
          <Badge label={task.difficulty} color={DIFFICULTY_COLOR[task.difficulty]} />
          {task.is_hot && <Badge label="Hot" color="amber" />}
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.category}>{task.category}</Text>
        <Text style={styles.description}>{task.description}</Text>

        {/* Pay info */}
        <View style={styles.payRow}>
          <View style={styles.payItem}>
            <Text style={styles.payValue}>{formatCurrency(task.pay_per_submission)}</Text>
            <Text style={styles.payLabel}>Upfront pay</Text>
          </View>
          <View style={styles.payDivider} />
          <View style={styles.payItem}>
            <Text style={styles.payValue}>{(task.royalty_rate * 100).toFixed(0)}%</Text>
            <Text style={styles.payLabel}>Royalty rate</Text>
          </View>
          <View style={styles.payDivider} />
          <View style={styles.payItem}>
            <Text style={styles.payValue}>{spotsLeft.toLocaleString()}</Text>
            <Text style={styles.payLabel}>Spots left</Text>
          </View>
        </View>

        {/* Fill */}
        <View style={styles.fillSection}>
          <View style={styles.fillHeader}>
            <Text style={styles.fillLabel}>Progress</Text>
            <Text style={styles.fillPct}>{fill}% filled</Text>
          </View>
          <View style={styles.fillBg}>
            <View style={[styles.fillBar, { width: `${fill}%`, backgroundColor: fill >= 80 ? colors.amber : colors.primary }]} />
          </View>
          <Text style={styles.deadline}>{formatDeadline(task.deadline)}</Text>
        </View>

        {/* Requirements */}
        <Text style={styles.reqTitle}>Requirements</Text>
        {task.requirements.map((r, i) => (
          <View key={i} style={styles.reqRow}>
            <Text style={styles.reqBullet}>•</Text>
            <Text style={styles.reqText}>{r}</Text>
          </View>
        ))}

        {/* User submissions */}
        <View style={styles.myCard}>
          <Text style={styles.myCardTitle}>Your submissions</Text>
          <Text style={styles.myCardValue}>0 approved</Text>
        </View>
      </ScrollView>

      <View style={styles.ctaBar}>
        <Button
          title={`Capture for this Task (+${formatCurrency(task.pay_per_submission)})`}
          onPress={() => navigation.navigate('Capture')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingBottom: 100 },
  back: { marginBottom: spacing.md },
  backText: { ...typography.body, color: colors.textSecondary },
  badges: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm },
  title: { ...typography.heading2, color: colors.text, marginBottom: spacing.xs },
  category: { ...typography.bodySmall, color: colors.primary, marginBottom: spacing.md },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg },
  payRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.md, marginBottom: spacing.lg,
  },
  payItem: { flex: 1, alignItems: 'center' },
  payDivider: { width: 1, backgroundColor: colors.border },
  payValue: { ...typography.heading3, color: colors.primary },
  payLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  fillSection: { marginBottom: spacing.lg },
  fillHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  fillLabel: { ...typography.bodySmall, color: colors.textSecondary },
  fillPct: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  fillBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: spacing.xs },
  fillBar: { height: '100%', borderRadius: 3 },
  deadline: { ...typography.caption, color: colors.textTertiary },
  reqTitle: { ...typography.body, color: colors.text, fontWeight: '700', marginBottom: spacing.sm },
  reqRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs },
  reqBullet: { color: colors.primary, fontWeight: '700' },
  reqText: { ...typography.body, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  myCard: {
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginTop: spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  myCardTitle: { ...typography.body, color: colors.textSecondary },
  myCardValue: { ...typography.body, color: colors.text, fontWeight: '700' },
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
});
