import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import RoyaltyEvent from '../components/RoyaltyEvent';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils/formatting';
import { fetchRoyalties, fetchRoyaltySummary } from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const PERIODS = ['All', 'This month', 'This week'];

function isThisMonth(dateStr) {
  const d = new Date(dateStr);
  const n = new Date();
  return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}

function isThisWeek(dateStr) {
  return Date.now() - new Date(dateStr).getTime() < 7 * 86400000;
}

export default function RoyaltiesScreen() {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({ total_royalties: 0, total_uses: 0, this_month: 0, companies_count: 0 });
  const [period, setPeriod] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [eventsRes, summaryRes] = await Promise.allSettled([
        fetchRoyalties({ limit: 50 }),
        fetchRoyaltySummary(),
      ]);
      if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value?.events || []);
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const filtered = events.filter((e) => {
    if (period === 'This month') return isThisMonth(e.created_at);
    if (period === 'This week') return isThisWeek(e.created_at);
    return true;
  });

  const periodTotal = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Text style={styles.heading}>Earn</Text>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Royalties</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(summary.total_royalties)}</Text>

          <View style={styles.summaryStats}>
            <View style={styles.sumStat}>
              <Text style={styles.sumStatValue}>{summary.total_uses}</Text>
              <Text style={styles.sumStatLabel}>Times used</Text>
            </View>
            <View style={styles.sumStatDivider} />
            <View style={styles.sumStat}>
              <Text style={styles.sumStatValue}>{summary.companies_count}</Text>
              <Text style={styles.sumStatLabel}>Companies</Text>
            </View>
            <View style={styles.sumStatDivider} />
            <View style={styles.sumStat}>
              <Text style={styles.sumStatValue}>{formatCurrency(summary.this_month)}</Text>
              <Text style={styles.sumStatLabel}>This month</Text>
            </View>
          </View>
        </View>

        {/* Period filter */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Period total */}
        {period !== 'All' && (
          <View style={styles.periodTotal}>
            <Text style={styles.periodTotalLabel}>{period} total</Text>
            <Text style={styles.periodTotalValue}>{formatCurrency(periodTotal)}</Text>
          </View>
        )}

        {/* Events list */}
        <View style={styles.eventsCard}>
          {filtered.length === 0
            ? <EmptyState icon="💸" title="No royalties yet" subtitle="Your earnings will appear here" />
            : filtered.map((event) => <RoyaltyEvent key={event.id} event={event} />)
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingBottom: spacing.xxl },
  heading: { ...typography.heading2, color: colors.text, marginBottom: spacing.md },
  summaryCard: {
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.md,
  },
  summaryLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  summaryAmount: { ...typography.heading1, color: colors.text, marginBottom: spacing.md },
  summaryStats: { flexDirection: 'row' },
  sumStat: { flex: 1, alignItems: 'center' },
  sumStatDivider: { width: 1, backgroundColor: colors.border },
  sumStatValue: { ...typography.body, color: colors.text, fontWeight: '700' },
  sumStatLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  periodRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  periodBtn: {
    paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  periodBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodText: { ...typography.bodySmall, color: colors.textSecondary },
  periodTextActive: { color: colors.background, fontWeight: '600' },
  periodTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.primaryDim, borderRadius: 10,
    padding: spacing.sm, marginBottom: spacing.md,
  },
  periodTotalLabel: { ...typography.body, color: colors.primary },
  periodTotalValue: { ...typography.body, color: colors.primary, fontWeight: '700' },
  eventsCard: {
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md,
  },
});
