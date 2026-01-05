/**
 * KWIZ Design System - Colors
 * Warm Chocolate Theme with cozy, premium aesthetics
 * Updated with custom color palette
 */

// Core color palette
export const palette = {
  // Primary Browns - Updated
  brown: {
    900: '#3D2A1E', // Darkest
    800: '#4f3426', // Icon background
    700: '#644433', // Primary Background
    600: '#70513e', // Third/Tertiary
    500: '#755748', // Icons
    400: '#9b6f53', // Secondary
    300: '#94705f', // Normal text
    200: '#cb9963', // Notification numbers
    100: '#cd9861', // Status dots
    50: '#fff2e8',  // Highlighted text
  },

  // Semantic mappings
  primary: '#644433',
  secondary: '#9b6f53',
  tertiary: '#70513e',
  statusDots: '#cd9861',
  notification: '#cb9963',
  icons: '#755748',
  iconBackground: '#4f3426',
  highlightedText: '#fff2e8',
  normalText: '#94705f',

  // Cream & Beige
  cream: {
    light: '#fff8f0',
    default: '#fff2e8',
    dark: '#e8d4c4',
  },

  // Accent Colors
  orange: {
    light: '#cd9861',
    default: '#cb9963',
    dark: '#b88545',
  },

  gold: {
    light: '#e8c69a',
    default: '#cd9861',
    dark: '#b88a58',
  },

  // Semantic Colors
  success: {
    light: '#a8d4a8',
    default: '#7cb97c',
    dark: '#5a9a5a',
  },

  error: {
    light: '#e8a8a8',
    default: '#cc6b6b',
    dark: '#a84848',
  },

  // Neutrals
  white: '#FFFFFF',
  black: '#1a1614',
  transparent: 'transparent',
} as const;

// Semantic color mappings for light mode (primary theme)
export const colors = {
  // Backgrounds
  background: {
    primary: palette.primary,       // #644433
    secondary: palette.secondary,   // #9b6f53
    tertiary: palette.tertiary,     // #70513e
    surface: palette.tertiary,      // #70513e
    elevated: palette.secondary,    // #9b6f53
    card: 'rgba(100, 68, 51, 0.85)', // Primary with transparency
    glass: 'rgba(100, 68, 51, 0.7)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    iconBackground: palette.iconBackground, // #4f3426
  },

  // Text
  text: {
    primary: palette.highlightedText,   // #fff2e8
    secondary: palette.normalText,      // #94705f
    muted: palette.brown[300],          // #94705f
    inverse: palette.brown[800],        // #4f3426
    accent: palette.orange.default,     // #cb9963
    success: palette.success.default,
    error: palette.error.default,
    white: palette.white,
    highlighted: palette.highlightedText, // #fff2e8
    normal: palette.normalText,           // #94705f
  },

  // Borders
  border: {
    default: 'rgba(255, 242, 232, 0.15)',
    light: 'rgba(255, 242, 232, 0.25)',
    strong: 'rgba(255, 242, 232, 0.4)',
    accent: palette.orange.default,
    focus: palette.gold.default,
  },

  // Interactive Elements
  interactive: {
    primary: palette.statusDots,      // #cd9861
    primaryHover: palette.orange.dark,
    secondary: palette.notification,   // #cb9963
    secondaryHover: palette.gold.dark,
    disabled: palette.brown[400],
    disabledText: palette.brown[300],
  },

  // Status Colors
  status: {
    success: palette.success.default,
    successBackground: 'rgba(124, 185, 124, 0.2)',
    error: palette.error.default,
    errorBackground: 'rgba(204, 107, 107, 0.2)',
    warning: palette.orange.default,
    warningBackground: 'rgba(203, 153, 99, 0.2)',
    info: palette.gold.default,
    infoBackground: 'rgba(205, 152, 97, 0.2)',
  },

  // Icons
  icon: {
    default: palette.icons,            // #755748
    background: palette.iconBackground, // #4f3426
    active: palette.statusDots,        // #cd9861
    muted: palette.normalText,         // #94705f
  },

  // Quiz-specific
  quiz: {
    option: {
      default: palette.tertiary,      // #70513e
      hover: palette.secondary,       // #9b6f53
      selected: palette.statusDots,   // #cd9861
      correct: palette.success.default,
      wrong: palette.error.default,
      disabled: palette.brown[400],
    },
    timer: {
      safe: palette.highlightedText,  // #fff2e8
      warning: palette.statusDots,    // #cd9861
      danger: palette.error.default,
    },
    progress: {
      track: palette.tertiary,        // #70513e
      fill: palette.statusDots,       // #cd9861
      xp: palette.notification,       // #cb9963
    },
    streak: {
      fire: '#ff6b35',
      glow: 'rgba(255, 107, 53, 0.4)',
    },
  },

  // Gamification
  gamification: {
    xp: palette.notification,          // #cb9963
    level: palette.statusDots,         // #cd9861
    badge: {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2',
    },
    streak: {
      1: palette.orange.light,
      2: palette.orange.default,
      3: palette.orange.dark,
      4: '#ff6b35',
      5: '#ff4500',
    },
  },

  // Gradients (as arrays for LinearGradient)
  gradients: {
    primary: [palette.primary, palette.brown[800]],
    card: ['rgba(155, 111, 83, 0.9)', 'rgba(100, 68, 51, 0.9)'],
    button: [palette.statusDots, palette.orange.dark],
    gold: [palette.gold.light, palette.gold.default],
    success: [palette.success.light, palette.success.default],
    error: [palette.error.light, palette.error.default],
    overlay: ['transparent', 'rgba(0, 0, 0, 0.8)'],
  },
} as const;

// Dark mode overrides (optional - main theme is already dark-ish)
export const colorsDark = {
  ...colors,
  background: {
    ...colors.background,
    primary: palette.brown[800],
    secondary: palette.primary,
  },
} as const;

export default colors;
