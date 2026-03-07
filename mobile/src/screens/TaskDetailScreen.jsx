import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import Skeleton from '../components/Skeleton';
import ScreenHeader from '../components/ScreenHeader';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency, formatDeadline } from '../utils/formatting';
import { fetchTask } from '../services/api';

const TYPE_ICONS = { photo: 'camera', video: 'video', audio: 'mic' };
const DIFFICULTY_COLOR = { easy: 'green', medium: 'amber', hard: 'red' };

export default function TaskDetailScreen({ navigation, route }) {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask(taskId)
      .then((data) => setTask(data))
      .catch(() => setTask(null))
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Skeleton width={60} height={16} borderRadius={4} />
          <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md }}>
            <Skeleton width={60} height={24} borderRadius={12} />
            <Skeleton width={60} height={24} borderRadius={12} />
          </View>
          <Skeleton width={'80%'} height={28} borderRadius={4} style={{ marginTop: spacing.md }} />
          <Skeleton width={120} height={14} borderRadius={4} style={{ marginTop: spacing.xs }} />
          <Skeleton width={'100%'} height={60} borderRadius={4} style={{ marginTop: spacing.md }} />
          <Skeleton width={'100%'} height={70} borderRadius={14} style={{ marginTop: spacing.lg }} />
          <Skeleton width={'100%'} height={40} borderRadius={4} style={{ marginTop: spacing.lg }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Task" onBack={() => navigation.goBack()} />
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>Task not found.</Text>
      </SafeAreaView>
    );
  }

  const fill = Math.round((task.quantity_filled / task.quantity_needed) * 100);
  const spotsLeft = task.quantity_needed - task.quantity_filled;
  const requirements = Array.isArray(task.requirements) ? task.requirements : [];
  const typeIcon = TYPE_ICONS[task.data_type];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScreenHeader title={task?.title || 'Task'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.badges}>
          <Badge label={task.data_type} color="gray" />
          <Badge label={task.difficulty} color={DIFFICULTY_COLOR[task.difficulty]} />
          {task.is_hot && <Badge label="Hot" color="amber" />}
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.category}>{task.category}</Text>
        <Text style={styles.description}>{task.description}</Text>

        {/* Pay info */}
        <Card style={styles.payRow}>
          <View style={styles.payInner}>
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
        </Card>

        {/* Fill */}
        <View style={styles.fillSection}>
          <View style={styles.fillHeader}>
            <Text style={styles.fillLabel}>Progress</Text>
            <Text style={styles.fillPct}>{fill}% filled</Text>
          </View>
          <View style={styles.fillBg}>
            <View style={[styles.fillBar, { width: `${fill}%`, backgroundColor: fill >= 80 ? colors.amber : colors.primary }]} />
          </View>
          {task.deadline && <Text style={styles.deadline}>{formatDeadline(task.deadline)}</Text>}
        </View>

        {/* Requirements */}
        {requirements.length > 0 && (
          <>
            <Text style={styles.reqTitle}>Requirements</Text>
            {requirements.map((r, i) => (
              <View key={i} style={styles.reqRow}>
                <Text style={styles.reqBullet}>•</Text>
                <Text style={styles.reqText}>{r}</Text>
              </View>
            ))}
          </>
        )}

        {/* User submissions */}
        <Card style={styles.myCard}>
          <View style={styles.myCardInner}>
            <Text style={styles.myCardTitle}>Your submissions</Text>
            <Text style={styles.myCardValue}>{task.user_submission_count ?? 0} approved</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.ctaBar}>
        <Button
          title={`Capture for this Task (+${formatCurrency(task.pay_per_submission)})`}
          onPress={() => navigation.navigate('Capture', { taskId: task.id })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingBottom: 100 },
  badges: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm },
  title: { ...typography.heading2, color: colors.text, marginBottom: spacing.xs },
  category: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg },
  payRow: { marginBottom: spacing.lg, padding: 0 },
  payInner: { flexDirection: 'row', paddingVertical: spacing.md },
  payItem: { flex: 1, alignItems: 'center' },
  payDivider: { width: 1, backgroundColor: colors.border },
  payValue: { ...typography.heading3, color: colors.text },
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
  reqBullet: { color: colors.text, fontWeight: '700' },
  reqText: { ...typography.body, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  myCard: { marginTop: spacing.lg, padding: spacing.md },
  myCardInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  myCardTitle: { ...typography.body, color: colors.textSecondary },
  myCardValue: { ...typography.body, color: colors.text, fontWeight: '700' },
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
});
