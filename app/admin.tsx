/**
 * KWIZ App - Admin Dashboard Screen
 * Quiz host control panel for managing live quizzes
 */

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button, Card, ProgressBar, Text } from '@/components/ui';
import { borderRadius, colors, layout, palette, spacing } from '@/constants';

interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    timeLimit: number;
}

interface Participant {
    id: string;
    displayName: string;
    avatarId: number;
    score: number;
    isOnline: boolean;
}

// Demo data
const DEMO_QUIZ = {
    id: 'demo-quiz',
    title: 'Science Trivia Challenge',
    code: 'ABC123',
    totalQuestions: 10,
    currentQuestionIndex: 0,
    status: 'waiting' as 'waiting' | 'active' | 'paused' | 'ended',
};

const DEMO_QUESTIONS: QuizQuestion[] = [
    { id: '1', text: 'What is the largest planet in our solar system?', options: ['Mars', 'Jupiter', 'Saturn', 'Neptune'], correctIndex: 1, timeLimit: 30 },
    { id: '2', text: 'Which element has the chemical symbol "Au"?', options: ['Silver', 'Aluminum', 'Gold', 'Copper'], correctIndex: 2, timeLimit: 30 },
    { id: '3', text: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], correctIndex: 0, timeLimit: 30 },
];

const DEMO_PARTICIPANTS: Participant[] = [
    { id: '1', displayName: 'Alice', avatarId: 2, score: 450, isOnline: true },
    { id: '2', displayName: 'Bob', avatarId: 3, score: 380, isOnline: true },
    { id: '3', displayName: 'Charlie', avatarId: 4, score: 320, isOnline: true },
    { id: '4', displayName: 'Diana', avatarId: 5, score: 280, isOnline: false },
];

