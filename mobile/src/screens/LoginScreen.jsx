import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { login } from '../services/auth';
import { useAuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { setIsAuthenticated } = useAuthContext();
  const [mode, setMode] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!identifier.trim()) { setError('Please enter your ' + (mode === 'phone' ? 'phone number' : 'email')); return; }
    if (!password.trim()) { setError('Please enter your password'); return; }
    setError('');
    setLoading(true);
    try {
      await login({ identifier: identifier.trim(), password });
      setIsAuthenticated(true);
    } catch (e) {
      setError(e.response?.data?.error || 'Invalid credentials. Please try again.');
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

          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.sub}>Sign in to your Quirk account</Text>

          <View style={styles.toggle}>
            {['email', 'phone'].map((m) => (
              <TouchableOpacity key={m} style={[styles.toggleBtn, mode === m && styles.toggleActive]} onPress={() => { setMode(m); setIdentifier(''); }}>
                <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>{m === 'email' ? 'Email' : 'Phone'}</Text>
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
            autoFocus
          />

          <TextInput
            style={[styles.input, { marginTop: spacing.sm }]}
            placeholder="Password"
            placeholderTextColor={colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Button title="Sign In" onPress={handleLogin} loading={loading} style={styles.cta} />

          <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLinkText}>Don't have an account? <Text style={styles.signupLinkBold}>Sign up</Text></Text>
          </TouchableOpacity>
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
  error: { ...typography.bodySmall, color: colors.red, marginBottom: spacing.sm },
  cta: { marginTop: spacing.md },
  signupLink: { alignItems: 'center', marginTop: spacing.xl },
  signupLinkText: { ...typography.body, color: colors.textSecondary },
  signupLinkBold: { color: colors.primary, fontWeight: '600' },
});
