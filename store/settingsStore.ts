/**
 * KWIZ Settings Store
 * Persisted settings for language, theme, and AI provider API keys
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Supported languages
export type Language = 'en' | 'de' | 'es' | 'fr' | 'it' | 'pt';

// Supported themes
export type Theme = 'warm-brown' | 'dark-blue' | 'forest-green' | 'purple-night' | 'sunset-orange';

// AI Provider types
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'openrouter' | 'perplexity';

// AI Provider configuration
export interface AIProviderConfig {
    id: AIProvider;
    name: string;
    description: string;
    models: string[];
    apiKey: string;
    enabled: boolean;
}

// Language option
export interface LanguageOption {
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
}

// Theme option
export interface ThemeOption {
    id: Theme;
    name: string;
    primaryColor: string;
    description: string;
}

// Available languages
export const LANGUAGES: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
];

// Available themes
export const THEMES: ThemeOption[] = [
    { id: 'warm-brown', name: 'Warm Brown', primaryColor: '#CD9861', description: 'Default warm and cozy' },
    { id: 'dark-blue', name: 'Ocean Night', primaryColor: '#4A90D9', description: 'Deep blue tones' },
    { id: 'forest-green', name: 'Forest', primaryColor: '#4CAF50', description: 'Natural green' },
    { id: 'purple-night', name: 'Purple Night', primaryColor: '#9B59B6', description: 'Elegant purple' },
    { id: 'sunset-orange', name: 'Sunset', primaryColor: '#FF6B35', description: 'Vibrant orange' },
];

// Default AI providers
export const DEFAULT_AI_PROVIDERS: AIProviderConfig[] = [
    {
        id: 'openrouter',
        name: 'OpenRouter',
        description: 'Access multiple AI models through one API',
        models: ['meta-llama/llama-3.1-8b-instruct:free', 'google/gemini-flash-1.5', 'anthropic/claude-3.5-sonnet'],
        apiKey: '',
        enabled: true,
    },
    {
        id: 'openai',
        name: 'OpenAI',
        description: 'GPT-4 and GPT-4 Turbo models',
        models: ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini'],
        apiKey: '',
        enabled: false,
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        description: 'Claude 3.5 Sonnet and Claude 3 models',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
        apiKey: '',
        enabled: false,
    },
    {
        id: 'google',
        name: 'Google Gemini',
        description: 'Gemini Pro and Flash models',
        models: ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'],
        apiKey: '',
        enabled: false,
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        description: 'Perplexity AI with real-time knowledge',
        models: ['llama-3.1-sonar-small-128k-online', 'llama-3.1-sonar-large-128k-online'],
        apiKey: '',
        enabled: false,
    },
];

interface SettingsState {
    // Language settings
    language: Language;
    setLanguage: (language: Language) => void;

    // Theme settings
    theme: Theme;
    setTheme: (theme: Theme) => void;

    // AI Provider settings
    aiProviders: AIProviderConfig[];
    setProviderApiKey: (providerId: AIProvider, apiKey: string) => void;
    toggleProvider: (providerId: AIProvider, enabled: boolean) => void;
    getActiveProvider: () => AIProviderConfig | null;

    // Pro status
    isPro: boolean;
    setIsPro: (isPro: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            // Default settings
            language: 'en',
            theme: 'warm-brown',
            aiProviders: DEFAULT_AI_PROVIDERS,
            isPro: false,

            setLanguage: (language) => set({ language }),

            setTheme: (theme) => set({ theme }),

            setProviderApiKey: (providerId, apiKey) => {
                set((state) => ({
                    aiProviders: state.aiProviders.map((p) =>
                        p.id === providerId ? { ...p, apiKey } : p
                    ),
                }));
            },

            toggleProvider: (providerId, enabled) => {
                set((state) => ({
                    aiProviders: state.aiProviders.map((p) =>
                        p.id === providerId ? { ...p, enabled } : p
                    ),
                }));
            },

            getActiveProvider: () => {
                const providers = get().aiProviders;
                // Return first enabled provider with an API key
                return providers.find((p) => p.enabled && p.apiKey.trim()) || null;
            },

            setIsPro: (isPro) => set({ isPro }),
        }),
        {
            name: 'kwiz-settings',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
