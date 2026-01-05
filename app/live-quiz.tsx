/**
 * KWIZ App - Live Quiz Screen
 * Beautiful, clean quiz interface with timer and auto-progression
 */

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { Avatar, Text } from '@/components/ui';
import { borderRadius, colors, layout, palette, shadows, spacing } from '@/constants';
import { playSound, socketService } from '@/services';
import { LeaderboardEntry, useQuizStore, useUserStore } from '@/store';

const TIMER_SIZE = 60;
const TIMER_STROKE = 4;
const TIMER_RADIUS = (TIMER_SIZE - TIMER_STROKE) / 2;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

// Quiz state phases
type QuizPhase = 'question' | 'reveal' | 'transition';

export default function LiveQuizScreen() {
    const {
        session,
        currentQuestion,
        score,
        currentStreak,
        leaderboard,
        submitAnswer,
    } = useQuizStore();

    const { displayName, avatarId, incrementStreak, resetStreak, addXP } = useUserStore();

    // Local state
    const [phase, setPhase] = useState<QuizPhase>('question');
    const [timeRemaining, setTimeRemaining] = useState(30);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [questionKey, setQuestionKey] = useState(0);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [localLeaderboard, setLocalLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [questionNumber, setQuestionNumber] = useState(1);

    // Timer refs
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const hasAnsweredRef = useRef<boolean>(false);
    const responseTimeRef = useRef<number>(0);

    // Blink animation for last 5 seconds
    const blinkOpacity = useSharedValue(1);

    // Initialize question
    useEffect(() => {
        if (currentQuestion) {
            // Reset state for new question
            setPhase('question');
            setSelectedOption(null);
            setIsCorrect(null);
            setTimeRemaining(currentQuestion.timeLimit);
            setQuestionKey(prev => prev + 1);
            startTimeRef.current = Date.now();
            hasAnsweredRef.current = false;
            responseTimeRef.current = 0;
            blinkOpacity.value = 1;

            // Update question number based on session index (0-based to 1-based)
            const qNum = Math.min(
                (session?.currentQuestionIndex ?? 0) + 1,
                session?.totalQuestions ?? 1
            );
            setQuestionNumber(qNum);

            // Play sound
            playSound('new_question');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            // Start countdown
            startTimer();
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [currentQuestion?.id]);

    // Handle quiz end
    useEffect(() => {
        if (session?.status === 'ended') {
            playSound('end_quiz');
            setTimeout(() => {
                router.replace('/results');
            }, 500);
        }
    }, [session?.status]);

    // Update local leaderboard when store updates
    useEffect(() => {
        if (leaderboard.length > 0) {
            setLocalLeaderboard(leaderboard);
        }
    }, [leaderboard]);

    // Blink effect for last 5 seconds
    useEffect(() => {
        if (timeRemaining <= 5 && timeRemaining > 0 && phase === 'question') {
            blinkOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.3, { duration: 200 }),
                    withTiming(1, { duration: 200 })
                ),
                -1,
                true
            );
        } else {
            blinkOpacity.value = 1;
        }
    }, [timeRemaining, phase]);

    const blinkStyle = useAnimatedStyle(() => ({
        opacity: blinkOpacity.value,
    }));

    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    timerRef.current = null;
                    // Use setTimeout to ensure state update completes
                    setTimeout(() => {
                        handleTimeUp();
                    }, 50);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleTimeUp = useCallback(() => {
        // Prevent double execution
        if (phase !== 'question') return;

        // If no answer was selected, mark as wrong
        if (!hasAnsweredRef.current) {
            setIsCorrect(false);
            resetStreak();

            // Submit empty answer to server
            if (currentQuestion) {
                socketService.submitAnswer(currentQuestion.id, [], currentQuestion.timeLimit);
                submitAnswer(false, 0, currentQuestion.timeLimit);
            }
        }

        // Stop blink
        blinkOpacity.value = 1;

        // Move to reveal phase
        setPhase('reveal');
        playSound('show_answer');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        // After 2.5 seconds, transition to next question
        setTimeout(() => {
            setPhase('transition');
        }, 2500);
    }, [phase, currentQuestion]);

    const handleSelectOption = useCallback((optionId: number) => {
        // Can only select once and only during question phase
        if (phase !== 'question' || hasAnsweredRef.current) return;

        hasAnsweredRef.current = true;
        setSelectedOption(optionId);
        playSound('select_answer');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Calculate response time
        responseTimeRef.current = Math.round((Date.now() - startTimeRef.current) / 1000);

        // Check if answer is correct
        const correct = currentQuestion?.correctOptionIds.includes(optionId) || false;
        setIsCorrect(correct);

        // Calculate points
        const basePoints = currentQuestion?.points || 100;
        const timeLimit = currentQuestion?.timeLimit || 30;
        const timeBonus = Math.floor((timeLimit - responseTimeRef.current) * 3);
        const streakMultiplier = currentStreak >= 5 ? 2 : currentStreak >= 3 ? 1.5 : 1;
        const pointsEarned = correct
            ? Math.floor((basePoints + Math.max(0, timeBonus)) * streakMultiplier)
            : 0;

        // Submit to server immediately (for leaderboard updates)
        if (currentQuestion) {
            socketService.submitAnswer(currentQuestion.id, [optionId], responseTimeRef.current);
            submitAnswer(correct, pointsEarned, responseTimeRef.current);
        }

        // Update user stats
        if (correct) {
            incrementStreak();
            addXP(pointsEarned);
        } else {
            resetStreak();
        }

        // DON'T stop timer or reveal answer - wait for timer to finish
    }, [phase, currentQuestion, currentStreak]);

    // Timer circle calculation
    const getStrokeDashoffset = () => {
        const elapsed = (currentQuestion?.timeLimit || 30) - timeRemaining;
        const total = currentQuestion?.timeLimit || 30;
        return TIMER_CIRCUMFERENCE * (elapsed / total);
    };

    const getTimerColor = () => {
        if (timeRemaining <= 5) return colors.status.error;
        if (timeRemaining <= 10) return colors.status.warning;
        return colors.interactive.primary;
    };

    const getOptionStyle = (optionId: number) => {
        if (phase === 'question') {
            if (selectedOption === optionId) {
                return styles.optionSelected;
            }
            return styles.optionDefault;
        }

        // Reveal phase
        const isCorrectOption = currentQuestion?.correctOptionIds.includes(optionId);
        if (isCorrectOption) {
            return styles.optionCorrect;
        }
        if (selectedOption === optionId && !isCorrectOption) {
            return styles.optionWrong;
        }
        return styles.optionDimmed;
    };

    const getOptionLabelStyle = (optionId: number) => {
        if (phase === 'question') {
            if (selectedOption === optionId) {
                return styles.optionLabelSelected;
            }
            return styles.optionLabelDefault;
        }

        const isCorrectOption = currentQuestion?.correctOptionIds.includes(optionId);
        if (isCorrectOption) {
            return styles.optionLabelCorrect;
        }
        if (selectedOption === optionId) {
            return styles.optionLabelWrong;
        }
        return styles.optionLabelDimmed;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    };

    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    // Loading state
    if (!currentQuestion || !session) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[palette.primary, palette.brown[800]]}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingContainer}>
                        <Text variant="h3" color="primary" align="center">
                            Waiting for quiz to start...
                        </Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    const totalQuestions = session.totalQuestions || 5;
    const progress = questionNumber / totalQuestions;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.primary, palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    <View style={styles.questionBadge}>
                        <Text variant="buttonSmall" color="white">
                            {questionNumber}/{totalQuestions}
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                        </View>
                    </View>

                    {/* Leaderboard Button */}
                    <Pressable
                        style={styles.leaderboardButton}
                        onPress={() => setShowLeaderboard(true)}
                    >
                        <Text style={styles.leaderboardIcon}>🏆</Text>
                    </Pressable>

                    <View style={styles.scoreBadge}>
                        <Text variant="buttonSmall" color="accent">
                            {score} PTS
                        </Text>
                    </View>
                </View>

                {/* Timer & Question Card */}
                <View style={styles.questionSection}>
                    {/* Timer Circle with blink effect */}
                    <Animated.View style={[styles.timerContainer, timeRemaining <= 5 && blinkStyle]}>
                        <Svg width={TIMER_SIZE} height={TIMER_SIZE} style={styles.timerSvg}>
                            {/* Background circle */}
                            <Circle
                                cx={TIMER_SIZE / 2}
                                cy={TIMER_SIZE / 2}
                                r={TIMER_RADIUS}
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth={TIMER_STROKE}
                                fill="transparent"
                            />
                            {/* Progress circle */}
                            <Circle
                                cx={TIMER_SIZE / 2}
                                cy={TIMER_SIZE / 2}
                                r={TIMER_RADIUS}
                                stroke={getTimerColor()}
                                strokeWidth={TIMER_STROKE}
                                fill="transparent"
                                strokeLinecap="round"
                                strokeDasharray={TIMER_CIRCUMFERENCE}
                                strokeDashoffset={getStrokeDashoffset()}
                                rotation={-90}
                                origin={`${TIMER_SIZE / 2}, ${TIMER_SIZE / 2}`}
                            />
                        </Svg>
                        <View style={styles.timerTextContainer}>
                            <Text
                                variant="h3"
                                color={timeRemaining <= 5 ? 'error' : 'primary'}
                                style={styles.timerText}
                            >
                                {timeRemaining}
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Streak Badge */}
                    {currentStreak > 0 && (
                        <View style={styles.streakBadge}>
                            <Text style={styles.streakEmoji}>🔥</Text>
                            <Text variant="labelSmall" color="accent">{currentStreak}</Text>
                        </View>
                    )}

                    {/* Question Card - Smooth fade animation */}
                    <Animated.View
                        key={`q-${questionKey}`}
                        entering={FadeIn.duration(400)}
                        style={styles.questionCard}
                    >
                        <Text variant="h3" color="primary" align="center" style={styles.questionText}>
                            {currentQuestion.text}
                        </Text>
                    </Animated.View>
                </View>

                {/* Options - Smooth fade animation */}
                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <Animated.View
                            key={`opt-${questionKey}-${option.id}`}
                            entering={FadeInDown.duration(300).delay(index * 60)}
                        >
                            <Pressable
                                onPress={() => handleSelectOption(option.id)}
                                disabled={phase !== 'question' || hasAnsweredRef.current}
                                style={[styles.optionButton, getOptionStyle(option.id)]}
                            >
                                <View style={[styles.optionLabel, getOptionLabelStyle(option.id)]}>
                                    <Text variant="buttonMedium" style={styles.optionLabelText}>
                                        {optionLetters[index]}
                                    </Text>
                                </View>
                                <Text
                                    variant="bodyLarge"
                                    color="primary"
                                    style={styles.optionText}
                                    numberOfLines={2}
                                >
                                    {option.text}
                                </Text>
                                {phase === 'reveal' && currentQuestion.correctOptionIds.includes(option.id) && (
                                    <Text style={styles.checkIcon}>✓</Text>
                                )}
                                {phase === 'reveal' && selectedOption === option.id &&
                                    !currentQuestion.correctOptionIds.includes(option.id) && (
                                        <Text style={styles.crossIcon}>✗</Text>
                                    )}
                            </Pressable>
                        </Animated.View>
                    ))}
                </View>

                {/* Selected indicator (before reveal) */}
                {phase === 'question' && selectedOption !== null && (
                    <View style={styles.selectedIndicator}>
                        <Text variant="bodySmall" color="secondary">
                            ✓ Answer locked in! Waiting for timer...
                        </Text>
                    </View>
                )}

                {/* Result Feedback at Bottom */}
                {phase === 'reveal' && (
                    <Animated.View
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(200)}
                        style={styles.feedbackContainer}
                    >
                        <View style={[
                            styles.feedbackCard,
                            isCorrect ? styles.feedbackCorrect : styles.feedbackWrong
                        ]}>
                            <Text variant="h4" style={isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextWrong}>
                                {isCorrect ? '🎉 Correct!' : '❌ Wrong!'}
                            </Text>
                            <Text variant="bodySmall" color="secondary">
                                Next question in 2s...
                            </Text>
                        </View>
                    </Animated.View>
                )}
            </SafeAreaView>

            {/* Leaderboard Modal */}
            <Modal
                visible={showLeaderboard}
                animationType="fade"
                transparent
                onRequestClose={() => setShowLeaderboard(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setShowLeaderboard(false)}
                    />
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        style={styles.modalContent}
                    >
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text variant="h2" color="primary">🏆 Leaderboard</Text>
                            <Pressable
                                onPress={() => setShowLeaderboard(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeIcon}>✕</Text>
                            </Pressable>
                        </View>

                        <Text variant="bodySmall" color="secondary" style={styles.leaderboardSubtitle}>
                            Ranked by correct answers & fastest time
                        </Text>

                        {/* Leaderboard List */}
                        <ScrollView
                            style={styles.leaderboardScroll}
                            showsVerticalScrollIndicator={false}
                        >
                            {localLeaderboard.length > 0 ? (
                                localLeaderboard.map((entry, index) => (
                                    <View
                                        key={entry.participantId}
                                        style={[
                                            styles.leaderboardRow,
                                            entry.displayName === displayName && styles.leaderboardRowSelf
                                        ]}
                                    >
                                        {/* Rank */}
                                        <View style={styles.rankContainer}>
                                            {index === 0 ? (
                                                <Text style={styles.medalEmoji}>🥇</Text>
                                            ) : index === 1 ? (
                                                <Text style={styles.medalEmoji}>🥈</Text>
                                            ) : index === 2 ? (
                                                <Text style={styles.medalEmoji}>🥉</Text>
                                            ) : (
                                                <Text variant="buttonMedium" color="muted">#{index + 1}</Text>
                                            )}
                                        </View>

                                        {/* Avatar */}
                                        <Avatar mascotId={entry.avatarId} size="small" />

                                        {/* Name & Stats */}
                                        <View style={styles.playerInfo}>
                                            <Text variant="bodyMedium" color="primary" numberOfLines={1}>
                                                {entry.displayName}
                                                {entry.displayName === displayName && (
                                                    <Text variant="bodySmall" color="accent"> (You)</Text>
                                                )}
                                            </Text>
                                            <View style={styles.statRow}>
                                                <Text variant="labelSmall" color="muted">
                                                    ✓ {entry.correctAnswers ?? 0}
                                                </Text>
                                                <Text variant="labelSmall" color="muted" style={styles.statDivider}>•</Text>
                                                <Text variant="labelSmall" color="muted">
                                                    ⏱ {formatTime(entry.totalResponseTime ?? 0)}
                                                </Text>
                                                {entry.streak > 0 && (
                                                    <>
                                                        <Text variant="labelSmall" color="muted" style={styles.statDivider}>•</Text>
                                                        <Text variant="labelSmall" color="accent">🔥{entry.streak}</Text>
                                                    </>
                                                )}
                                            </View>
                                        </View>

                                        {/* Score */}
                                        <View style={styles.scoreContainer}>
                                            <Text variant="h4" color="accent">{entry.score}</Text>
                                            <Text variant="labelSmall" color="muted">pts</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyLeaderboard}>
                                    <Text style={styles.emptyEmoji}>📊</Text>
                                    <Text variant="bodyMedium" color="muted" align="center">
                                        Leaderboard updates after each question
                                    </Text>
                                </View>
                            )}
                        </ScrollView>

                        {/* Close Button */}
                        <Pressable
                            style={styles.modalCloseBtn}
                            onPress={() => setShowLeaderboard(false)}
                        >
                            <Text variant="buttonMedium" color="white">Close</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Modal>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Top Bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        gap: spacing.sm,
    },
    questionBadge: {
        backgroundColor: 'rgba(205, 152, 97, 0.4)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
    },
    progressContainer: {
        flex: 1,
        height: 6,
    },
    progressTrack: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.interactive.primary,
        borderRadius: 3,
    },
    leaderboardButton: {
        backgroundColor: 'rgba(205, 152, 97, 0.3)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
    },
    leaderboardIcon: {
        fontSize: 18,
    },
    scoreBadge: {
        backgroundColor: 'rgba(100, 68, 51, 0.6)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
    },

    // Question Section
    questionSection: {
        alignItems: 'center',
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    timerContainer: {
        position: 'relative',
        width: TIMER_SIZE,
        height: TIMER_SIZE,
        marginBottom: spacing.md,
    },
    timerSvg: {
        transform: [{ rotateZ: '-90deg' }],
    },
    timerTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        fontWeight: '700',
    },
    streakBadge: {
        position: 'absolute',
        top: spacing.lg,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(205, 152, 97, 0.3)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    streakEmoji: {
        fontSize: 14,
    },
    questionCard: {
        backgroundColor: 'rgba(100, 68, 51, 0.4)',
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(155, 111, 83, 0.3)',
        ...shadows.md,
    },
    questionText: {
        lineHeight: 28,
    },

    // Options
    optionsContainer: {
        flex: 1,
        gap: spacing.md,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        minHeight: 60,
    },
    optionDefault: {
        backgroundColor: 'rgba(100, 68, 51, 0.35)',
        borderColor: 'rgba(155, 111, 83, 0.25)',
    },
    optionSelected: {
        backgroundColor: 'rgba(205, 152, 97, 0.25)',
        borderColor: colors.interactive.primary,
    },
    optionCorrect: {
        backgroundColor: 'rgba(124, 185, 124, 0.3)',
        borderColor: colors.status.success,
    },
    optionWrong: {
        backgroundColor: 'rgba(204, 107, 107, 0.3)',
        borderColor: colors.status.error,
    },
    optionDimmed: {
        backgroundColor: 'rgba(100, 68, 51, 0.2)',
        borderColor: 'rgba(155, 111, 83, 0.15)',
        opacity: 0.6,
    },
    optionLabel: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    optionLabelDefault: {
        backgroundColor: 'rgba(155, 111, 83, 0.4)',
    },
    optionLabelSelected: {
        backgroundColor: colors.interactive.primary,
    },
    optionLabelCorrect: {
        backgroundColor: colors.status.success,
    },
    optionLabelWrong: {
        backgroundColor: colors.status.error,
    },
    optionLabelDimmed: {
        backgroundColor: 'rgba(155, 111, 83, 0.3)',
    },
    optionLabelText: {
        color: '#fff',
        fontWeight: '700',
    },
    optionText: {
        flex: 1,
    },
    checkIcon: {
        fontSize: 22,
        color: colors.status.success,
        fontWeight: '700',
        marginLeft: spacing.sm,
    },
    crossIcon: {
        fontSize: 22,
        color: colors.status.error,
        fontWeight: '700',
        marginLeft: spacing.sm,
    },

    // Selected indicator
    selectedIndicator: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },

    // Feedback
    feedbackContainer: {
        paddingVertical: spacing.lg,
    },
    feedbackCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
        borderWidth: 2,
    },
    feedbackCorrect: {
        backgroundColor: 'rgba(124, 185, 124, 0.15)',
        borderColor: colors.status.success,
    },
    feedbackWrong: {
        backgroundColor: 'rgba(204, 107, 107, 0.15)',
        borderColor: colors.status.error,
    },
    feedbackTextCorrect: {
        color: colors.status.success,
        marginBottom: spacing.xs,
    },
    feedbackTextWrong: {
        color: colors.status.error,
        marginBottom: spacing.xs,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: palette.brown[700],
        borderRadius: borderRadius['2xl'],
        width: '90%',
        maxHeight: '75%',
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(205, 152, 97, 0.3)',
        ...shadows.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    closeButton: {
        padding: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: borderRadius.full,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 16,
        color: colors.text.muted,
    },
    leaderboardSubtitle: {
        marginBottom: spacing.lg,
    },
    leaderboardScroll: {
        maxHeight: 320,
    },
    leaderboardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
        backgroundColor: 'rgba(100, 68, 51, 0.3)',
        gap: spacing.sm,
    },
    leaderboardRowSelf: {
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        borderWidth: 1,
        borderColor: colors.interactive.primary,
    },
    rankContainer: {
        width: 36,
        alignItems: 'center',
    },
    medalEmoji: {
        fontSize: 24,
    },
    playerInfo: {
        flex: 1,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    statDivider: {
        marginHorizontal: spacing.xs,
    },
    scoreContainer: {
        alignItems: 'flex-end',
    },
    emptyLeaderboard: {
        paddingVertical: spacing['3xl'],
        alignItems: 'center',
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    modalCloseBtn: {
        backgroundColor: colors.interactive.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
});
