import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TextInput, TouchableOpacity,
} from 'react-native';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { verifyOtp, resendOtp } from '../services/auth';

export default function OnboardingVerify({ navigation, route }) {
  const { identifier = '' } = route.params || {};
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setInterval(() => setResendCountdown((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [resendCountdown]);

  const handleDigit = (value, index) => {
    const d = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = d;
    setDigits(next);
    if (d && index < 5) refs[index + 1].current?.focus();
    if (next.every((x) => x !== '') && d) handleSubmit(next.join(''));
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (code) => {
    if (loading) return;
    const otp = code || digits.join('');
    if (otp.length < 6) return;
    setLoading(true);
    setError('');
    try {
      await verifyOtp({ identifier, otp_code: otp });
      navigation.navigate('Profile', { identifier });
    } catch (e) {
      setError(e.response?.data?.error || 'Invalid code. Please try again.');
      setDigits(['', '', '', '', '', '']);
      refs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    try {
      await resendOtp({ identifier });
      setResendCountdown(60);
      setDigits(['', '', '', '', '', '']);
      refs[0].current?.focus();
    } catch (e) {
      setError(e.response?.data?.error || 'Could not resend code.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScreenHeader title="Enter code" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.sub}>We sent a 6-digit code to{'\n'}<Text style={styles.identifier}>{identifier}</Text></Text>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              style={[styles.otpBox, d && styles.otpBoxFilled]}
              value={d}
              onChangeText={(v) => handleDigit(v, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Button
          title="Verify"
          onPress={() => handleSubmit(digits.join(''))}
          loading={loading}
          disabled={digits.some((d) => !d)}
          style={styles.cta}
        />

        <TouchableOpacity onPress={handleResend} disabled={resendCountdown > 0} style={styles.resendBtn}>
          <Text style={[styles.resend, resendCountdown > 0 && styles.resendDisabled]}>
            {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend code'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg },
  sub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xs, lineHeight: 24 },
  identifier: { color: colors.text, fontWeight: '600' },
  otpRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  otpBox: {
    flex: 1, height: 56, borderRadius: 8,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    ...typography.heading3, color: colors.text,
  },
  otpBoxFilled: { borderColor: colors.primary },
  error: { ...typography.bodySmall, color: colors.red, marginBottom: spacing.sm },
  cta: { marginBottom: spacing.md },
  resendBtn: { alignItems: 'center' },
  resend: { ...typography.body, color: colors.text },
  resendDisabled: { color: colors.textTertiary },
});
