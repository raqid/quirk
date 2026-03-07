import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Button from '../components/Button';
import { useAuthContext } from '../context/AuthContext';
import { saveToken } from '../services/storage';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const STATS = [
  { value: '2,400+', label: 'Contributors' },
  { value: '$18',    label: 'Avg/month'    },
  { value: '150+',   label: 'Companies'    },
];

export default function OnboardingWelcome({ navigation }) {
  const { setIsAuthenticated } = useAuthContext();

  const handleDevSkip = async () => {
    await saveToken('dev-skip-token');
    setIsAuthenticated(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Q</Text>
          </View>
          <Text style={styles.appName}>Quirk</Text>
          <Text style={styles.tagline}>Capture the world.{'\n'}Earn while AI learns.</Text>
          <Text style={styles.explainer}>Upload photos, videos & audio. AI companies pay you upfront + ongoing royalties.</Text>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.stat, i > 0 && styles.statBorder]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Get Started" onPress={() => navigation.navigate('Signup')} />
          <Button
            title="I already have an account"
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginBtn}
          />
          <Button
            title="Skip Login (Dev)"
            variant="secondary"
            onPress={handleDevSkip}
            style={styles.devBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'space-between', paddingTop: spacing.xl, paddingBottom: spacing.lg },
  logoSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { fontSize: 40, fontWeight: '800', color: colors.text },
  appName: { ...typography.heading1, color: colors.text, marginBottom: spacing.sm },
  tagline: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  explainer: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 18 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statBorder: { borderLeftWidth: 1, borderLeftColor: colors.border },
  statValue: { ...typography.heading3, color: colors.text },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  actions: {},
  loginBtn: { marginTop: spacing.sm },
  devBtn: { marginTop: spacing.xs, opacity: 0.6 },
});
