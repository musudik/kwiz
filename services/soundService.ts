/**
 * KWIZ Service - Sound Service
 * Audio playback for quiz sound effects
 */

import { Audio } from 'expo-av';

// Sound types
export type SoundType =
    | 'quiz_start'
    | 'new_question'
    | 'select_answer'
    | 'show_answer'
    | 'end_quiz'
    | 'correct_answer'
    | 'wrong_answer'
    | 'timer_tick'
    | 'timer_warning'
    | 'countdown'
    | 'button_tap'
    | 'level_up'
    | 'streak'
    | 'achievement'
    | 'success'
    | 'error';

// Sound cache
const soundCache: Map<string, Audio.Sound> = new Map();

// Sound file mappings to actual files
const soundFiles: Partial<Record<SoundType, any>> = {
    quiz_start: require('../assets/sounds/Quiz-Start.wav'),
    new_question: require('../assets/sounds/NewQuestion.mp3'),
    select_answer: require('../assets/sounds/SelectAnswer.mp3'),
    show_answer: require('../assets/sounds/ShowAnswer.mp3'),
    end_quiz: require('../assets/sounds/EndQuiz.wav'),
    // Aliases for other sound types
    correct_answer: require('../assets/sounds/ShowAnswer.mp3'),
    countdown: require('../assets/sounds/NewQuestion.mp3'),
    button_tap: require('../assets/sounds/SelectAnswer.mp3'),
    success: require('../assets/sounds/ShowAnswer.mp3'),
};

// Initialize audio mode
async function initAudio() {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
        });
    } catch (error) {
        console.warn('[Sound] Failed to initialize audio mode:', error);
    }
}

// Play a sound
export async function playSound(type: SoundType, volume: number = 0.5): Promise<void> {
    try {
        const soundFile = soundFiles[type];
        if (!soundFile) {
            console.log(`[Sound] No sound file for type: ${type}`);
            return;
        }

        // Check cache first
        let sound = soundCache.get(type);

        if (!sound) {
            const { sound: newSound } = await Audio.Sound.createAsync(soundFile, {
                shouldPlay: false,
                volume,
            });
            sound = newSound;
            soundCache.set(type, sound);
        }

        // Reset position and play
        await sound.setPositionAsync(0);
        await sound.setVolumeAsync(volume);
        await sound.playAsync();
    } catch (error) {
        console.warn(`[Sound] Failed to play sound ${type}:`, error);
    }
}

// Preload commonly used sounds
export async function preloadSounds(): Promise<void> {
    await initAudio();

    const preloadTypes: SoundType[] = [
        'select_answer',
        'show_answer',
        'new_question',
    ];

    for (const type of preloadTypes) {
        try {
            const soundFile = soundFiles[type];
            if (soundFile) {
                const { sound } = await Audio.Sound.createAsync(soundFile, {
                    shouldPlay: false,
                });
                soundCache.set(type, sound);
            }
        } catch (error) {
            console.warn(`[Sound] Failed to preload ${type}:`, error);
        }
    }
}

// Cleanup sounds
export async function unloadSounds(): Promise<void> {
    for (const sound of soundCache.values()) {
        try {
            await sound.unloadAsync();
        } catch (error) {
            console.warn('[Sound] Failed to unload sound:', error);
        }
    }
    soundCache.clear();
}

export default {
    playSound,
    preloadSounds,
    unloadSounds,
};
