import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, TextInput, Image, Modal, FlatList,
} from 'react-native';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { mockTasks } from '../mocks/mockData';

const CATEGORIES = [
  'Food & Cooking','Street & Market','Vehicles & Transport','Speech & Conversation',
  'Work & Industry','Handwriting & Text','Music & Sound','Nature & Agriculture',
  'People & Daily Life','Buildings & Architecture','Animals','Health & Medical',
  'Education & Reading','Sports & Recreation','Technology & Devices',
];

const LANGUAGES = ['English','Bengali','Yoruba','Hausa','Igbo','Swahili','Hindi','Arabic','French','Portuguese','Spanish','Mandarin','Tagalog','Vietnamese','Indonesian'];

const UPLOAD_STEPS = ['Preparing file','Uploading','Processing','Analyzing quality','Saving'];

export default function UploadMetadataScreen({ navigation, route }) {
  const { asset, type, taskId } = route.params || {};
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [linkedTaskId, setLinkedTaskId] = useState(taskId || null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const linkedTask = mockTasks.find((t) => t.id === linkedTaskId);

  const handleUpload = async () => {
    if (!category) return;
    setUploading(true);
    for (let i = 0; i < UPLOAD_STEPS.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }
    setUploading(false);
    setDone(true);
  };

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>Upload successful!</Text>
          <Text style={styles.successSub}>
            Your {type} is being reviewed.{'\n'}
            Estimated pay: <Text style={{ color: colors.primary }}>${linkedTask ? linkedTask.pay_per_submission.toFixed(2) : '0.05'}</Text>
          </Text>
          <Button title="Upload Another" onPress={() => navigation.goBack()} style={styles.successBtn} />
          <Button title="Back to Home" variant="secondary" onPress={() => navigation.navigate('Home')} style={styles.successBtn} />
        </View>
      </SafeAreaView>
    );
  }

  if (uploading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingTitle}>Uploading...</Text>
          {UPLOAD_STEPS.map((s, i) => (
            <View key={s} style={styles.stepRow}>
              <Text style={[styles.stepDot, i <= step && styles.stepDotActive]}>●</Text>
              <Text style={[styles.stepText, i <= step && styles.stepTextActive]}>{s}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Add details</Text>

        {/* Preview */}
        {asset?.uri ? (
          <Image source={{ uri: asset.uri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={[styles.preview, styles.previewPlaceholder]}>
            <Text style={{ fontSize: 40 }}>{type === 'audio' ? '🎙️' : '🎥'}</Text>
          </View>
        )}

        <Text style={styles.fieldLabel}>Category *</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setShowCategories(true)}>
          <Text style={category ? styles.selectorText : styles.selectorPlaceholder}>
            {category || 'Select a category'}
          </Text>
          <Text style={styles.selectorArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe what's in this media (optional but helps with approval)"
          placeholderTextColor={colors.textTertiary}
          value={description}
          onChangeText={(t) => setDescription(t.slice(0, 200))}
          multiline
          numberOfLines={3}
        />
        <Text style={styles.charCount}>{description.length}/200</Text>

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

        <Text style={styles.fieldLabel}>Link to task</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setShowTasks(true)}>
          <Text style={linkedTaskId ? styles.selectorText : styles.selectorPlaceholder}>
            {linkedTask ? linkedTask.title : 'No task linked (optional)'}
          </Text>
          <Text style={styles.selectorArrow}>›</Text>
        </TouchableOpacity>

        <Button title="Upload" onPress={handleUpload} disabled={!category} style={styles.cta} />
      </ScrollView>

      {/* Category Modal */}
      <Modal visible={showCategories} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalRow} onPress={() => { setCategory(item); setShowCategories(false); }}>
                  <Text style={[styles.modalRowText, item === category && styles.modalRowTextActive]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cancel" variant="secondary" onPress={() => setShowCategories(false)} />
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLanguages} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalRow} onPress={() => { setLanguage(item); setShowLanguages(false); }}>
                  <Text style={[styles.modalRowText, item === language && styles.modalRowTextActive]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cancel" variant="secondary" onPress={() => setShowLanguages(false)} />
          </View>
        </View>
      </Modal>

      {/* Tasks Modal */}
      <Modal visible={showTasks} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Link to Task</Text>
            <TouchableOpacity style={styles.modalRow} onPress={() => { setLinkedTaskId(null); setShowTasks(false); }}>
              <Text style={[styles.modalRowText, !linkedTaskId && styles.modalRowTextActive]}>No task (no bonus)</Text>
            </TouchableOpacity>
            <FlatList
              data={mockTasks.filter((t) => t.data_type === type)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalRow} onPress={() => { setLinkedTaskId(item.id); setShowTasks(false); }}>
                  <Text style={[styles.modalRowText, item.id === linkedTaskId && styles.modalRowTextActive]}>
                    {item.title} (+${item.pay_per_submission.toFixed(2)})
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cancel" variant="secondary" onPress={() => setShowTasks(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.md },
  backText: { ...typography.body, color: colors.textSecondary },
  heading: { ...typography.heading2, color: colors.text, marginBottom: spacing.md },
  preview: { width: '100%', height: 200, borderRadius: 12, marginBottom: spacing.md },
  previewPlaceholder: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  selector: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, height: 52, marginBottom: spacing.xs,
  },
  selectorText: { ...typography.body, color: colors.text, flex: 1 },
  selectorPlaceholder: { ...typography.body, color: colors.textTertiary, flex: 1 },
  selectorArrow: { fontSize: 20, color: colors.textTertiary },
  textArea: {
    backgroundColor: colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    color: colors.text, paddingHorizontal: spacing.md, paddingTop: spacing.sm,
    ...typography.body, height: 80, textAlignVertical: 'top',
  },
  charCount: { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginBottom: spacing.sm },
  cta: { marginTop: spacing.lg },
  uploadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  uploadingTitle: { ...typography.heading2, color: colors.text, marginBottom: spacing.xl },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  stepDot: { color: colors.border, fontSize: 12 },
  stepDotActive: { color: colors.primary },
  stepText: { ...typography.body, color: colors.textTertiary },
  stepTextActive: { color: colors.text },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  successIcon: { fontSize: 60, marginBottom: spacing.lg },
  successTitle: { ...typography.heading2, color: colors.text, marginBottom: spacing.sm },
  successSub: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: spacing.xl },
  successBtn: { width: '100%', marginBottom: spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg, maxHeight: '70%' },
  modalTitle: { ...typography.heading3, color: colors.text, marginBottom: spacing.md },
  modalRow: { paddingVertical: 12 },
  modalRowText: { ...typography.body, color: colors.text },
  modalRowTextActive: { color: colors.primary, fontWeight: '600' },
});
