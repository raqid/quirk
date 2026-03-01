import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const STATS = [
  { value: '2,400+', label: 'Contributors' },
  { value: '$18',    label: 'Avg/month'    },
  { value: '150+',   label: 'Companies'    },
];

export default function OnboardingWelcome({ navigation }) {
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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'space-between', paddingVertical: spacing.xl },
  logoSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primaryDim,
    borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { fontSize: 40, fontWeight: '800', color: colors.primary },
  appName: { ...typography.heading1, color: colors.text, marginBottom: spacing.sm },
  tagline: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statBorder: { borderLeftWidth: 1, borderLeftColor: colors.border },
  statValue: { ...typography.heading3, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  actions: {},
  loginBtn: { marginTop: spacing.sm },
});
