import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import Badge from '../components/Badge';
import Card from '../components/Card';
import RoyaltyEvent from '../components/RoyaltyEvent';
import ScreenHeader from '../components/ScreenHeader';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency, formatDate } from '../utils/formatting';
import { fetchUpload } from '../services/api';

const STATUS_COLOR = { approved: 'green', pending: 'amber', processing: 'amber', rejected: 'red', removed: 'gray' };
const TYPE_ICONS = { photo: 'camera', video: 'video', audio: 'mic' };

export default function AssetDetailScreen({ navigation, route }) {
  const { uploadId } = route.params;
  const [upload, setUpload] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpload(uploadId)
      .then((data) => {
        setUpload(data);
        setEvents(data.royalty_events || []);
      })
      .catch(() => setUpload(null))
      .finally(() => setLoading(false));
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
        <ScreenHeader title="Asset Details" onBack={() => navigation.goBack()} />
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>Asset not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScreenHeader title="Asset Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>

        {upload.thumbnail_url ? (
          <Image source={{ uri: upload.thumbnail_url }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Icon name={TYPE_ICONS[upload.type] || 'image'} size={48} color={colors.textSecondary} />
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
        <Card style={styles.earningsCard}>
          <View style={styles.earningsInner}>
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
        </Card>

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
            <Card>
              {events.map((e) => <RoyaltyEvent key={e.id} event={e} />)}
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingBottom: spacing.xxl },
  thumbnail: { width: '100%', height: 220, borderRadius: 12, marginBottom: spacing.md },
  thumbnailPlaceholder: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.xs },
  date: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.lg },
  earningsCard: { marginBottom: spacing.lg, padding: 0 },
  earningsInner: { flexDirection: 'row', paddingVertical: spacing.md },
  earningItem: { flex: 1, alignItems: 'center' },
  earningDivider: { width: 1, backgroundColor: colors.border },
  earningValue: { ...typography.body, color: colors.text, fontWeight: '700' },
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
});
