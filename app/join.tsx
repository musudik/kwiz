/**
 * KWIZ App - Join Quiz Screen
 * Join a quiz session by code or after QR scan
 */

import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mascot } from '@/components/Mascot';
import { Avatar, Button, Card, Input, Text } from '@/components/ui';
import { colors, layout, palette, spacing } from '@/constants';
import { useConnection } from '@/hooks';
import { socketService } from '@/services';
import { useQuizStore, useUserStore } from '@/store';

export default function JoinScreen() {
    const params = useLocalSearchParams<{ code?: string }>();
    const [quizCode, setQuizCode] = useState(params.code || '');
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { displayName, avatarId } = useUserStore();
    const { session } = useQuizStore();
    const { isConnected, connect, connectionStatus } = useConnection();

    // Auto-join if code was passed from QR scan
    useEffect(() => {
        if (params.code && isConnected && !session) {
            handleJoin();
        }
    }, [params.code, isConnected]);

    // Listen for session updates to navigate to lobby
    useEffect(() => {
        if (session && isJoining) {
            setIsJoining(false);
            router.replace('/lobby');
        }
    }, [session, isJoining]);

    const handleJoin = async () => {
        if (!quizCode.trim()) {
            setError('Please enter a quiz code');
            return;
        }

        if (quizCode.length < 4 || quizCode.length > 8) {
            setError('Quiz code should be 4-8 characters');
            return;
        }

        setIsJoining(true);
        setError(null);

        try {
            // Connect if not already connected
            if (!isConnected) {
                await connect();
            }

            // Set up error listener before joining
            const socket = socketService.getSocket();
            if (socket) {
                const errorHandler = (errorData: { message: string }) => {
                    setError(errorData.message || 'Failed to join quiz. Check the code and try again.');
                    setIsJoining(false);
                    socket.off('connection:error', errorHandler);
                };
                socket.on('connection:error', errorHandler);

                // Clean up listener after timeout
                setTimeout(() => {
                    socket.off('connection:error', errorHandler);
                }, 5000);
            }

            // Join the quiz - the socket service will update the store with real session data
            socketService.joinQuiz(quizCode.toUpperCase(), displayName, avatarId);

            // Timeout if no response
            setTimeout(() => {
                if (isJoining) {
                    setError('Connection timeout. Please try again.');
                    setIsJoining(false);
                }
            }, 5000);
        } catch (err: any) {
            setError(err.message || 'Failed to join quiz');
            setIsJoining(false);
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
                <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
                    <Button
                        variant="ghost"
                        size="small"
                        onPress={() => router.back()}
                    >
                        ← Back
                    </Button>
                </Animated.View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Mascot */}
                    <Animated.View entering={SlideInUp.springify().delay(200)} style={styles.mascotContainer}>
                        <Mascot type="kwizzy" size="large" animation="wave" />
                    </Animated.View>

                    {/* Join Card */}
                    <Animated.View entering={SlideInUp.springify().delay(300)} style={styles.cardContainer}>
                        <Card variant="glass" padding="2xl">
                            <Text variant="h2" color="primary" align="center" style={styles.title}>
                                Join Quiz
                            </Text>

                            <Text variant="bodyMedium" color="secondary" align="center" style={styles.subtitle}>
                                Enter the 6-digit quiz code to join
                            </Text>

                            {/* Quiz Code Input */}
                            <Input
                                label="Quiz Code"
                                value={quizCode}
                                onChangeText={(text) => {
                                    setQuizCode(text.toUpperCase());
                                    setError(null);
                                }}
                                placeholder="ABC123"
                                variant="filled"
                                autoCapitalize="characters"
                                maxLength={8}
                                error={error || undefined}
                                containerStyle={styles.input}
                            />

                            {/* User Preview */}
                            <View style={styles.userPreview}>
                                <Avatar mascotId={avatarId} size="small" />
                                <Text variant="bodyMedium" color="primary" style={styles.userName}>
                                    Joining as {displayName}
                                </Text>
                            </View>

                            {/* Join Button */}
                            <Button
                                variant="primary"
                                size="large"
                                fullWidth
                                onPress={handleJoin}
                                loading={isJoining}
                                disabled={!quizCode.trim() || isJoining}
                            >
                                {isJoining ? 'Joining...' : 'Join Quiz'}
                            </Button>

                            {/* Connection Status */}
                            {connectionStatus === 'connecting' && (
                                <View style={styles.connectionStatus}>
                                    <ActivityIndicator size="small" color={colors.text.secondary} />
                                    <Text variant="bodySmall" color="secondary" style={styles.connectionText}>
                                        Connecting to server...
                                    </Text>
                                </View>
                            )}
                        </Card>
                    </Animated.View>

                    {/* Tips */}
                    <Animated.View entering={FadeIn.delay(500)} style={styles.tipsContainer}>
                        <Text variant="bodySmall" color="muted" align="center">
                            💡 Look for the quiz code on the host's screen or scan the QR code
                        </Text>
                    </Animated.View>
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
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingVertical: spacing.md,
    },
    content: {
        flex: 1,
        paddingHorizontal: layout.screenPaddingHorizontal,
        justifyContent: 'center',
    },
    mascotContainer: {
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    cardContainer: {
        marginBottom: spacing.xl,
    },
    title: {
        marginBottom: spacing.sm,
    },
    subtitle: {
        marginBottom: spacing['2xl'],
    },
    input: {
        marginBottom: spacing.xl,
    },
    userPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        padding: spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
    },
    userName: {
        marginLeft: spacing.md,
    },
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
    },
    connectionText: {
        marginLeft: spacing.sm,
    },
    tipsContainer: {
        paddingHorizontal: spacing.xl,
    },
});
