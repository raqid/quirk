import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, TextInput, Image,
  Modal, FlatList, Animated,
} from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/formatting';
import { uploadAsset, fetchTasks } from '../services/api';

const CATEGORIES = [
  'Food & Cooking', 'Street & Market', 'Vehicles & Transport', 'Speech & Conversation',
  'Work & Industry', 'Handwriting & Text', 'Music & Sound', 'Nature & Agriculture',
  'People & Daily Life', 'Buildings & Architecture', 'Animals', 'Health & Medical',
  'Education & Reading', 'Sports & Recreation', 'Technology & Devices',
];

const LANGUAGES = [
  'English', 'Bengali', 'Yoruba', 'Hausa', 'Igbo', 'Swahili', 'Hindi',
  'Arabic', 'French', 'Portuguese', 'Spanish', 'Mandarin', 'Tagalog',
  'Vietnamese', 'Indonesian',
];

function PickerModal({ visible, title, data, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
            renderItem={({ item }) => {
              const label    = typeof item === 'string' ? item : item.title;
              const subLabel = typeof item === 'object' ? formatCurrency(item.pay_per_submission) + ' per submission' : null;
              const isActive = typeof item === 'string' ? item === selected : item.id === selected;
              return (
                <TouchableOpacity style={styles.modalRow} onPress={() => onSelect(typeof item === 'string' ? item : item.id)}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalRowText, isActive && styles.modalRowTextActive]}>{label}</Text>
                    {subLabel && <Text style={styles.modalRowSub}>{subLabel}</Text>}
                  </View>
                  {isActive && <Text style={styles.modalCheck}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
          <Button title="Close" variant="secondary" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export default function UploadMetadataScreen({ navigation, route }) {
  const { asset, type, taskId } = route.params || {};

  const [category,       setCategory]       = useState('');
  const [description,    setDescription]    = useState('');
  const [language,       setLanguage]       = useState('');
  const [linkedTaskId,   setLinkedTaskId]   = useState(taskId || null);
  const [availableTasks, setAvailableTasks] = useState([]);

  const [showCategories, setShowCategories] = useState(false);
  const [showLanguages,  setShowLanguages]  = useState(false);
  const [showTasks,      setShowTasks]      = useState(false);

  const [progress,  setProgress]  = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState('');

  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchTasks({ status: 'active', limit: 20 })
      .then((res) => setAvailableTasks((res?.tasks || []).filter((t) => t.data_type === type)))
      .catch(() => {});
  }, [type]);

  const linkedTask = availableTasks.find((t) => t.id === linkedTaskId);

  const animateProgress = (val) => {
    Animated.timing(progressAnim, {
      toValue: val,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleUpload = async () => {
    if (!category) return;
    setError('');
    setUploading(true);
    setProgress(0);
    animateProgress(0);

    try {
      await uploadAsset({
        asset,
        type,
        category,
        description,
        task_id:  linkedTaskId,
        language: language || undefined,
        onProgress: (p) => {
          setProgress(Math.round(p * 100));
          animateProgress(p);
        },
      });
      setProgress(100);
      animateProgress(1);
      setTimeout(() => { setUploading(false); setDone(true); }, 400);
    } catch (err) {
      setUploading(false);
      setError(err?.response?.data?.error || 'Upload failed. Please try again.');
    }
  };

  // ── Done state ──
  if (done) {
    const pay = linkedTask ? linkedTask.pay_per_submission : 0.05;
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.centeredScreen}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Upload successful!</Text>
          <Text style={styles.successSub}>
            Your {type} is being reviewed.{'\n'}
            Estimated pay: <Text style={{ color: colors.primary }}>{formatCurrency(pay)}</Text>
          </Text>
          <Button title="Upload Another"  onPress={() => navigation.goBack()}              style={styles.successBtn} />
          <Button title="Back to Home"    variant="secondary" onPress={() => navigation.navigate('Home')} style={styles.successBtn} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Uploading state ──
  if (uploading) {
    const barWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.centeredScreen}>
          <Text style={styles.uploadingEmoji}>📤</Text>
          <Text style={styles.uploadingTitle}>Uploading…</Text>
          <Text style={styles.uploadingPct}>{progress}%</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: barWidth }]} />
          </View>
          <Text style={styles.uploadingHint}>Please keep the app open</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main form ──
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Add details</Text>

        {/* Preview */}
        {asset?.uri && (type === 'photo' || type === 'video') ? (
          <Image source={{ uri: asset.uri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={[styles.preview, styles.previewPlaceholder]}>
            <Text style={{ fontSize: 48 }}>{type === 'audio' ? '🎙️' : '🎥'}</Text>
            <Text style={styles.previewLabel}>{type === 'audio' ? 'Audio file' : 'Video file'}</Text>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Category */}
        <Text style={styles.fieldLabel}>Category *</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setShowCategories(true)}>
          <Text style={category ? styles.selectorText : styles.selectorPlaceholder}>
            {category || 'Select a category'}
          </Text>
          <Text style={styles.selectorArrow}>›</Text>
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Briefly describe what's in this media (helps with approval)"
          placeholderTextColor={colors.textTertiary}
          value={description}
          onChangeText={(t) => setDescription(t.slice(0, 200))}
          multiline
          numberOfLines={3}
        />
        <Text style={styles.charCount}>{description.length}/200</Text>

        {/* Language (audio only) */}
        {type === 'audio' && (
          <>
            <Text style={styles.fieldLabel}>Language spoken</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShowLanguages(true)}>
              <Text style={language ? styles.selectorText : styles.selectorPlaceholder}>
                {language || 'Select language'}
              </Text>
              <Text style={styles.selectorArrow}>›</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Task link */}
        <Text style={styles.fieldLabel}>Link to Task {linkedTask && <Text style={styles.taskBonus}>+{formatCurrency(linkedTask.pay_per_submission)}</Text>}</Text>
        <TouchableOpacity style={[styles.selector, linkedTask && styles.selectorActive]} onPress={() => setShowTasks(true)}>
          <Text style={linkedTask ? styles.selectorText : styles.selectorPlaceholder}>
            {linkedTask ? linkedTask.title : 'No task linked (optional)'}
          </Text>
          <Text style={styles.selectorArrow}>›</Text>
        </TouchableOpacity>

        <Button title="Upload" onPress={handleUpload} disabled={!category} style={styles.cta} />
        <Text style={styles.hint}>Your upload will be reviewed within 24 hours. Approved uploads earn upfront payment immediately.</Text>
      </ScrollView>

      <PickerModal
        visible={showCategories}
        title="Select Category"
        data={CATEGORIES}
        selected={category}
        onSelect={(v) => { setCategory(v); setShowCategories(false); }}
        onClose={() => setShowCategories(false)}
      />
      <PickerModal
        visible={showLanguages}
        title="Select Language"
        data={LANGUAGES}
        selected={language}
        onSelect={(v) => { setLanguage(v); setShowLanguages(false); }}
        onClose={() => setShowLanguages(false)}
      />
      <PickerModal
        visible={showTasks}
        title="Link to Task"
        data={[{ id: null, title: 'No task (upload freely)', pay_per_submission: 0, data_type: type }, ...availableTasks]}
        selected={linkedTaskId}
        onSelect={(v) => { setLinkedTaskId(v || null); setShowTasks(false); }}
        onClose={() => setShowTasks(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: colors.background },
  container:          { padding: spacing.md, paddingBottom: spacing.xxl },
  back:               { marginBottom: spacing.md },
  backText:           { ...typography.body, color: colors.textSecondary },
  heading:            { ...typography.heading2, color: colors.text, marginBottom: spacing.md },
  preview:            { width: '100%', height: 200, borderRadius: 12, marginBottom: spacing.md },
  previewPlaceholder: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  previewLabel:       { ...typography.caption, color: colors.textSecondary },
  errorText:          { ...typography.bodySmall, color: colors.red, marginBottom: spacing.sm, textAlign: 'center' },
  fieldLabel:         { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  taskBonus:          { color: colors.primary },
  selector:           { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, height: 52, marginBottom: spacing.xs },
  selectorActive:     { borderColor: colors.primary, backgroundColor: colors.primaryDim },
  selectorText:       { ...typography.body, color: colors.text, flex: 1 },
  selectorPlaceholder:{ ...typography.body, color: colors.textTertiary, flex: 1 },
  selectorArrow:      { fontSize: 20, color: colors.textTertiary },
  textArea:           { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, color: colors.text, paddingHorizontal: spacing.md, paddingTop: spacing.sm, ...typography.body, minHeight: 80, textAlignVertical: 'top' },
  charCount:          { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginBottom: spacing.sm },
  cta:                { marginTop: spacing.lg },
  hint:               { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },
  centeredScreen:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  successEmoji:       { fontSize: 64, marginBottom: spacing.lg },
  successTitle:       { ...typography.heading2, color: colors.text, marginBottom: spacing.sm },
  successSub:         { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: spacing.xl },
  successBtn:         { width: '100%', marginBottom: spacing.sm },
  uploadingEmoji:     { fontSize: 48, marginBottom: spacing.md },
  uploadingTitle:     { ...typography.heading2, color: colors.text, marginBottom: spacing.xs },
  uploadingPct:       { ...typography.heading1, color: colors.primary, marginBottom: spacing.lg },
  progressTrack:      { width: '100%', height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.md },
  progressFill:       { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  uploadingHint:      { ...typography.caption, color: colors.textTertiary },
  modalOverlay:       { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalSheet:         { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg, maxHeight: '70%' },
  modalTitle:         { ...typography.heading3, color: colors.text, marginBottom: spacing.md },
  modalRow:           { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  modalRowText:       { ...typography.body, color: colors.text },
  modalRowTextActive: { color: colors.primary, fontWeight: '600' },
  modalRowSub:        { ...typography.caption, color: colors.primary, marginTop: 2 },
  modalCheck:         { color: colors.primary, fontWeight: '700', fontSize: 16 },
});
