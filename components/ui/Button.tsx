/**
 * KWIZ UI Component - Button
 * Animated button with multiple variants and haptic feedback
 */

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { colors, layout, shadows, spacing, springConfigs } from '../../constants';
import { Text } from './Text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    hapticFeedback?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    children,
    variant = 'primary',
    size = 'medium',
    onPress,
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    hapticFeedback = true,
    style,
    textStyle,
}: ButtonProps) {
    const pressed = useSharedValue(0);

    const handlePressIn = useCallback(() => {
        pressed.value = withSpring(1, springConfigs.button);
        if (hapticFeedback && !disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [disabled, hapticFeedback]);

    const handlePressOut = useCallback(() => {
        pressed.value = withSpring(0, springConfigs.button);
    }, []);

    const handlePress = useCallback(() => {
        if (!disabled && !loading && onPress) {
            onPress();
        }
    }, [disabled, loading, onPress]);

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            pressed.value,
            [0, 1],
            [1, 0.96],
            Extrapolate.CLAMP
        );
        const opacity = interpolate(
            pressed.value,
            [0, 1],
            [1, 0.9],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ scale }],
            opacity,
        };
    });

    const sizeStyles = buttonSizes[size];
    const variantStyles = buttonVariants[variant];
    const isDisabled = disabled || loading;

    const content = (
        <>
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variantStyles.textColor}
                    style={styles.loader}
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <Animated.View style={styles.iconLeft}>{icon}</Animated.View>
                    )}
                    <Text
                        variant={sizeStyles.textVariant as any}
                        style={[
                            { color: isDisabled ? colors.interactive.disabledText : variantStyles.textColor },
                            textStyle,
                        ]}
                    >
                        {children}
                    </Text>
                    {icon && iconPosition === 'right' && (
                        <Animated.View style={styles.iconRight}>{icon}</Animated.View>
                    )}
                </>
            )}
        </>
    );

    const buttonContent = (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={isDisabled}
            style={[
                animatedStyle,
                styles.base,
                sizeStyles.container,
                variantStyles.container,
                isDisabled && styles.disabled,
                fullWidth && styles.fullWidth,
                style,
            ]}
        >
            {(variant === 'primary' || variant === 'secondary' || variant === 'success' || variant === 'error') ? (
                <LinearGradient
                    colors={isDisabled ? [colors.interactive.disabled, colors.interactive.disabled] : variantStyles.gradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: layout.buttonBorderRadius }]}
                />
            ) : null}
            <Animated.View style={styles.content}>{content}</Animated.View>
        </AnimatedPressable>
    );

    return buttonContent;
}

const buttonSizes: Record<ButtonSize, { container: ViewStyle; textVariant: string }> = {
    small: {
        container: {
            height: layout.buttonHeightSmall,
            paddingHorizontal: spacing.lg,
        },
        textVariant: 'buttonSmall',
    },
    medium: {
        container: {
            height: layout.buttonHeightMedium,
            paddingHorizontal: spacing.xl,
        },
        textVariant: 'buttonMedium',
    },
    large: {
        container: {
            height: layout.buttonHeightLarge,
            paddingHorizontal: spacing['2xl'],
        },
        textVariant: 'buttonLarge',
    },
};

const buttonVariants: Record<ButtonVariant, { container: ViewStyle; textColor: string; gradient?: readonly string[] }> = {
    primary: {
        container: {
            ...shadows.button,
        },
        textColor: colors.text.white,
        gradient: colors.gradients.button,
    },
    secondary: {
        container: {
            ...shadows.md,
        },
        textColor: colors.text.inverse,
        gradient: colors.gradients.gold,
    },
    outline: {
        container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.border.strong,
        },
        textColor: colors.text.primary,
    },
    ghost: {
        container: {
            backgroundColor: 'transparent',
        },
        textColor: colors.text.primary,
    },
    success: {
        container: {
            ...shadows.md,
        },
        textColor: colors.text.white,
        gradient: colors.gradients.success,
    },
    error: {
        container: {
            ...shadows.md,
        },
        textColor: colors.text.white,
        gradient: colors.gradients.error,
    },
};

const styles = StyleSheet.create({
    base: {
        borderRadius: layout.buttonBorderRadius,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.6,
    },
    fullWidth: {
        width: '100%',
    },
    loader: {
        marginRight: spacing.sm,
    },
    iconLeft: {
        marginRight: spacing.sm,
    },
    iconRight: {
        marginLeft: spacing.sm,
    },
});

export default Button;
