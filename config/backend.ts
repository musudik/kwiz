/**
 * KWIZ Configuration - Backend
 * Server URLs and API configuration
 */

// Environment-based configuration
// NOTE: For mobile testing, use your PC's local IP address
// Find it with: ipconfig (Windows) or ifconfig (Mac/Linux)
const LOCAL_IP = '192.168.178.114'; // Your PC's IP address

const ENV = {
    development: {
        // Local development server - use PC's IP for mobile devices
        WS_URL: `ws://${LOCAL_IP}:3001`,
        API_URL: `http://${LOCAL_IP}:3001/api`,
        DEBUG: true,
    },
    staging: {
        // Staging server (replace with your staging URL)
        WS_URL: 'wss://staging-api.kwiz.app',
        API_URL: 'https://staging-api.kwiz.app/api',
        DEBUG: true,
    },
    production: {
        // Production server (replace with your production URL)
        WS_URL: 'wss://api.kwiz.app',
        API_URL: 'https://api.kwiz.app/api',
        DEBUG: false,
    },
};

// Current environment (change this for different builds)
const CURRENT_ENV: keyof typeof ENV = 'development';

export const config = {
    ...ENV[CURRENT_ENV],

    // App configuration
    APP_NAME: 'KWIZ',
    APP_VERSION: '1.0.0',

    // WebSocket settings
    WS_RECONNECT_ATTEMPTS: 5,
    WS_RECONNECT_DELAY: 1000,
    WS_TIMEOUT: 10000,

    // API settings
    API_TIMEOUT: 30000,

    // Quiz settings
    DEFAULT_QUESTION_TIME: 30,
    MAX_QUIZ_CODE_LENGTH: 8,
    MIN_QUIZ_CODE_LENGTH: 4,
    MAX_DISPLAY_NAME_LENGTH: 20,

    // XP settings
    BASE_XP_PER_QUESTION: 100,
    TIME_BONUS_MULTIPLIER: 3,
    STREAK_MULTIPLIERS: {
        3: 1.5,
        5: 2,
        7: 2.5,
        10: 3,
    },
    WIN_BONUS: {
        1: 500, // 1st place
        2: 300, // 2nd place
        3: 150, // 3rd place
    },

    // Level progression
    BASE_XP_FOR_LEVEL: 1000,
    LEVEL_MULTIPLIER: 1.2,
};

// Helper to get the WebSocket URL
export const getWebSocketUrl = (): string => config.WS_URL;

// Helper to get the API URL
export const getApiUrl = (endpoint: string): string => `${config.API_URL}${endpoint}`;

// Helper to check if in debug mode
export const isDebug = (): boolean => config.DEBUG;

export default config;
