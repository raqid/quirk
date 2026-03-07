import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, Modal, FlatList,
} from 'react-native';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { updateProfile, updatePayoutMethod } from '../services/api';

const COUNTRIES = [
  'Nigeria','Ghana','Kenya','South Africa','Ethiopia','Tanzania','Uganda','Cameroon',
  'Senegal','Ivory Coast','Rwanda','Zimbabwe','Zambia','Mozambique','Angola',
  'India','Bangladesh','Pakistan','Indonesia','Philippines','Vietnam','Thailand',
  'Egypt','Morocco','Algeria','Tunisia','Sudan',
  'Brazil','Colombia','Mexico','Argentina','Peru',
  'United States','United Kingdom','Germany','France','Canada','Australia',
];

const PAYOUT_METHODS = [
  { key: 'paypal', label: 'PayPal', icon: 'creditCard' },
  { key: 'bank',   label: 'Bank Transfer', icon: 'building' },
];

export default function OnboardingProfile({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [payout, setPayout] = useState('paypal');
  const [showCountry, setShowCountry] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCountries = COUNTRIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase()));

  const handleContinue = async () => {
    if (!displayName.trim()) return;
    setLoading(true);
    try {
      await updateProfile({ display_name: displayName.trim(), country });
      const payoutDetails = payout === 'paypal' && paypalEmail.trim()
        ? { email: paypalEmail.trim() }
        : {};
      await updatePayoutMethod({ type: payout, details: payoutDetails });
    } catch {
      // profile can be updated later — continue anyway
    } finally {
      setLoading(false);
    }
    navigation.navigate('Tutorial');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScreenHeader title="Set up your profile" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.sub}>This helps us pay you and personalize your experience</Text>

        <Input
          label="Display name"
          placeholder="How should we call you?"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.inputWrapper}
        />

        <Text style={styles.fieldLabel}>Country</Text>
        <TouchableOpacity style={styles.countrySelect} onPress={() => setShowCountry(true)}>
          <Text style={country ? styles.countrySelectText : styles.countrySelectPlaceholder}>
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
            <Icon name={m.icon} size={22} color={colors.textSecondary} />
            <Text style={[styles.payoutLabel, payout === m.key && styles.payoutLabelActive]}>{m.label}</Text>
            <View style={[styles.radio, payout === m.key && styles.radioActive]}>
              {payout === m.key && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {payout === 'paypal' && (
          <Input
            label="PayPal email"
            placeholder="your@email.com"
            value={paypalEmail}
            onChangeText={setPaypalEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.inputWrapper}
          />
        )}

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
              <Input
                placeholder="Search..."
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoFocus
                style={styles.modalSearchWrapper}
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
  sub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  inputWrapper: { marginBottom: spacing.md },
  countrySelect: {
    backgroundColor: colors.surface, borderRadius: 8,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, height: 48,
    justifyContent: 'center', marginBottom: spacing.md,
  },
  countrySelectText: { ...typography.body, color: colors.text },
  countrySelectPlaceholder: { ...typography.body, color: colors.textTertiary },
  payoutCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  payoutCardActive: { borderColor: colors.primary },
  payoutLabel: { ...typography.body, color: colors.textSecondary, flex: 1 },
  payoutLabelActive: { color: colors.text, fontWeight: '600' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  cta: { marginTop: spacing.md },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: spacing.lg, maxHeight: '80%' },
  modalTitle: { ...typography.heading3, color: colors.text, marginBottom: spacing.md },
  modalSearchWrapper: { marginBottom: spacing.sm },
  countryRow: { paddingVertical: 12 },
  countryText: { ...typography.body, color: colors.text },
  countryTextActive: { color: colors.primary, fontWeight: '600' },
  modalCancel: { marginTop: spacing.sm },
});
