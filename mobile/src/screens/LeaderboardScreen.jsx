import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  FlatList, TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { fetchLeaderboard } from '../services/api';
import ScreenHeader from '../components/ScreenHeader';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/formatting';
import EmptyState from '../components/EmptyState';

const PERIODS  = [
  { key: 'week',  label: 'This Week'  },
  { key: 'month', label: 'This Month' },
  { key: 'all',   label: 'All Time'   },
];

const MEDAL_OPACITY = { 1: 1.0, 2: 0.7, 3: 0.5 };

function LeaderboardRow({ item }) {
  const medalOpacity = MEDAL_OPACITY[item.rank];
  return (
    <View style={[styles.row, item.is_me && styles.rowMe]}>
      <View style={styles.rankWrap}>
        {medalOpacity != null
          ? <Icon name="medal" size={22} color={colors.text} style={{ opacity: medalOpacity }} />
          : <Text style={[styles.rank, item.is_me && styles.rankMe]}>#{item.rank}</Text>
        }
      </View>
      <View style={[styles.avatar, item.is_me && styles.avatarMe]}>
        <Text style={[styles.avatarText, item.is_me && styles.avatarTextMe]}>
          {(item.display_name || '?').charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, item.is_me && styles.nameMe]} numberOfLines={1}>
          {item.display_name}{item.is_me ? ' (You)' : ''}
        </Text>
        {item.country && <Text style={styles.country}>{item.country}</Text>}
      </View>
      <Text style={[styles.amount, item.is_me && styles.amountMe]}>
        {formatCurrency(item.amount)}
      </Text>
    </View>
  );
}

export default function LeaderboardScreen({ navigation }) {
  const [period, setPeriod]       = useState('all');
  const [data, setData]           = useState([]);
  const [myRank, setMyRank]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (p) => {
    try {
      const res = await fetchLeaderboard(p);
      setData(res?.leaderboard || []);
      setMyRank(res?.my_rank || null);
    } catch {}
  }, []);

  useEffect(() => { load(period).finally(() => setLoading(false)); }, []);

  const onPeriodChange = async (p) => {
    setPeriod(p);
    setLoading(true);
    await load(p);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load(period);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScreenHeader title="Leaderboard" onBack={() => navigation.goBack()} />

      {myRank && (
        <View style={styles.myRankBanner}>
          <Text style={styles.myRankText}>Your rank: <Text style={styles.myRankNum}>#{myRank}</Text></Text>
        </View>
      )}

      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.periodBtn, period === p.key && styles.periodBtnActive]}
            onPress={() => onPeriodChange(p.key)}
          >
            <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading
        ? <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
        : (
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.rank)}
            renderItem={({ item }) => <LeaderboardRow item={item} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            ListEmptyComponent={
              <EmptyState icon="trophy" title="No data yet" subtitle="Earn royalties to appear on the leaderboard" />
            }
            contentContainerStyle={data.length === 0 ? { flex: 1 } : styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.background },
  myRankBanner:   { backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginHorizontal: spacing.md, marginBottom: spacing.sm, padding: spacing.sm, alignItems: 'center' },
  myRankText:     { ...typography.bodySmall, color: colors.text },
  myRankNum:      { color: colors.text, fontWeight: '700' },
  periodRow:      { flexDirection: 'row', gap: spacing.xs, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  periodBtn:      { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center' },
  periodBtnActive:{ backgroundColor: colors.ctaBackground, borderColor: colors.ctaBackground },
  periodText:     { ...typography.caption, color: colors.textSecondary },
  periodTextActive:{ color: colors.ctaText, fontWeight: '700' },
  list:           { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  row:            { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: spacing.sm, marginBottom: spacing.xs },
  rowMe:          { borderWidth: 1, borderColor: colors.borderLight, backgroundColor: colors.surfaceElevated },
  rankWrap:       { width: 36, alignItems: 'center' },
  rank:           { ...typography.caption, color: colors.textTertiary, fontWeight: '600' },
  rankMe:         { color: colors.text },
  avatar:         { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  avatarMe:       { backgroundColor: colors.primaryDim, borderWidth: 1, borderColor: colors.primary },
  avatarText:     { ...typography.body, color: colors.textSecondary, fontWeight: '700' },
  avatarTextMe:   { color: colors.text },
  info:           { flex: 1 },
  name:           { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  nameMe:         { color: colors.text, fontWeight: '700' },
  country:        { ...typography.caption, color: colors.textTertiary },
  amount:         { ...typography.bodySmall, color: colors.text, fontWeight: '700' },
  amountMe:       { color: colors.text },
  separator:      { height: spacing.xs },
});
