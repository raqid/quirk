import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Button from '../components/Button';
import { Icon } from '../utils/icons';
import { useAuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const { width } = Dimensions.get('window');

const PAGES = [
  {
    icon: 'camera',
    title: 'Upload & Earn',
    body: 'Capture photos, videos, and audio that AI companies need. Every approved upload earns you an upfront payment.',
  },
  {
    icon: 'checkCircle',
    title: 'Complete Tasks',
    body: 'Earn more by completing specific tasks — things companies need urgently. Higher pay, faster approval.',
  },
  {
    icon: 'coins',
    title: 'Earn Royalties Forever',
    body: 'Every time a company uses your data in a training run, you earn a royalty. e.g., A company licenses a dataset with your photos → you earn $0.02–$0.50 per use, every time. On top of the upfront payment you already received.',
  },
];

export default function OnboardingTutorial({ navigation }) {
  const { setIsAuthenticated } = useAuthContext();
  const [page, setPage] = useState(0);
  const scrollRef = useRef();

  const handleScroll = (e) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    setPage(p);
  };

  const handleNext = () => {
    if (page < PAGES.length - 1) {
      scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
    } else {
      setIsAuthenticated(true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.skip} onPress={() => setIsAuthenticated(true)}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.scroll}
        >
          {PAGES.map((p, i) => (
            <View key={i} style={[styles.page, { width }]}>
              <Icon name={p.icon} size={64} color={colors.text} style={styles.pageIcon} />
              <Text style={styles.pageTitle}>{p.title}</Text>
              <Text style={styles.pageBody}>{p.body}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.dots}>
          {PAGES.map((_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>

        <Button
          title={page === PAGES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.cta}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingBottom: spacing.xl },
  skip: { alignSelf: 'flex-end', padding: spacing.md },
  skipText: { ...typography.body, color: colors.textSecondary },
  scroll: { flex: 1 },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  pageIcon: { marginBottom: spacing.lg },
  pageTitle: { ...typography.heading2, color: colors.text, marginBottom: spacing.md, textAlign: 'center' },
  pageBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
  cta: { marginHorizontal: spacing.lg },
});
