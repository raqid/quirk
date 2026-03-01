import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import PortfolioCard from '../components/PortfolioCard';
import TaskCard from '../components/TaskCard';
import RoyaltyEvent from '../components/RoyaltyEvent';
import NotificationBanner from '../components/NotificationBanner';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { fetchProfile, fetchPortfolio, fetchTasks, fetchRoyalties, fetchNotifications } from '../services/api';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const EMPTY_PORTFOLIO = {
  total_earned: 0, royalties_this_month: 0, royalties_last_month: 0,
  trend_percent: 0, trend_direction: 'up',
  photos: { count: 0, monthly_royalties: 0 },
  videos: { count: 0, monthly_royalties: 0 },
  audio:  { count: 0, monthly_royalties: 0 },
};

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState(EMPTY_PORTFOLIO);
  const [tasks, setTasks] = useState([]);
  const [royalties, setRoyalties] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const loadData = async () => {
    try {
      const [prof, port, tasksRes, royRes, notifRes] = await Promise.allSettled([
        fetchProfile(),
        fetchPortfolio(),
        fetchTasks({ status: 'active', limit: 3 }),
        fetchRoyalties({ limit: 5 }),
        fetchNotifications({ unread: true, limit: 5 }),
      ]);
      if (prof.status === 'fulfilled') setProfile(prof.value);
      if (port.status === 'fulfilled') setPortfolio(port.value);
      if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value?.tasks || tasksRes.value || []);
      if (royRes.status === 'fulfilled') setRoyalties(royRes.value?.events || []);
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value?.notifications || []);
    } catch {}
  };

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const unread = notifications.filter((n) => !n.read);
  const displayName = profile?.display_name || 'there';

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
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>{displayName.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
            {unread.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unread.length}</Text></View>}
          </TouchableOpacity>
        </View>

        {/* Notification banner */}
        {!dismissedBanner && unread.length > 0 && (
          <NotificationBanner
            notification={unread[0]}
            onDismiss={() => setDismissedBanner(true)}
          />
        )}

        {/* Portfolio */}
        <PortfolioCard portfolio={portfolio} />

        {/* Active tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Tasks</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          {tasks.slice(0, 3).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            />
          ))}
          {tasks.length === 0 && (
            <Text style={styles.emptyText}>No active tasks right now.</Text>
          )}
        </View>

        {/* Recent royalties */}
        {royalties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Royalties</Text>
            <View style={styles.royaltyCard}>
              {royalties.map((event) => (
                <RoyaltyEvent key={event.id} event={event} />
              ))}
            </View>
          </View>
        )}

        {/* Capture CTA */}
        <TouchableOpacity style={styles.captureCta} onPress={() => navigation.navigate('Capture')} activeOpacity={0.85}>
          <Text style={styles.captureCtaIcon}>📷</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.captureCtaTitle}>Ready to capture?</Text>
            <Text style={styles.captureCtaSub}>Upload media and start earning today</Text>
          </View>
          <Text style={styles.captureCtaArrow}>→</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  greeting: { ...typography.caption, color: colors.textSecondary },
  name: { ...typography.heading3, color: colors.text },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryDim,
    borderWidth: 1.5, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...typography.body, color: colors.primary, fontWeight: '700' },
  badge: {
    position: 'absolute', top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { ...typography.body, color: colors.text, fontWeight: '700', marginBottom: spacing.sm },
  seeAll: { ...typography.caption, color: colors.primary },
  emptyText: { ...typography.body, color: colors.textTertiary, textAlign: 'center', paddingVertical: spacing.md },
  royaltyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  captureCta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    margin: spacing.md, marginTop: spacing.lg,
    backgroundColor: colors.primaryDim,
    borderRadius: 14, borderWidth: 1, borderColor: colors.primary + '44',
    padding: spacing.md,
  },
  captureCtaIcon: { fontSize: 28 },
  captureCtaTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  captureCtaSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  captureCtaArrow: { fontSize: 18, color: colors.primary },
});
