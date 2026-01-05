/**
 * KWIZ Hook - useSound
 * Custom hook for playing sounds with app settings awareness
 */

import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { playSound, SoundType, stopSound } from '../services';
import { useAppStore } from '../store';

interface UseSoundReturn {
    play: (type: SoundType) => Promise<void>;
    stop: (type: SoundType) => Promise<void>;
    playWithHaptic: (type: SoundType, hapticType?: Haptics.ImpactFeedbackStyle) => Promise<void>;
}

export function useSound(): UseSoundReturn {
    const { settings } = useAppStore();

    const play = useCallback(async (type: SoundType) => {
        if (settings.soundEnabled) {
            await playSound(type);
        }
    }, [settings.soundEnabled]);

    const stop = useCallback(async (type: SoundType) => {
        await stopSound(type);
    }, []);

    const playWithHaptic = useCallback(async (
        type: SoundType,
        hapticType: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light
    ) => {
        // Play haptic if enabled
        if (settings.hapticsEnabled) {
            await Haptics.impactAsync(hapticType);
        }

        // Play sound if enabled
        if (settings.soundEnabled) {
            await playSound(type);
        }
    }, [settings.soundEnabled, settings.hapticsEnabled]);

    return { play, stop, playWithHaptic };
}

export default useSound;
