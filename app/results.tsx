/**
 * KWIZ App - Results Screen
 * Final quiz results with score breakdown and sharing
 */

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp,
    SlideInUp
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CelebrationMascot, Mascot } from '@/components/Mascot';
import { Avatar, Button, Card, Text } from '@/components/ui';
import { borderRadius, colors, layout, palette, spacing } from '@/constants';
import { playSound } from '@/services';
import { useQuizStore, useUserStore } from '@/store';

interface StatItem {
    label: string;
    value: string | number;
    icon: string;
    color: 'primary' | 'accent' | 'success' | 'error';
}

export default function ResultsScreen() {
    const { session, score, answers, leaderboard, resetQuiz } = useQuizStore();
    const { addXP, incrementStreak, updateStats, displayName, avatarId } = useUserStore();

    const [showCelebration, setShowCelebration] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);

    // Calculate stats
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const avgResponseTime = answers.length > 0
        ? Math.round(answers.reduce((acc, a) => acc + a.responseTime, 0) / answers.length)
        : 0;

    // Find user's rank in leaderboard
    const userRank = leaderboard.findIndex(e => e.displayName === displayName) + 1;
    const isWinner = userRank === 1;
    const isTopThree = userRank <= 3 && userRank > 0;

    // Calculate XP earned
    useEffect(() => {
        const baseXP = score;
        const accuracyBonus = Math.floor(accuracy * 2);
        const winBonus = isWinner ? 500 : isTopThree ? 200 : 0;
        const totalXP = baseXP + accuracyBonus + winBonus;

        setXpEarned(totalXP);

        // Add XP to user store
        if (totalXP > 0) {
            addXP(totalXP);
        }

        // Update stats
        updateStats({
            totalQuizzes: 1,
            totalCorrect: correctAnswers,
            totalWrong: totalQuestions - correctAnswers,
            totalWins: isWinner ? 1 : 0,
        });

        // Play appropriate sound and show celebration
        if (isWinner) {
            playSound('achievement');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowCelebration(true);
        } else if (isTopThree) {
            playSound('level_up');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            playSound('quiz_end');
        }
    }, []);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `🎉 I scored ${score} points in ${session?.title || 'KWIZ'}! Accuracy: ${accuracy}% 🧠\n\nDownload KWIZ and challenge me!`,
            });
        } catch (error) {
            console.log('Share error:', error);
        }
    };

    const handlePlayAgain = () => {
        resetQuiz();
        router.replace('/');
    };

    const handleViewLeaderboard = () => {
        router.push('/leaderboard');
    };

    const stats: StatItem[] = [
        { label: 'Score', value: score, icon: '🏆', color: 'accent' },
        { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯', color: accuracy >= 80 ? 'success' : 'primary' },
        { label: 'Correct', value: `${correctAnswers}/${totalQuestions}`, icon: '✅', color: 'success' },
        { label: 'Avg Time', value: `${avgResponseTime}s`, icon: '⏱️', color: 'primary' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.primary, palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />

            {/* Celebration overlay */}
            <CelebrationMascot
                visible={showCelebration}
                onComplete={() => setShowCelebration(false)}
            />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
                    <Text variant="labelSmall" color="secondary">
                        {session?.title || 'QUIZ COMPLETE'}
                    </Text>
                </Animated.View>

                {/* Rank & Score */}
                <Animated.View entering={SlideInUp.springify().delay(200)} style={styles.rankSection}>
                    {isTopThree && (
                        <View style={styles.rankBadge}>
                            <Text style={styles.rankEmoji}>
                                {userRank === 1 ? '🥇' : userRank === 2 ? '🥈' : '🥉'}
                            </Text>
                            <Text variant="labelSmall" color="accent">
                                {userRank === 1 ? '1ST PLACE!' : userRank === 2 ? '2ND PLACE' : '3RD PLACE'}
                            </Text>
                        </View>
                    )}

                    <Card variant="glass" padding="2xl" style={styles.scoreCard}>
                        <Avatar mascotId={avatarId} size="large" showBorder />
                        <Text variant="h3" color="primary" style={styles.playerName}>
                            {displayName}
                        </Text>

                        <Text variant="labelSmall" color="secondary">FINAL SCORE</Text>
                        <Animated.Text
                            entering={FadeInUp.delay(400).springify()}
                            style={styles.scoreText}
                        >
                            {score}
                        </Animated.Text>

                        {/* XP Earned */}
                        <View style={styles.xpContainer}>
                            <Text variant="labelSmall" color="accent">
                                +{xpEarned} XP EARNED
                            </Text>
                        </View>
                    </Card>
                </Animated.View>

                {/* Stats Grid */}
                <Animated.View entering={FadeIn.delay(500)} style={styles.statsContainer}>
                    <View style={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <Animated.View
                                key={stat.label}
                                entering={SlideInUp.springify().delay(600 + index * 100)}
                                style={styles.statItem}
                            >
                                <Text style={styles.statIcon}>{stat.icon}</Text>
                                <Text variant="h4" color={stat.color}>{stat.value}</Text>
                                <Text variant="labelSmall" color="muted">{stat.label}</Text>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {/* Mascot */}
                <View style={styles.mascotContainer}>
                    <Mascot
                        type="kwizzy"
                        size="small"
                        animation={isWinner ? 'celebrate' : 'idle'}
                        interactive
                    />
                </View>

                {/* Actions */}
                <Animated.View entering={FadeIn.delay(900)} style={styles.actionsContainer}>
                    <Button
                        variant="primary"
                        size="large"
                        fullWidth
                        onPress={handleShare}
                        icon={<Text>📤</Text>}
                    >
                        Share Results
                    </Button>

                    <View style={styles.buttonRow}>
                        <Button
                            variant="outline"
                            size="medium"
                            onPress={handleViewLeaderboard}
                            style={styles.halfButton}
                        >
                            Leaderboard
                        </Button>
                        <Button
                            variant="secondary"
                            size="medium"
                            onPress={handlePlayAgain}
                            style={styles.halfButton}
                        >
                            Play Again
                        </Button>
                    </View>
                </Animated.View>
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
        paddingHorizontal: layout.screenPaddingHorizontal,
    },
    header: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    rankSection: {
        alignItems: 'center',
        marginTop: spacing.md,
    },
    rankBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    rankEmoji: {
        fontSize: 24,
    },
    scoreCard: {
        alignItems: 'center',
        width: '100%',
    },
    playerName: {
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    scoreText: {
        fontSize: 72,
        fontWeight: 'bold',
        color: colors.text.accent,
        fontFamily: 'Outfit_600SemiBold',
        marginVertical: spacing.md,
    },
    xpContainer: {
        backgroundColor: 'rgba(205, 152, 97, 0.15)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        marginTop: spacing.md,
    },
    statsContainer: {
        marginVertical: spacing.xl,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: 'rgba(100, 68, 51, 0.5)',
        borderRadius: borderRadius.lg,
        marginHorizontal: spacing.xs,
    },
    statIcon: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    mascotContainer: {
        alignItems: 'center',
        marginVertical: spacing.md,
    },
    actionsContainer: {
        marginTop: 'auto',
        paddingBottom: spacing.xl,
        gap: spacing.md,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    halfButton: {
        flex: 1,
    },
});
