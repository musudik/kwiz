/**
 * KWIZ App - Home Screen
 * Main landing screen with QR scanner, mascot, and level display
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Button,
  Card,
  LevelProgressBar,
  MiniStreak,
  Text
} from '@/components/ui';
import { colors, layout, palette, safeArea, shadows, spacing } from '@/constants';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentLevel] = useState(2);
  const [currentXP] = useState(5);
  const [totalXP] = useState(10);
  const [streak] = useState(3);

  // Mascot floating animation
  const floatAnim = useSharedValue(0);

  React.useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const mascotAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: floatAnim.value * -10 },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={[palette.brown[700], palette.brown[800]]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Level */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <LevelProgressBar
                currentStep={currentXP}
                totalSteps={totalXP}
                level={currentLevel}
                style={styles.levelProgress}
              />
            </View>
            <View style={styles.headerRight}>
              {streak > 0 && <MiniStreak count={streak} />}
              <View style={styles.settingsButton}>
                <FontAwesome name="sliders" size={18} color={colors.text.secondary} />
              </View>
            </View>
          </View>

          {/* Mascot Section */}
          <View style={styles.mascotSection}>
            <Animated.View style={[styles.mascotContainer, mascotAnimatedStyle]}>
              {/* Mascot placeholder - will be Lottie animation */}
              <View style={styles.mascotWrapper}>
                <View style={styles.mascotShadow} />
                <View style={styles.mascot}>
                  <Text style={styles.mascotEmoji}>🐱</Text>
                </View>
              </View>
            </Animated.View>

            <Text variant="displaySmall" color="primary" align="center" style={styles.mascotName}>
              Kwizzy
            </Text>
            <Text variant="levelText" color="accent" align="center">
              Level {currentLevel}
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Card variant="glass" padding="2xl" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <View style={styles.actionIcon}>
                  <FontAwesome name="qrcode" size={32} color={colors.text.primary} />
                </View>
                <View style={styles.actionText}>
                  <Text variant="h3" color="primary">
                    Join a Quiz
                  </Text>
                  <Text variant="bodySmall" color="secondary">
                    Scan QR code or enter code
                  </Text>
                </View>
              </View>
              <Button
                variant="primary"
                size="large"
                fullWidth
                onPress={() => router.push('/scan')}
                style={styles.scanButton}
              >
                Scan QR Code
              </Button>
            </Card>

            {/* Enter Code Option */}
            <View style={styles.orDivider}>
              <View style={styles.dividerLine} />
              <Text variant="labelSmall" color="muted" style={styles.orText}>
                OR
              </Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              variant="outline"
              size="medium"
              fullWidth
              onPress={() => router.push('/join')}
              icon={<FontAwesome name="keyboard-o" size={16} color={colors.text.primary} />}
            >
              Enter Quiz Code
            </Button>

            {/* Demo Quiz Button */}
            <Button
              variant="secondary"
              size="medium"
              fullWidth
              onPress={() => router.push('/quiz-demo')}
              style={styles.demoButton}
              icon={<FontAwesome name="play" size={14} color={colors.text.inverse} />}
            >
              Try Demo Quiz
            </Button>
          </View>

          {/* Stats Preview */}
          <View style={styles.statsSection}>
            <Text variant="labelSmall" color="secondary" style={styles.statsTitle}>
              YOUR STATS
            </Text>
            <View style={styles.statsGrid}>
              <Card variant="gradient" padding="lg" style={styles.statCard}>
                <Text variant="scoreText" color="accent" style={styles.statValue}>
                  12
                </Text>
                <Text variant="labelSmall" color="secondary">
                  Quizzes
                </Text>
              </Card>
              <Card variant="gradient" padding="lg" style={styles.statCard}>
                <Text variant="scoreText" color="accent" style={styles.statValue}>
                  84%
                </Text>
                <Text variant="labelSmall" color="secondary">
                  Accuracy
                </Text>
              </Card>
              <Card variant="gradient" padding="lg" style={styles.statCard}>
                <Text variant="scoreText" color="accent" style={styles.statValue}>
                  🏆 3
                </Text>
                <Text variant="labelSmall" color="secondary">
                  Wins
                </Text>
              </Card>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentSection}>
            <Text variant="labelSmall" color="secondary" style={styles.sectionTitle}>
              RECENT QUIZZES
            </Text>
            <Card variant="default" padding="lg" style={styles.recentCard}>
              <View style={styles.recentItem}>
                <View style={styles.recentIcon}>
                  <Text style={styles.recentEmoji}>📚</Text>
                </View>
                <View style={styles.recentInfo}>
                  <Text variant="bodyMedium" color="primary">
                    Science Trivia
                  </Text>
                  <Text variant="bodyXSmall" color="muted">
                    2nd place • 850 pts
                  </Text>
                </View>
                <Text variant="labelSmall" color="secondary">
                  2h ago
                </Text>
              </View>
            </Card>
          </View>

          {/* Bottom spacing for tab bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: Platform.OS === 'android' ? safeArea.top : 0,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,
  },
  headerLeft: {
    flex: 1,
    maxWidth: '60%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelProgress: {
    maxWidth: 200,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },

  // Mascot
  mascotSection: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  mascotContainer: {
    alignItems: 'center',
  },
  mascotWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  mascotShadow: {
    position: 'absolute',
    bottom: -20,
    width: 100,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    transform: [{ scaleX: 1.5 }],
  },
  mascot: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#5BC0EB',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.xl,
  },
  mascotEmoji: {
    fontSize: 80,
  },
  mascotName: {
    marginTop: spacing.xl,
    fontFamily: 'PlayfairDisplay_700Bold',
  },

  // Actions
  actionsSection: {
    paddingVertical: spacing['2xl'],
  },
  actionCard: {
    marginBottom: spacing.lg,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(205, 152, 97, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  actionText: {
    flex: 1,
  },
  scanButton: {
    marginTop: spacing.sm,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  orText: {
    marginHorizontal: spacing.md,
  },

  // Stats
  statsSection: {
    paddingVertical: spacing.xl,
  },
  statsTitle: {
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    lineHeight: 32,
  },

  // Recent
  recentSection: {
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  recentCard: {
    marginBottom: spacing.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(205, 152, 97, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  recentEmoji: {
    fontSize: 20,
  },
  recentInfo: {
    flex: 1,
  },
  demoButton: {
    marginTop: spacing.md,
  },

  bottomSpacer: {
    height: layout.tabBarHeight + spacing['2xl'],
  },
});
