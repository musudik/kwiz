/**
 * KWIZ Hook - useQuizTimer
 * Custom hook for managing quiz countdown timer
 */

import { useCallback, useEffect, useRef } from 'react';
import { useQuizStore } from '../store';
import { useSound } from './useSound';

interface UseQuizTimerOptions {
    onTimeUp?: () => void;
    warningThreshold?: number;
    dangerThreshold?: number;
}

interface UseQuizTimerReturn {
    timeRemaining: number;
    isRunning: boolean;
    progress: number;
    isWarning: boolean;
    isDanger: boolean;
    start: () => void;
    stop: () => void;
    reset: (time?: number) => void;
}

export function useQuizTimer(options: UseQuizTimerOptions = {}): UseQuizTimerReturn {
    const {
        onTimeUp,
        warningThreshold = 10,
        dangerThreshold = 5,
    } = options;

    const {
        timeRemaining,
        isTimerRunning,
        currentQuestion,
        setTimeRemaining,
        setTimerRunning,
    } = useQuizStore();

    const { play } = useSound();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastSecondRef = useRef<number>(timeRemaining);

    const totalTime = currentQuestion?.timeLimit || 30;
    const progress = timeRemaining / totalTime;
    const isWarning = timeRemaining <= warningThreshold && timeRemaining > dangerThreshold;
    const isDanger = timeRemaining <= dangerThreshold && timeRemaining > 0;

    // Timer interval
    useEffect(() => {
        if (isTimerRunning && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isTimerRunning, timeRemaining, setTimeRemaining]);

    // Sound effects for timer
    useEffect(() => {
        if (timeRemaining !== lastSecondRef.current) {
            lastSecondRef.current = timeRemaining;

            if (isDanger && timeRemaining > 0) {
                play('timer_warning');
            } else if (isWarning && timeRemaining === warningThreshold) {
                play('timer_tick');
            }
        }
    }, [timeRemaining, isDanger, isWarning, play, warningThreshold]);

    // Handle time up
    useEffect(() => {
        if (timeRemaining === 0 && isTimerRunning) {
            setTimerRunning(false);
            onTimeUp?.();
        }
    }, [timeRemaining, isTimerRunning, setTimerRunning, onTimeUp]);

    const start = useCallback(() => {
        setTimerRunning(true);
    }, [setTimerRunning]);

    const stop = useCallback(() => {
        setTimerRunning(false);
    }, [setTimerRunning]);

    const reset = useCallback((time?: number) => {
        setTimeRemaining(time ?? totalTime);
        setTimerRunning(false);
    }, [setTimeRemaining, setTimerRunning, totalTime]);

    return {
        timeRemaining,
        isRunning: isTimerRunning,
        progress,
        isWarning,
        isDanger,
        start,
        stop,
        reset,
    };
}

export default useQuizTimer;
