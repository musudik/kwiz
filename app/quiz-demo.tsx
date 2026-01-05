/**
 * KWIZ App - Quiz Demo Screen
 * Demonstration of the live quiz interface
 */

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import Animated, {
    FadeIn,
    SlideInRight
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { OptionState } from '@/components/ui';
import {
    Button,
    Card,
    MiniStreak,
    OptionButton,
    ProgressBar,
    StreakBadge,
    Text,
    Timer,
} from '@/components/ui';
import { colors, layout, palette, safeArea, spacing } from '@/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Question {
    id: number;
    text: string;
    options: string[];
    correctIndex: number;
}

const DEMO_QUESTIONS: Question[] = [
    {
        id: 1,
        text: 'What is the largest planet in our solar system?',
        options: ['Mars', 'Jupiter', 'Saturn', 'Neptune'],
        correctIndex: 1,
    },
    {
        id: 2,
        text: 'Which element has the chemical symbol "Au"?',
        options: ['Silver', 'Aluminum', 'Gold', 'Copper'],
        correctIndex: 2,
    },
    {
        id: 3,
        text: 'In what year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctIndex: 2,
    },
];

export default function QuizDemoScreen() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timer, setTimer] = useState(30);
    const [isQuizEnded, setIsQuizEnded] = useState(false);

    const currentQuestion = DEMO_QUESTIONS[currentQuestionIndex];
    const progress = (currentQuestionIndex + 1) / DEMO_QUESTIONS.length;

    // Timer countdown
    useEffect(() => {
        if (timer > 0 && !showResult && !isQuizEnded) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0 && !showResult) {
            handleTimeUp();
        }
    }, [timer, showResult, isQuizEnded]);

    const handleTimeUp = () => {
        setShowResult(true);
        setStreak(0);
    };

    const handleOptionSelect = (index: number) => {
        if (selectedOption !== null || showResult) return;

        setSelectedOption(index);
        setShowResult(true);

        const isCorrect = index === currentQuestion.correctIndex;
        if (isCorrect) {
            const basePoints = 100;
            const timeBonus = Math.floor(timer * 3);
            const streakMultiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
            const points = (basePoints + timeBonus) * streakMultiplier;
            setScore((prev) => prev + points);
            setStreak((prev) => prev + 1);
        } else {
            setStreak(0);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < DEMO_QUESTIONS.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setShowResult(false);
            setTimer(30);
        } else {
            setIsQuizEnded(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
        setStreak(0);
        setTimer(30);
        setIsQuizEnded(false);
    };

    const getOptionState = (index: number): OptionState => {
        if (!showResult) {
            return selectedOption === index ? 'selected' : 'default';
        }
        if (index === currentQuestion.correctIndex) {
            return 'correct';
        }
        if (index === selectedOption && index !== currentQuestion.correctIndex) {
            return 'wrong';
        }
        return 'disabled';
    };

    const optionLabels = ['A', 'B', 'C', 'D'];

    if (isQuizEnded) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[palette.brown[700], palette.brown[800]]}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.resultsContainer}>
                        <Animated.View entering={FadeIn.delay(200)}>
                            <Text style={styles.resultsEmoji}>🎉</Text>
                            <Text variant="displayMedium" color="primary" align="center">
                                Quiz Complete!
                            </Text>
                        </Animated.View>

                        <Animated.View entering={FadeIn.delay(400)} style={styles.scoreCard}>
                            <Card variant="glass" padding="2xl">
                                <Text variant="labelSmall" color="secondary" align="center">
                                    FINAL SCORE
                                </Text>
                                <Text variant="scoreText" color="accent" align="center" style={styles.finalScore}>
                                    {score}
                                </Text>
                                <View style={styles.scoreStats}>
                                    <View style={styles.scoreStat}>
                                        <Text variant="h3" color="primary">{DEMO_QUESTIONS.length}</Text>
                                        <Text variant="labelSmall" color="muted">Questions</Text>
                                    </View>
                                    <View style={styles.scoreStatDivider} />
                                    <View style={styles.scoreStat}>
                                        <Text variant="h3" color="success">
                                            {Math.round((score / (DEMO_QUESTIONS.length * 200)) * 100)}%
                                        </Text>
                                        <Text variant="labelSmall" color="muted">Accuracy</Text>
                                    </View>
                                </View>
                            </Card>
                        </Animated.View>

                        <Animated.View entering={FadeIn.delay(600)} style={styles.resultsActions}>
                            <Button variant="primary" size="large" fullWidth onPress={handleRestartQuiz}>
                                Play Again
                            </Button>
                            <Button variant="outline" size="large" fullWidth onPress={() => router.back()}>
                                Back to Home
                            </Button>
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.brown[700], palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text variant="labelSmall" color="secondary">
                            QUESTION {currentQuestionIndex + 1} OF {DEMO_QUESTIONS.length}
                        </Text>
                        <ProgressBar progress={progress} variant="quiz" size="small" style={styles.progressBar} />
                    </View>
                    <View style={styles.headerRight}>
                        {streak > 0 && <MiniStreak count={streak} />}
                    </View>
                </View>

                {/* Timer & Score */}
                <View style={styles.timerSection}>
                    <Timer
                        seconds={timer}
                        totalSeconds={30}
                        size={100}
                        strokeWidth={8}
                    />
                    <View style={styles.scoreContainer}>
                        <Text variant="labelSmall" color="secondary">SCORE</Text>
                        <Text variant="h2" color="accent">{score}</Text>
                    </View>
                </View>

                {/* Question */}
                <Animated.View
                    key={currentQuestion.id}
                    entering={SlideInRight.springify().damping(15)}
                    style={styles.questionSection}
                >
                    <Card variant="glass" padding="2xl">
                        <Text variant="questionText" color="primary" align="center">
                            {currentQuestion.text}
                        </Text>
                    </Card>
                </Animated.View>

                {/* Options */}
                <View style={styles.optionsSection}>
                    {currentQuestion.options.map((option, index) => (
                        <Animated.View
                            key={index}
                            entering={SlideInRight.springify().damping(15).delay(index * 100)}
                        >
                            <OptionButton
                                label={option}
                                optionKey={optionLabels[index]}
                                state={getOptionState(index)}
                                onPress={() => handleOptionSelect(index)}
                                disabled={showResult}
                                index={index}
                            />
                        </Animated.View>
                    ))}
                </View>

                {/* Streak celebration */}
                {showResult && streak >= 3 && (
                    <Animated.View entering={FadeIn} style={styles.streakCelebration}>
                        <StreakBadge count={streak} size="large" />
                    </Animated.View>
                )}

                {/* Next Button */}
                {showResult && (
                    <Animated.View entering={FadeIn.delay(500)} style={styles.nextButtonContainer}>
                        <Button variant="primary" size="large" fullWidth onPress={handleNextQuestion}>
                            {currentQuestionIndex < DEMO_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
                        </Button>
                    </Animated.View>
                )}
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
        paddingTop: Platform.OS === 'android' ? safeArea.top : 0,
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: spacing.md,
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        marginLeft: spacing.md,
    },
    progressBar: {
        marginTop: spacing.sm,
        maxWidth: 200,
    },

    // Timer Section
    timerSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl,
        gap: spacing['3xl'],
    },
    scoreContainer: {
        alignItems: 'center',
    },

    // Question
    questionSection: {
        paddingVertical: spacing.lg,
    },

    // Options
    optionsSection: {
        gap: spacing.md,
        paddingVertical: spacing.md,
    },

    // Streak
    streakCelebration: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -60,
        marginTop: -40,
        zIndex: 100,
    },

    // Next Button
    nextButtonContainer: {
        position: 'absolute',
        bottom: spacing['3xl'],
        left: layout.screenPaddingHorizontal,
        right: layout.screenPaddingHorizontal,
    },

    // Results
    resultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: layout.screenPaddingHorizontal,
    },
    resultsEmoji: {
        fontSize: 64,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    scoreCard: {
        width: '100%',
        marginVertical: spacing['3xl'],
    },
    finalScore: {
        fontSize: 64,
        lineHeight: 72,
        marginVertical: spacing.lg,
    },
    scoreStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    scoreStat: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    scoreStatDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border.default,
    },
    resultsActions: {
        width: '100%',
        gap: spacing.md,
    },
});
