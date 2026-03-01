import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import PortfolioCard from '../components/PortfolioCard';
import TaskCard from '../components/TaskCard';
import RoyaltyEvent from '../components/RoyaltyEvent';
import NotificationBanner from '../components/NotificationBanner';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { mockUser, mockPortfolio, mockTasks, mockRoyaltyEvents, mockNotifications } from '../mocks/mockData';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ navigation }) {
  const unread = mockNotifications.filter((n) => !n.read);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

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
            <Text style={styles.name}>{mockUser.display_name.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Text style={styles.avatarText}>{mockUser.display_name.charAt(0)}</Text>
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
        <PortfolioCard portfolio={mockPortfolio} />

        {/* Active tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Tasks</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          {mockTasks.slice(0, 3).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            />
          ))}
        </View>

        {/* Recent royalties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Royalties</Text>
          <View style={styles.royaltyCard}>
            {mockRoyaltyEvents.slice(0, 5).map((event) => (
              <RoyaltyEvent key={event.id} event={event} />
            ))}
          </View>
        </View>

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
