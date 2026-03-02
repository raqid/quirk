import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import Badge from '../components/Badge';
import RoyaltyEvent from '../components/RoyaltyEvent';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency, formatDate } from '../utils/formatting';
import { fetchUpload, fetchRoyalties } from '../services/api';

const STATUS_COLOR = { approved: 'green', pending: 'amber', processing: 'amber', rejected: 'red', removed: 'gray' };
const TYPE_ICONS = { photo: '📷', video: '🎥', audio: '🎙️' };

export default function AssetDetailScreen({ navigation, route }) {
  const { uploadId } = route.params;
  const [upload, setUpload] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchUpload(uploadId),
      fetchRoyalties({ upload_id: uploadId }),
    ]).then(([u, r]) => {
      if (u.status === 'fulfilled') setUpload(u.value);
      if (r.status === 'fulfilled') setEvents(r.value?.royalties || []);
    }).finally(() => setLoading(false));
  }, [uploadId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!upload) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>Asset not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {upload.thumbnail_url ? (
          <Image source={{ uri: upload.thumbnail_url }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Text style={{ fontSize: 48 }}>{TYPE_ICONS[upload.type]}</Text>
          </View>
        )}

        <View style={styles.badges}>
          <Badge label={upload.status} color={STATUS_COLOR[upload.status] || 'gray'} />
          <Badge label={upload.type} color="gray" />
          <Badge label={upload.category} color="gray" />
        </View>

        {upload.description && (
          <Text style={styles.description}>{upload.description}</Text>
        )}

        <Text style={styles.date}>Uploaded {formatDate(upload.created_at)}</Text>

        {/* Earnings */}
        <View style={styles.earningsRow}>
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>{formatCurrency(upload.total_royalties)}</Text>
            <Text style={styles.earningLabel}>Total royalties</Text>
          </View>
          <View style={styles.earningDivider} />
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>{upload.usage_count}</Text>
            <Text style={styles.earningLabel}>Times used</Text>
          </View>
          <View style={styles.earningDivider} />
          <View style={styles.earningItem}>
            <Text style={styles.earningValue}>{formatCurrency(upload.upfront_payment)}</Text>
            <Text style={styles.earningLabel}>Upfront paid</Text>
          </View>
        </View>

        {/* Rejection reason */}
        {upload.status === 'rejected' && upload.rejection_reason && (
          <View style={styles.rejectionCard}>
            <Text style={styles.rejectionTitle}>Why it was rejected</Text>
            <Text style={styles.rejectionReason}>{upload.rejection_reason}</Text>
          </View>
        )}

        {/* Usage history */}
        {events.length > 0 && (
          <View style={styles.usageSection}>
            <Text style={styles.usageTitle}>Usage history</Text>
            <View style={styles.usageCard}>
              {events.map((e) => <RoyaltyEvent key={e.id} event={e} />)}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.md },
  backText: { ...typography.body, color: colors.textSecondary },
  thumbnail: { width: '100%', height: 220, borderRadius: 14, marginBottom: spacing.md },
  thumbnailPlaceholder: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.xs },
  date: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.lg },
  earningsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.md, marginBottom: spacing.lg,
  },
  earningItem: { flex: 1, alignItems: 'center' },
  earningDivider: { width: 1, backgroundColor: colors.border },
  earningValue: { ...typography.body, color: colors.primary, fontWeight: '700' },
  earningLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  rejectionCard: {
    backgroundColor: colors.redDim, borderRadius: 12,
    borderWidth: 1, borderColor: colors.red + '44',
    padding: spacing.md, marginBottom: spacing.lg,
  },
  rejectionTitle: { ...typography.bodySmall, color: colors.red, fontWeight: '600', marginBottom: spacing.xs },
  rejectionReason: { ...typography.body, color: colors.text },
  usageSection: { marginTop: spacing.sm },
  usageTitle: { ...typography.body, color: colors.text, fontWeight: '700', marginBottom: spacing.sm },
  usageCard: {
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md,
  },
});
