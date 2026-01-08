/**
 * KWIZ App - Quiz Lobby Screen
 * Waiting room before quiz starts
 */

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, {
    FadeIn,
    SlideInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mascot } from '@/components/Mascot';
import { Avatar, Button, Card, Text } from '@/components/ui';
import { colors, layout, palette, spacing } from '@/constants';
import { useTranslations } from '@/i18n';
import { socketService } from '@/services';
import { useQuizStore, useUserStore } from '@/store';

interface Participant {
    id: string;
    displayName: string;
    avatarId: number;
}

export default function LobbyScreen() {
    const { session, currentQuestion, resetQuiz } = useQuizStore();
    const { displayName, avatarId } = useUserStore();
    const t = useTranslations();

    // Mock participants for demo
    const [participants, setParticipants] = useState<Participant[]>([
        { id: '1', displayName: displayName, avatarId: avatarId },
        { id: '2', displayName: 'Alice', avatarId: 2 },
        { id: '3', displayName: 'Bob', avatarId: 3 },
    ]);

    // Pulsing animation for waiting indicator
    const pulseAnim = useSharedValue(1);

    useEffect(() => {
        pulseAnim.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    // Navigate to live quiz when quiz starts or question arrives
    useEffect(() => {
        if (session?.status === 'active' || currentQuestion) {
            console.log('[Lobby] Quiz started, navigating to live quiz...');
            router.replace('/live-quiz');
        }
    }, [session?.status, currentQuestion]);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }],
    }));

    const handleLeave = () => {
        socketService.leaveQuiz();
        resetQuiz();
        router.replace('/');
    };

    if (!session) {
        // Redirect if no session
        router.replace('/');
        return null;
    }

    const renderParticipant = ({ item, index }: { item: Participant; index: number }) => (
        <Animated.View
            entering={SlideInUp.springify().delay(index * 100)}
            style={styles.participantItem}
        >
            <Avatar mascotId={item.avatarId} size="medium" />
            <Text variant="bodyMedium" color="primary" style={styles.participantName}>
                {item.displayName}
                {item.id === '1' && (
                    <Text variant="bodySmall" color="accent"> ({t.leaderboard.you})</Text>
                )}
            </Text>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.primary, palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <Animated.View entering={FadeIn} style={styles.header}>
                    <View>
                        <Text variant="labelSmall" color="secondary">{t.quiz.quizCode.toUpperCase()}</Text>
                        <Text variant="h2" color="accent">{session.code}</Text>
                    </View>
                    <Button variant="ghost" size="small" onPress={handleLeave}>
                        {t.quiz.leave}
                    </Button>
                </Animated.View>

                {/* Quiz Info */}
                <Animated.View entering={SlideInUp.springify()} style={styles.quizInfoContainer}>
                    <Card variant="glass" padding="xl">
                        <Text variant="h3" color="primary" align="center" style={styles.quizTitle}>
                            {session.title}
                        </Text>
                        <Text variant="bodySmall" color="secondary" align="center">
                            {t.quiz.hostedBy} {session.hostName}
                        </Text>
                        <View style={styles.quizStats}>
                            <View style={styles.statItem}>
                                <Text variant="h4" color="accent">{session.totalQuestions}</Text>
                                <Text variant="labelSmall" color="muted">{t.quiz.questions}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text variant="h4" color="accent">{participants.length}</Text>
                                <Text variant="labelSmall" color="muted">{t.quiz.players}</Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Waiting Indicator */}
                <View style={styles.waitingContainer}>
                    <Animated.View style={[styles.waitingDot, pulseStyle]} />
                    <Text variant="bodyMedium" color="secondary" style={styles.waitingText}>
                        {t.quiz.waiting}
                    </Text>
                </View>

                {/* Participants */}
                <View style={styles.participantsContainer}>
                    <Text variant="labelSmall" color="secondary" style={styles.participantsTitle}>
                        {t.quiz.players.toUpperCase()} ({participants.length})
                    </Text>
                    <FlatList
                        data={participants}
                        keyExtractor={(item) => item.id}
                        renderItem={renderParticipant}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.participantsList}
                    />
                </View>

                {/* Mascot */}
                <View style={styles.mascotContainer}>
                    <Mascot type="kwizzy" size="medium" animation="idle" interactive />
                </View>

                {/* Waiting Footer */}
                <View style={styles.footer}>
                    <Text variant="bodyMedium" color="muted" align="center">
                        {t.quiz.waitingForHost}
                    </Text>
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
        paddingHorizontal: layout.screenPaddingHorizontal,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    quizInfoContainer: {
        marginBottom: spacing.xl,
    },
    quizTitle: {
        marginBottom: spacing.xs,
    },
    quizStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: spacing['2xl'],
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border.default,
    },
    waitingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg,
    },
    waitingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.interactive.primary,
        marginRight: spacing.sm,
    },
    waitingText: {
        fontStyle: 'italic',
    },
    participantsContainer: {
        marginVertical: spacing.lg,
    },
    participantsTitle: {
        marginBottom: spacing.md,
    },
    participantsList: {
        gap: spacing.md,
    },
    participantItem: {
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
    },
    participantName: {
        marginTop: spacing.xs,
        maxWidth: 80,
        textAlign: 'center',
    },
    mascotContainer: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: spacing.xl,
    },
    footerNote: {
        marginTop: spacing.sm,
    },
});
