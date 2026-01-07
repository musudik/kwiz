/**
 * KWIZ App - Home Screen
 * Professional landing page with feature showcase and quick actions
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Text } from '@/components/ui';
import { borderRadius, colors, layout, palette, safeArea, shadows, spacing } from '@/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Feature capabilities for the slideshow
const FEATURES = [
  {
    id: 1,
    icon: '⚡',
    title: 'Real-Time Quiz',
    description: 'Live multiplayer quizzes with instant scoring and leaderboards',
    color: '#FF6B6B',
  },
  {
    id: 2,
    icon: '📱',
    title: 'QR Code Join',
    description: 'Scan to join instantly - no typing, no hassle',
    color: '#4ECDC4',
  },
  {
    id: 3,
    icon: '🌍',
    title: 'Global Players',
    description: 'Compete with players from around the world in real-time',
    color: '#45B7D1',
  },
  {
    id: 4,
    icon: '✏️',
    title: 'Custom Questions',
    description: 'Create your own quizzes with unlimited questions',
    color: '#96CEB4',
  },
  {
    id: 5,
    icon: '🏆',
    title: 'Rewards & Rankings',
    description: 'Earn XP, unlock badges, and climb the leaderboard',
    color: '#FFEAA7',
  },
  {
    id: 6,
    icon: '📚',
    title: 'Multiple Categories',
    description: 'Education, entertainment, trivia, sports & more',
    color: '#DDA0DD',
  },
  {
    id: 7,
    icon: '🎮',
    title: 'Host Controls',
    description: 'Auto-advance or manual control - you decide',
    color: '#98D8C8',
  },
  {
    id: 8,
    icon: '🤖',
    title: 'AI Quiz Generator',
    description: 'Let AI create questions on any topic instantly',
    color: '#F7DC6F',
  },
  {
    id: 9,
    icon: '👤',
    title: 'Guest Mode',
    description: 'Join without registration - play instantly',
    color: '#BB8FCE',
  },
];

export default function HomeScreen() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // Smooth progress animation for carousel
  const progress = useSharedValue(0);
  const logoGlow = useSharedValue(0);

  // Feature rotation with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate progress when feature changes
  useEffect(() => {
    progress.value = withTiming(currentFeatureIndex, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  }, [currentFeatureIndex]);

  // Subtle logo glow animation
  useEffect(() => {
    logoGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const logoGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(logoGlow.value, [0, 1], [0.3, 0.6]),
    shadowRadius: interpolate(logoGlow.value, [0, 1], [10, 20]),
  }));

  const currentFeature = FEATURES[currentFeatureIndex];

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={[palette.brown[700], palette.brown[800], palette.brown[900]]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section - 30% of screen */}
          <Animated.View
            entering={FadeInDown.duration(800).delay(100)}
            style={styles.logoSection}
          >
            <Animated.View style={[styles.logoContainer, logoGlowStyle]}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
          </Animated.View>

          {/* Feature Carousel - Full Width */}
          <Animated.View
            entering={FadeIn.duration(600).delay(400)}
            style={styles.featuresSection}
          >
            <Text variant="labelSmall" color="muted" align="center" style={styles.featuresLabel}>
              DISCOVER WHAT YOU CAN DO
            </Text>

            {/* Feature Card - Animated */}
            <Animated.View
              key={currentFeature.id}
              entering={FadeIn.duration(500)}
              style={styles.featureCardContainer}
            >
              <LinearGradient
                colors={[currentFeature.color + '25', currentFeature.color + '10']}
                style={styles.featureCard}
              >
                <View style={[styles.featureIconBg, { backgroundColor: currentFeature.color + '40' }]}>
                  <Text style={styles.featureIcon}>{currentFeature.icon}</Text>
                </View>
                <Text variant="h2" color="primary" align="center" style={styles.featureTitle}>
                  {currentFeature.title}
                </Text>
                <Text variant="bodyLarge" color="secondary" align="center" style={styles.featureDesc}>
                  {currentFeature.description}
                </Text>
              </LinearGradient>
            </Animated.View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { width: `${((currentFeatureIndex + 1) / FEATURES.length) * 100}%` }
                  ]}
                />
              </View>
              <Text variant="labelSmall" color="muted" style={styles.progressText}>
                {currentFeatureIndex + 1} / {FEATURES.length}
              </Text>
            </View>

            {/* Dots indicator */}
            <View style={styles.dotsContainer}>
              {FEATURES.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentFeatureIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View
            entering={FadeInUp.duration(500).delay(600)}
            style={styles.actionsSection}
          >
            {/* Join Quiz Section */}
            <Card variant="glass" padding="lg" style={styles.joinCard}>
              <Text variant="labelSmall" color="secondary" style={styles.actionLabel}>
                JOIN A QUIZ
              </Text>
              <View style={styles.joinRow}>
                <Button
                  variant="primary"
                  size="medium"
                  onPress={() => router.push('/scan')}
                  style={styles.joinButton}
                  icon={<FontAwesome name="qrcode" size={18} color="#fff" />}
                >
                  Scan QR
                </Button>
                <Button
                  variant="outline"
                  size="medium"
                  onPress={() => router.push('/join')}
                  style={styles.joinButton}
                  icon={<FontAwesome name="keyboard-o" size={16} color={colors.text.primary} />}
                >
                  Enter Code
                </Button>
              </View>
            </Card>

            {/* Other Actions */}
            <View style={styles.actionGrid}>
              <Button
                variant="outline"
                size="medium"
                onPress={() => router.push('/leaderboard')}
                style={styles.gridButton}
                icon={<FontAwesome name="trophy" size={14} color={colors.text.accent} />}
              >
                Leaderboard
              </Button>
            </View>
          </Animated.View>

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
    paddingTop: Platform.OS === 'android' ? safeArea.top : spacing.sm,
  },

  // Logo - 30% of screen height
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: SCREEN_HEIGHT * 0.22,
    paddingVertical: spacing.md,
  },
  logoContainer: {
    shadowColor: colors.interactive.primary,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  logoImage: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.5,
  },

  // Features
  featuresSection: {
    paddingVertical: spacing.md,
    width: '100%',
  },
  featuresLabel: {
    marginBottom: spacing.md,
  },
  featureCardContainer: {
    width: '100%',
    minHeight: SCREEN_HEIGHT * 0.22,
  },
  featureCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  featureIcon: {
    fontSize: 38,
  },
  featureTitle: {
    marginBottom: spacing.sm,
  },
  featureDesc: {
    lineHeight: 22,
    maxWidth: '90%',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(205, 152, 97, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.interactive.primary,
    borderRadius: 2,
  },
  progressText: {
    minWidth: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(205, 152, 97, 0.3)',
  },
  dotActive: {
    backgroundColor: colors.interactive.primary,
    width: 18,
  },

  // Actions
  actionsSection: {
    paddingVertical: spacing.lg,
  },
  joinCard: {
    marginBottom: spacing.lg,
  },
  actionLabel: {
    marginBottom: spacing.md,
  },
  joinRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  joinButton: {
    flex: 1,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gridButton: {
    flex: 1,
  },

  bottomSpacer: {
    height: Platform.OS === 'ios' ? 110 : 90,
  },
});
