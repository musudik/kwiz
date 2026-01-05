/**
 * KWIZ Store - Quiz Store
 * Global state for active quiz sessions
 */

import { create } from 'zustand';

export interface QuizOption {
    id: number;
    text: string;
    imageUrl?: string;
}

export interface QuizQuestion {
    id: string;
    text: string;
    imageUrl?: string;
    options: QuizOption[];
    correctOptionIds: number[];
    timeLimit: number;
    points: number;
    type: 'mcq' | 'multi-select' | 'true-false' | 'poll';
}

export interface QuizSession {
    id: string;
    code: string;
    title: string;
    hostName: string;
    totalQuestions: number;
    currentQuestionIndex: number;
    status: 'waiting' | 'active' | 'paused' | 'ended';
    participants: number;
}

export interface Answer {
    questionId: string;
    selectedOptionIds: number[];
    isCorrect: boolean;
    pointsEarned: number;
    responseTime: number;
    timestamp: Date;
}

export interface LeaderboardEntry {
    rank: number;
    participantId: string;
    displayName: string;
    avatarId: number;
    score: number;
    streak: number;
    correctAnswers?: number;
    totalResponseTime?: number;
}

interface QuizState {
    // Session state
    session: QuizSession | null;
    currentQuestion: QuizQuestion | null;
    answers: Answer[];
    score: number;
    currentStreak: number;
    leaderboard: LeaderboardEntry[];

    // Timer state
    timeRemaining: number;
    isTimerRunning: boolean;

    // UI state
    selectedOptionIds: number[];
    hasSubmitted: boolean;
    showResults: boolean;

    // Actions
    setSession: (session: QuizSession | null) => void;
    setCurrentQuestion: (question: QuizQuestion | null) => void;
    selectOption: (optionId: number) => void;
    deselectOption: (optionId: number) => void;
    clearSelection: () => void;
    submitAnswer: (isCorrect: boolean, pointsEarned: number, responseTime: number) => void;
    setTimeRemaining: (time: number) => void;
    setTimerRunning: (running: boolean) => void;
    updateLeaderboard: (entries: LeaderboardEntry[]) => void;
    setShowResults: (show: boolean) => void;
    nextQuestion: () => void;
    endQuiz: () => void;
    resetQuiz: () => void;
}

const initialState = {
    session: null,
    currentQuestion: null,
    answers: [],
    score: 0,
    currentStreak: 0,
    leaderboard: [],
    timeRemaining: 0,
    isTimerRunning: false,
    selectedOptionIds: [],
    hasSubmitted: false,
    showResults: false,
};

export const useQuizStore = create<QuizState>((set, get) => ({
    ...initialState,

    setSession: (session) => set({ session }),

    setCurrentQuestion: (question) => set({
        currentQuestion: question,
        selectedOptionIds: [],
        hasSubmitted: false,
        showResults: false,
        timeRemaining: question?.timeLimit || 0,
        isTimerRunning: question !== null,
    }),

    selectOption: (optionId) => set((state) => {
        if (state.hasSubmitted) return state;

        const question = state.currentQuestion;
        if (!question) return state;

        // For single-select questions, replace selection
        if (question.type === 'mcq' || question.type === 'true-false') {
            return { selectedOptionIds: [optionId] };
        }

        // For multi-select, toggle selection
        if (state.selectedOptionIds.includes(optionId)) {
            return { selectedOptionIds: state.selectedOptionIds.filter(id => id !== optionId) };
        }
        return { selectedOptionIds: [...state.selectedOptionIds, optionId] };
    }),

    deselectOption: (optionId) => set((state) => ({
        selectedOptionIds: state.selectedOptionIds.filter(id => id !== optionId),
    })),

    clearSelection: () => set({ selectedOptionIds: [], hasSubmitted: false }),

    submitAnswer: (isCorrect, pointsEarned, responseTime) => set((state) => {
        const question = state.currentQuestion;
        if (!question) return state;

        const answer: Answer = {
            questionId: question.id,
            selectedOptionIds: state.selectedOptionIds,
            isCorrect,
            pointsEarned,
            responseTime,
            timestamp: new Date(),
        };

        const newStreak = isCorrect ? state.currentStreak + 1 : 0;
        const newScore = state.score + pointsEarned;

        return {
            answers: [...state.answers, answer],
            score: newScore,
            currentStreak: newStreak,
            hasSubmitted: true,
            // Don't show results or stop timer - wait for timer to finish
            showResults: false,
            isTimerRunning: true,
        };
    }),

    setTimeRemaining: (time) => set({ timeRemaining: Math.max(0, time) }),

    setTimerRunning: (running) => set({ isTimerRunning: running }),

    updateLeaderboard: (entries) => set({ leaderboard: entries }),

    setShowResults: (show) => set({ showResults: show }),

    nextQuestion: () => set((state) => {
        if (!state.session) return state;
        return {
            selectedOptionIds: [],
            hasSubmitted: false,
            showResults: false,
            session: {
                ...state.session,
                currentQuestionIndex: state.session.currentQuestionIndex + 1,
            },
        };
    }),

    endQuiz: () => set((state) => ({
        session: state.session ? { ...state.session, status: 'ended' } : null,
        isTimerRunning: false,
    })),

    resetQuiz: () => set(initialState),
}));

export default useQuizStore;
