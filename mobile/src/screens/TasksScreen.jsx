import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TextInput, TouchableOpacity, RefreshControl,
} from 'react-native';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { mockTasks } from '../mocks/mockData';

const FILTERS = ['All', 'Photo', 'Video', 'Audio'];

export default function TasksScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = mockTasks.filter((t) => {
    const matchType = filter === 'All' || t.data_type === filter.toLowerCase();
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.heading}>Tasks</Text>
        <TextInput
          style={styles.search}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {filtered.length === 0
          ? <EmptyState icon="🔍" title="No tasks found" subtitle="Try a different search or filter" />
          : filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            />
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm },
  heading: { ...typography.heading2, color: colors.text, marginBottom: spacing.sm },
  search: {
    backgroundColor: colors.surface, borderRadius: 10,
    borderWidth: 1, borderColor: colors.border,
    color: colors.text, paddingHorizontal: spacing.md, height: 44,
    ...typography.body, marginBottom: spacing.sm,
  },
  filtersScroll: { marginBottom: spacing.xs },
  filterPill: {
    paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, marginRight: spacing.xs,
  },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { ...typography.bodySmall, color: colors.textSecondary },
  filterTextActive: { color: colors.background, fontWeight: '600' },
  list: { padding: spacing.md, paddingTop: spacing.sm },
});
