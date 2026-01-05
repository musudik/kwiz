/**
 * KWIZ UI Component - OptionButton
 * Quiz answer option button with animated states
 */

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { colors, layout, shadows, spacing, springConfigs } from '../../constants';
import { Text } from './Text';

export type OptionState = 'default' | 'selected' | 'correct' | 'wrong' | 'disabled' | 'revealed';

interface OptionButtonProps {
    label: string;
    optionKey?: string; // A, B, C, D
    state?: OptionState;
    onPress?: () => void;
    disabled?: boolean;
    style?: ViewStyle;
    index?: number;
}

export function OptionButton({
    label,
    optionKey,
    state = 'default',
    onPress,
    disabled = false,
    style,
    index = 0,
}: OptionButtonProps) {
    const pressed = useSharedValue(0);
    const stateAnim = useSharedValue(0);
    const shakeAnim = useSharedValue(0);
    const revealAnim = useSharedValue(0);

    // Handle state changes with animations
    useEffect(() => {
        if (state === 'correct') {
            stateAnim.value = withSpring(1, springConfigs.bouncy);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (state === 'wrong') {
            stateAnim.value = withSpring(1, springConfigs.stiff);
            shakeAnim.value = withSequence(
                withTiming(1, { duration: 50 }),
                withTiming(-1, { duration: 100 }),
                withTiming(1, { duration: 100 }),
                withTiming(-1, { duration: 100 }),
                withTiming(0, { duration: 50 })
            );
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else if (state === 'selected') {
            stateAnim.value = withSpring(0.5, springConfigs.snappy);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (state === 'revealed') {
            revealAnim.value = withTiming(1, { duration: 300 });
        } else {
            stateAnim.value = withTiming(0, { duration: 200 });
            revealAnim.value = withTiming(0, { duration: 200 });
        }
    }, [state]);

    const handlePressIn = () => {
        if (!disabled && state === 'default') {
            pressed.value = withSpring(1, springConfigs.button);
        }
    };

    const handlePressOut = () => {
        pressed.value = withSpring(0, springConfigs.button);
    };

    const handlePress = () => {
        if (!disabled && onPress) {
            onPress();
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            pressed.value,
            [0, 1],
            [1, 0.97],
            Extrapolate.CLAMP
        );

        const translateX = shakeAnim.value * 8;

        // Correct answer bounce
        const bounceScale = state === 'correct'
            ? interpolate(stateAnim.value, [0, 0.5, 1], [1, 1.05, 1], Extrapolate.CLAMP)
            : 1;

        return {
            transform: [
                { scale: scale * bounceScale },
                { translateX },
            ],
        };
    });

    const stateStyles = optionStates[state];
    const isDisabled = disabled || state === 'disabled' || state === 'revealed';

    return (
        <Animated.View style={[styles.wrapper, animatedStyle, style]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
                disabled={isDisabled}
                style={({ pressed: isPressed }) => [
                    styles.container,
                    stateStyles.container,
                    isDisabled && styles.disabled,
                ]}
            >
                {(state === 'correct' || state === 'wrong') && (
                    <LinearGradient
                        colors={stateStyles.gradient as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[StyleSheet.absoluteFill, { borderRadius: layout.optionBorderRadius }]}
                    />
                )}

                {optionKey && (
                    <Animated.View
                        style={[
                            styles.keyBadge,
                            { backgroundColor: stateStyles.keyBackground },
                        ]}
                    >
                        <Text
                            variant="labelMedium"
                            style={{ color: stateStyles.keyText }}
                        >
                            {optionKey}
                        </Text>
                    </Animated.View>
                )}

                <Text
                    variant="optionText"
                    style={[
                        styles.label,
                        { color: stateStyles.textColor },
                    ]}
                    numberOfLines={2}
                >
                    {label}
                </Text>

                {state === 'correct' && (
                    <Text style={styles.icon}>✓</Text>
                )}
                {state === 'wrong' && (
                    <Text style={styles.icon}>✗</Text>
                )}
            </Pressable>
        </Animated.View>
    );
}

const optionStates: Record<OptionState, {
    container: ViewStyle;
    textColor: string;
    keyBackground: string;
    keyText: string;
    gradient?: string[];
}> = {
    default: {
        container: {
            backgroundColor: colors.quiz.option.default,
            borderWidth: 2,
            borderColor: colors.border.default,
        },
        textColor: colors.text.primary,
        keyBackground: 'rgba(245, 230, 211, 0.1)',
        keyText: colors.text.secondary,
    },
    selected: {
        container: {
            backgroundColor: colors.quiz.option.selected,
            borderWidth: 2,
            borderColor: colors.quiz.option.selected,
            ...shadows.glow,
        },
        textColor: colors.text.white,
        keyBackground: 'rgba(255, 255, 255, 0.2)',
        keyText: colors.text.white,
    },
    correct: {
        container: {
            borderWidth: 2,
            borderColor: colors.quiz.option.correct,
        },
        textColor: colors.text.white,
        keyBackground: 'rgba(255, 255, 255, 0.3)',
        keyText: colors.text.white,
        gradient: colors.gradients.success,
    },
    wrong: {
        container: {
            borderWidth: 2,
            borderColor: colors.quiz.option.wrong,
        },
        textColor: colors.text.white,
        keyBackground: 'rgba(255, 255, 255, 0.3)',
        keyText: colors.text.white,
        gradient: colors.gradients.error,
    },
    disabled: {
        container: {
            backgroundColor: colors.quiz.option.disabled,
            borderWidth: 2,
            borderColor: 'transparent',
            opacity: 0.5,
        },
        textColor: colors.text.muted,
        keyBackground: 'rgba(245, 230, 211, 0.05)',
        keyText: colors.text.muted,
    },
    revealed: {
        container: {
            backgroundColor: 'rgba(124, 185, 124, 0.3)',
            borderWidth: 2,
            borderColor: colors.quiz.option.correct,
        },
        textColor: colors.text.primary,
        keyBackground: 'rgba(124, 185, 124, 0.3)',
        keyText: colors.text.primary,
    },
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: layout.optionHeight,
        borderRadius: layout.optionBorderRadius,
        paddingHorizontal: layout.optionPadding,
        paddingVertical: spacing.md,
        overflow: 'hidden',
    },
    disabled: {
        opacity: 0.6,
    },
    keyBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    label: {
        flex: 1,
    },
    icon: {
        fontSize: 20,
        marginLeft: spacing.sm,
        color: colors.text.white,
    },
});

export default OptionButton;
