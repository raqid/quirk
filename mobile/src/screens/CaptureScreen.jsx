import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/formatting';
import { fetchTasks } from '../services/api';

const TYPES = [
  { key: 'photo', label: 'Photo', icon: '📷', desc: 'JPG, PNG, HEIC' },
  { key: 'video', label: 'Video', icon: '🎥', desc: 'MP4, MOV, up to 60s' },
  { key: 'audio', label: 'Audio', icon: '🎙️', desc: 'MP3, WAV, M4A' },
];

export default function CaptureScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState('photo');
  const [linkedTask,   setLinkedTask]   = useState(null);
  const [tasks,        setTasks]        = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingTasks(true);
    fetchTasks({ status: 'active', limit: 5 })
      .then((res) => { if (!cancelled) setTasks(res?.tasks || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingTasks(false); });
    return () => { cancelled = true; };
  }, []);

  const activeTasks = tasks.filter((t) => t.data_type === selectedType).slice(0, 3);

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to capture media.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: selectedType === 'photo' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.9,
    });
    if (!result.canceled) {
      navigation.navigate('UploadMetadata', { asset: result.assets[0], type: selectedType, taskId: linkedTask });
    }
  };

  const handleLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photo library access is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectedType === 'photo' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.9,
    });
    if (!result.canceled) {
      navigation.navigate('UploadMetadata', { asset: result.assets[0], type: selectedType, taskId: linkedTask });
    }
  };

  const handleAudio = () => {
    navigation.navigate('UploadMetadata', { asset: { type: 'audio' }, type: 'audio', taskId: linkedTask });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Capture</Text>
        <Text style={styles.sub}>Choose what you want to upload</Text>

        {/* Type selector */}
        <View style={styles.typeRow}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeCard, selectedType === t.key && styles.typeCardActive]}
              onPress={() => { setSelectedType(t.key); setLinkedTask(null); }}
              activeOpacity={0.8}
            >
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <Text style={[styles.typeLabel, selectedType === t.key && styles.typeLabelActive]}>{t.label}</Text>
              <Text style={styles.typeDesc}>{t.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earnings info */}
        <View style={styles.earningsInfo}>
          <Text style={styles.earningsIcon}>💡</Text>
          <Text style={styles.earningsText}>
            Earn upfront for each upload. Link to a task below to maximize your payout.
          </Text>
        </View>

        {/* Link to task */}
        {!loadingTasks && activeTasks.length > 0 && (
          <View style={styles.tasksSection}>
            <Text style={styles.tasksSectionTitle}>Link to a Task (optional)</Text>
            <Text style={styles.tasksSectionSub}>Earn more by contributing to active requests</Text>
            {activeTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskRow, linkedTask === task.id && styles.taskRowActive]}
                onPress={() => setLinkedTask(linkedTask === task.id ? null : task.id)}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskPay}>+{formatCurrency(task.pay_per_submission)} per submission</Text>
                </View>
                {linkedTask === task.id
                  ? <View style={styles.taskCheck}><Text style={styles.taskCheckText}>✓</Text></View>
                  : <View style={styles.taskCheckEmpty} />
                }
              </TouchableOpacity>
            ))}
          </View>
        )}

        {loadingTasks && (
          <View style={styles.tasksSection}>
            <Text style={styles.tasksSectionTitle}>Link to a Task</Text>
            <Text style={styles.loadingText}>Loading available tasks…</Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          {selectedType !== 'audio' ? (
            <>
              <TouchableOpacity style={styles.actionBtn} onPress={handleCamera} activeOpacity={0.85}>
                <Text style={styles.actionIcon}>📷</Text>
                <Text style={styles.actionLabel}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={handleLibrary} activeOpacity={0.85}>
                <Text style={styles.actionIcon}>🖼️</Text>
                <Text style={[styles.actionLabel, styles.actionLabelSecondary]}>Choose from Library</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.actionBtn} onPress={handleAudio} activeOpacity={0.85}>
              <Text style={styles.actionIcon}>🎙️</Text>
              <Text style={styles.actionLabel}>Record Audio</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: colors.background },
  container:         { padding: spacing.md, paddingBottom: spacing.xxl },
  heading:           { ...typography.heading2, color: colors.text, marginBottom: spacing.xs },
  sub:               { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  typeRow:           { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  typeCard:          { flex: 1, backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: spacing.md, alignItems: 'center' },
  typeCardActive:    { borderColor: colors.primary, backgroundColor: colors.primaryDim },
  typeIcon:          { fontSize: 24, marginBottom: 4 },
  typeLabel:         { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  typeLabelActive:   { color: colors.primary },
  typeDesc:          { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginTop: 2 },
  earningsInfo:      { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.primaryDim, borderRadius: 12, borderWidth: 1, borderColor: colors.primary + '30', padding: spacing.sm, marginBottom: spacing.lg },
  earningsIcon:      { fontSize: 16, marginTop: 1 },
  earningsText:      { ...typography.caption, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  tasksSection:      { marginBottom: spacing.lg },
  tasksSectionTitle: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: 2 },
  tasksSectionSub:   { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  loadingText:       { ...typography.caption, color: colors.textTertiary, paddingVertical: spacing.sm },
  taskRow:           { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: spacing.sm, marginBottom: spacing.xs },
  taskRowActive:     { borderColor: colors.primary, backgroundColor: colors.primaryDim },
  taskTitle:         { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  taskPay:           { ...typography.caption, color: colors.primary, marginTop: 2 },
  taskCheck:         { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  taskCheckText:     { color: colors.background, fontWeight: '700', fontSize: 13 },
  taskCheckEmpty:    { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.border },
  actions:           { gap: spacing.sm },
  actionBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: 14, height: 56 },
  actionBtnSecondary:{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  actionIcon:        { fontSize: 22 },
  actionLabel:       { ...typography.body, color: colors.background, fontWeight: '600' },
  actionLabelSecondary:{ color: colors.text },
});
