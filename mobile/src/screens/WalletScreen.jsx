import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency, formatRelativeTime } from '../utils/formatting';
import { mockWallet, mockTransactions } from '../mocks/mockData';

const TX_ICONS = { royalty: '💸', upfront_payment: '✅', payout: '🏦', referral_bonus: '👥', bonus: '🎁' };

export default function WalletScreen() {
  const [showAll, setShowAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const displayedTx = showAll ? mockTransactions : mockTransactions.slice(0, 8);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleWithdraw = () => {
    if (mockWallet.available_balance < 10) {
      Alert.alert('Minimum not met', 'You need at least $10 to withdraw.');
      return;
    }
    Alert.alert(
      'Withdraw Funds',
      `Send ${formatCurrency(mockWallet.available_balance)} to your ${mockWallet.payout_method.type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Withdraw', onPress: () => Alert.alert('Requested', 'Your payout is being processed.') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Text style={styles.heading}>Wallet</Text>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(mockWallet.available_balance)}</Text>
          <Button
            title="Withdraw Funds"
            onPress={handleWithdraw}
            disabled={mockWallet.available_balance < 10}
            style={styles.withdrawBtn}
          />
          <View style={styles.pendingRow}>
            <Text style={styles.pendingLabel}>Pending</Text>
            <Text style={styles.pendingValue}>{formatCurrency(mockWallet.pending_balance)}</Text>
          </View>
        </View>

        {/* Lifetime stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatCurrency(mockWallet.total_earned)}</Text>
            <Text style={styles.statLabel}>Lifetime earned</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatCurrency(mockWallet.total_royalties)}</Text>
            <Text style={styles.statLabel}>From royalties</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatCurrency(mockWallet.total_withdrawn)}</Text>
            <Text style={styles.statLabel}>Withdrawn</Text>
          </View>
        </View>

        {/* Transactions */}
        <Text style={styles.txTitle}>Transaction History</Text>
        <View style={styles.txList}>
          {displayedTx.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <Text style={styles.txIcon}>{TX_ICONS[tx.type] || '•'}</Text>
              <View style={styles.txInfo}>
                <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                <Text style={styles.txTime}>{formatRelativeTime(tx.created_at)}</Text>
              </View>
              <Text style={[styles.txAmount, tx.amount < 0 && styles.txAmountNeg]}>
                {tx.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
              </Text>
            </View>
          ))}
        </View>

        {mockTransactions.length > 8 && (
          <TouchableOpacity style={styles.showAllBtn} onPress={() => setShowAll(!showAll)}>
            <Text style={styles.showAllText}>{showAll ? 'Show less' : `Show all ${mockTransactions.length} transactions`}</Text>
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
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.md,
  },
  balanceLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  balanceAmount: { ...typography.heading1, color: colors.text, marginBottom: spacing.md },
  withdrawBtn: { marginBottom: spacing.sm },
  pendingRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pendingLabel: { ...typography.caption, color: colors.textSecondary },
  pendingValue: { ...typography.caption, color: colors.amber },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.md, marginBottom: spacing.lg,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDiv: { width: 1, backgroundColor: colors.border },
  statValue: { ...typography.bodySmall, color: colors.text, fontWeight: '700' },
  statLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2, textAlign: 'center' },
  txTitle: { ...typography.body, color: colors.text, fontWeight: '700', marginBottom: spacing.sm },
  txList: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  txIcon: { fontSize: 18, marginRight: spacing.sm, width: 28 },
  txInfo: { flex: 1 },
  txDesc: { ...typography.bodySmall, color: colors.text },
  txTime: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  txAmount: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  txAmountNeg: { color: colors.textSecondary },
  showAllBtn: { alignItems: 'center', paddingVertical: spacing.md },
  showAllText: { ...typography.body, color: colors.primary },
});
