/**
 * KWIZ Assets - Sound Configuration
 * Defines all sound effects and their sources
 */

import type { SoundType } from '../../services/soundService';

export interface SoundConfig {
    file: any; // Audio file source
    volume: number;
    preload: boolean;
}

// Sound file mappings (uncomment and add actual files when available)
const soundSources: Partial<Record<SoundType, SoundConfig>> = {
    // UI Sounds
    // button_tap: {
    //   file: require('./tap.mp3'),
    //   volume: 0.3,
    //   preload: true,
    // },

    // Quiz Sounds
    // correct_answer: {
    //   file: require('./correct.mp3'),
    //   volume: 0.6,
    //   preload: true,
    // },
    // wrong_answer: {
    //   file: require('./wrong.mp3'),
    //   volume: 0.5,
    //   preload: true,
    // },

    // Timer Sounds
    // timer_tick: {
    //   file: require('./tick.mp3'),
    //   volume: 0.2,
    //   preload: false,
    // },
    // timer_warning: {
    //   file: require('./warning.mp3'),
    //   volume: 0.4,
    //   preload: true,
    // },
    // countdown: {
    //   file: require('./countdown.mp3'),
    //   volume: 0.5,
    //   preload: false,
    // },

    // Game Sounds
    // quiz_start: {
    //   file: require('./start.mp3'),
    //   volume: 0.7,
    //   preload: false,
    // },
    // quiz_end: {
    //   file: require('./end.mp3'),
    //   volume: 0.7,
    //   preload: false,
    // },

    // Achievement Sounds
    // level_up: {
    //   file: require('./levelup.mp3'),
    //   volume: 0.8,
    //   preload: false,
    // },
    // streak: {
    //   file: require('./streak.mp3'),
    //   volume: 0.5,
    //   preload: false,
    // },
    // achievement: {
    //   file: require('./achievement.mp3'),
    //   volume: 0.7,
    //   preload: false,
    // },

    // Generic Sounds
    // success: {
    //   file: require('./success.mp3'),
    //   volume: 0.5,
    //   preload: true,
    // },
    // error: {
    //   file: require('./error.mp3'),
    //   volume: 0.4,
    //   preload: true,
    // },
};

// Get sound file for a type
export function getSoundSource(type: SoundType): SoundConfig | null {
    return soundSources[type] || null;
}

// Get all sounds that should be preloaded
export function getPreloadSounds(): SoundType[] {
    return Object.entries(soundSources)
        .filter(([_, config]) => config?.preload)
        .map(([type]) => type as SoundType);
}

// Instructions for adding sound effects:
/*
1. Find free sound effects from:
   - freesound.org
   - mixkit.co/free-sound-effects
   - zapsplat.com

2. Download as MP3 (keep file sizes small, under 100KB each)

3. Save to assets/sounds/ folder:
   - tap.mp3 - UI tap sound
   - correct.mp3 - Correct answer chime
   - wrong.mp3 - Wrong answer buzz
   - tick.mp3 - Timer tick
   - warning.mp3 - Timer warning beep
   - countdown.mp3 - Final countdown
   - start.mp3 - Quiz start fanfare
   - end.mp3 - Quiz end sound
   - levelup.mp3 - Level up celebration
   - streak.mp3 - Streak continuation
   - achievement.mp3 - Achievement unlocked
   - success.mp3 - Generic success
   - error.mp3 - Generic error

4. Uncomment the relevant lines in soundSources above

Recommended sound characteristics:
- Short duration (under 2 seconds for most)
- Clean, modern sounds
- Not too loud or harsh
- Match the warm, friendly app theme
*/

export default soundSources;
