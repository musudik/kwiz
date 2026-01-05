/**
 * KWIZ Store - User Store
 * Global state for user profile, XP, level, and achievements
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Achievement {
    id: string;
    name: string;
    emoji: string;
    description: string;
    unlocked: boolean;
    unlockedAt?: Date;
}

export interface UserStats {
    totalQuizzes: number;
    totalCorrect: number;
    totalWrong: number;
    bestStreak: number;
    totalWins: number;
    averageResponseTime: number;
}

export interface UserProfile {
    id: string | null;
    displayName: string;
    avatarId: number;
    level: number;
    xp: number;
    xpToNextLevel: number;
    streak: number;
    stats: UserStats;
    achievements: Achievement[];
}

interface UserState extends UserProfile {
    // Actions
    setProfile: (profile: Partial<UserProfile>) => void;
    setDisplayName: (name: string) => void;
    setAvatarId: (id: number) => void;
    addXP: (amount: number) => void;
    incrementStreak: () => void;
    resetStreak: () => void;
    updateStats: (update: Partial<UserStats>) => void;
    unlockAchievement: (achievementId: string) => void;
    resetUser: () => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_quiz', name: 'First Quiz', emoji: '🌟', description: 'Complete your first quiz', unlocked: false },
    { id: 'speed_demon', name: 'Speed Demon', emoji: '⚡', description: 'Answer 5 questions in under 3 seconds each', unlocked: false },
    { id: 'perfect_score', name: 'Perfect Score', emoji: '🏆', description: 'Get 100% accuracy in a quiz', unlocked: false },
    { id: 'streak_master', name: 'Streak Master', emoji: '🔥', description: 'Get a 10 answer streak', unlocked: false },
    { id: 'team_player', name: 'Team Player', emoji: '🤝', description: 'Win 3 team battles', unlocked: false },
    { id: 'early_bird', name: 'Early Bird', emoji: '🐦', description: 'Join a quiz within 30 seconds', unlocked: false },
    { id: 'social_butterfly', name: 'Social Butterfly', emoji: '🦋', description: 'Share your results 5 times', unlocked: false },
    { id: 'quiz_master', name: 'Quiz Master', emoji: '👑', description: 'Win 10 quizzes', unlocked: false },
];

const initialState: Omit<UserProfile, never> = {
    id: null,
    displayName: 'Player',
    avatarId: 1,
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    streak: 0,
    stats: {
        totalQuizzes: 0,
        totalCorrect: 0,
        totalWrong: 0,
        bestStreak: 0,
        totalWins: 0,
        averageResponseTime: 0,
    },
    achievements: DEFAULT_ACHIEVEMENTS,
};

// Calculate XP needed for next level (exponential growth)
const calculateXPForLevel = (level: number): number => {
    return Math.floor(1000 * Math.pow(1.2, level - 1));
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setProfile: (profile) => set((state) => ({ ...state, ...profile })),

            setDisplayName: (name) => set({ displayName: name }),

            setAvatarId: (id) => set({ avatarId: id }),

            addXP: (amount) => set((state) => {
                let newXP = state.xp + amount;
                let newLevel = state.level;
                let xpToNext = state.xpToNextLevel;

                // Check for level up
                while (newXP >= xpToNext) {
                    newXP -= xpToNext;
                    newLevel += 1;
                    xpToNext = calculateXPForLevel(newLevel);
                }

                return {
                    xp: newXP,
                    level: newLevel,
                    xpToNextLevel: xpToNext,
                };
            }),

            incrementStreak: () => set((state) => {
                const newStreak = state.streak + 1;
                const newBestStreak = Math.max(state.stats.bestStreak, newStreak);

                return {
                    streak: newStreak,
                    stats: {
                        ...state.stats,
                        bestStreak: newBestStreak,
                    },
                };
            }),

            resetStreak: () => set({ streak: 0 }),

            updateStats: (update) => set((state) => ({
                stats: { ...state.stats, ...update },
            })),

            unlockAchievement: (achievementId) => set((state) => ({
                achievements: state.achievements.map((a) =>
                    a.id === achievementId
                        ? { ...a, unlocked: true, unlockedAt: new Date() }
                        : a
                ),
            })),

            resetUser: () => set(initialState),
        }),
        {
            name: 'kwiz-user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useUserStore;
