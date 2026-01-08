/**
 * KWIZ App - Profile Screen
 * User profile with stats, achievements, and settings
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import { borderRadius, colors, layout, palette, shadows, spacing } from '@/constants';
import { useTranslations } from '@/i18n';
import { UserRole, useUserStore } from '@/store';

// Role display info
const ROLE_INFO: Record<UserRole, { label: string; emoji: string; color: string }> = {
  guest: { label: 'Guest', emoji: '👤', color: colors.text.muted },
  player: { label: 'Player', emoji: '🎮', color: colors.text.secondary },
  creator: { label: 'Creator', emoji: '✨', color: colors.text.accent },
  moderator: { label: 'Moderator', emoji: '🛡️', color: '#4ECDC4' },
  admin: { label: 'Admin', emoji: '👑', color: '#FFD700' },
};

export default function ProfileScreen() {
  const {
    displayName: storedName,
    avatarId: storedAvatar,
    level,
    xp,
    xpToNextLevel,
    stats,
    achievements: storedAchievements,
    setDisplayName,
    setAvatarId,
    role,
    roleRequestPending,
    canCreateQuiz,
    setRole,
  } = useUserStore();

  const roleInfo = ROLE_INFO[role];
  const isCreator = canCreateQuiz();
  const t = useTranslations();

  const [editName, setEditName] = useState(storedName);
  const [editAvatar, setEditAvatar] = useState(storedAvatar);
  const [isEditing, setIsEditing] = useState(false);

  // Sync local edit state when store changes
  useEffect(() => {
    if (!isEditing) {
      setEditName(storedName);
      setEditAvatar(storedAvatar);
    }
  }, [storedName, storedAvatar, isEditing]);

  const handleSave = () => {
    // Save to store
    if (editName.trim()) {
      setDisplayName(editName.trim());
    }
    setAvatarId(editAvatar);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to stored values
    setEditName(storedName);
    setEditAvatar(storedAvatar);
    setIsEditing(false);
  };

  const achievements = storedAchievements.slice(0, 6); // Show first 6

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
            <Text variant="h1" color="primary">{t.profile.title}</Text>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="small"
                onPress={() => setIsEditing(true)}
              >
                {t.common.edit}
              </Button>
            ) : (
              <View style={styles.headerButtons}>
                <Button variant="ghost" size="small" onPress={handleCancel}>
                  {t.common.cancel}
                </Button>
                <Button variant="primary" size="small" onPress={handleSave}>
                  {t.common.save}
                </Button>
              </View>
            )}
          </View>

          {/* Profile Card */}
          <Card variant="glass" padding="2xl" style={styles.profileCard}>
            <View style={styles.profileContent}>
              <Avatar
                mascotId={storedAvatar}
                size="xlarge"
                showBorder
              />
              <View style={styles.profileInfo}>
                <Text variant="h2" color="primary" style={styles.profileName}>
                  {storedName}
                </Text>
                <View style={styles.levelBadge}>
                  <Text variant="labelSmall" color="accent">
                    {t.profile.level.toUpperCase()} {level} • {xp.toLocaleString()} XP
                  </Text>
                </View>
                <View style={[styles.roleBadge, { backgroundColor: roleInfo.color + '20' }]}>
                  <Text style={{ color: roleInfo.color, fontSize: 12 }}>
                    {roleInfo.emoji} {roleInfo.label}
                  </Text>
                </View>
              </View>
            </View>

            {/* XP Progress */}
            <View style={styles.xpContainer}>
              <View style={styles.xpHeader}>
                <Text variant="labelSmall" color="muted">
                  {t.profile.xpToNextLevel.toUpperCase()}
                </Text>
                <Text variant="labelSmall" color="accent">
                  {xp} / {xpToNextLevel}
                </Text>
              </View>
              <ProgressBar progress={xp / xpToNextLevel} variant="xp" size="medium" />
            </View>
          </Card>

          {/* Edit Section (conditional) */}
          {isEditing && (
            <Card variant="default" padding="xl" style={styles.editCard}>
              <Text variant="h4" color="primary" style={styles.editTitle}>
                {t.profile.editProfile}
              </Text>

              <Input
                label={t.profile.displayName}
                value={editName}
                onChangeText={setEditName}
                variant="filled"
                containerStyle={styles.input}
              />

              <Text variant="labelSmall" color="secondary" style={styles.avatarLabel}>
                {t.profile.chooseAvatar.toUpperCase()}
              </Text>
              <AvatarSelector
                selectedId={editAvatar}
                onSelect={setEditAvatar}
              />
            </Card>
          )}

          {/* Creator Section */}
          {isCreator && (
            <View style={styles.section}>
              <Text variant="labelSmall" color="secondary" style={styles.sectionTitle}>
                {t.profile.creatorTools.toUpperCase()}
              </Text>
              <Card variant="gradient" padding="lg" style={styles.creatorCard}>
                <View style={styles.creatorContent}>
                  <View style={styles.creatorIcon}>
                    <Text style={{ fontSize: 32 }}>✨</Text>
                  </View>
                  <View style={styles.creatorInfo}>
                    <Text variant="h4" color="primary">{t.profile.myQuizzes}</Text>
                    <Text variant="bodySmall" color="muted">{t.profile.manageQuizzes}</Text>
                  </View>
                </View>
                <Button
                  variant="primary"
                  size="medium"
                  fullWidth
                  onPress={() => router.push('/my-quizzes')}
                  icon={<FontAwesome name="puzzle-piece" size={14} color="#fff" />}
                  style={{ marginTop: spacing.lg }}
                >
                  View My Quizzes
                </Button>
              </Card>
            </View>
          )}

          {/* Request Creator Access (for non-creators) */}
          {!isCreator && (
            <View style={styles.section}>
              <Card variant="default" padding="lg">
                <View style={styles.requestContent}>
                  <Text style={{ fontSize: 24, marginRight: spacing.md }}>✨</Text>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyMedium" color="primary">Want to create quizzes?</Text>
                    <Text variant="bodySmall" color="muted">Request Creator access to build your own quizzes</Text>
                  </View>
                </View>
                <Button
                  variant="outline"
                  size="medium"
                  fullWidth
                  onPress={() => {
                    // For demo, immediately grant creator role
                    setRole('creator');
                  }}
                  disabled={roleRequestPending}
                  style={{ marginTop: spacing.md }}
                >
                  {roleRequestPending ? 'Request Pending...' : 'Become a Creator'}
                </Button>
              </Card>
            </View>
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
                  {stats.totalQuizzes}
                </Text>
                <Text variant="labelSmall" color="muted">
                  Quizzes Played
                </Text>
              </Card>
              <Card variant="gradient" padding="lg" style={styles.statCard}>
                <Text style={styles.statEmoji}>✅</Text>
                <Text variant="h3" color="primary" style={styles.statValue}>
                  {(stats.totalCorrect + stats.totalWrong) > 0
                    ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100)
                    : 0}%
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
                  {stats.bestStreak}
                </Text>
                <Text variant="labelSmall" color="muted">
                  Best Streak
                </Text>
              </Card>
              <Card variant="gradient" padding="lg" style={styles.statCard}>
                <Text style={styles.statEmoji}>🏆</Text>
                <Text variant="h3" color="primary" style={styles.statValue}>
                  {stats.totalWins}
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
    paddingTop: spacing.md,
    paddingBottom: spacing['3xl'],
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
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

  // Role Badge
  roleBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },

  // Creator Section
  creatorCard: {
    // No additional styles needed
  },
  creatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(205, 152, 97, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  creatorInfo: {
    flex: 1,
  },

  // Request Creator
  requestContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
