/**
 * KWIZ UI Component - ProgressBar
 * Animated progress bar with XP and level indication
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { colors, spacing } from '../../constants';
import { Text } from './Text';

interface ProgressBarProps {
    progress: number; // 0 to 1
    variant?: 'default' | 'xp' | 'timer' | 'quiz';
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
    label?: string;
    animated?: boolean;
    style?: ViewStyle;
}

export function ProgressBar({
    progress,
    variant = 'default',
    size = 'medium',
    showLabel = false,
    label,
    animated = true,
    style,
}: ProgressBarProps) {
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        if (animated) {
            animatedProgress.value = withSpring(progress, {
                damping: 20,
                stiffness: 100,
            });
        } else {
            animatedProgress.value = progress;
        }
    }, [progress, animated]);

    const animatedWidthStyle = useAnimatedStyle(() => {
        return {
            width: `${Math.min(Math.max(animatedProgress.value * 100, 0), 100)}%`,
        };
    });

    const sizeStyles = progressSizes[size];
    const variantColors = progressVariants[variant];

    return (
        <View style={[styles.container, style]}>
            {showLabel && (
                <View style={styles.labelContainer}>
                    <Text variant="labelSmall" color="secondary">
                        {label || `${Math.round(progress * 100)}%`}
                    </Text>
                </View>
            )}
            <View
                style={[
                    styles.track,
                    {
                        height: sizeStyles.height,
                        borderRadius: sizeStyles.height / 2,
                        backgroundColor: variantColors.track,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.fill,
                        animatedWidthStyle,
                        {
                            height: sizeStyles.height,
                            borderRadius: sizeStyles.height / 2,
                        },
                    ]}
                >
                    <LinearGradient
                        colors={variantColors.fill as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[StyleSheet.absoluteFill, { borderRadius: sizeStyles.height / 2 }]}
                    />
                    <View style={[styles.shine, { height: sizeStyles.height / 3 }]} />
                </Animated.View>
            </View>
        </View>
    );
}

// Level Progress Bar with indicator dots
interface LevelProgressBarProps extends Omit<ProgressBarProps, 'progress'> {
    currentStep: number;
    totalSteps: number;
    level?: number;
}

export function LevelProgressBar({
    currentStep,
    totalSteps,
    level = 1,
    style,
    ...props
}: LevelProgressBarProps) {
    const progress = currentStep / totalSteps;

    return (
        <View style={[styles.levelContainer, style]}>
            <View style={styles.levelHeader}>
                <Text variant="labelSmall" color="secondary">
                    LEVEL {level}
                </Text>
                <Text variant="labelSmall" color="accent">
                    {currentStep} of {totalSteps}
                </Text>
            </View>
            <View style={styles.dotsContainer}>
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index < currentStep && styles.dotFilled,
                            index === currentStep - 1 && styles.dotCurrent,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const progressSizes = {
    small: { height: 4 },
    medium: { height: 8 },
    large: { height: 12 },
};

const progressVariants = {
    default: {
        track: colors.quiz.progress.track,
        fill: [colors.interactive.primary, colors.interactive.primaryHover],
    },
    xp: {
        track: 'rgba(212, 165, 116, 0.2)',
        fill: colors.gradients.gold,
    },
    timer: {
        track: colors.quiz.progress.track,
        fill: [colors.quiz.timer.safe, colors.quiz.timer.warning],
    },
    quiz: {
        track: colors.quiz.progress.track,
        fill: colors.gradients.button,
    },
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    labelContainer: {
        marginBottom: spacing.xs,
    },
    track: {
        width: '100%',
        overflow: 'hidden',
        backgroundColor: colors.quiz.progress.track,
    },
    fill: {
        position: 'relative',
        overflow: 'hidden',
    },
    shine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 999,
    },
    levelContainer: {
        width: '100%',
    },
    levelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    dot: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(205, 152, 97, 0.3)',
    },
    dotFilled: {
        backgroundColor: colors.quiz.progress.fill,
    },
    dotCurrent: {
        backgroundColor: colors.quiz.progress.fill,
        shadowColor: colors.quiz.progress.fill,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
});

export default ProgressBar;