export default function AdminDashboardScreen() {
    const [quiz, setQuiz] = useState(DEMO_QUIZ);
    const [participants, setParticipants] = useState(DEMO_PARTICIPANTS);
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [answersReceived, setAnswersReceived] = useState(0);

    const isQuizActive = quiz.status === 'active';
    const isQuizPaused = quiz.status === 'paused';
    const isQuizEnded = quiz.status === 'ended';
    const onlineCount = participants.filter(p => p.isOnline).length;

    // Timer countdown when question is active
    useEffect(() => {
        if (isQuizActive && timeRemaining > 0) {
            const interval = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timeRemaining === 0 && isQuizActive && currentQuestion) {
            // Auto-advance to results
            handleShowResults();
        }
    }, [isQuizActive, timeRemaining, currentQuestion]);

    const handleStartQuiz = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setQuiz({ ...quiz, status: 'active' });
        showQuestion(0);
    };

    const showQuestion = (index: number) => {
        if (index >= DEMO_QUESTIONS.length) {
            handleEndQuiz();
            return;
        }

        const question = DEMO_QUESTIONS[index];
        setCurrentQuestion(question);
        setTimeRemaining(question.timeLimit);
        setAnswersReceived(0);
        setQuiz({ ...quiz, currentQuestionIndex: index, status: 'active' });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Simulate answers coming in
        simulateAnswers();
    };

    const simulateAnswers = () => {
        let count = 0;
        const interval = setInterval(() => {
            if (count < participants.length) {
                setAnswersReceived(prev => prev + 1);
                count++;
            } else {
                clearInterval(interval);
            }
        }, Math.random() * 3000 + 1000);
    };

    const handleShowResults = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // In real app, this would show the correct answer and update scores
    };

    const handleNextQuestion = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        showQuestion(quiz.currentQuestionIndex + 1);
    };

    const handlePauseQuiz = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setQuiz({ ...quiz, status: 'paused' });
    };

    const handleResumeQuiz = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setQuiz({ ...quiz, status: 'active' });
    };

    const handleEndQuiz = () => {
        Alert.alert(
            'End Quiz',
            'Are you sure you want to end this quiz?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'End Quiz',
                    style: 'destructive',
                    onPress: () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        setQuiz({ ...quiz, status: 'ended' });
                        setCurrentQuestion(null);
                    },
                },
            ]
        );
    };

    const handleBack = () => {
        if (isQuizActive) {
            Alert.alert(
                'Leave Dashboard',
                'The quiz will continue running. Are you sure?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Leave', onPress: () => router.back() },
                ]
            );
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.primary, palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <Animated.View entering={FadeIn} style={styles.header}>
                    <Button variant="ghost" size="small" onPress={handleBack}>
                        ← Back
                    </Button>
                    <View style={styles.headerCenter}>
                        <Text variant="labelSmall" color="secondary">QUIZ CODE</Text>
                        <Text variant="h3" color="accent">{quiz.code}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <View style={[
                            styles.statusDot,
                            quiz.status === 'active' && styles.statusActive,
                            quiz.status === 'paused' && styles.statusPaused,
                            quiz.status === 'ended' && styles.statusEnded,
                        ]} />
                        <Text variant="labelSmall" color="primary">
                            {quiz.status.toUpperCase()}
                        </Text>
                    </View>
                </Animated.View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Quiz Info */}
                    <Card variant="glass" padding="lg" style={styles.quizInfoCard}>
                        <Text variant="h3" color="primary" align="center">
                            {quiz.title}
                        </Text>
                        <View style={styles.quizStats}>
                            <View style={styles.statItem}>
                                <Text variant="h4" color="accent">{onlineCount}</Text>
                                <Text variant="labelSmall" color="muted">Online</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text variant="h4" color="accent">
                                    {quiz.currentQuestionIndex + 1}/{quiz.totalQuestions}
                                </Text>
                                <Text variant="labelSmall" color="muted">Question</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text variant="h4" color="accent">{participants.length}</Text>
                                <Text variant="labelSmall" color="muted">Players</Text>
                            </View>
                        </View>
                    </Card>

                    {/* Current Question (if active) */}
                    {currentQuestion && (
                        <Animated.View entering={SlideInUp.springify()}>
                            <Card variant="default" padding="xl" style={styles.questionCard}>
                                <View style={styles.questionHeader}>
                                    <Text variant="labelSmall" color="secondary">
                                        QUESTION {quiz.currentQuestionIndex + 1}
                                    </Text>
                                    <View style={styles.timerBadge}>
                                        <Text variant="h4" color={timeRemaining <= 5 ? 'error' : 'primary'}>
                                            {timeRemaining}s
                                        </Text>
                                    </View>
                                </View>

                                <Text variant="h4" color="primary" style={styles.questionText}>
                                    {currentQuestion.text}
                                </Text>

                                <View style={styles.optionsPreview}>
                                    {currentQuestion.options.map((option, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.optionItem,
                                                index === currentQuestion.correctIndex && styles.correctOption,
                                            ]}
                                        >
                                            <Text variant="labelSmall" color="secondary" style={styles.optionLetter}>
                                                {String.fromCharCode(65 + index)}
                                            </Text>
                                            <Text variant="bodySmall" color="primary" numberOfLines={1}>
                                                {option}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Answers Progress */}
                                <View style={styles.answersProgress}>
                                    <Text variant="labelSmall" color="secondary">
                                        Answers received: {answersReceived}/{participants.length}
                                    </Text>
                                    <ProgressBar
                                        progress={answersReceived / participants.length}
                                        variant="xp"
                                        size="small"
                                        style={styles.progressBar}
                                    />
                                </View>
                            </Card>
                        </Animated.View>
                    )}

                    {/* Participants */}
                    <View style={styles.participantsSection}>
                        <Text variant="labelSmall" color="secondary" style={styles.sectionTitle}>
                            PARTICIPANTS ({participants.length})
                        </Text>
                        <View style={styles.participantsGrid}>
                            {participants.slice(0, 8).map((participant) => (
                                <View key={participant.id} style={styles.participantItem}>
                                    <View style={styles.participantAvatar}>
                                        <Avatar mascotId={participant.avatarId} size="small" />
                                        <View style={[
                                            styles.onlineIndicator,
                                            participant.isOnline && styles.online,
                                        ]} />
                                    </View>
                                    <Text variant="bodyXSmall" color="primary" numberOfLines={1}>
                                        {participant.displayName}
                                    </Text>
                                    <Text variant="labelSmall" color="accent">
                                        {participant.score}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Control Actions */}
                <View style={styles.controlsContainer}>
                    {quiz.status === 'waiting' && (
                        <Button
                            variant="primary"
                            size="large"
                            fullWidth
                            onPress={handleStartQuiz}
                        >
                            Start Quiz
                        </Button>
                    )}

                    {isQuizActive && (
                        <View style={styles.controlRow}>
                            <Button
                                variant="outline"
                                size="medium"
                                onPress={handlePauseQuiz}
                                style={styles.controlButton}
                            >
                                ⏸ Pause
                            </Button>
                            <Button
                                variant="primary"
                                size="medium"
                                onPress={handleNextQuestion}
                                style={styles.controlButton}
                            >
                                Next →
                            </Button>
                        </View>
                    )}

                    {isQuizPaused && (
                        <View style={styles.controlRow}>
                            <Button
                                variant="secondary"
                                size="medium"
                                onPress={handleResumeQuiz}
                                style={styles.controlButton}
                            >
                                ▶ Resume
                            </Button>
                            <Button
                                variant="error"
                                size="medium"
                                onPress={handleEndQuiz}
                                style={styles.controlButton}
                            >
                                End Quiz
                            </Button>
                        </View>
                    )}

                    {isQuizEnded && (
                        <Button
                            variant="primary"
                            size="large"
                            fullWidth
                            onPress={() => router.push('/leaderboard')}
                        >
                            View Final Results
                        </Button>
                    )}
                </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingVertical: spacing.md,
    },
    headerCenter: {
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(100, 68, 51, 0.6)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.text.muted,
    },
    statusActive: {
        backgroundColor: colors.status.success,
    },
    statusPaused: {
        backgroundColor: colors.status.warning,
    },
    statusEnded: {
        backgroundColor: colors.status.error,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: layout.screenPaddingHorizontal,
    },
    quizInfoCard: {
        marginBottom: spacing.lg,
    },
    quizStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.border.default,
    },
    questionCard: {
        marginBottom: spacing.lg,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    timerBadge: {
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
    },
    questionText: {
        marginBottom: spacing.lg,
    },
    optionsPreview: {
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        backgroundColor: 'rgba(100, 68, 51, 0.3)',
        borderRadius: borderRadius.md,
        gap: spacing.sm,
    },
    correctOption: {
        backgroundColor: 'rgba(124, 185, 124, 0.2)',
        borderWidth: 1,
        borderColor: colors.status.success,
    },
    optionLetter: {
        width: 24,
        height: 24,
        backgroundColor: 'rgba(100, 68, 51, 0.5)',
        borderRadius: 12,
        textAlign: 'center',
        lineHeight: 24,
    },
    answersProgress: {
        marginTop: spacing.md,
    },
    progressBar: {
        marginTop: spacing.sm,
    },
    participantsSection: {
        marginTop: spacing.md,
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },
    participantsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    participantItem: {
        alignItems: 'center',
        width: 70,
    },
    participantAvatar: {
        position: 'relative',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.text.muted,
        borderWidth: 2,
        borderColor: palette.primary,
    },
    online: {
        backgroundColor: colors.status.success,
    },
    controlsContainer: {
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border.default,
    },
    controlRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    controlButton: {
        flex: 1,
    },
});
