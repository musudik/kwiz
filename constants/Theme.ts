/**
 * KWIZ Design System - Main Theme Export
 * Unified theme object for the entire application
 */

import { animationValues, durations, easings, haptics, springConfigs, timingConfigs } from './Animations';
import colors, { colorsDark, colors as colorsLight, palette } from './Colors';
import { borderRadius, layout, safeArea, screen, shadows, spacing, zIndex } from './Spacing';
import textStyles, { fonts, fontSizes, letterSpacing, lineHeights } from './Typography';

// Theme mode type
export type ThemeMode = 'light' | 'dark';

// Complete theme object
export const theme = {
    // Colors
    colors,
    palette,

    // Typography
    fonts,
    fontSizes,
    lineHeights,
    letterSpacing,
    textStyles,

    // Spacing & Layout
    spacing,
    borderRadius,
    shadows,
    screen,
    safeArea,
    layout,
    zIndex,

    // Animations
    animation: {
        durations,
        easings,
        springConfigs,
        timingConfigs,
        values: animationValues,
        haptics,
    },
} as const;

// Theme type for TypeScript
export type Theme = typeof theme;

// Create themed colors based on mode
export const getThemedColors = (mode: ThemeMode) => {
    return mode === 'dark' ? colorsDark : colorsLight;
};

// Export individual modules
export {
    animationValues, borderRadius, colors,
    colorsDark, durations,
    easings, fonts,
    fontSizes, haptics, layout, letterSpacing, lineHeights, palette, safeArea, screen, shadows, spacing, springConfigs, textStyles, timingConfigs, zIndex
};

export default theme;
