/**
 * KWIZ Store - Quiz Template Store
 * Global state for managing quiz templates (created quizzes)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Simple UUID generator for React Native (no crypto dependency)
const generateId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    const randomPart2 = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomPart}-${randomPart2}`;
};

// Quiz categories
export type QuizCategory =
    | 'general'
    | 'science'
    | 'history'
    | 'geography'
    | 'sports'
    | 'entertainment'
    | 'music'
    | 'art'
    | 'technology'
    | 'nature'
    | 'food'
    | 'custom';

export const QUIZ_CATEGORIES: { id: QuizCategory; name: string; emoji: string }[] = [
    { id: 'general', name: 'General Knowledge', emoji: '🧠' },
    { id: 'science', name: 'Science', emoji: '🔬' },
    { id: 'history', name: 'History', emoji: '📜' },
    { id: 'geography', name: 'Geography', emoji: '🌍' },
    { id: 'sports', name: 'Sports', emoji: '⚽' },
    { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
    { id: 'music', name: 'Music', emoji: '🎵' },
    { id: 'art', name: 'Art & Culture', emoji: '🎨' },
    { id: 'technology', name: 'Technology', emoji: '💻' },
    { id: 'nature', name: 'Nature', emoji: '🌿' },
    { id: 'food', name: 'Food & Drink', emoji: '🍕' },
    { id: 'custom', name: 'Custom', emoji: '✨' },
];

// Question types
export type QuestionType = 'mcq' | 'multi-select' | 'true-false';

export interface QuestionOption {
    id: number;
    text: string;
    imageUrl?: string;
}

export interface QuestionTemplate {
    id: string;
    text: string;
    imageUrl?: string;
    options: QuestionOption[];
    correctOptionIds: number[];
    timeLimit: number;
    points: number;
    type: QuestionType;
    order: number;
}

export interface QuizSettings {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showLeaderboard: boolean;
    allowLateJoin: boolean;
    maxParticipants: number;
    isPublic: boolean;
}

export interface QuizTemplate {
    id: string;
    title: string;
    description: string;
    category: QuizCategory;
    coverImageUrl?: string;
    questions: QuestionTemplate[];
    settings: QuizSettings;
    status: 'draft' | 'published' | 'finished';
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    playCount: number;
    code?: string; // Generated when published
}

// Default settings for new quizzes
const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
    shuffleQuestions: false,
    shuffleOptions: false,
    showLeaderboard: true,
    allowLateJoin: false,
    maxParticipants: 100,
    isPublic: false,
};

// Default question template
export const createDefaultQuestion = (order: number): QuestionTemplate => ({
    id: generateId(),
    text: '',
    options: [
        { id: 0, text: '' },
        { id: 1, text: '' },
        { id: 2, text: '' },
        { id: 3, text: '' },
    ],
    correctOptionIds: [],
    timeLimit: 15,
    points: 100,
    type: 'mcq',
    order,
});

interface QuizTemplateState {
    // State
    templates: QuizTemplate[];
    currentTemplate: QuizTemplate | null;
    currentQuestion: QuestionTemplate | null;
    isLoading: boolean;
    error: string | null;

    // Template CRUD
    createTemplate: (title: string, category: QuizCategory) => QuizTemplate;
    updateTemplate: (id: string, updates: Partial<QuizTemplate>) => void;
    deleteTemplate: (id: string) => void;
    getTemplate: (id: string) => QuizTemplate | undefined;
    setCurrentTemplate: (template: QuizTemplate | null) => void;

    // Question CRUD
    addQuestion: (templateId: string) => QuestionTemplate;
    updateQuestion: (templateId: string, questionId: string, updates: Partial<QuestionTemplate>) => void;
    deleteQuestion: (templateId: string, questionId: string) => void;
    reorderQuestions: (templateId: string, questionIds: string[]) => void;
    setCurrentQuestion: (question: QuestionTemplate | null) => void;

    // Publishing
    publishTemplate: (id: string) => void;
    unpublishTemplate: (id: string) => void;
    markAsFinished: (id: string) => void;

    // Utilities
    duplicateTemplate: (id: string) => QuizTemplate | null;
    clearError: () => void;
}

export const useQuizTemplateStore = create<QuizTemplateState>()(
    persist(
        (set, get) => ({
            templates: [],
            currentTemplate: null,
            currentQuestion: null,
            isLoading: false,
            error: null,

            // Create a new quiz template
            createTemplate: (title, category) => {
                const newTemplate: QuizTemplate = {
                    id: generateId(),
                    title,
                    description: '',
                    category,
                    questions: [],
                    settings: { ...DEFAULT_QUIZ_SETTINGS },
                    status: 'draft',
                    createdBy: '', // Will be set by caller
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    playCount: 0,
                };

                set((state) => ({
                    templates: [...state.templates, newTemplate],
                    currentTemplate: newTemplate,
                }));

                return newTemplate;
            },

            // Update an existing template
            updateTemplate: (id, updates) => {
                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === id
                            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
                            : t
                    ),
                    currentTemplate:
                        state.currentTemplate?.id === id
                            ? { ...state.currentTemplate, ...updates, updatedAt: new Date().toISOString() }
                            : state.currentTemplate,
                }));
            },

            // Delete a template
            deleteTemplate: (id) => {
                set((state) => ({
                    templates: state.templates.filter((t) => t.id !== id),
                    currentTemplate:
                        state.currentTemplate?.id === id ? null : state.currentTemplate,
                }));
            },

            // Get a template by ID
            getTemplate: (id) => {
                return get().templates.find((t) => t.id === id);
            },

            // Set current template for editing
            setCurrentTemplate: (template) => {
                set({ currentTemplate: template, currentQuestion: null });
            },

            // Add a new question to a template
            addQuestion: (templateId) => {
                const template = get().templates.find((t) => t.id === templateId);
                if (!template) {
                    throw new Error('Template not found');
                }

                const newQuestion = createDefaultQuestion(template.questions.length);

                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === templateId
                            ? {
                                ...t,
                                questions: [...t.questions, newQuestion],
                                updatedAt: new Date().toISOString(),
                            }
                            : t
                    ),
                    currentTemplate:
                        state.currentTemplate?.id === templateId
                            ? {
                                ...state.currentTemplate,
                                questions: [...state.currentTemplate.questions, newQuestion],
                            }
                            : state.currentTemplate,
                    currentQuestion: newQuestion,
                }));

                return newQuestion;
            },

            // Update a question
            updateQuestion: (templateId, questionId, updates) => {
                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === templateId
                            ? {
                                ...t,
                                questions: t.questions.map((q) =>
                                    q.id === questionId ? { ...q, ...updates } : q
                                ),
                                updatedAt: new Date().toISOString(),
                            }
                            : t
                    ),
                    currentTemplate:
                        state.currentTemplate?.id === templateId
                            ? {
                                ...state.currentTemplate,
                                questions: state.currentTemplate.questions.map((q) =>
                                    q.id === questionId ? { ...q, ...updates } : q
                                ),
                            }
                            : state.currentTemplate,
                    currentQuestion:
                        state.currentQuestion?.id === questionId
                            ? { ...state.currentQuestion, ...updates }
                            : state.currentQuestion,
                }));
            },

            // Delete a question
            deleteQuestion: (templateId, questionId) => {
                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === templateId
                            ? {
                                ...t,
                                questions: t.questions
                                    .filter((q) => q.id !== questionId)
                                    .map((q, index) => ({ ...q, order: index })),
                                updatedAt: new Date().toISOString(),
                            }
                            : t
                    ),
                    currentTemplate:
                        state.currentTemplate?.id === templateId
                            ? {
                                ...state.currentTemplate,
                                questions: state.currentTemplate.questions
                                    .filter((q) => q.id !== questionId)
                                    .map((q, index) => ({ ...q, order: index })),
                            }
                            : state.currentTemplate,
                    currentQuestion:
                        state.currentQuestion?.id === questionId ? null : state.currentQuestion,
                }));
            },

            // Reorder questions
            reorderQuestions: (templateId, questionIds) => {
                const template = get().templates.find((t) => t.id === templateId);
                if (!template) return;

                const reorderedQuestions = questionIds
                    .map((id, index) => {
                        const question = template.questions.find((q) => q.id === id);
                        return question ? { ...question, order: index } : null;
                    })
                    .filter((q): q is QuestionTemplate => q !== null);

                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === templateId
                            ? { ...t, questions: reorderedQuestions, updatedAt: new Date().toISOString() }
                            : t
                    ),
                    currentTemplate:
                        state.currentTemplate?.id === templateId
                            ? { ...state.currentTemplate, questions: reorderedQuestions }
                            : state.currentTemplate,
                }));
            },

            // Set current question for editing
            setCurrentQuestion: (question) => {
                set({ currentQuestion: question });
            },

            // Publish a template (make it playable)
            publishTemplate: (id) => {
                // Generate a unique quiz code
                const generateCode = () => {
                    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                    let code = '';
                    for (let i = 0; i < 6; i++) {
                        code += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    return code;
                };

                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === id
                            ? {
                                ...t,
                                status: 'published' as const,
                                code: t.code || generateCode(),
                                updatedAt: new Date().toISOString(),
                            }
                            : t
                    ),
                    currentTemplate:
                        state.currentTemplate?.id === id
                            ? {
                                ...state.currentTemplate,
                                status: 'published' as const,
                                code: state.currentTemplate.code || generateCode(),
                            }
                            : state.currentTemplate,
                }));
            },

            // Unpublish a template
            unpublishTemplate: (id) => {
                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === id
                            ? { ...t, status: 'draft' as const, updatedAt: new Date().toISOString() }
                            : t
                    ),
                    currentTemplate:
                        state.currentTemplate?.id === id
                            ? { ...state.currentTemplate, status: 'draft' as const }
                            : state.currentTemplate,
                }));
            },

            // Mark a quiz as finished (after hosting session ends)
            markAsFinished: (id) => {
                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === id
                            ? {
                                ...t,
                                status: 'finished' as const,
                                playCount: (t.playCount || 0) + 1,
                                updatedAt: new Date().toISOString()
                            }
                            : t
                    ),
                    currentTemplate:
                        state.currentTemplate?.id === id
                            ? { ...state.currentTemplate, status: 'finished' as const }
                            : state.currentTemplate,
                }));
            },

            // Duplicate a template
            duplicateTemplate: (id) => {
                const template = get().templates.find((t) => t.id === id);
                if (!template) return null;

                const duplicated: QuizTemplate = {
                    ...template,
                    id: generateId(),
                    title: `${template.title} (Copy)`,
                    status: 'draft',
                    code: undefined,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    playCount: 0,
                    questions: template.questions.map((q) => ({
                        ...q,
                        id: generateId(),
                    })),
                };

                set((state) => ({
                    templates: [...state.templates, duplicated],
                }));

                return duplicated;
            },

            // Clear error
            clearError: () => set({ error: null }),
        }),
        {
            name: 'kwiz-templates-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useQuizTemplateStore;
