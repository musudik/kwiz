/**
 * KWIZ Service - Socket Service
 * WebSocket connection for real-time quiz communication
 */

import { io, Socket } from 'socket.io-client';
import type { LeaderboardEntry, QuizQuestion, QuizSession } from '../store';
import { useAppStore, useQuizStore } from '../store';

// Event types from server
interface ServerToClientEvents {
    // Connection events
    'connection:established': (data: { participantId: string }) => void;
    'connection:error': (error: { message: string }) => void;

    // Quiz events
    'quiz:joined': (session: QuizSession) => void;
    'quiz:started': () => void;
    'quiz:question': (question: QuizQuestion) => void;
    'quiz:answer-result': (result: {
        isCorrect: boolean;
        correctOptionIds: number[];
        pointsEarned: number;
        newScore: number;
        newStreak: number;
    }) => void;
    'quiz:leaderboard': (entries: LeaderboardEntry[]) => void;
    'quiz:answer-stats': (stats: {
        questionId: string;
        correctOptionIds: number[];
        stats: Record<number, { count: number; percentage: number; text: string }>;
    }) => void;
    'quiz:ended': (finalResults: {
        rank: number;
        totalParticipants: number;
        score: number;
    }) => void;

    // Session events
    'session:update': (update: { currentQuestionIndex?: number; status?: 'waiting' | 'active' | 'paused' | 'ended' }) => void;

    // Participant events
    'participants:count': (count: number) => void;
    'participant:joined': (participant: { displayName: string; avatarId: number }) => void;
    'participant:left': (participantId: string) => void;

    // Host control events
    'host:paused': () => void;
    'host:resumed': () => void;
    'host:skipped': () => void;
}

// Event types to server
interface ClientToServerEvents {
    'join:quiz': (data: {
        code: string;
        displayName: string;
        avatarId: number;
    }) => void;
    'submit:answer': (data: {
        questionId: string;
        selectedOptionIds: number[];
        responseTime: number;
    }) => void;
    'leave:quiz': () => void;
}

class SocketService {
    private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
    private serverUrl: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private participantId: string | null = null;

    // Connect to the WebSocket server
    connect(serverUrl: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socket?.connected) {
                resolve();
                return;
            }

            useAppStore.getState().setConnectionStatus('connecting');
            this.serverUrl = serverUrl;

            this.socket = io(serverUrl, {
                transports: ['websocket'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: 1000,
                timeout: 10000,
            });

            // Connection events
            this.socket.on('connect', () => {
                console.log('[Socket] Connected to server');
                useAppStore.getState().setConnectionStatus('connected');
                this.reconnectAttempts = 0;
                resolve();
            });

            this.socket.on('disconnect', (reason) => {
                console.log('[Socket] Disconnected:', reason);
                useAppStore.getState().setConnectionStatus('disconnected');
            });

            this.socket.on('connect_error', (error) => {
                console.error('[Socket] Connection error:', error);
                this.reconnectAttempts++;
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    useAppStore.getState().setConnectionStatus('error');
                    useAppStore.getState().setError('Failed to connect to server');
                    reject(error);
                }
            });

            // Custom events
            this.socket.on('connection:established', (data) => {
                this.participantId = data.participantId;
                console.log('[Socket] Participant ID:', data.participantId);
            });

            this.socket.on('connection:error', (error) => {
                useAppStore.getState().setError(error.message);
            });

            // Quiz events
            this.setupQuizEventHandlers();
        });
    }

    private setupQuizEventHandlers() {
        if (!this.socket) return;

        this.socket.on('quiz:joined', (session) => {
            console.log('[Socket] Joined quiz:', session.title);
            useQuizStore.getState().setSession(session);
        });

        this.socket.on('quiz:started', () => {
            console.log('[Socket] Quiz started');
            const store = useQuizStore.getState();
            if (store.session) {
                store.setSession({
                    ...store.session,
                    status: 'active',
                });
            }
        });

        this.socket.on('quiz:question', (question) => {
            console.log('[Socket] New question:', question.id);
            useQuizStore.getState().setCurrentQuestion(question);
        });

        this.socket.on('quiz:answer-result', (result) => {
            console.log('[Socket] Answer result:', result.isCorrect);
            // The store handles the result when submitting locally
            // This is for syncing with server state
        });

        this.socket.on('quiz:leaderboard', (entries) => {
            useQuizStore.getState().updateLeaderboard(entries);
        });

        this.socket.on('session:update', (update) => {
            console.log('[Socket] Session update:', update);
            const store = useQuizStore.getState();
            if (store.session) {
                store.setSession({
                    ...store.session,
                    ...update,
                });
            }
        });

        this.socket.on('quiz:leaderboard', (entries) => {
            console.log('[Socket] Leaderboard update:', entries.length, 'entries');
            useQuizStore.getState().updateLeaderboard(entries);
        });

        this.socket.on('quiz:ended', (finalResults) => {
            console.log('[Socket] Quiz ended. Rank:', finalResults.rank);
            useQuizStore.getState().endQuiz();
        });

        this.socket.on('participants:count', (count) => {
            const store = useQuizStore.getState();
            if (store.session) {
                store.setSession({
                    ...store.session,
                    participants: count,
                });
            }
        });

        this.socket.on('host:paused', () => {
            const store = useQuizStore.getState();
            if (store.session) {
                store.setSession({ ...store.session, status: 'paused' });
                store.setTimerRunning(false);
            }
        });

        this.socket.on('host:resumed', () => {
            const store = useQuizStore.getState();
            if (store.session) {
                store.setSession({ ...store.session, status: 'active' });
                store.setTimerRunning(true);
            }
        });
    }

    // Join a quiz session
    joinQuiz(code: string, displayName: string, avatarId: number): void {
        if (!this.socket?.connected) {
            console.error('[Socket] Not connected');
            return;
        }

        this.socket.emit('join:quiz', { code, displayName, avatarId });
    }

    // Submit an answer
    submitAnswer(questionId: string, selectedOptionIds: number[], responseTime: number): void {
        if (!this.socket?.connected) {
            console.error('[Socket] Not connected');
            return;
        }

        this.socket.emit('submit:answer', { questionId, selectedOptionIds, responseTime });
    }

    // Leave the current quiz
    leaveQuiz(): void {
        if (!this.socket?.connected) return;
        this.socket.emit('leave:quiz');
        useQuizStore.getState().resetQuiz();
    }

    // Disconnect from server
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.participantId = null;
        useAppStore.getState().setConnectionStatus('disconnected');
    }

    // Check if connected
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Get participant ID
    getParticipantId(): string | null {
        return this.participantId;
    }

    // Get raw socket for direct event handling
    getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
        return this.socket;
    }
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;
