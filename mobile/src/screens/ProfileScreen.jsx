import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { formatCurrency } from '../utils/formatting';
import { mockUser, mockPortfolio, mockReferrals } from '../mocks/mockData';
import { useAuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const LEVEL_COLORS = { bronze: 'gray', silver: 'gray', gold: 'amber', platinum: 'green' };

const SETTINGS = [
  { key: 'notifications', icon: '🔔', label: 'Notification Settings' },
  { key: 'payout',        icon: '💳', label: 'Payout Method' },
  { key: 'privacy',       icon: '🔒', label: 'Privacy & Data' },
  { key: 'help',          icon: '❓', label: 'Help & Support' },
  { key: 'terms',         icon: '📄', label: 'Terms & Privacy Policy' },
];

export default function ProfileScreen({ navigation }) {
  const { setIsAuthenticated } = useAuthContext();
  const [showReferral, setShowReferral] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => setIsAuthenticated(false) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {navigation.canGoBack() && (
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{mockUser.display_name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{mockUser.display_name}</Text>
          <View style={styles.levelRow}>
            <Badge label={mockUser.level} color={LEVEL_COLORS[mockUser.level] ?? 'gray'} />
            <Text style={styles.memberSince}>Member since {new Date(mockUser.member_since).getFullYear()}</Text>
          </View>
          {mockUser.city && mockUser.country && (
            <Text style={styles.location}>📍 {mockUser.city}, {mockUser.country}</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{mockUser.total_uploads}</Text>
            <Text style={styles.statLabel}>Uploads</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatCurrency(mockPortfolio.total_earned)}</Text>
            <Text style={styles.statLabel}>Total earned</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{mockReferrals?.total_referred ?? 0}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.referralCard} onPress={() => setShowReferral(!showReferral)} activeOpacity={0.8}>
          <View style={styles.referralHeader}>
            <View>
              <Text style={styles.referralTitle}>Refer & Earn</Text>
              <Text style={styles.referralSub}>Earn 10% of every royalty your referrals earn</Text>
            </View>
            <Text style={styles.referralChevron}>{showReferral ? '↑' : '↓'}</Text>
          </View>
          {showReferral && (
            <View style={styles.referralCode}>
              <Text style={styles.referralCodeLabel}>Your referral code</Text>
              <Text style={styles.referralCodeValue}>{mockUser.referral_code}</Text>
              <Text style={styles.referralNote}>Share this code with friends. You'll earn 10% of their royalties forever.</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.settingsCard}>
          {SETTINGS.map((s, i) => (
            <View key={s.key}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => Alert.alert(s.label, 'Coming soon.')}
                activeOpacity={0.7}
              >
                <Text style={styles.settingIcon}>{s.icon}</Text>
                <Text style={styles.settingLabel}>{s.label}</Text>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
              {i < SETTINGS.length - 1 && <View style={styles.settingDivider} />}
            </View>
          ))}
        </View>

        <Button title="Sign Out" variant="secondary" onPress={handleLogout} style={styles.signOutBtn} />
        <Text style={styles.version}>Quirk v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.md },
  backText: { ...typography.body, color: colors.textSecondary },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primaryDim, borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  avatarLetter: { fontSize: 36, fontWeight: '700', color: colors.primary },
  name: { ...typography.heading2, color: colors.text, marginBottom: spacing.sm },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  memberSince: { ...typography.caption, color: colors.textTertiary },
  location: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.md, marginBottom: spacing.lg,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDiv: { width: 1, backgroundColor: colors.border },
  statValue: { ...typography.body, color: colors.text, fontWeight: '700' },
  statLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  referralCard: {
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.primary + '44',
    padding: spacing.md, marginBottom: spacing.lg,
  },
  referralHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  referralTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  referralSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  referralChevron: { ...typography.body, color: colors.primary, fontWeight: '600' },
  referralCode: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  referralCodeLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  referralCodeValue: { ...typography.heading3, color: colors.primary, letterSpacing: 2, marginBottom: spacing.sm },
  referralNote: { ...typography.caption, color: colors.textTertiary, lineHeight: 18 },
  settingsCard: {
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, marginBottom: spacing.lg,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  settingIcon: { fontSize: 18, width: 24 },
  settingLabel: { ...typography.body, color: colors.text, flex: 1 },
  settingArrow: { fontSize: 20, color: colors.textTertiary },
  settingDivider: { height: 1, backgroundColor: colors.border },
  signOutBtn: { marginBottom: spacing.lg },
  version: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
});
