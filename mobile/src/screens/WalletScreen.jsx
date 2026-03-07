import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency, formatRelativeTime } from '../utils/formatting';
import { fetchWallet, fetchTransactions, requestWithdrawal } from '../services/api';

const TX_ICONS = {
  royalty: 'coins',
  upfront_payment: 'checkCircle',
  payout: 'building',
  referral_bonus: 'users',
  bonus: 'star',
};

const EMPTY_WALLET = { available_balance: 0, pending_balance: 0, total_earned: 0, total_royalties: 0, total_withdrawn: 0, payout_method: null };

export default function WalletScreen() {
  const [wallet, setWallet] = useState(EMPTY_WALLET);
  const [transactions, setTransactions] = useState([]);
  const [totalTx, setTotalTx] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [walletRes, txRes] = await Promise.allSettled([
        fetchWallet(),
        fetchTransactions({ limit: 8 }),
      ]);
      if (walletRes.status === 'fulfilled') setWallet(walletRes.value || EMPTY_WALLET);
      if (txRes.status === 'fulfilled') {
        setTransactions(txRes.value?.transactions || []);
        setTotalTx(txRes.value?.total || 0);
      }
    } catch {}
  };

  useEffect(() => { loadData().finally(() => setLoading(false)); }, []);

  const loadAll = async () => {
    try {
      const res = await fetchTransactions({ limit: 100 });
      setTransactions(res?.transactions || []);
    } catch {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleWithdraw = () => {
    const balance = Number(wallet.available_balance);
    if (balance < 10) {
      Alert.alert('Minimum not met', 'You need at least $10 to withdraw.');
      return;
    }
    Alert.alert(
      'Withdraw Funds',
      `Send ${formatCurrency(balance)} to your ${wallet.payout_method || 'account'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: async () => {
            try {
              await requestWithdrawal(balance);
              Alert.alert('Requested', 'Processing — usually arrives within 24 hours.');
              loadData();
            } catch (e) {
              Alert.alert('Error', e.response?.data?.error || 'Could not process withdrawal.');
            }
          },
        },
      ]
    );
  };

  const displayedTx = showAll ? transactions : transactions.slice(0, 8);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Text style={styles.heading}>Wallet</Text>

        {loading && (
          <View style={{ gap: spacing.md }}>
            <Skeleton width={'100%'} height={180} borderRadius={12} />
            <Skeleton width={'100%'} height={70} borderRadius={12} />
            <Skeleton width={140} height={16} borderRadius={4} />
            <Skeleton width={'100%'} height={200} borderRadius={12} />
          </View>
        )}

        {/* Balance card */}
        {!loading && (
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available balance</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(wallet.available_balance)}</Text>
              <Button
                title="Withdraw Funds"
                onPress={handleWithdraw}
                disabled={Number(wallet.available_balance) < 10}
                style={styles.withdrawBtn}
              />
              <Text style={styles.payoutSla}>Payouts arrive within 24 hours</Text>
              {Number(wallet.available_balance) < 10 && (
                <Text style={styles.minThreshold}>$10.00 minimum to withdraw</Text>
              )}
              <View style={styles.pendingRow}>
                <Text style={styles.pendingLabel}>Pending</Text>
                <Text style={styles.pendingValue}>{formatCurrency(wallet.pending_balance)}</Text>
              </View>
            </View>

            {/* Lifetime stats */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{formatCurrency(wallet.total_earned)}</Text>
                <Text style={styles.statLabel}>Lifetime earned</Text>
              </View>
              <View style={styles.statDiv} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{formatCurrency(wallet.total_royalties)}</Text>
                <Text style={styles.statLabel}>From royalties</Text>
              </View>
              <View style={styles.statDiv} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{formatCurrency(wallet.total_withdrawn)}</Text>
                <Text style={styles.statLabel}>Withdrawn</Text>
              </View>
            </View>

            {/* Transactions */}
            <Text style={styles.txTitle}>Transaction History</Text>
            <View style={styles.txList}>
              {displayedTx.length === 0 ? (
                <Text style={{ ...typography.body, color: colors.textTertiary, textAlign: 'center', paddingVertical: spacing.md }}>No transactions yet.</Text>
              ) : displayedTx.map((tx) => (
                <View key={tx.id} style={styles.txRow}>
                  <View style={styles.txIconWrap}>
                    <Icon name={TX_ICONS[tx.type] || 'coins'} size={18} color={colors.textSecondary} />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                    <Text style={styles.txTime}>{formatRelativeTime(tx.created_at)}</Text>
                  </View>
                  <Text style={[styles.txAmount, Number(tx.amount) < 0 && styles.txAmountNeg]}>
                    {Number(tx.amount) < 0 ? '-' : '+'}{formatCurrency(Math.abs(Number(tx.amount)))}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {!loading && totalTx > 8 && (
          <TouchableOpacity
            style={styles.showAllBtn}
            onPress={() => {
              if (!showAll) loadAll();
              setShowAll(!showAll);
            }}
          >
            <Text style={styles.showAllText}>{showAll ? 'Show less' : `Show all ${totalTx} transactions`}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingBottom: spacing.xxl },
  heading: { ...typography.heading2, color: colors.text, marginBottom: spacing.md },
  balanceCard: {
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.md,
  },
  balanceLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  balanceAmount: { ...typography.heading1, color: colors.text, marginBottom: spacing.md },
  withdrawBtn: { marginBottom: spacing.xs },
  payoutSla: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginBottom: spacing.xs },
  minThreshold: { ...typography.caption, color: colors.amber, textAlign: 'center', marginBottom: spacing.xs },
  pendingRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pendingLabel: { ...typography.caption, color: colors.textSecondary },
  pendingValue: { ...typography.caption, color: colors.amber },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.md, marginBottom: spacing.lg,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDiv: { width: 1, backgroundColor: colors.border },
  statValue: { ...typography.bodySmall, color: colors.text, fontWeight: '700' },
  statLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2, textAlign: 'center' },
  txTitle: { ...typography.body, color: colors.text, fontWeight: '700', marginBottom: spacing.sm },
  txList: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  txIconWrap: { marginRight: spacing.sm, width: 28, alignItems: 'center' },
  txInfo: { flex: 1 },
  txDesc: { ...typography.bodySmall, color: colors.text },
  txTime: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  txAmount: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  txAmountNeg: { color: colors.textSecondary },
  showAllBtn: { alignItems: 'center', paddingVertical: spacing.md },
  showAllText: { ...typography.body, color: colors.text },
});
