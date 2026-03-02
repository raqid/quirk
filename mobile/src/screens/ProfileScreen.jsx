import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Alert, Share,
} from 'react-native';
import Button from '../components/Button';
import TierProgress from '../components/TierProgress';
import { formatCurrency } from '../utils/formatting';
import { fetchProfile, fetchProfileStats, fetchReferrals } from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import { logout } from '../services/auth';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const TIER_META = {
  bronze:   { icon: '🥉', color: '#CD7F32' },
  silver:   { icon: '🥈', color: '#A8A9AD' },
  gold:     { icon: '🥇', color: '#FFD700' },
  platinum: { icon: '💎', color: '#00E676' },
};

function StatBox({ value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { setIsAuthenticated } = useAuthContext();
  const [profile,   setProfile]   = useState(null);
  const [stats,     setStats]     = useState({ total_uploads: 0, total_earned: 0, total_referrals: 0, streak_days: 0, tier: 'bronze', next_tier: 'silver', tier_progress: 0, next_tier_uploads: 10 });
  const [referrals, setReferrals] = useState(null);

  useEffect(() => {
    Promise.allSettled([fetchProfile(), fetchProfileStats(), fetchReferrals()]).then(([p, s, r]) => {
      if (p.status === 'fulfilled') setProfile(p.value);
      if (s.status === 'fulfilled') setStats(s.value || stats);
      if (r.status === 'fulfilled') setReferrals(r.value);
    });
  }, []);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          await logout();
          setIsAuthenticated(false);
        },
      },
    ]);
  };

  const handleShare = async () => {
    const code = profile?.referral_code || referrals?.referral_code;
    if (!code) return;
    await Share.share({
      message: `Join Quirk and start earning from your photos & videos! Use my code ${code} to get started. https://quirk.app/join`,
      title:   'Join Quirk',
    });
  };

  const displayName   = profile?.display_name || 'User';
  const initial       = displayName.charAt(0).toUpperCase();
  const memberYear    = profile?.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear();
  const referralCode  = profile?.referral_code || referrals?.referral_code || '—';
  const tier          = stats.tier || 'bronze';
  const tierMeta      = TIER_META[tier] || TIER_META.bronze;
  const uploadsNeeded = stats.next_tier_uploads != null
    ? Math.max(0, stats.next_tier_uploads - stats.total_uploads)
    : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {navigation.canGoBack() && (
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}

        {/* Avatar + identity */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarRing, { borderColor: tierMeta.color + '80' }]}>
            <View style={styles.avatar}>
              <Text style={[styles.avatarLetter, { color: tierMeta.color }]}>{initial}</Text>
            </View>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <View style={styles.tierRow}>
            <Text style={styles.tierIcon}>{tierMeta.icon}</Text>
            <Text style={[styles.tierLabel, { color: tierMeta.color }]}>
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </Text>
            {stats.streak_days > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>🔥 {stats.streak_days} day streak</Text>
              </View>
            )}
          </View>
          {profile?.city && profile?.country && (
            <Text style={styles.location}>📍 {profile.city}, {profile.country}</Text>
          )}
          <Text style={styles.memberSince}>Member since {memberYear}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox value={stats.total_uploads}              label="Uploads"    />
          <View style={styles.statDiv} />
          <StatBox value={formatCurrency(stats.total_earned)} label="Earned"   />
          <View style={styles.statDiv} />
          <StatBox value={stats.total_referrals ?? 0}       label="Referrals"  />
          <View style={styles.statDiv} />
          <StatBox value={stats.streak_days ?? 0}           label="Day streak" />
        </View>

        {/* Tier progress */}
        <TierProgress
          tier={tier}
          nextTier={stats.next_tier}
          progress={stats.tier_progress}
          uploadsNeeded={uploadsNeeded}
          earnedNeeded={
            stats.next_tier_earned != null
              ? Math.max(0, stats.next_tier_earned - stats.total_earned)
              : null
          }
        />

        {/* Refer & Earn */}
        <View style={styles.referCard}>
          <View style={styles.referTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.referTitle}>Refer & Earn</Text>
              <Text style={styles.referSub}>Earn 10% of every royalty your referrals earn — forever</Text>
            </View>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
              <Text style={styles.shareBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Your code</Text>
            <Text style={styles.code}>{referralCode}</Text>
          </View>
          {referrals && Number(referrals.total_referred) > 0 && (
            <Text style={styles.referEarned}>
              {referrals.total_referred} {referrals.total_referred === 1 ? 'friend' : 'friends'} joined · {formatCurrency(referrals.total_earned)} earned
            </Text>
          )}
        </View>

        {/* Settings */}
        <View style={styles.settingsCard}>
          {[
            { icon: '🏆', label: 'Leaderboard',          onPress: () => navigation.navigate('Leaderboard') },
            { icon: '💳', label: 'Payout & Settings',    onPress: () => navigation.navigate('Settings')    },
            { icon: '🔔', label: 'Notifications',         onPress: () => navigation.navigate('Notifications') },
          ].map((item, i, arr) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.settingRow} onPress={item.onPress} activeOpacity={0.7}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.settingDivider} />}
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
  safe:          { flex: 1, backgroundColor: colors.background },
  content:       { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xxl, gap: spacing.md },
  back:          { marginBottom: spacing.sm },
  backText:      { ...typography.body, color: colors.textSecondary },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.md },
  avatarRing:    { width: 92, height: 92, borderRadius: 46, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatar:        { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryDim, alignItems: 'center', justifyContent: 'center' },
  avatarLetter:  { fontSize: 36, fontWeight: '700' },
  name:          { ...typography.heading2, color: colors.text, marginBottom: spacing.xs },
  tierRow:       { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  tierIcon:      { fontSize: 18 },
  tierLabel:     { ...typography.body, fontWeight: '700' },
  streakPill:    { backgroundColor: colors.amber + '20', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.amber + '40' },
  streakText:    { ...typography.caption, color: colors.amber, fontWeight: '600' },
  location:      { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  memberSince:   { ...typography.caption, color: colors.textTertiary, marginTop: 4 },
  statsRow:      { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.md },
  statBox:       { flex: 1, alignItems: 'center' },
  statDiv:       { width: 1, backgroundColor: colors.border },
  statValue:     { ...typography.body, color: colors.text, fontWeight: '700' },
  statLabel:     { ...typography.caption, color: colors.textTertiary, marginTop: 2, textAlign: 'center' },
  referCard:     { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.primary + '40', padding: spacing.md, gap: spacing.sm },
  referTop:      { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  referTitle:    { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: 2 },
  referSub:      { ...typography.caption, color: colors.textSecondary, lineHeight: 17 },
  shareBtn:      { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: spacing.md, paddingVertical: 8 },
  shareBtnText:  { ...typography.caption, color: colors.background, fontWeight: '700' },
  codeRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background, borderRadius: 10, padding: spacing.sm, borderWidth: 1, borderColor: colors.border },
  codeLabel:     { ...typography.caption, color: colors.textTertiary },
  code:          { ...typography.body, color: colors.primary, fontWeight: '700', letterSpacing: 2 },
  referEarned:   { ...typography.caption, color: colors.textSecondary },
  settingsCard:  { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  settingRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  settingIcon:   { fontSize: 18, width: 24 },
  settingLabel:  { ...typography.body, color: colors.text, flex: 1 },
  settingArrow:  { fontSize: 20, color: colors.textTertiary },
  settingDivider:{ height: 1, backgroundColor: colors.border },
  signOutBtn:    {},
  version:       { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
});
