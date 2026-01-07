/**
 * KWIZ Store - Index
 * Export all stores
 */

export { useUserStore } from './userStore';
export type { Achievement, RoleRequest, UserProfile, UserRole, UserStats } from './userStore';

export { useQuizStore } from './quizStore';
export type {
    Answer,
    LeaderboardEntry, QuizOption,
    QuizQuestion,
    QuizSession
} from './quizStore';

export { useAppStore } from './appStore';

export { QUIZ_CATEGORIES, createDefaultQuestion, useQuizTemplateStore } from './quizTemplateStore';
export type {
    QuestionOption,
    QuestionTemplate, QuestionType, QuizCategory, QuizSettings,
    QuizTemplate
} from './quizTemplateStore';

