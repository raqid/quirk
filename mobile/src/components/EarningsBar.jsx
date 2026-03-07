import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function EarningsBar({ last7Days = [] }) {
  const max = Math.max(...last7Days.map((d) => d.amount), 0.01);

  return (
    <View style={styles.container}>
      {last7Days.map((d, i) => {
        const heightPct = Math.max((d.amount / max) * 100, 4);
        const isToday   = i === last7Days.length - 1;
        return (
          <View key={i} style={styles.barCol}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  { height: `${heightPct}%` },
                  isToday && styles.barToday,
                  d.amount === 0 && styles.barEmpty,
                ]}
              />
            </View>
            <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{d.day}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 56 },
  barCol:       { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barTrack:     { flex: 1, width: '100%', justifyContent: 'flex-end' },
  bar:          { width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, minHeight: 3 },
  barToday:     { backgroundColor: colors.primary },
  barEmpty:     { backgroundColor: colors.border },
  dayLabel:     { ...typography.label, color: colors.textTertiary, marginTop: 4, fontSize: 10 },
  dayLabelToday:{ color: colors.primary },
});
