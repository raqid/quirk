import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import TaskCard from '../components/TaskCard';
import RoyaltyEvent from '../components/RoyaltyEvent';
import EarningsBar from '../components/EarningsBar';
import TierProgress from '../components/TierProgress';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/formatting';
import {
  fetchProfile, fetchProfileStats, fetchPortfolio,
  fetchTasks, fetchRoyalties, fetchNotifications,
} from '../services/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function buildLast7Days(royaltyEvents) {
  const now   = new Date();
  const bars  = Array.from({ length: 7 }, (_, i) => {
    const d   = new Date(now.getTime() - (6 - i) * 86400000);
    return { day: DAYS[d.getDay()], date: d.toISOString().split('T')[0], amount: 0 };
  });
  for (const ev of royaltyEvents) {
    const date = new Date(ev.created_at).toISOString().split('T')[0];
    const bar  = bars.find((b) => b.date === date);
    if (bar) bar.amount += Number(ev.amount || 0);
  }
  return bars;
}

function StatChip({ label, value, highlight }) {
  return (
    <View style={[styles.chip, highlight && styles.chipHighlight]}>
      <Text style={[styles.chipValue, highlight && styles.chipValueHL]}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

const EMPTY_PORTFOLIO = {
  total_earned: 0, royalties_this_month: 0, royalties_last_month: 0,
  trend_percent: 0, trend_direction: 'up',
  photos: { count: 0 }, videos: { count: 0 }, audio: { count: 0 },
};
const EMPTY_STATS = { total_uploads: 0, total_earned: 0, total_referrals: 0, streak_days: 0, tier: 'bronze', next_tier: 'silver', tier_progress: 0, next_tier_uploads: 10 };

export default function HomeScreen({ navigation }) {
  const [profile,       setProfile]       = useState(null);
  const [stats,         setStats]         = useState(EMPTY_STATS);
  const [portfolio,     setPortfolio]     = useState(EMPTY_PORTFOLIO);
  const [tasks,         setTasks]         = useState([]);
  const [royalties,     setRoyalties]     = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);

  const last7Days = useMemo(() => buildLast7Days(royalties), [royalties]);

  const loadData = async () => {
    try {
      const [profR, statsR, portR, tasksR, royR, notifR] = await Promise.allSettled([
        fetchProfile(),
        fetchProfileStats(),
        fetchPortfolio(),
        fetchTasks({ status: 'active', limit: 3 }),
        fetchRoyalties({ limit: 50 }),
        fetchNotifications({ unread: true, limit: 1 }),
      ]);
      if (profR.status  === 'fulfilled') setProfile(profR.value);
      if (statsR.status === 'fulfilled') setStats(statsR.value || EMPTY_STATS);
      if (portR.status  === 'fulfilled') setPortfolio(portR.value || EMPTY_PORTFOLIO);
      if (tasksR.status === 'fulfilled') setTasks(tasksR.value?.tasks || []);
      if (royR.status   === 'fulfilled') setRoyalties(royR.value?.events || []);
      if (notifR.status === 'fulfilled') setUnreadCount(notifR.value?.unread_count || 0);
    } catch {}
  };

  useEffect(() => { loadData().finally(() => setLoading(false)); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const displayName = profile?.display_name || 'there';
  const firstName   = displayName.split(' ')[0];
  const initials    = displayName.charAt(0).toUpperCase();

  const trendUp   = portfolio.trend_direction === 'up';
  const thisMonth = Number(portfolio.royalties_this_month || 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Text style={styles.bellIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('ProfileScreen')}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero earnings card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Total Earned</Text>
              <Text style={styles.heroAmount}>{formatCurrency(stats.total_earned)}</Text>
              <View style={styles.trendRow}>
                <Text style={[styles.trendBadge, { color: trendUp ? colors.primary : colors.red }]}>
                  {trendUp ? '↑' : '↓'} {portfolio.trend_percent}%
                </Text>
                <Text style={styles.trendLabel}> vs last month</Text>
              </View>
            </View>
            <View style={styles.heroRight}>
              {stats.streak_days > 0 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakFire}>🔥</Text>
                  <Text style={styles.streakNum}>{stats.streak_days}</Text>
                  <Text style={styles.streakLabel}>day{stats.streak_days !== 1 ? 's' : ''}</Text>
                </View>
              )}
            </View>
          </View>

          {/* 7-day earnings bars */}
          <EarningsBar last7Days={last7Days} />

          <View style={styles.heroStats}>
            <StatChip label="This month" value={formatCurrency(thisMonth)} highlight />
            <StatChip label="Uploads"    value={stats.total_uploads} />
            <StatChip label="Referrals"  value={stats.total_referrals} />
          </View>
        </View>

        {/* Tier progress */}
        <View style={styles.px}>
          <TierProgress
            tier={stats.tier}
            nextTier={stats.next_tier}
            progress={stats.tier_progress}
            uploadsNeeded={
              stats.next_tier_uploads != null
                ? Math.max(0, stats.next_tier_uploads - stats.total_uploads)
                : null
            }
          />
        </View>

        {/* Top task */}
        {tasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Task Right Now</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </View>
            <TaskCard
              task={tasks[0]}
              onPress={() => navigation.navigate('TaskDetail', { taskId: tasks[0].id })}
            />
          </View>
        )}

        {/* More tasks */}
        {tasks.length > 1 && (
          <View style={[styles.section, { marginTop: 0 }]}>
            <Text style={styles.sectionTitle}>More Tasks</Text>
            {tasks.slice(1).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              />
            ))}
          </View>
        )}

        {/* Recent royalties */}
        {royalties.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Royalties</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Earn')}>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.royaltyCard}>
              {royalties.slice(0, 5).map((event) => (
                <RoyaltyEvent key={event.id} event={event} />
              ))}
            </View>
          </View>
        )}

        {/* Capture CTA */}
        <TouchableOpacity
          style={styles.captureCta}
          onPress={() => navigation.navigate('Capture')}
          activeOpacity={0.85}
        >
          <Text style={styles.captureCtaIcon}>📷</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.captureCtaTitle}>Ready to capture?</Text>
            <Text style={styles.captureCtaSub}>Upload media and start earning today</Text>
          </View>
          <Text style={styles.captureCtaArrow}>→</Text>
        </TouchableOpacity>

        {/* Leaderboard nudge */}
        <TouchableOpacity
          style={styles.lbNudge}
          onPress={() => navigation.navigate('Leaderboard')}
          activeOpacity={0.8}
        >
          <Text style={styles.lbNudgeIcon}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.lbNudgeTitle}>View Leaderboard</Text>
            <Text style={styles.lbNudgeSub}>See where you rank against other contributors</Text>
          </View>
          <Text style={styles.lbNudgeArrow}>→</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.background },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm },
  greeting:       { ...typography.caption, color: colors.textSecondary },
  name:           { ...typography.heading3, color: colors.text },
  headerRight:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bellBtn:        { position: 'relative', width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  bellIcon:       { fontSize: 20 },
  bellBadge:      { position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  bellBadgeText:  { fontSize: 9, color: '#fff', fontWeight: '700' },
  avatar:         { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryDim, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText:     { ...typography.bodySmall, color: colors.primary, fontWeight: '700' },
  heroCard:       { margin: spacing.md, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.md },
  heroTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLabel:      { ...typography.caption, color: colors.textTertiary, marginBottom: 4 },
  heroAmount:     { ...typography.heading1, color: colors.text },
  trendRow:       { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  trendBadge:     { ...typography.caption, fontWeight: '700' },
  trendLabel:     { ...typography.caption, color: colors.textTertiary },
  heroRight:      { alignItems: 'flex-end' },
  streakBadge:    { backgroundColor: colors.amber + '20', borderWidth: 1, borderColor: colors.amber + '60', borderRadius: 12, paddingHorizontal: spacing.sm, paddingVertical: 6, alignItems: 'center' },
  streakFire:     { fontSize: 18 },
  streakNum:      { ...typography.heading3, color: colors.amber, lineHeight: 22 },
  streakLabel:    { ...typography.caption, color: colors.amber },
  heroStats:      { flexDirection: 'row', gap: spacing.sm },
  chip:           { flex: 1, backgroundColor: colors.background, borderRadius: 10, borderWidth: 1, borderColor: colors.border, padding: spacing.sm, alignItems: 'center' },
  chipHighlight:  { backgroundColor: colors.primaryDim, borderColor: colors.primary + '40' },
  chipValue:      { ...typography.body, color: colors.text, fontWeight: '700' },
  chipValueHL:    { color: colors.primary },
  chipLabel:      { ...typography.caption, color: colors.textTertiary, marginTop: 1 },
  px:             { paddingHorizontal: spacing.md, marginBottom: spacing.md },
  section:        { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle:   { ...typography.body, color: colors.text, fontWeight: '700' },
  seeAll:         { ...typography.caption, color: colors.primary },
  royaltyCard:    { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  captureCta:     { flexDirection: 'row', alignItems: 'center', gap: spacing.md, margin: spacing.md, marginTop: spacing.lg, backgroundColor: colors.primaryDim, borderRadius: 14, borderWidth: 1, borderColor: colors.primary + '44', padding: spacing.md },
  captureCtaIcon: { fontSize: 28 },
  captureCtaTitle:{ ...typography.body, color: colors.text, fontWeight: '600' },
  captureCtaSub:  { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  captureCtaArrow:{ fontSize: 18, color: colors.primary },
  lbNudge:        { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  lbNudgeIcon:    { fontSize: 24 },
  lbNudgeTitle:   { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  lbNudgeSub:     { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  lbNudgeArrow:   { fontSize: 18, color: colors.textTertiary },
});
