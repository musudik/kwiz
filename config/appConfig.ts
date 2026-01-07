/**
 * KWIZ Config - App Configuration
 * Centralized configuration for app branding and settings
 */

export const APP_CONFIG = {
    // App branding
    appName: 'KWIZ',
    appTagline: 'Quiz together, anywhere!',
    mascotName: 'KWIZ',

    // API configuration
    apiVersion: '1.0.0',
    // Use your local network IP so phone can reach the server
    // Change this to your PC's IP address (found via ipconfig)
    apiBaseUrl: 'http://192.168.178.114:3001',
    wsBaseUrl: 'ws://192.168.178.114:3001',

    // Game settings
    defaultTimeLimit: 30,
    minQuizCode: 4,
    maxQuizCode: 8,

    // Animation durations (ms)
    animationDurations: {
        fade: 300,
        slide: 400,
        reveal: 2500,
    },

    // Social links
    socialLinks: {
        website: 'https://kwiz.app',
        twitter: 'https://twitter.com/kwizapp',
        instagram: 'https://instagram.com/kwizapp',
    },
};

export default APP_CONFIG;
