/**
 * KWIZ UI Component - StreakBadge
 * Animated streak indicator with fire effects
 */

import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { borderRadius, colors, shadows, spacing } from '../../constants';
import { Text } from './Text';

interface StreakBadgeProps {
    count: number;
    size?: 'small' | 'medium' | 'large';
    animated?: boolean;
    showMultiplier?: boolean;
    style?: ViewStyle;
}

export function StreakBadge({
    count,
    size = 'medium',
    animated = true,
    showMultiplier = true,
    style,
}: StreakBadgeProps) {
    const scaleAnim = useSharedValue(1);
    const glowAnim = useSharedValue(0);
    const fireAnim = useSharedValue(0);

    const getMultiplier = () => {
        if (count >= 10) return 5;
        if (count >= 7) return 4;
        if (count >= 5) return 3;
        if (count >= 3) return 2;
        return 1;
    };

    const getStreakColor = () => {
        if (count >= 10) return colors.gamification.streak[5];
        if (count >= 7) return colors.gamification.streak[4];
        if (count >= 5) return colors.gamification.streak[3];
        if (count >= 3) return colors.gamification.streak[2];
        return colors.gamification.streak[1];
    };

    useEffect(() => {
        if (animated && count > 0) {
            // Pop animation when streak increases
            scaleAnim.value = withSequence(
                withSpring(1.3, { damping: 8, stiffness: 400 }),
                withSpring(1, { damping: 12, stiffness: 200 })
            );

            // Continuous glow for active streaks
            if (count >= 3) {
                glowAnim.value = withRepeat(
                    withSequence(
                        withTiming(1, { duration: 800 }),
                        withTiming(0.5, { duration: 800 })
                    ),
                    -1,
                    true
                );
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            // Fire flicker for high streaks
            if (count >= 5) {
                fireAnim.value = withRepeat(
                    withSequence(
                        withTiming(1, { duration: 200 }),
                        withTiming(0.7, { duration: 300 }),
                        withTiming(1, { duration: 200 })
                    ),
                    -1,
                    false
                );
            }
        }
    }, [count, animated]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleAnim.value }],
        };
    });

    const animatedGlowStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            glowAnim.value,
            [0, 1],
            [0.3, 0.8],
            Extrapolate.CLAMP
        );
        return { opacity };
    });

    const animatedFireStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            fireAnim.value,
            [0, 1],
            [0.9, 1.1],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ scale }],
        };
    });

    const sizeStyles = badgeSizes[size];
    const multiplier = getMultiplier();
    const streakColor = getStreakColor();

    if (count === 0) {
        return null;
    }

    return (
        <Animated.View style={[styles.container, animatedContainerStyle, style]}>
            {/* Glow effect */}
            {count >= 3 && (
                <Animated.View
                    style={[
                        styles.glow,
                        {
                            backgroundColor: streakColor,
                            width: sizeStyles.size + 20,
                            height: sizeStyles.size + 20,
                            borderRadius: (sizeStyles.size + 20) / 2,
                        },
                        animatedGlowStyle,
                    ]}
                />
            )}

            {/* Badge */}
            <View
                style={[
                    styles.badge,
                    {
                        width: sizeStyles.size,
                        height: sizeStyles.size,
                        borderRadius: sizeStyles.size / 2,
                        backgroundColor: streakColor,
                    },
                    count >= 3 && shadows.glow,
                ]}
            >
                {/* Fire emoji */}
                <Animated.Text
                    style={[
                        styles.fireEmoji,
                        { fontSize: sizeStyles.emojiSize },
                        count >= 5 && animatedFireStyle,
                    ]}
                >
                    🔥
                </Animated.Text>
            </View>

            {/* Streak count */}
            <View style={styles.countContainer}>
                <Text
                    variant={sizeStyles.textVariant as any}
                    color="white"
                    style={[styles.count, { color: streakColor }]}
                >
                    ×{count}
                </Text>
                {showMultiplier && multiplier > 1 && (
                    <Text variant="labelSmall" color="accent" style={styles.multiplier}>
                        {multiplier}x points
                    </Text>
                )}
            </View>
        </Animated.View>
    );
}

// Mini streak indicator for headers
export function MiniStreak({ count, style }: { count: number; style?: ViewStyle }) {
    if (count === 0) return null;

    return (
        <View style={[styles.miniContainer, style]}>
            <Text style={styles.miniEmoji}>🔥</Text>
            <Text variant="labelMedium" color="accent">
                {count}
            </Text>
        </View>
    );
}

const badgeSizes = {
    small: {
        size: 32,
        emojiSize: 16,
        textVariant: 'labelMedium',
    },
    medium: {
        size: 48,
        emojiSize: 24,
        textVariant: 'h4',
    },
    large: {
        size: 64,
        emojiSize: 32,
        textVariant: 'h3',
    },
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    glow: {
        position: 'absolute',
        left: -10,
        top: -10,
    },
    badge: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    fireEmoji: {
        textAlign: 'center',
    },
    countContainer: {
        marginLeft: spacing.sm,
    },
    count: {
        fontWeight: '700',
    },
    multiplier: {
        marginTop: -2,
    },
    miniContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    miniEmoji: {
        fontSize: 14,
    },
});

export default StreakBadge;
