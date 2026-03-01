import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const TYPE_COLORS = {
  royalty_received: colors.primary,
  upload_approved:  colors.primary,
  upload_rejected:  colors.red,
  new_task:         colors.amber,
  payout_complete:  colors.primary,
  referral_signup:  colors.blue,
  weekly_summary:   colors.textSecondary,
  milestone:        colors.amber,
};

export default function NotificationBanner({ notification, onDismiss }) {
  const borderColor = TYPE_COLORS[notification.type] || colors.textSecondary;
  return (
    <View style={[styles.banner, { borderLeftColor: borderColor }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.body} numberOfLines={2}>{notification.body}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismiss}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  content: { flex: 1 },
  title: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  body: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  dismiss: { padding: spacing.xs },
  dismissText: { color: colors.textTertiary, fontSize: 14 },
});
