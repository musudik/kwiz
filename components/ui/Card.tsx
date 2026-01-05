/**
 * KWIZ UI Component - Card
 * Glassmorphic card with optional gradient and blur effects
 */

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { borderRadius, colors, shadows, spacing } from '../../constants';

export type CardVariant = 'default' | 'elevated' | 'glass' | 'gradient' | 'outlined';

interface CardProps extends ViewProps {
    variant?: CardVariant;
    padding?: keyof typeof spacing | number;
    borderRadiusSize?: keyof typeof borderRadius;
    children: React.ReactNode;
    style?: ViewStyle;
    animated?: boolean;
    pressable?: boolean;
    onPress?: () => void;
}

export function Card({
    variant = 'default',
    padding = 'xl',
    borderRadiusSize = '2xl',
    children,
    style,
    animated = false,
    pressable = false,
    onPress,
    ...props
}: CardProps) {
    const pressed = useSharedValue(0);

    const handlePressIn = () => {
        if (pressable) {
            pressed.value = withSpring(1, { damping: 15, stiffness: 400 });
        }
    };

    const handlePressOut = () => {
        if (pressable) {
            pressed.value = withSpring(0, { damping: 15, stiffness: 400 });
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        if (!pressable && !animated) return {};

        const scale = interpolate(
            pressed.value,
            [0, 1],
            [1, 0.98],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ scale }],
        };
    });

    const paddingValue = typeof padding === 'number' ? padding : spacing[padding as keyof typeof spacing];
    const radius = borderRadius[borderRadiusSize];

    const variantStyles = cardVariants[variant];

    const containerStyle: ViewStyle = {
        padding: paddingValue,
        borderRadius: radius,
        ...variantStyles.container,
        ...style,
    };

    const content = (
        <Animated.View
            style={[containerStyle, animated || pressable ? animatedStyle : undefined]}
            onTouchStart={pressable ? handlePressIn : undefined}
            onTouchEnd={pressable ? handlePressOut : undefined}
            onTouchCancel={pressable ? handlePressOut : undefined}
            {...props}
        >
            {variant === 'glass' && (
                <BlurView
                    intensity={20}
                    tint="dark"
                    style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
                />
            )}
            {variant === 'gradient' && (
                <LinearGradient
                    colors={colors.gradients.card as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
                />
            )}
            <View style={styles.content}>{children}</View>
        </Animated.View>
    );

    return content;
}

const cardVariants: Record<CardVariant, { container: ViewStyle }> = {
    default: {
        container: {
            backgroundColor: colors.background.card,
            ...shadows.card,
        },
    },
    elevated: {
        container: {
            backgroundColor: colors.background.elevated,
            ...shadows.xl,
        },
    },
    glass: {
        container: {
            backgroundColor: 'rgba(100, 68, 51, 0.5)',
            borderWidth: 1,
            borderColor: colors.border.light,
            overflow: 'hidden',
        },
    },
    gradient: {
        container: {
            overflow: 'hidden',
            ...shadows.lg,
        },
    },
    outlined: {
        container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.border.default,
        },
    },
};

const styles = StyleSheet.create({
    content: {
        position: 'relative',
        zIndex: 1,
    },
});

export default Card;
