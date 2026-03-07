import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  FlatList, TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import ScreenHeader from '../components/ScreenHeader';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatRelativeTime } from '../utils/formatting';
import EmptyState from '../components/EmptyState';

const TYPE_CONFIG = {
  royalty:         { icon: 'coins',       color: colors.text },
  approval:        { icon: 'checkCircle', color: colors.text },
  rejection:       { icon: 'ban',         color: colors.red },
  task:            { icon: 'checkSquare', color: colors.amber },
  referral:        { icon: 'users',       color: colors.blue },
  weekly_summary:  { icon: 'barChart',    color: colors.textSecondary },
  milestone:       { icon: 'trophy',      color: colors.amber },
  payout:          { icon: 'building',    color: colors.text },
};

function NotificationRow({ item, onRead }) {
  const cfg = TYPE_CONFIG[item.type] || { icon: 'bell', color: colors.textSecondary };

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
        <Icon name={cfg.icon} size={18} color={cfg.color} />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.time}>{formatRelativeTime(item.created_at)}</Text>
      </View>
      {!item.read && <View style={styles.dot} />}
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

  const rightAction = unreadCount > 0 ? (
    <TouchableOpacity onPress={handleReadAll}>
      <Text style={styles.readAll}>Mark all read</Text>
    </TouchableOpacity>
  ) : undefined;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScreenHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        rightAction={rightAction}
      />

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
        ListEmptyComponent={<EmptyState icon="bell" title="No notifications" subtitle="You're all caught up!" />}
        contentContainerStyle={notifications.length === 0 ? { flex: 1 } : styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.background },
  readAll:      { ...typography.caption, color: colors.text },
  unreadBanner: { backgroundColor: colors.surfaceElevated, paddingHorizontal: spacing.md, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  unreadBannerText: { ...typography.caption, color: colors.text },
  list:         { paddingBottom: spacing.xxl },
  row:          { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  rowUnread:    { backgroundColor: colors.surface },
  iconWrap:     { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  rowBody:      { flex: 1 },
  title:        { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 2 },
  titleUnread:  { color: colors.text, fontWeight: '600' },
  body:         { ...typography.caption, color: colors.textSecondary, lineHeight: 17 },
  time:         { ...typography.caption, color: colors.textTertiary, marginTop: 3 },
  dot:          { width: 8, height: 8, borderRadius: 4, marginTop: 6, backgroundColor: colors.text },
  separator:    { height: 1, backgroundColor: colors.border },
});
