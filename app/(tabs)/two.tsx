/**
 * KWIZ App - Profile Screen
 * User profile with stats, achievements, and settings
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Avatar,
  AvatarSelector,
  Button,
  Card,
  Input,
  ProgressBar,
  Text,
} from '@/components/ui';
import { borderRadius, colors, layout, palette, safeArea, shadows, spacing } from '@/constants';

export default function ProfileScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [displayName, setDisplayName] = useState('Player');
  const [isEditing, setIsEditing] = useState(false);

  const achievements = [
    { id: 1, name: 'First Quiz', emoji: '🌟', unlocked: true },
    { id: 2, name: 'Speed Demon', emoji: '⚡', unlocked: true },
    { id: 3, name: 'Perfect Score', emoji: '🏆', unlocked: false },
    { id: 4, name: 'Streak Master', emoji: '🔥', unlocked: false },
    { id: 5, name: 'Team Player', emoji: '🤝', unlocked: true },
    { id: 6, name: 'Early Bird', emoji: '🐦', unlocked: false },
  ];

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
          {/* Header */}
          <View style={styles.header}>
            <Text variant="h1" color="primary">Profile</Text>
            <Button
              variant="ghost"
              size="small"
              onPress={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </View>

          {/* Profile Card */}
          <Card variant="glass" padding="2xl" style={styles.profileCard}>
            <View style={styles.profileContent}>
              <Avatar
                mascotId={selectedAvatar}
                size="xlarge"
                showBorder
              />
              <View style={styles.profileInfo}>
                <Text variant="h2" color="primary" style={styles.profileName}>
                  {displayName}
                </Text>
                <View style={styles.levelBadge}>
                  <Text variant="labelSmall" color="accent">
                    LEVEL 2 • 1,250 XP
                  </Text>
                </View>
              </View>
            </View>

            {/* XP Progress */}
            <View style={styles.xpContainer}>
              <View style={styles.xpHeader}>
                <Text variant="labelSmall" color="muted">
                  XP TO NEXT LEVEL
                </Text>
                <Text variant="labelSmall" color="accent">
                  750 / 1000
                </Text>
              </View>
              <ProgressBar progress={0.75} variant="xp" size="medium" />
            </View>
          </Card>

          {/* Edit Section (conditional) */}
          {isEditing && (
            <Card variant="default" padding="xl" style={styles.editCard}>
              <Text variant="h4" color="primary" style={styles.editTitle}>
                Edit Profile
              </Text>

              <Input
                label="Display Name"
                value={displayName}
                onChangeText={setDisplayName}
                variant="filled"
                containerStyle={styles.input}
              />

              <Text variant="labelSmall" color="secondary" style={styles.avatarLabel}>
                CHOOSE AVATAR
              </Text>
              <AvatarSelector
                selectedId={selectedAvatar}
                onSelect={setSelectedAvatar}
              />
            </Card>
          )}

          {/* Stats Section */}
          <View style={styles.section}>
            <Text variant="labelSmall" color="secondary" style={styles.sectionTitle}>
              STATISTICS
            </Text>
            <View style={styles.statsGrid}>
              <Card variant="gradient" padding="lg" style={styles.statCard}>
                <Text style={styles.statEmoji}>🎯</Text>
                <Text variant="h3" color="primary" style={styles.statValue}>
                  12
                </Text>
                <Text variant="labelSmall" color="muted">
                  Quizzes Played
                </Text>
              </Card>
              <Card variant="gradient" padding="lg" style={styles.statCard}>
                <Text style={styles.statEmoji}>✅</Text>
                <Text variant="h3" color="primary" style={styles.statValue}>
                  84%
                </Text>
                <Text variant="labelSmall" color="muted">
                  Accuracy
                </Text>
              </Card>
            </View>
            <View style={styles.statsGrid}>
              <Card variant="gradient" padding="lg" style={styles.statCard}>
                <Text style={styles.statEmoji}>🔥</Text>
                <Text variant="h3" color="primary" style={styles.statValue}>
                  7
                </Text>
                <Text variant="labelSmall" color="muted">
                  Best Streak
                </Text>
              </Card>
              <Card variant="gradient" padding="lg" style={styles.statCard}>
                <Text style={styles.statEmoji}>🏆</Text>
                <Text variant="h3" color="primary" style={styles.statValue}>
                  3
                </Text>
                <Text variant="labelSmall" color="muted">
                  Wins
                </Text>
              </Card>
            </View>
          </View>

          {/* Achievements Section */}
          <View style={styles.section}>
            <Text variant="labelSmall" color="secondary" style={styles.sectionTitle}>
              ACHIEVEMENTS
            </Text>
            <Card variant="default" padding="lg">
              <View style={styles.achievementsGrid}>
                {achievements.map((achievement) => (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementItem,
                      !achievement.unlocked && styles.achievementLocked,
                    ]}
                  >
                    <View
                      style={[
                        styles.achievementIcon,
                        achievement.unlocked && styles.achievementIconUnlocked,
                      ]}
                    >
                      <Text style={styles.achievementEmoji}>
                        {achievement.unlocked ? achievement.emoji : '🔒'}
                      </Text>
                    </View>
                    <Text
                      variant="bodyXSmall"
                      color={achievement.unlocked ? 'primary' : 'muted'}
                      align="center"
                      numberOfLines={1}
                    >
                      {achievement.name}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>

          {/* Settings Links */}
          <View style={styles.section}>
            <Text variant="labelSmall" color="secondary" style={styles.sectionTitle}>
              SETTINGS
            </Text>
            <Card variant="default" padding="none">
              <SettingsLink
                icon="bell-o"
                label="Notifications"
                onPress={() => { }}
              />
              <SettingsLink
                icon="volume-up"
                label="Sound & Haptics"
                onPress={() => { }}
              />
              <SettingsLink
                icon="info-circle"
                label="About KWIZ"
                onPress={() => { }}
                isLast
              />
            </Card>
          </View>

          {/* Bottom spacing for tab bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Settings link component
function SettingsLink({
  icon,
  label,
  onPress,
  isLast = false,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      style={{ ...styles.settingsLink, ...(!isLast ? styles.settingsLinkBorder : {}) }}
    >
      <View style={styles.settingsLinkContent}>
        <FontAwesome
          name={icon as any}
          size={18}
          color={colors.text.secondary}
          style={styles.settingsIcon}
        />
        <Text variant="bodyMedium" color="primary" style={styles.settingsLabel}>
          {label}
        </Text>
        <FontAwesome
          name="chevron-right"
          size={14}
          color={colors.text.muted}
        />
      </View>
    </Button>
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
    paddingTop: Platform.OS === 'android' ? safeArea.top + spacing.lg : spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  // Profile Card
  profileCard: {
    marginBottom: spacing.xl,
  },
  profileContent: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  profileName: {
    marginBottom: spacing.xs,
  },
  levelBadge: {
    backgroundColor: 'rgba(205, 152, 97, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  xpContainer: {
    marginTop: spacing.md,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  // Edit Section
  editCard: {
    marginBottom: spacing.xl,
  },
  editTitle: {
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.lg,
  },
  avatarLabel: {
    marginBottom: spacing.md,
  },

  // Stats
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statValue: {
    marginVertical: spacing.xs,
  },

  // Achievements
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  achievementIconUnlocked: {
    backgroundColor: 'rgba(205, 152, 97, 0.2)',
    ...shadows.sm,
  },
  achievementEmoji: {
    fontSize: 24,
  },

  // Settings
  settingsLink: {
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.lg,
    height: 56,
  },
  settingsLinkBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  settingsLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  settingsIcon: {
    width: 28,
    marginRight: spacing.md,
  },
  settingsLabel: {
    flex: 1,
  },

  bottomSpacer: {
    height: layout.tabBarHeight + spacing['2xl'],
  },
});
