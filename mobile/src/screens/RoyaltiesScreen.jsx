import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import RoyaltyEvent from '../components/RoyaltyEvent';
import EmptyState from '../components/EmptyState';
import Card from '../components/Card';
import Skeleton from '../components/Skeleton';
import { Icon } from '../utils/icons';
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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [eventsRes, summaryRes] = await Promise.allSettled([
        fetchRoyalties({ limit: 50 }),
        fetchRoyaltySummary(),
      ]);
      if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value?.events || []);
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
      setError(false);
    } catch {
      setError(true);
    }
  };

  useEffect(() => { loadData().finally(() => setLoading(false)); }, []);

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

        {loading && (
          <View style={{ gap: spacing.md }}>
            <Skeleton width={'100%'} height={140} borderRadius={12} />
            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              <Skeleton width={60} height={32} borderRadius={20} />
              <Skeleton width={80} height={32} borderRadius={20} />
              <Skeleton width={70} height={32} borderRadius={20} />
            </View>
            <Skeleton width={'100%'} height={200} borderRadius={12} />
          </View>
        )}

        {/* Summary card */}
        {!loading && <>
          <Card style={styles.summaryCardInner}>
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
          </Card>

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

          {/* Error state */}
          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>Could not load royalties</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Events list */}
          {!error && (
            <Card style={styles.eventsCardInner}>
              {filtered.length === 0
                ? <View style={styles.emptyExplainer}>
                    <Icon name="coins" size={48} color={colors.textTertiary} style={{ marginBottom: spacing.sm }} />
                    <Text style={styles.emptyTitle}>No royalties yet</Text>
                    <Text style={styles.emptyBody}>Your royalties will appear here when companies use your data. Keep uploading to earn more!</Text>
                  </View>
                : filtered.map((event) => <RoyaltyEvent key={event.id} event={event} />)
              }
            </Card>
          )}
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingBottom: spacing.xxl },
  heading: { ...typography.heading2, color: colors.text, marginBottom: spacing.md },
  summaryCardInner: {
    marginBottom: spacing.md,
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
    borderRadius: 8, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  periodBtnActive: { backgroundColor: colors.ctaBackground, borderColor: colors.ctaBackground },
  periodText: { ...typography.bodySmall, color: colors.textSecondary },
  periodTextActive: { color: colors.ctaText, fontWeight: '600' },
  periodTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surfaceElevated, borderRadius: 12,
    padding: spacing.sm, marginBottom: spacing.md,
  },
  periodTotalLabel: { ...typography.body, color: colors.text },
  periodTotalValue: { ...typography.body, color: colors.text, fontWeight: '700' },
  eventsCardInner: {},
  errorCard: { alignItems: 'center', paddingVertical: spacing.xl },
  errorText: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  retryBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  retryText: { ...typography.body, color: colors.text, fontWeight: '600' },
  emptyExplainer: { alignItems: 'center', paddingVertical: spacing.lg },
  emptyTitle: { ...typography.heading3, color: colors.text, marginBottom: spacing.xs },
  emptyBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
