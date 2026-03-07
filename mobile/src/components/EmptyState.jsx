import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function EmptyState({ icon = '📭', iconName, title, subtitle }) {
  return (
    <View style={styles.container}>
      {iconName
        ? <Icon name={iconName} size={40} color={colors.textTertiary} style={styles.lucideIcon} />
        : <Text style={styles.icon}>{icon}</Text>
      }
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xxl },
  icon: { fontSize: 40, marginBottom: spacing.md },
  lucideIcon: { marginBottom: spacing.md },
  title: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: spacing.xs, textAlign: 'center' },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', maxWidth: 240 },
});
