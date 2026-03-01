import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, TextInput, Alert, Switch, Linking,
} from 'react-native';
import Button from '../components/Button';
import { updatePayoutMethod } from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const PAYOUT_TABS = [
  { key: 'paypal',  label: 'PayPal',       placeholder: 'PayPal email address' },
  { key: 'venmo',   label: 'Venmo',        placeholder: '@venmo-handle'         },
  { key: 'bank',    label: 'Bank Transfer', placeholder: 'Account number'        },
];

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function SettingRow({ icon, label, right, onPress, last }) {
  return (
    <>
      <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={styles.settingLabel}>{label}</Text>
        {right ?? <Text style={styles.settingArrow}>›</Text>}
      </TouchableOpacity>
      {!last && <View style={styles.divider} />}
    </>
  );
}

function ToggleRow({ icon, label, value, onToggle, last }) {
  return (
    <>
      <View style={styles.settingRow}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={[styles.settingLabel, { flex: 1 }]}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#fff"
        />
      </View>
      {!last && <View style={styles.divider} />}
    </>
  );
}

export default function SettingsScreen({ navigation }) {
  const [payoutTab,    setPayoutTab]    = useState('paypal');
  const [payoutDetail, setPayoutDetail] = useState('');
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutSaved,  setPayoutSaved]  = useState(false);

  const [notifRoyalty, setNotifRoyalty] = useState(true);
  const [notifApproval, setNotifApproval] = useState(true);
  const [notifWeekly,  setNotifWeekly]  = useState(true);
  const [notifTask,    setNotifTask]    = useState(false);

  const handleSavePayout = async () => {
    if (!payoutDetail.trim()) {
      Alert.alert('Required', 'Please enter your payout details.');
      return;
    }
    setSavingPayout(true);
    try {
      await updatePayoutMethod({ type: payoutTab, details: { value: payoutDetail.trim() } });
      setPayoutSaved(true);
      Alert.alert('Saved', 'Your payout method has been updated.');
    } catch {
      Alert.alert('Error', 'Could not save payout method. Try again.');
    } finally {
      setSavingPayout(false);
    }
  };

  const currentTab = PAYOUT_TABS.find((t) => t.key === payoutTab);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Payout Method */}
        <Section title="Payout Method">
          <View style={styles.tabRow}>
            {PAYOUT_TABS.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, payoutTab === t.key && styles.tabActive]}
                onPress={() => { setPayoutTab(t.key); setPayoutSaved(false); }}
              >
                <Text style={[styles.tabText, payoutTab === t.key && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder={currentTab?.placeholder}
            placeholderTextColor={colors.textTertiary}
            value={payoutDetail}
            onChangeText={(v) => { setPayoutDetail(v); setPayoutSaved(false); }}
            autoCapitalize="none"
            keyboardType={payoutTab === 'bank' ? 'numeric' : 'email-address'}
          />
          <Text style={styles.payoutNote}>Minimum withdrawal: $10 · Processed within 3-5 business days</Text>
          <Button
            title={payoutSaved ? '✓ Saved' : 'Save Payout Method'}
            onPress={handleSavePayout}
            loading={savingPayout}
            style={styles.saveBtn}
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <ToggleRow icon="💸" label="Royalty earnings"    value={notifRoyalty}  onToggle={setNotifRoyalty}  />
          <ToggleRow icon="✅" label="Upload approvals"    value={notifApproval} onToggle={setNotifApproval} />
          <ToggleRow icon="📊" label="Weekly summary"      value={notifWeekly}   onToggle={setNotifWeekly}   />
          <ToggleRow icon="📋" label="New task alerts"     value={notifTask}     onToggle={setNotifTask}     last />
        </Section>

        {/* Account */}
        <Section title="Account">
          <SettingRow icon="🔑" label="Change Password" onPress={() => Alert.alert('Coming Soon', 'Password change will be available soon.')} />
          <SettingRow icon="📧" label="Update Email / Phone" onPress={() => Alert.alert('Coming Soon', 'Contact support to update your login.')} last />
        </Section>

        {/* Legal */}
        <Section title="Legal & Support">
          <SettingRow icon="📄" label="Terms of Service"   onPress={() => Linking.openURL('https://quirk.app/terms')} />
          <SettingRow icon="🔒" label="Privacy Policy"     onPress={() => Linking.openURL('https://quirk.app/privacy')} />
          <SettingRow icon="❓" label="Help & Support"     onPress={() => Linking.openURL('mailto:support@quirk.app')} last />
        </Section>

        {/* Danger zone */}
        <Section title="Danger Zone">
          <SettingRow
            icon="🗑️"
            label="Delete Account"
            onPress={() =>
              Alert.alert(
                'Delete Account',
                'This permanently deletes your account and all earnings. This cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Contact Support', 'Email support@quirk.app to delete your account.') },
                ]
              )
            }
            right={<Text style={styles.dangerArrow}>›</Text>}
            last
          />
        </Section>

        <Text style={styles.version}>Quirk v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.background },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  back:          { ...typography.body, color: colors.textSecondary, width: 60 },
  heading:       { ...typography.heading3, color: colors.text },
  content:       { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  section:       { marginBottom: spacing.lg },
  sectionTitle:  { ...typography.label, color: colors.textTertiary, marginBottom: spacing.sm },
  sectionCard:   { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  settingRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.md },
  settingIcon:   { fontSize: 18, width: 24 },
  settingLabel:  { ...typography.body, color: colors.text },
  settingArrow:  { fontSize: 20, color: colors.textTertiary },
  dangerArrow:   { fontSize: 20, color: colors.red },
  divider:       { height: 1, backgroundColor: colors.border, marginLeft: spacing.md + 24 + spacing.md },
  tabRow:        { flexDirection: 'row', gap: spacing.xs, padding: spacing.md, paddingBottom: 0 },
  tab:           { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  tabActive:     { backgroundColor: colors.primaryDim, borderColor: colors.primary },
  tabText:       { ...typography.caption, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  input:         { margin: spacing.md, backgroundColor: colors.background, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, height: 48, ...typography.body, color: colors.text },
  payoutNote:    { ...typography.caption, color: colors.textTertiary, marginHorizontal: spacing.md, marginBottom: spacing.sm },
  saveBtn:       { marginHorizontal: spacing.md, marginBottom: spacing.md },
  version:       { ...typography.caption, color: colors.textTertiary, textAlign: 'center', paddingVertical: spacing.md },
});
