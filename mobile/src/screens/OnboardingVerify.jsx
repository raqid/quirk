import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TextInput, TouchableOpacity,
} from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function OnboardingVerify({ navigation, route }) {
  const { identifier = '', referralCode = '' } = route.params || {};
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
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    navigation.navigate('Profile', { identifier, referralCode });
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setResendCountdown(60);
    setDigits(['', '', '', '', '', '']);
    refs[0].current?.focus();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Enter code</Text>
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
  back: { marginBottom: spacing.lg },
  backText: { ...typography.body, color: colors.textSecondary },
  heading: { ...typography.heading2, color: colors.text, marginBottom: spacing.xs },
  sub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 24 },
  identifier: { color: colors.text, fontWeight: '600' },
  otpRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  otpBox: {
    flex: 1, height: 56, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    ...typography.heading3, color: colors.text,
  },
  otpBoxFilled: { borderColor: colors.primary },
  error: { ...typography.bodySmall, color: colors.red, marginBottom: spacing.sm },
  cta: { marginBottom: spacing.md },
  resendBtn: { alignItems: 'center' },
  resend: { ...typography.body, color: colors.primary },
  resendDisabled: { color: colors.textTertiary },
});
