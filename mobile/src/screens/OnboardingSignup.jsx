import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
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
      <ScreenHeader title="Create account" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.sub}>Join thousands of contributors earning from their data</Text>

          <View style={styles.toggle}>
            {['phone', 'email'].map((m) => (
              <TouchableOpacity key={m} style={[styles.toggleBtn, mode === m && styles.toggleActive]} onPress={() => { setMode(m); setIdentifier(''); }}>
                <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>{m === 'phone' ? 'Phone' : 'Email'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            placeholder={mode === 'phone' ? '+1 555 000 0000' : 'you@example.com'}
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType={mode === 'phone' ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
            style={styles.inputWrapper}
          />

          <Input
            placeholder="Password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputWrapper}
          />

          <TouchableOpacity onPress={() => setShowReferral(!showReferral)} style={styles.referralToggle}>
            <Text style={styles.referralToggleText}>{showReferral ? '− Hide referral code' : '+ Have a referral code?'}</Text>
          </TouchableOpacity>

          {showReferral && (
            <Input
              placeholder="Referral code (optional)"
              value={referralCode}
              onChangeText={setReferralCode}
              autoCapitalize="characters"
              style={styles.inputWrapper}
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
  sub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  toggle: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 10, marginBottom: spacing.md, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  toggleActive: { backgroundColor: colors.surfaceElevated },
  toggleText: { ...typography.body, color: colors.textSecondary },
  toggleTextActive: { color: colors.text, fontWeight: '600' },
  inputWrapper: { marginBottom: spacing.sm },
  referralToggle: { marginBottom: spacing.sm },
  referralToggleText: { ...typography.bodySmall, color: colors.text },
  error: { ...typography.bodySmall, color: colors.red, marginBottom: spacing.sm },
  cta: { marginTop: spacing.md },
  terms: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.lg, lineHeight: 18 },
});
