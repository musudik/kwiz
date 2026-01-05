/**
 * KWIZ Assets - Lottie Animation Configuration
 * Defines all mascot animations and their sources
 */

import type { MascotAnimation, MascotType } from '../components/Mascot';

// Animation sources would be Lottie JSON files
// For production, download from LottieFiles.com and add to assets/animations/

// Recommended free animations from LottieFiles:
// Cat mascot: https://lottiefiles.com/animations/cute-cat-waving
// Owl professor: https://lottiefiles.com/animations/owl-reading
// Fox: https://lottiefiles.com/animations/cute-fox
// Bear: https://lottiefiles.com/animations/teddy-bear

export interface AnimationConfig {
    source: any; // Lottie JSON source
    duration: number; // Animation duration in ms
    loop: boolean;
}

type AnimationMap = {
    [key in MascotType]?: {
        [animation in MascotAnimation]?: AnimationConfig;
    };
};

// Animation file mappings (uncomment and add actual files when available)
export const animationSources: AnimationMap = {
    kwizzy: {
        // idle: {
        //   source: require('../assets/animations/kwizzy_idle.json'),
        //   duration: 3000,
        //   loop: true,
        // },
        // wave: {
        //   source: require('../assets/animations/kwizzy_wave.json'),
        //   duration: 2000,
        //   loop: false,
        // },
        // celebrate: {
        //   source: require('../assets/animations/kwizzy_celebrate.json'),
        //   duration: 2500,
        //   loop: false,
        // },
        // thinking: {
        //   source: require('../assets/animations/kwizzy_thinking.json'),
        //   duration: 2000,
        //   loop: true,
        // },
        // excited: {
        //   source: require('../assets/animations/kwizzy_excited.json'),
        //   duration: 1500,
        //   loop: false,
        // },
        // sad: {
        //   source: require('../assets/animations/kwizzy_sad.json'),
        //   duration: 2000,
        //   loop: true,
        // },
    },
    professor: {
        // Add professor owl animations
    },
    sparky: {
        // Add fox animations
    },
    bruno: {
        // Add bear animations
    },
};

// Get animation for a mascot
export function getAnimationSource(
    mascotType: MascotType,
    animation: MascotAnimation
): AnimationConfig | null {
    const mascotAnimations = animationSources[mascotType];
    if (!mascotAnimations) return null;

    const config = mascotAnimations[animation];
    return config || null;
}

// Default animation durations when no specific config
export const defaultAnimationDurations: Record<MascotAnimation, number> = {
    idle: 3000,
    wave: 2000,
    celebrate: 2500,
    thinking: 2000,
    excited: 1500,
    sad: 2000,
    sleep: 4000,
};

// Instructions for adding Lottie animations:
/*
1. Visit LottieFiles.com and search for cute animal animations
2. Download as JSON (not dotLottie)
3. Save to assets/animations/ folder with naming convention:
   - [mascot]_[animation].json (e.g., kwizzy_idle.json)
4. Uncomment the relevant lines in animationSources above
5. Update the Mascot component to use these sources

Recommended animations to download:
- Cat idle animation (for Kwizzy)
- Cat waving/greeting
- Cat celebrating/jumping
- Cat thinking/confused
- Owl reading (for Professor)
- Fox running (for Sparky)
- Bear hugging (for Bruno)
*/

export default animationSources;
