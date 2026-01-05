/**
 * KWIZ UI Component - Timer
 * Circular countdown timer with warning states
 */

import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors, durations, layout, spacing } from '../../constants';
import { Text } from './Text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerProps {
    seconds: number;
    totalSeconds: number;
    size?: number;
    strokeWidth?: number;
    onTimeUp?: () => void;
    warningThreshold?: number;
    dangerThreshold?: number;
    style?: ViewStyle;
}

export function Timer({
    seconds,
    totalSeconds,
    size = layout.timerSize,
    strokeWidth = 6,
    onTimeUp,
    warningThreshold = 10,
    dangerThreshold = 5,
    style,
}: TimerProps) {
    const progress = useSharedValue(1);
    const pulseScale = useSharedValue(1);
    const previousSeconds = useSharedValue(seconds);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Determine state
    const isWarning = seconds <= warningThreshold && seconds > dangerThreshold;
    const isDanger = seconds <= dangerThreshold;

    useEffect(() => {
        // Update progress
        progress.value = withTiming(seconds / totalSeconds, {
            duration: durations.timer,
            easing: Easing.linear,
        });

        // Pulse animation when in danger zone
        if (isDanger && seconds > 0) {
            pulseScale.value = withSequence(
                withTiming(1.1, { duration: 200 }),
                withTiming(1, { duration: 200 })
            );
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // Called when time is up
        if (seconds === 0 && onTimeUp) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        previousSeconds.value = seconds;
    }, [seconds, totalSeconds, isDanger]);

    const animatedCircleProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseScale.value }],
        };
    });

    const getTimerColor = () => {
        if (isDanger) return colors.quiz.timer.danger;
        if (isWarning) return colors.quiz.timer.warning;
        return colors.quiz.timer.safe;
    };

    const formatTime = (s: number) => {
        if (s < 0) return '0';
        return s.toString();
    };

    return (
        <Animated.View style={[styles.container, animatedContainerStyle, style]}>
            <Svg width={size} height={size}>
                {/* Background circle */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colors.background.tertiary}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress circle */}
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={getTimerColor()}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animatedProps={animatedCircleProps}
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </Svg>
            <View style={styles.textContainer}>
                <Text
                    variant="timerText"
                    style={[
                        styles.timerText,
                        { color: getTimerColor() },
                        isDanger && styles.timerTextDanger,
                    ]}
                >
                    {formatTime(seconds)}
                </Text>
            </View>
        </Animated.View>
    );
}

// Compact inline timer for header
interface CompactTimerProps {
    seconds: number;
    totalSeconds: number;
    style?: ViewStyle;
}

export function CompactTimer({ seconds, totalSeconds, style }: CompactTimerProps) {
    const isWarning = seconds <= 10 && seconds > 5;
    const isDanger = seconds <= 5;

    const getColor = () => {
        if (isDanger) return colors.quiz.timer.danger;
        if (isWarning) return colors.quiz.timer.warning;
        return colors.quiz.timer.safe;
    };

    return (
        <View style={[styles.compactContainer, style]}>
            <View style={[styles.compactDot, { backgroundColor: getColor() }]} />
            <Text
                variant="labelMedium"
                style={{ color: getColor() }}
            >
                {seconds}s
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        textAlign: 'center',
    },
    timerTextDanger: {
        textShadowColor: 'rgba(204, 107, 107, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    compactDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});

export default Timer;
