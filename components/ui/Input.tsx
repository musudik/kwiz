/**
 * KWIZ UI Component - Input
 * Styled text input with floating label and validation states
 */

import React, { useCallback, useRef, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { colors, durations, layout, spacing, textStyles } from '../../constants';
import { Text } from './Text';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    variant?: 'default' | 'filled' | 'outlined';
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function Input({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    containerStyle,
    variant = 'filled',
    value,
    onFocus,
    onBlur,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const focusAnim = useSharedValue(0);
    const hasValue = !!value && value.length > 0;

    const handleFocus = useCallback((e: any) => {
        setIsFocused(true);
        focusAnim.value = withTiming(1, { duration: durations.fast });
        onFocus?.(e);
    }, [onFocus]);

    const handleBlur = useCallback((e: any) => {
        setIsFocused(false);
        focusAnim.value = withTiming(0, { duration: durations.fast });
        onBlur?.(e);
    }, [onBlur]);

    const animatedLabelStyle = useAnimatedStyle(() => {
        const isActive = isFocused || hasValue;
        const translateY = interpolate(
            focusAnim.value,
            [0, 1],
            [0, -12],
            Extrapolate.CLAMP
        );
        const scale = interpolate(
            focusAnim.value,
            [0, 1],
            [1, 0.85],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { translateY: isActive ? -12 : translateY },
                { scale: isActive ? 0.85 : scale },
            ],
        };
    });

    const animatedBorderStyle = useAnimatedStyle(() => {
        const borderColor = error
            ? colors.status.error
            : interpolateColor(
                focusAnim.value,
                [0, 1],
                [colors.border.default, colors.border.focus]
            );

        return { borderColor };
    });

    const variantStyles = inputVariants[variant];

    return (
        <View style={[styles.container, containerStyle]}>
            <Pressable onPress={() => inputRef.current?.focus()}>
                <Animated.View
                    style={[
                        styles.inputContainer,
                        variantStyles.container,
                        animatedBorderStyle,
                        error && styles.errorBorder,
                    ]}
                >
                    {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                    <View style={styles.inputWrapper}>
                        {label && (
                            <Animated.View
                                style={[
                                    styles.labelContainer,
                                    animatedLabelStyle,
                                    (isFocused || hasValue) && styles.labelFloating,
                                ]}
                            >
                                <Text
                                    variant="labelMedium"
                                    color={error ? 'error' : isFocused ? 'accent' : 'muted'}
                                >
                                    {label}
                                </Text>
                            </Animated.View>
                        )}

                        <AnimatedTextInput
                            ref={inputRef}
                            style={[
                                styles.input,
                                textStyles.bodyMedium,
                                { color: colors.text.primary },
                                label && styles.inputWithLabel,
                            ]}
                            value={value}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholderTextColor={colors.text.muted}
                            selectionColor={colors.interactive.primary}
                            {...props}
                        />
                    </View>

                    {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
                </Animated.View>
            </Pressable>

            {(error || hint) && (
                <View style={styles.helperContainer}>
                    <Text
                        variant="bodyXSmall"
                        color={error ? 'error' : 'muted'}
                    >
                        {error || hint}
                    </Text>
                </View>
            )}
        </View>
    );
}

const inputVariants = {
    default: {
        container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.border.default,
        },
    },
    filled: {
        container: {
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: 'transparent',
        },
    },
    outlined: {
        container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.border.default,
        },
    },
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: layout.inputHeight,
        borderRadius: layout.inputBorderRadius,
        paddingHorizontal: layout.inputPaddingHorizontal,
    },
    inputWrapper: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
    },
    labelContainer: {
        position: 'absolute',
        left: 0,
        top: '50%',
        marginTop: -10,
        backgroundColor: 'transparent',
    },
    labelFloating: {
        backgroundColor: colors.background.surface,
        paddingHorizontal: spacing.xs,
        marginLeft: -spacing.xs,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingTop: spacing.lg,
    },
    inputWithLabel: {
        paddingTop: spacing.xl,
    },
    leftIcon: {
        marginRight: spacing.sm,
    },
    rightIcon: {
        marginLeft: spacing.sm,
    },
    helperContainer: {
        marginTop: spacing.xs,
        marginLeft: spacing.xs,
    },
    errorBorder: {
        borderColor: colors.status.error,
    },
});

export default Input;
