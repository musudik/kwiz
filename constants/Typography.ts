/**
 * KWIZ Design System - Typography
 * Premium typography hierarchy for a polished quiz experience
 */

import { Platform, TextStyle } from 'react-native';

// Font families
export const fonts = {
    display: Platform.select({
        ios: 'PlayfairDisplay-Bold',
        android: 'PlayfairDisplay-Bold',
        default: 'PlayfairDisplay-Bold',
    }) as string,
    displayItalic: Platform.select({
        ios: 'PlayfairDisplay-BoldItalic',
        android: 'PlayfairDisplay-BoldItalic',
        default: 'PlayfairDisplay-BoldItalic',
    }) as string,
    heading: Platform.select({
        ios: 'Outfit-SemiBold',
        android: 'Outfit-SemiBold',
        default: 'Outfit-SemiBold',
    }) as string,
    body: Platform.select({
        ios: 'Inter_400Regular',
        android: 'Inter_400Regular',
        default: 'Inter_400Regular',
    }) as string,
    bodyMedium: Platform.select({
        ios: 'Inter_500Medium',
        android: 'Inter_500Medium',
        default: 'Inter_500Medium',
    }) as string,
    bodySemibold: Platform.select({
        ios: 'Inter_600SemiBold',
        android: 'Inter_600SemiBold',
        default: 'Inter_600SemiBold',
    }) as string,
    bodyBold: Platform.select({
        ios: 'Inter_700Bold',
        android: 'Inter_700Bold',
        default: 'Inter_700Bold',
    }) as string,
    mono: Platform.select({
        ios: 'SpaceMono-Regular',
        android: 'SpaceMono-Regular',
        default: 'monospace',
    }) as string,
};

// Font sizes
export const fontSizes = {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
    '7xl': 56,
} as const;

// Line heights
export const lineHeights = {
    none: 1,
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
} as const;

// Letter spacing
export const letterSpacing = {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
} as const;

// Pre-defined text styles
export const textStyles: Record<string, TextStyle> = {
    // Display - Large titles, splash screens
    displayLarge: {
        fontFamily: fonts.display,
        fontSize: fontSizes['6xl'],
        lineHeight: fontSizes['6xl'] * lineHeights.tight,
        letterSpacing: letterSpacing.tight,
        fontWeight: '700',
    },
    displayMedium: {
        fontFamily: fonts.display,
        fontSize: fontSizes['5xl'],
        lineHeight: fontSizes['5xl'] * lineHeights.tight,
        letterSpacing: letterSpacing.tight,
        fontWeight: '700',
    },
    displaySmall: {
        fontFamily: fonts.display,
        fontSize: fontSizes['4xl'],
        lineHeight: fontSizes['4xl'] * lineHeights.tight,
        letterSpacing: letterSpacing.tight,
        fontWeight: '700',
    },

    // Headings
    h1: {
        fontFamily: fonts.heading,
        fontSize: fontSizes['3xl'],
        lineHeight: fontSizes['3xl'] * lineHeights.snug,
        letterSpacing: letterSpacing.tight,
        fontWeight: '600',
    },
    h2: {
        fontFamily: fonts.heading,
        fontSize: fontSizes['2xl'],
        lineHeight: fontSizes['2xl'] * lineHeights.snug,
        letterSpacing: letterSpacing.tight,
        fontWeight: '600',
    },
    h3: {
        fontFamily: fonts.heading,
        fontSize: fontSizes.xl,
        lineHeight: fontSizes.xl * lineHeights.snug,
        letterSpacing: letterSpacing.normal,
        fontWeight: '600',
    },
    h4: {
        fontFamily: fonts.heading,
        fontSize: fontSizes.lg,
        lineHeight: fontSizes.lg * lineHeights.snug,
        letterSpacing: letterSpacing.normal,
        fontWeight: '600',
    },

    // Body text
    bodyLarge: {
        fontFamily: fonts.body,
        fontSize: fontSizes.lg,
        lineHeight: fontSizes.lg * lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
        fontWeight: '400',
    },
    bodyMedium: {
        fontFamily: fonts.body,
        fontSize: fontSizes.md,
        lineHeight: fontSizes.md * lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
        fontWeight: '400',
    },
    bodySmall: {
        fontFamily: fonts.body,
        fontSize: fontSizes.base,
        lineHeight: fontSizes.base * lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
        fontWeight: '400',
    },
    bodyXSmall: {
        fontFamily: fonts.body,
        fontSize: fontSizes.sm,
        lineHeight: fontSizes.sm * lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
        fontWeight: '400',
    },

    // Labels
    labelLarge: {
        fontFamily: fonts.bodyMedium,
        fontSize: fontSizes.md,
        lineHeight: fontSizes.md * lineHeights.normal,
        letterSpacing: letterSpacing.wide,
        fontWeight: '500',
    },
    labelMedium: {
        fontFamily: fonts.bodyMedium,
        fontSize: fontSizes.base,
        lineHeight: fontSizes.base * lineHeights.normal,
        letterSpacing: letterSpacing.wide,
        fontWeight: '500',
    },
    labelSmall: {
        fontFamily: fonts.bodyMedium,
        fontSize: fontSizes.sm,
        lineHeight: fontSizes.sm * lineHeights.normal,
        letterSpacing: letterSpacing.wider,
        fontWeight: '500',
        textTransform: 'uppercase',
    },

    // Quiz-specific
    questionText: {
        fontFamily: fonts.heading,
        fontSize: fontSizes['2xl'],
        lineHeight: fontSizes['2xl'] * lineHeights.normal,
        letterSpacing: letterSpacing.normal,
        fontWeight: '600',
    },
    optionText: {
        fontFamily: fonts.bodyMedium,
        fontSize: fontSizes.lg,
        lineHeight: fontSizes.lg * lineHeights.snug,
        letterSpacing: letterSpacing.normal,
        fontWeight: '500',
    },
    timerText: {
        fontFamily: fonts.mono,
        fontSize: fontSizes['4xl'],
        lineHeight: fontSizes['4xl'] * lineHeights.none,
        letterSpacing: letterSpacing.tight,
        fontWeight: '700',
    },
    scoreText: {
        fontFamily: fonts.mono,
        fontSize: fontSizes['5xl'],
        lineHeight: fontSizes['5xl'] * lineHeights.none,
        letterSpacing: letterSpacing.tight,
        fontWeight: '700',
    },
    levelText: {
        fontFamily: fonts.bodyMedium,
        fontSize: fontSizes.sm,
        lineHeight: fontSizes.sm * lineHeights.normal,
        letterSpacing: letterSpacing.wider,
        fontWeight: '500',
    },

    // Buttons
    buttonLarge: {
        fontFamily: fonts.bodySemibold,
        fontSize: fontSizes.lg,
        lineHeight: fontSizes.lg * lineHeights.snug,
        letterSpacing: letterSpacing.wide,
        fontWeight: '600',
    },
    buttonMedium: {
        fontFamily: fonts.bodySemibold,
        fontSize: fontSizes.md,
        lineHeight: fontSizes.md * lineHeights.snug,
        letterSpacing: letterSpacing.wide,
        fontWeight: '600',
    },
    buttonSmall: {
        fontFamily: fonts.bodySemibold,
        fontSize: fontSizes.base,
        lineHeight: fontSizes.base * lineHeights.snug,
        letterSpacing: letterSpacing.wide,
        fontWeight: '600',
    },
} as const;

export default textStyles;
