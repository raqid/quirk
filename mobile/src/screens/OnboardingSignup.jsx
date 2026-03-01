import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { register } from '../services/auth';

export default function OnboardingSignup({ navigation }) {
  const [mode, setMode] = useState('phone'); // 'phone' | 'email'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!identifier.trim()) { setError('Please enter your ' + (mode === 'phone' ? 'phone number' : 'email')); return; }
    if (!password.trim() || password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await register({ identifier: identifier.trim(), password, referral_code: referralCode || undefined });
      navigation.navigate('Verify', { identifier: identifier.trim() });
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.sub}>Join thousands of contributors earning from their data</Text>

          <View style={styles.toggle}>
            {['phone', 'email'].map((m) => (
              <TouchableOpacity key={m} style={[styles.toggleBtn, mode === m && styles.toggleActive]} onPress={() => { setMode(m); setIdentifier(''); }}>
                <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>{m === 'phone' ? 'Phone' : 'Email'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder={mode === 'phone' ? '+1 555 000 0000' : 'you@example.com'}
            placeholderTextColor={colors.textTertiary}
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType={mode === 'phone' ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, { marginTop: spacing.sm }]}
            placeholder="Password (min 6 characters)"
            placeholderTextColor={colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => setShowReferral(!showReferral)} style={styles.referralToggle}>
            <Text style={styles.referralToggleText}>{showReferral ? '− Hide referral code' : '+ Have a referral code?'}</Text>
          </TouchableOpacity>

          {showReferral && (
            <TextInput
              style={styles.input}
              placeholder="Referral code (optional)"
              placeholderTextColor={colors.textTertiary}
              value={referralCode}
              onChangeText={setReferralCode}
              autoCapitalize="characters"
            />
          )}

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Button title="Continue" onPress={handleContinue} loading={loading} style={styles.cta} />

          <Text style={styles.terms}>By continuing you agree to our Terms of Service and Privacy Policy.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.lg },
  backText: { ...typography.body, color: colors.textSecondary },
  heading: { ...typography.heading2, color: colors.text, marginBottom: spacing.xs },
  sub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  toggle: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 10, marginBottom: spacing.md, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  toggleActive: { backgroundColor: colors.surfaceElevated },
  toggleText: { ...typography.body, color: colors.textSecondary },
  toggleTextActive: { color: colors.text, fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing.md,
    height: 52,
    ...typography.body,
    marginBottom: spacing.sm,
  },
  referralToggle: { marginBottom: spacing.sm },
  referralToggleText: { ...typography.bodySmall, color: colors.primary },
  error: { ...typography.bodySmall, color: colors.red, marginBottom: spacing.sm },
  cta: { marginTop: spacing.md },
  terms: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.lg, lineHeight: 18 },
});
