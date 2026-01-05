/**
 * KWIZ Design System - Animations
 * Consistent animation durations, easing curves, and configuration
 */

import { Easing } from 'react-native-reanimated';

// Animation durations (in milliseconds)
export const durations = {
    instant: 0,
    fastest: 100,
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
    slowest: 800,

    // Specific animations
    buttonPress: 100,
    screenTransition: 300,
    modalOpen: 350,
    modalClose: 250,
    fadeIn: 200,
    fadeOut: 150,
    slideIn: 300,
    slideOut: 250,
    bounce: 400,
    shake: 400,
    pulse: 500,
    confetti: 2000,
    scoreCount: 600,
    levelUp: 1200,
    streak: 1000,
    timer: 1000,
    timerWarning: 200,
} as const;

// Easing functions
export const easings = {
    // Standard easings
    linear: Easing.linear,
    ease: Easing.ease,
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),

    // Cubic easings
    cubicIn: Easing.in(Easing.cubic),
    cubicOut: Easing.out(Easing.cubic),
    cubicInOut: Easing.inOut(Easing.cubic),

    // Bounce & Spring
    bounce: Easing.bounce,
    elastic: Easing.elastic(1.5),
    back: Easing.back(1.5),

    // Custom easings for specific animations
    buttonPress: Easing.out(Easing.cubic),
    screenEase: Easing.inOut(Easing.cubic),
    modalEase: Easing.out(Easing.cubic),
    bounceIn: Easing.out(Easing.back(1.7)),
    smooth: Easing.bezier(0.4, 0, 0.2, 1),
} as const;

// Spring configurations for React Native Reanimated
export const springConfigs = {
    // Gentle spring
    gentle: {
        damping: 20,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },

    // Snappy spring
    snappy: {
        damping: 15,
        mass: 1,
        stiffness: 200,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
    },

    // Bouncy spring
    bouncy: {
        damping: 10,
        mass: 1,
        stiffness: 180,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },

    // Stiff spring (quick, less bounce)
    stiff: {
        damping: 20,
        mass: 0.8,
        stiffness: 300,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
    },

    // For button presses
    button: {
        damping: 12,
        mass: 0.5,
        stiffness: 400,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
    },

    // For card flips/transitions
    card: {
        damping: 18,
        mass: 1,
        stiffness: 150,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },

    // For score counting
    score: {
        damping: 25,
        mass: 1,
        stiffness: 120,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
} as const;

// Timing configurations
export const timingConfigs = {
    fadeIn: {
        duration: durations.fadeIn,
        easing: easings.easeOut,
    },
    fadeOut: {
        duration: durations.fadeOut,
        easing: easings.easeIn,
    },
    slideIn: {
        duration: durations.slideIn,
        easing: easings.screenEase,
    },
    slideOut: {
        duration: durations.slideOut,
        easing: easings.screenEase,
    },
    pulse: {
        duration: durations.pulse,
        easing: easings.easeInOut,
    },
} as const;

// Predefined animation values
export const animationValues = {
    // Scale
    scalePressed: 0.95,
    scaleHover: 1.03,
    scalePop: 1.1,
    scaleBounce: 1.2,

    // Opacity
    opacityDisabled: 0.5,
    opacityHover: 0.8,
    opacityPressed: 0.7,

    // Rotation (degrees)
    rotateShake: 3,
    rotateFlip: 180,

    // Translation
    slideDistance: 20,
    bounceHeight: 10,
} as const;

// Haptic feedback types (for expo-haptics)
export const haptics = {
    light: 'light',
    medium: 'medium',
    heavy: 'heavy',
    selection: 'selection',
    success: 'success',
    warning: 'warning',
    error: 'error',
} as const;

export default {
    durations,
    easings,
    springConfigs,
    timingConfigs,
    animationValues,
    haptics,
};
