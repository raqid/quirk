import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TextInput, TouchableOpacity, Modal, FlatList,
} from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const COUNTRIES = [
  'Nigeria','Ghana','Kenya','South Africa','Ethiopia','Tanzania','Uganda','Cameroon',
  'Senegal','Ivory Coast','Rwanda','Zimbabwe','Zambia','Mozambique','Angola',
  'India','Bangladesh','Pakistan','Indonesia','Philippines','Vietnam','Thailand',
  'Egypt','Morocco','Algeria','Tunisia','Sudan',
  'Brazil','Colombia','Mexico','Argentina','Peru',
  'United States','United Kingdom','Germany','France','Canada','Australia',
];

const PAYOUT_METHODS = [
  { key: 'paypal', label: 'PayPal', icon: '💳' },
  { key: 'bank',   label: 'Bank Transfer', icon: '🏦' },
];

export default function OnboardingProfile({ navigation, route }) {
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [payout, setPayout] = useState('paypal');
  const [showCountry, setShowCountry] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCountries = COUNTRIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase()));

  const handleContinue = async () => {
    if (!displayName.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    navigation.navigate('Tutorial');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Set up your profile</Text>
        <Text style={styles.sub}>This helps us pay you and personalize your experience</Text>

        <Text style={styles.fieldLabel}>Display name</Text>
        <TextInput
          style={styles.input}
          placeholder="How should we call you?"
          placeholderTextColor={colors.textTertiary}
          value={displayName}
          onChangeText={setDisplayName}
        />

        <Text style={styles.fieldLabel}>Country</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowCountry(true)}>
          <Text style={country ? styles.inputText : styles.inputPlaceholder}>
            {country || 'Select your country'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>Payout method</Text>
        {PAYOUT_METHODS.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.payoutCard, payout === m.key && styles.payoutCardActive]}
            onPress={() => setPayout(m.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.payoutIcon}>{m.icon}</Text>
            <Text style={[styles.payoutLabel, payout === m.key && styles.payoutLabelActive]}>{m.label}</Text>
            <View style={[styles.radio, payout === m.key && styles.radioActive]}>
              {payout === m.key && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        <Button
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          disabled={!displayName.trim()}
          style={styles.cta}
        />

        <Modal visible={showCountry} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TextInput
                style={styles.modalSearch}
                placeholder="Search..."
                placeholderTextColor={colors.textTertiary}
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoFocus
              />
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryRow}
                    onPress={() => { setCountry(item); setShowCountry(false); setCountrySearch(''); }}
                  >
                    <Text style={[styles.countryText, item === country && styles.countryTextActive]}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title="Cancel" variant="secondary" onPress={() => setShowCountry(false)} style={styles.modalCancel} />
            </View>
          </View>
        </Modal>
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
  sub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, height: 52,
    justifyContent: 'center', marginBottom: spacing.md,
  },
  inputText: { ...typography.body, color: colors.text },
  inputPlaceholder: { ...typography.body, color: colors.textTertiary },
  payoutCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  payoutCardActive: { borderColor: colors.primary },
  payoutIcon: { fontSize: 22 },
  payoutLabel: { ...typography.body, color: colors.textSecondary, flex: 1 },
  payoutLabelActive: { color: colors.text, fontWeight: '600' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  cta: { marginTop: spacing.md },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg, maxHeight: '80%' },
  modalTitle: { ...typography.heading3, color: colors.text, marginBottom: spacing.md },
  modalSearch: {
    backgroundColor: colors.surfaceElevated, borderRadius: 10,
    borderWidth: 1, borderColor: colors.border,
    color: colors.text, paddingHorizontal: spacing.md, height: 44,
    marginBottom: spacing.sm,
  },
  countryRow: { paddingVertical: 12 },
  countryText: { ...typography.body, color: colors.text },
  countryTextActive: { color: colors.primary, fontWeight: '600' },
  modalCancel: { marginTop: spacing.sm },
});
