import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  FlatList, TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatRelativeTime } from '../utils/formatting';
import EmptyState from '../components/EmptyState';

const TYPE_CONFIG = {
  royalty:         { icon: '💸', color: colors.primary },
  approval:        { icon: '✅', color: colors.primary },
  rejection:       { icon: '❌', color: colors.red },
  task:            { icon: '📋', color: colors.amber },
  referral:        { icon: '👥', color: colors.blue },
  weekly_summary:  { icon: '📊', color: colors.textSecondary },
  milestone:       { icon: '🏆', color: colors.amber },
  payout:          { icon: '🏦', color: colors.primary },
};

function NotificationRow({ item, onRead }) {
  const cfg = TYPE_CONFIG[item.type] || { icon: '🔔', color: colors.textSecondary };

  const handlePress = () => {
    if (!item.read) onRead(item.id);
  };

  return (
    <TouchableOpacity
      style={[styles.row, !item.read && styles.rowUnread]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, { backgroundColor: cfg.color + '20' }]}>
        <Text style={styles.icon}>{cfg.icon}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.time}>{formatRelativeTime(item.created_at)}</Text>
      </View>
      {!item.read && <View style={[styles.dot, { backgroundColor: cfg.color }]} />}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetchNotifications({ limit: 50 });
      setNotifications(res?.notifications || []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleRead = async (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    try { await markNotificationRead(id); } catch {}
  };

  const handleReadAll = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try { await markAllNotificationsRead(); } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleReadAll}>
            <Text style={styles.readAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadBannerText}>{unreadCount} unread</Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationRow item={item} onRead={handleRead} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={<EmptyState icon="🔔" title="No notifications" subtitle="You're all caught up!" />}
        contentContainerStyle={notifications.length === 0 ? { flex: 1 } : styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.background },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  back:         { ...typography.body, color: colors.textSecondary },
  heading:      { ...typography.heading3, color: colors.text },
  readAll:      { ...typography.caption, color: colors.primary },
  unreadBanner: { backgroundColor: colors.primaryDim, paddingHorizontal: spacing.md, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.primary + '30' },
  unreadBannerText: { ...typography.caption, color: colors.primary },
  list:         { paddingBottom: spacing.xxl },
  row:          { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  rowUnread:    { backgroundColor: colors.surface },
  iconWrap:     { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  icon:         { fontSize: 18 },
  rowBody:      { flex: 1 },
  title:        { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 2 },
  titleUnread:  { color: colors.text, fontWeight: '600' },
  body:         { ...typography.caption, color: colors.textSecondary, lineHeight: 17 },
  time:         { ...typography.caption, color: colors.textTertiary, marginTop: 3 },
  dot:          { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  separator:    { height: 1, backgroundColor: colors.border },
});
