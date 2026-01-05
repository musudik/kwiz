/**
 * KWIZ Design System - Spacing & Layout
 * Consistent spacing scale and layout constants
 */

import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base spacing unit (4px)
const BASE_UNIT = 4;

// Spacing scale
export const spacing = {
    none: 0,
    xs: BASE_UNIT,           // 4px
    sm: BASE_UNIT * 2,       // 8px
    md: BASE_UNIT * 3,       // 12px
    lg: BASE_UNIT * 4,       // 16px
    xl: BASE_UNIT * 5,       // 20px
    '2xl': BASE_UNIT * 6,    // 24px
    '3xl': BASE_UNIT * 8,    // 32px
    '4xl': BASE_UNIT * 10,   // 40px
    '5xl': BASE_UNIT * 12,   // 48px
    '6xl': BASE_UNIT * 16,   // 64px
    '7xl': BASE_UNIT * 20,   // 80px
    '8xl': BASE_UNIT * 24,   // 96px
} as const;

// Border radius
export const borderRadius = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
} as const;

// Shadows
export const shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    },
    '2xl': {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.35,
        shadowRadius: 32,
        elevation: 16,
    },
    // Special shadows
    card: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 32,
        elevation: 8,
    },
    button: {
        shadowColor: '#E88A4C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    glow: {
        shadowColor: '#E88A4C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 8,
    },
    innerGlow: {
        shadowColor: '#E88A4C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 0,
    },
} as const;

// Screen dimensions
export const screen = {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isSmall: SCREEN_WIDTH < 375,
    isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
    isLarge: SCREEN_WIDTH >= 414,
} as const;

// Safe area defaults
export const safeArea = {
    top: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44,
    bottom: Platform.OS === 'ios' ? 34 : 0,
} as const;

// Layout constants
export const layout = {
    // Screen padding
    screenPaddingHorizontal: spacing.lg,
    screenPaddingVertical: spacing['2xl'],

    // Card dimensions
    cardPadding: spacing.xl,
    cardBorderRadius: borderRadius['2xl'],

    // Button dimensions
    buttonHeightSmall: 40,
    buttonHeightMedium: 48,
    buttonHeightLarge: 56,
    buttonBorderRadius: borderRadius.lg,

    // Input dimensions
    inputHeight: 52,
    inputBorderRadius: borderRadius.md,
    inputPaddingHorizontal: spacing.lg,

    // Option button (quiz)
    optionHeight: 64,
    optionBorderRadius: borderRadius.lg,
    optionPadding: spacing.lg,

    // Avatar
    avatarSmall: 32,
    avatarMedium: 48,
    avatarLarge: 64,
    avatarXLarge: 96,

    // Progress bar
    progressBarHeight: 8,
    progressBarRadius: borderRadius.full,

    // Icons
    iconSmall: 16,
    iconMedium: 24,
    iconLarge: 32,
    iconXLarge: 48,

    // Timer
    timerSize: 80,

    // Header
    headerHeight: 56,

    // Tab bar
    tabBarHeight: Platform.OS === 'ios' ? 88 : 64,

    // Modal
    modalBorderRadius: borderRadius['3xl'],
    modalMaxWidth: Math.min(SCREEN_WIDTH - spacing['3xl'] * 2, 400),
} as const;

// Z-index levels
export const zIndex = {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
    toast: 600,
    overlay: 700,
} as const;

export default {
    spacing,
    borderRadius,
    shadows,
    screen,
    safeArea,
    layout,
    zIndex,
};
