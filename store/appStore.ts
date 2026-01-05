/**
 * KWIZ Store - App Store
 * Global app settings and UI state
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppSettings {
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    notificationsEnabled: boolean;
    theme: 'light' | 'dark' | 'auto';
}

interface AppState {
    // Settings
    settings: AppSettings;

    // Connection state
    isConnected: boolean;
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
    serverUrl: string | null;

    // UI state
    isLoading: boolean;
    loadingMessage: string | null;
    error: string | null;

    // Onboarding
    hasCompletedOnboarding: boolean;

    // Actions
    updateSettings: (settings: Partial<AppSettings>) => void;
    setConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void;
    setServerUrl: (url: string | null) => void;
    setLoading: (loading: boolean, message?: string) => void;
    setError: (error: string | null) => void;
    completeOnboarding: () => void;
    resetApp: () => void;
}

const defaultSettings: AppSettings = {
    soundEnabled: true,
    hapticsEnabled: true,
    notificationsEnabled: true,
    theme: 'dark',
};

const initialState = {
    settings: defaultSettings,
    isConnected: false,
    connectionStatus: 'disconnected' as const,
    serverUrl: null,
    isLoading: false,
    loadingMessage: null,
    error: null,
    hasCompletedOnboarding: false,
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            ...initialState,

            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings },
            })),

            setConnectionStatus: (status) => set({
                connectionStatus: status,
                isConnected: status === 'connected',
            }),

            setServerUrl: (url) => set({ serverUrl: url }),

            setLoading: (loading, message) => set({
                isLoading: loading,
                loadingMessage: loading ? message || null : null,
            }),

            setError: (error) => set({ error }),

            completeOnboarding: () => set({ hasCompletedOnboarding: true }),

            resetApp: () => set({
                ...initialState,
                hasCompletedOnboarding: true, // Keep onboarding state
            }),
        }),
        {
            name: 'kwiz-app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                settings: state.settings,
                hasCompletedOnboarding: state.hasCompletedOnboarding,
            }),
        }
    )
);

export default useAppStore;
