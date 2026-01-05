/**
 * KWIZ UI Component - Avatar
 * Cute mascot avatar selector and display
 */

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { borderRadius, colors, layout, shadows, spacing, springConfigs } from '../../constants';
import { Text } from './Text';

// Avatar mascot data - colors represent the mascot type
export const MASCOTS = [
    { id: 1, name: 'Kwizzy', color: '#5BC0EB', emoji: '🐱' }, // Blue cat
    { id: 2, name: 'Professor', color: '#8B4513', emoji: '🦉' }, // Brown owl
    { id: 3, name: 'Sparky', color: '#FF6B35', emoji: '🦊' }, // Orange fox
    { id: 4, name: 'Bruno', color: '#A0522D', emoji: '🐻' }, // Brown bear
    { id: 5, name: 'Zippy', color: '#9B59B6', emoji: '🐰' }, // Purple bunny
    { id: 6, name: 'Flash', color: '#27AE60', emoji: '🐸' }, // Green frog
    { id: 7, name: 'Blaze', color: '#E74C3C', emoji: '🐉' }, // Red dragon
    { id: 8, name: 'Star', color: '#F1C40F', emoji: '⭐' }, // Gold star
] as const;

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
    mascotId: number;
    size?: AvatarSize;
    showName?: boolean;
    selected?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    showBorder?: boolean;
}

export function Avatar({
    mascotId,
    size = 'medium',
    showName = false,
    selected = false,
    onPress,
    style,
    showBorder = false,
}: AvatarProps) {
    const mascot = MASCOTS.find(m => m.id === mascotId) || MASCOTS[0];
    const pressed = useSharedValue(0);

    const handlePressIn = () => {
        if (onPress) {
            pressed.value = withSpring(1, springConfigs.button);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handlePressOut = () => {
        if (onPress) {
            pressed.value = withSpring(0, springConfigs.button);
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            pressed.value,
            [0, 1],
            [1, 0.92],
            Extrapolate.CLAMP
        );
        return { transform: [{ scale }] };
    });

    const sizeStyles = avatarSizes[size];

    const avatarContent = (
        <Animated.View
            style={[
                styles.container,
                sizeStyles.container,
                selected && styles.selected,
                showBorder && styles.bordered,
                style,
                onPress ? animatedStyle : undefined,
            ]}
        >
            <View
                style={[
                    styles.avatarCircle,
                    sizeStyles.circle,
                    { backgroundColor: mascot.color },
                ]}
            >
                <Text
                    style={[styles.emoji, { fontSize: sizeStyles.emojiSize }]}
                >
                    {mascot.emoji}
                </Text>
            </View>
            {selected && (
                <View style={styles.selectionRing}>
                    <LinearGradient
                        colors={colors.gradients.button as [string, string]}
                        style={styles.ringGradient}
                    />
                </View>
            )}
        </Animated.View>
    );

    if (onPress) {
        return (
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
            >
                {avatarContent}
                {showName && (
                    <Text
                        variant="labelSmall"
                        color={selected ? 'accent' : 'secondary'}
                        align="center"
                        style={styles.name}
                    >
                        {mascot.name}
                    </Text>
                )}
            </Pressable>
        );
    }

    return (
        <View>
            {avatarContent}
            {showName && (
                <Text
                    variant="labelSmall"
                    color="secondary"
                    align="center"
                    style={styles.name}
                >
                    {mascot.name}
                </Text>
            )}
        </View>
    );
}

// Avatar Selector Grid
interface AvatarSelectorProps {
    selectedId: number;
    onSelect: (id: number) => void;
    style?: ViewStyle;
}

export function AvatarSelector({ selectedId, onSelect, style }: AvatarSelectorProps) {
    return (
        <View style={[styles.selectorGrid, style]}>
            {MASCOTS.map((mascot) => (
                <Avatar
                    key={mascot.id}
                    mascotId={mascot.id}
                    size="large"
                    showName
                    selected={selectedId === mascot.id}
                    onPress={() => onSelect(mascot.id)}
                />
            ))}
        </View>
    );
}

const avatarSizes: Record<AvatarSize, { container: ViewStyle; circle: ViewStyle; emojiSize: number }> = {
    small: {
        container: { width: layout.avatarSmall, height: layout.avatarSmall },
        circle: { width: layout.avatarSmall, height: layout.avatarSmall, borderRadius: layout.avatarSmall / 2 },
        emojiSize: 16,
    },
    medium: {
        container: { width: layout.avatarMedium, height: layout.avatarMedium },
        circle: { width: layout.avatarMedium, height: layout.avatarMedium, borderRadius: layout.avatarMedium / 2 },
        emojiSize: 24,
    },
    large: {
        container: { width: layout.avatarLarge, height: layout.avatarLarge },
        circle: { width: layout.avatarLarge, height: layout.avatarLarge, borderRadius: layout.avatarLarge / 2 },
        emojiSize: 32,
    },
    xlarge: {
        container: { width: layout.avatarXLarge, height: layout.avatarXLarge },
        circle: { width: layout.avatarXLarge, height: layout.avatarXLarge, borderRadius: layout.avatarXLarge / 2 },
        emojiSize: 48,
    },
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    emoji: {
        textAlign: 'center',
    },
    selected: {
        transform: [{ scale: 1.05 }],
    },
    bordered: {
        borderWidth: 2,
        borderColor: colors.border.light,
        borderRadius: borderRadius.full,
        padding: 2,
    },
    selectionRing: {
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: borderRadius.full,
        borderWidth: 3,
        borderColor: colors.interactive.primary,
    },
    ringGradient: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: borderRadius.full,
    },
    name: {
        marginTop: spacing.xs,
    },
    selectorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.lg,
        padding: spacing.md,
    },
});

export default Avatar;
