/**
 * KWIZ Component - Mascot
 * Animated mascot using Lottie animations
 */

import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { shadows, spacing, springConfigs } from '../constants';
import { Text } from './ui';

// Mascot types
export type MascotType = 'kwizzy' | 'professor' | 'sparky' | 'bruno';

// Animation states
export type MascotAnimation =
    | 'idle'
    | 'wave'
    | 'celebrate'
    | 'thinking'
    | 'excited'
    | 'sad'
    | 'sleep';

// Mascot data
interface MascotData {
    name: string;
    color: string;
    emoji: string;
    description: string;
}

export const MASCOTS: Record<MascotType, MascotData> = {
    kwizzy: {
        name: 'Kwizzy',
        color: '#5BC0EB',
        emoji: '🐱',
        description: 'The curious cat who loves quizzes!',
    },
    professor: {
        name: 'Professor',
        color: '#8B4513',
        emoji: '🦉',
        description: 'The wise owl who knows everything.',
    },
    sparky: {
        name: 'Sparky',
        color: '#FF6B35',
        emoji: '🦊',
        description: 'The speedy fox, master of quick answers!',
    },
    bruno: {
        name: 'Bruno',
        color: '#A0522D',
        emoji: '🐻',
        description: 'The friendly bear, great team player!',
    },
};

interface MascotProps {
    type?: MascotType;
    animation?: MascotAnimation;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    showName?: boolean;
    interactive?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    autoPlay?: boolean;
    loop?: boolean;
}

export function Mascot({
    type = 'kwizzy',
    animation = 'idle',
    size = 'medium',
    showName = false,
    interactive = false,
    onPress,
    style,
    autoPlay = true,
    loop = true,
}: MascotProps) {
    const lottieRef = useRef<LottieView>(null);
    const mascotData = MASCOTS[type];
    const sizeValue = mascotSizes[size];

    // Floating animation
    const floatAnim = useSharedValue(0);
    const scaleAnim = useSharedValue(1);

    useEffect(() => {
        // Continuous floating animation
        floatAnim.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const handlePress = useCallback(() => {
        if (interactive) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            scaleAnim.value = withSequence(
                withSpring(1.1, springConfigs.bouncy),
                withSpring(1, springConfigs.gentle)
            );

            // Play celebration animation on tap
            if (lottieRef.current) {
                lottieRef.current.play();
            }

            onPress?.();
        }
    }, [interactive, onPress]);

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: floatAnim.value * -8 },
                { scale: scaleAnim.value },
            ],
        };
    });

    // For now, we use emoji as placeholder
    // In production, replace with actual Lottie animations
    const renderPlaceholderMascot = () => (
        <View
            style={[
                styles.placeholderMascot,
                {
                    width: sizeValue,
                    height: sizeValue,
                    borderRadius: sizeValue / 2,
                    backgroundColor: mascotData.color,
                },
            ]}
        >
            <Text style={[styles.emoji, { fontSize: sizeValue * 0.5 }]}>
                {mascotData.emoji}
            </Text>
        </View>
    );

    // Uncomment when Lottie animations are available
    // const renderLottieMascot = () => {
    //   const animationSource = getAnimationSource(type, animation);
    //   if (!animationSource) return renderPlaceholderMascot();
    //   
    //   return (
    //     <LottieView
    //       ref={lottieRef}
    //       source={animationSource}
    //       autoPlay={autoPlay}
    //       loop={loop}
    //       style={{ width: sizeValue, height: sizeValue }}
    //     />
    //   );
    // };

    return (
        <Pressable onPress={handlePress} disabled={!interactive}>
            <Animated.View style={[styles.container, containerStyle, style]}>
                {/* Shadow */}
                <View
                    style={[
                        styles.shadow,
                        {
                            width: sizeValue * 0.6,
                            height: sizeValue * 0.15,
                            bottom: -sizeValue * 0.1,
                        },
                    ]}
                />

                {/* Mascot */}
                {renderPlaceholderMascot()}

                {/* Name */}
                {showName && (
                    <Text
                        variant="h4"
                        color="primary"
                        align="center"
                        style={styles.name}
                    >
                        {mascotData.name}
                    </Text>
                )}
            </Animated.View>
        </Pressable>
    );
}

// Animated Mascot with expression changes
interface AnimatedMascotProps extends MascotProps {
    expression?: 'happy' | 'sad' | 'surprised' | 'neutral';
}

export function AnimatedMascot({
    expression = 'neutral',
    ...props
}: AnimatedMascotProps) {
    // Map expressions to animations
    const expressionToAnimation: Record<string, MascotAnimation> = {
        happy: 'celebrate',
        sad: 'sad',
        surprised: 'excited',
        neutral: 'idle',
    };

    return (
        <Mascot
            {...props}
            animation={expressionToAnimation[expression]}
        />
    );
}

// Celebration Effect Component
interface CelebrationMascotProps {
    type?: MascotType;
    visible: boolean;
    onComplete?: () => void;
}

export function CelebrationMascot({
    type = 'kwizzy',
    visible,
    onComplete,
}: CelebrationMascotProps) {
    const scaleAnim = useSharedValue(0);
    const rotateAnim = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scaleAnim.value = withSequence(
                withSpring(1.2, springConfigs.bouncy),
                withSpring(1, springConfigs.gentle)
            );
            rotateAnim.value = withSequence(
                withTiming(-10, { duration: 100 }),
                withTiming(10, { duration: 100 }),
                withTiming(-5, { duration: 100 }),
                withTiming(5, { duration: 100 }),
                withTiming(0, { duration: 100 })
            );

            // Call onComplete after animation
            setTimeout(() => onComplete?.(), 1500);
        } else {
            scaleAnim.value = 0;
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scaleAnim.value },
            { rotate: `${rotateAnim.value}deg` },
        ],
        opacity: scaleAnim.value,
    }));

    if (!visible) return null;

    return (
        <Animated.View style={[styles.celebrationContainer, animatedStyle]}>
            <Mascot
                type={type}
                animation="celebrate"
                size="large"
                autoPlay
                loop={false}
            />
        </Animated.View>
    );
}

const mascotSizes = {
    small: 64,
    medium: 120,
    large: 160,
    xlarge: 200,
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderMascot: {
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.xl,
    },
    emoji: {
        textAlign: 'center',
    },
    shadow: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 100,
        transform: [{ scaleX: 1.5 }],
    },
    name: {
        marginTop: spacing.md,
    },
    celebrationContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Mascot;
