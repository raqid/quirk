import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  FlatList, TouchableOpacity, TextInput, RefreshControl, ScrollView,
} from 'react-native';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { Icon } from '../utils/icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { fetchTasks, fetchTaskCategories } from '../services/api';

const TYPE_FILTERS = [
  { key: 'all',   label: 'All',   iconName: null },
  { key: 'photo', label: 'Photo', iconName: 'camera' },
  { key: 'video', label: 'Video', iconName: 'video' },
  { key: 'audio', label: 'Audio', iconName: 'mic' },
];

export default function TasksScreen({ navigation }) {
  const [tasks,      setTasks]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter,  setCatFilter]  = useState('');
  const [search,     setSearch]     = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);

  const loadData = useCallback(async () => {
    try {
      const params = { limit: 50 };
      if (typeFilter !== 'all') params.type = typeFilter;
      if (catFilter)            params.category = catFilter;

      const [tasksRes, catsRes] = await Promise.allSettled([
        fetchTasks(params),
        fetchTaskCategories(),
      ]);
      if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value?.tasks || []);
      if (catsRes.status  === 'fulfilled') setCategories(catsRes.value?.categories || []);
      setError(false);
    } catch {
      setError(true);
    }
  }, [typeFilter, catFilter]);

  useEffect(() => { loadData().finally(() => setLoading(false)); }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filtered = search.trim()
    ? tasks.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.category || '').toLowerCase().includes(search.toLowerCase())
      )
    : tasks;

  const hotTasks    = filtered.filter((t) => t.is_hot);
  const normalTasks = filtered.filter((t) => !t.is_hot);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <FlatList
        data={normalTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskWrap}>
            <TaskCard task={item} onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })} />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>Tasks</Text>

            {/* Search */}
            <View style={styles.searchRow}>
              <Icon name="search" size={16} color={colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tasks…"
                placeholderTextColor={colors.textTertiary}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Icon name="x" size={14} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Type filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll} contentContainerStyle={styles.typeScrollContent}>
              {TYPE_FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.typeChip, typeFilter === f.key && styles.typeChipActive]}
                  onPress={() => { setTypeFilter(f.key); setCatFilter(''); }}
                  activeOpacity={0.8}
                >
                  {f.iconName && (
                    <Icon
                      name={f.iconName}
                      size={14}
                      color={typeFilter === f.key ? colors.ctaText : colors.textSecondary}
                    />
                  )}
                  <Text style={[styles.typeChipText, typeFilter === f.key && styles.typeChipTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Category filter */}
            {categories.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catScrollContent}>
                <TouchableOpacity
                  style={[styles.catChip, !catFilter && styles.catChipActive]}
                  onPress={() => setCatFilter('')}
                >
                  <Text style={[styles.catChipText, !catFilter && styles.catChipTextActive]}>All topics</Text>
                </TouchableOpacity>
                {categories.map((c) => (
                  <TouchableOpacity
                    key={c.category}
                    style={[styles.catChip, catFilter === c.category && styles.catChipActive]}
                    onPress={() => setCatFilter(catFilter === c.category ? '' : c.category)}
                  >
                    <Text style={[styles.catChipText, catFilter === c.category && styles.catChipTextActive]}>
                      {c.category}
                    </Text>
                    <Text style={styles.catCount}> {c.count}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Hot tasks */}
            {hotTasks.length > 0 && !search && (
              <View style={styles.hotSection}>
                <View style={styles.hotHeader}>
                  <View style={styles.hotTitleRow}>
                    <Icon name="flame" size={16} color={colors.text} />
                    <Text style={styles.sectionTitle}> Hot Right Now</Text>
                  </View>
                  <Text style={styles.hotSub}>High pay, limited spots</Text>
                </View>
                {hotTasks.map((task) => (
                  <View key={task.id} style={styles.taskWrap}>
                    <TaskCard task={task} onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })} />
                  </View>
                ))}
                {normalTasks.length > 0 && <Text style={styles.allTasksLabel}>All Tasks</Text>}
              </View>
            )}

            {loading && (
              <View style={{ paddingHorizontal: spacing.md, gap: spacing.sm }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} width={'100%'} height={100} borderRadius={14} />
                ))}
              </View>
            )}

            {error && !loading && (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>Could not load tasks</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {!error && filtered.length === 0 && !loading && (
              <EmptyState icon="clipboard" title="No tasks found" subtitle="Try a different filter or check back soon" />
            )}
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: colors.background },
  list:               { paddingBottom: spacing.xxl },
  heading:            { ...typography.heading2, color: colors.text, paddingHorizontal: spacing.md, paddingTop: spacing.md, marginBottom: spacing.md },
  searchRow:          { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginHorizontal: spacing.md, paddingHorizontal: spacing.sm, height: 44, gap: spacing.xs, marginBottom: spacing.sm },
  searchInput:        { flex: 1, ...typography.body, color: colors.text },
  typeScroll:         { marginBottom: spacing.sm },
  typeScrollContent:  { paddingHorizontal: spacing.md, gap: spacing.xs },
  typeChip:           { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  typeChipActive:     { backgroundColor: colors.ctaBackground, borderColor: colors.ctaBackground },
  typeChipText:       { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  typeChipTextActive: { color: colors.ctaText },
  catScroll:          { marginBottom: spacing.md },
  catScrollContent:   { paddingHorizontal: spacing.md, gap: spacing.xs },
  catChip:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  catChipActive:      { backgroundColor: colors.surfaceElevated, borderColor: colors.borderLight },
  catChipText:        { ...typography.caption, color: colors.textSecondary },
  catChipTextActive:  { color: colors.text, fontWeight: '600' },
  catCount:           { ...typography.caption, color: colors.textTertiary },
  hotSection:         { paddingHorizontal: spacing.md },
  hotHeader:          { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing.sm },
  hotTitleRow:        { flexDirection: 'row', alignItems: 'center' },
  sectionTitle:       { ...typography.body, color: colors.text, fontWeight: '700' },
  hotSub:             { ...typography.caption, color: colors.amber },
  allTasksLabel:      { ...typography.body, color: colors.text, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  taskWrap:           { paddingHorizontal: spacing.md },
  errorCard:          { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  errorText:          { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  retryBtn:           { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  retryText:          { ...typography.body, color: colors.text, fontWeight: '600' },
});
