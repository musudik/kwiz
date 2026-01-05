/**
 * KWIZ Backend Server
 * Simple Node.js server for testing real-time quiz functionality
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const quizSessions = new Map();
const participants = new Map();

// Demo quiz questions (shorter time for testing)
const DEMO_QUESTIONS = [
    {
        id: 'q1',
        text: 'What is the largest planet in our solar system?',
        options: [
            { id: 0, text: 'Mars' },
            { id: 1, text: 'Jupiter' },
            { id: 2, text: 'Saturn' },
            { id: 3, text: 'Neptune' },
        ],
        correctOptionIds: [1],
        timeLimit: 15,
        points: 100,
        type: 'mcq',
    },
    {
        id: 'q2',
        text: 'Which element has the chemical symbol "Au"?',
        options: [
            { id: 0, text: 'Silver' },
            { id: 1, text: 'Aluminum' },
            { id: 2, text: 'Gold' },
            { id: 3, text: 'Copper' },
        ],
        correctOptionIds: [2],
        timeLimit: 15,
        points: 100,
        type: 'mcq',
    },
    {
        id: 'q3',
        text: 'In what year did World War II end?',
        options: [
            { id: 0, text: '1943' },
            { id: 1, text: '1944' },
            { id: 2, text: '1945' },
            { id: 3, text: '1946' },
        ],
        correctOptionIds: [2],
        timeLimit: 15,
        points: 100,
        type: 'mcq',
    },
    {
        id: 'q4',
        text: 'What is the capital of Japan?',
        options: [
            { id: 0, text: 'Beijing' },
            { id: 1, text: 'Seoul' },
            { id: 2, text: 'Tokyo' },
            { id: 3, text: 'Bangkok' },
        ],
        correctOptionIds: [2],
        timeLimit: 15,
        points: 100,
        type: 'mcq',
    },
    {
        id: 'q5',
        text: 'Who painted the Mona Lisa?',
        options: [
            { id: 0, text: 'Vincent van Gogh' },
            { id: 1, text: 'Leonardo da Vinci' },
            { id: 2, text: 'Pablo Picasso' },
            { id: 3, text: 'Michelangelo' },
        ],
        correctOptionIds: [1],
        timeLimit: 15,
        points: 100,
        type: 'mcq',
    },
];

// Create demo quiz session on startup
function createDemoSession() {
    const session = {
        id: uuidv4(),
        code: 'DEMO01',
        title: 'Demo Quiz - General Knowledge',
        hostName: 'KWIZ Bot',
        questions: DEMO_QUESTIONS,
        totalQuestions: DEMO_QUESTIONS.length,
        currentQuestionIndex: -1,
        status: 'waiting',
        participants: new Map(),
        createdAt: new Date(),
    };
    quizSessions.set(session.code, session);
    console.log(`📋 Demo quiz created with code: ${session.code}`);
    return session;
}

// Generate a random quiz code
function generateQuizCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Calculate points based on response time
function calculatePoints(basePoints, responseTime, timeLimit, streak) {
    const timeBonus = Math.floor((timeLimit - responseTime) * 3);
    const streakMultiplier = streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
    return Math.floor((basePoints + Math.max(0, timeBonus)) * streakMultiplier);
}

// Get leaderboard for a session
// Ranked by: 1) Most correct answers, 2) Fastest total response time
function getLeaderboard(session) {
    const entries = Array.from(session.participants.values())
        .map((p) => {
            // Calculate correct answers and total response time
            const correctAnswers = p.answers.filter(a => a.isCorrect).length;
            const totalResponseTime = p.answers.reduce((sum, a) => sum + a.responseTime, 0);

            return {
                rank: 0,
                participantId: p.id,
                displayName: p.displayName,
                avatarId: p.avatarId,
                score: p.score,
                streak: p.streak,
                correctAnswers,
                totalResponseTime,
            };
        })
        // Sort by: correct answers (desc), then total response time (asc)
        .sort((a, b) => {
            if (b.correctAnswers !== a.correctAnswers) {
                return b.correctAnswers - a.correctAnswers;
            }
            return a.totalResponseTime - b.totalResponseTime;
        });

    entries.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    return entries;
}

// REST API routes
app.get('/', (req, res) => {
    res.json({
        name: 'KWIZ Server',
        version: '1.0.0',
        status: 'running',
        activeSessions: quizSessions.size,
        totalParticipants: participants.size,
    });
});

app.get('/api/sessions', (req, res) => {
    const sessions = Array.from(quizSessions.values()).map((s) => ({
        id: s.id,
        code: s.code,
        title: s.title,
        hostName: s.hostName,
        totalQuestions: s.totalQuestions,
        participants: s.participants.size,
        status: s.status,
    }));
    res.json(sessions);
});

app.post('/api/sessions', (req, res) => {
    const { title, hostName, questions } = req.body;
    const session = {
        id: uuidv4(),
        code: generateQuizCode(),
        title: title || 'New Quiz',
        hostName: hostName || 'Anonymous Host',
        questions: questions || DEMO_QUESTIONS,
        totalQuestions: (questions || DEMO_QUESTIONS).length,
        currentQuestionIndex: -1,
        status: 'waiting',
        participants: new Map(),
        createdAt: new Date(),
    };
    quizSessions.set(session.code, session);
    res.json({ success: true, code: session.code, id: session.id });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    const participantId = uuidv4();
    console.log(`🔌 Client connected: ${socket.id} (Participant: ${participantId})`);

    // Send participant ID to client
    socket.emit('connection:established', { participantId });

    // Join quiz
    socket.on('join:quiz', (data) => {
        const { code, displayName, avatarId } = data;
        console.log(`📥 Join request: ${displayName} -> ${code}`);

        const session = quizSessions.get(code.toUpperCase());
        if (!session) {
            socket.emit('connection:error', { message: 'Quiz not found' });
            return;
        }

        // Create participant
        const participant = {
            id: participantId,
            socketId: socket.id,
            displayName,
            avatarId,
            score: 0,
            streak: 0,
            answers: [],
            joinedAt: new Date(),
        };

        // Add to session and global participants
        session.participants.set(participantId, participant);
        participants.set(participantId, { ...participant, sessionCode: code });

        // Join socket room
        socket.join(code);

        // Send session info to participant
        socket.emit('quiz:joined', {
            id: session.id,
            code: session.code,
            title: session.title,
            hostName: session.hostName,
            totalQuestions: session.totalQuestions,
            currentQuestionIndex: session.currentQuestionIndex,
            status: session.status,
            participants: session.participants.size,
        });

        // Notify all participants of new join
        io.to(code).emit('participants:count', session.participants.size);
        socket.to(code).emit('participant:joined', { displayName, avatarId });

        console.log(`✅ ${displayName} joined quiz ${code} (${session.participants.size} participants)`);
    });

    // Submit answer
    socket.on('submit:answer', (data) => {
        const { questionId, selectedOptionIds, responseTime } = data;
        const participantData = participants.get(participantId);

        if (!participantData) {
            socket.emit('connection:error', { message: 'Not in a quiz session' });
            return;
        }

        const session = quizSessions.get(participantData.sessionCode);
        if (!session || session.status !== 'active') {
            return;
        }

        const participant = session.participants.get(participantId);
        const currentQuestion = session.questions[session.currentQuestionIndex];

        if (!currentQuestion || currentQuestion.id !== questionId) {
            return;
        }

        // Check if answer is correct
        const isCorrect = selectedOptionIds.every((id) =>
            currentQuestion.correctOptionIds.includes(id)
        ) && selectedOptionIds.length === currentQuestion.correctOptionIds.length;

        // Update streak
        if (isCorrect) {
            participant.streak += 1;
        } else {
            participant.streak = 0;
        }

        // Calculate points
        const pointsEarned = isCorrect
            ? calculatePoints(currentQuestion.points, responseTime, currentQuestion.timeLimit, participant.streak)
            : 0;

        participant.score += pointsEarned;
        participant.answers.push({
            questionId,
            selectedOptionIds,
            isCorrect,
            pointsEarned,
            responseTime,
        });

        // Send result to participant
        socket.emit('quiz:answer-result', {
            isCorrect,
            correctOptionIds: currentQuestion.correctOptionIds,
            pointsEarned,
            newScore: participant.score,
            newStreak: participant.streak,
        });

        console.log(`📝 ${participant.displayName} answered ${isCorrect ? '✓' : '✗'} (+${pointsEarned} pts)`);
    });

    // Leave quiz
    socket.on('leave:quiz', () => {
        const participantData = participants.get(participantId);
        if (participantData) {
            const session = quizSessions.get(participantData.sessionCode);
            if (session) {
                session.participants.delete(participantId);
                socket.leave(participantData.sessionCode);
                io.to(participantData.sessionCode).emit('participants:count', session.participants.size);
                socket.to(participantData.sessionCode).emit('participant:left', participantId);
                console.log(`👋 Participant ${participantId} left quiz ${participantData.sessionCode}`);
            }
            participants.delete(participantId);
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        const participantData = participants.get(participantId);
        if (participantData) {
            const session = quizSessions.get(participantData.sessionCode);
            if (session) {
                session.participants.delete(participantId);
                io.to(participantData.sessionCode).emit('participants:count', session.participants.size);
                io.to(participantData.sessionCode).emit('participant:left', participantId);
            }
            participants.delete(participantId);
        }
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

// Host control functions (for testing via API)
// Active timers for auto-advance
const activeTimers = new Map();

// Helper function to advance to next question
function advanceQuestion(sessionCode) {
    const session = quizSessions.get(sessionCode);
    if (!session || session.status !== 'active') return;

    session.currentQuestionIndex += 1;

    if (session.currentQuestionIndex >= session.questions.length) {
        // Quiz ended
        session.status = 'ended';
        const leaderboard = getLeaderboard(session);

        leaderboard.forEach((entry, index) => {
            const participant = session.participants.get(entry.participantId);
            if (participant) {
                io.to(participant.socketId).emit('quiz:ended', {
                    rank: index + 1,
                    totalParticipants: leaderboard.length,
                    score: entry.score,
                });
            }
        });

        // Clear any active timer
        if (activeTimers.has(sessionCode)) {
            clearTimeout(activeTimers.get(sessionCode));
            activeTimers.delete(sessionCode);
        }

        console.log(`🏁 Quiz ${session.code} ended!`);
        io.to(session.code).emit('quiz:ended', { final: true });
    } else {
        // Send next question
        const question = session.questions[session.currentQuestionIndex];

        // Update session state for all clients
        io.to(session.code).emit('session:update', {
            currentQuestionIndex: session.currentQuestionIndex,
            status: session.status,
        });

        io.to(session.code).emit('quiz:question', question);
        io.to(session.code).emit('quiz:leaderboard', getLeaderboard(session));

        console.log(`➡️ Quiz ${session.code}: Question ${session.currentQuestionIndex + 1}`);

        // Schedule next question (auto-advance after time limit + 3 seconds for result display)
        const advanceDelay = (question.timeLimit + 3) * 1000;
        const timer = setTimeout(() => advanceQuestion(sessionCode), advanceDelay);
        activeTimers.set(sessionCode, timer);
    }
}

app.post('/api/sessions/:code/start', (req, res) => {
    const session = quizSessions.get(req.params.code.toUpperCase());
    if (!session) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    const autoAdvance = req.query.auto === 'true' || req.body.auto === true;

    session.status = 'active';
    session.currentQuestionIndex = 0;

    io.to(session.code).emit('quiz:started');
    io.to(session.code).emit('quiz:question', session.questions[0]);

    console.log(`🎮 Quiz ${session.code} started!${autoAdvance ? ' (auto-advance enabled)' : ''}`);

    // If auto-advance is enabled, schedule next question
    if (autoAdvance) {
        const question = session.questions[0];
        const advanceDelay = (question.timeLimit + 3) * 1000;
        const timer = setTimeout(() => advanceQuestion(session.code), advanceDelay);
        activeTimers.set(session.code, timer);
    }

    res.json({ success: true, message: 'Quiz started', autoAdvance });
});

app.post('/api/sessions/:code/next', (req, res) => {
    const session = quizSessions.get(req.params.code.toUpperCase());
    if (!session) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    session.currentQuestionIndex += 1;

    if (session.currentQuestionIndex >= session.questions.length) {
        // Quiz ended
        session.status = 'ended';
        const leaderboard = getLeaderboard(session);

        leaderboard.forEach((entry, index) => {
            const participant = session.participants.get(entry.participantId);
            if (participant) {
                io.to(participant.socketId).emit('quiz:ended', {
                    rank: index + 1,
                    totalParticipants: leaderboard.length,
                    score: entry.score,
                });
            }
        });

        console.log(`🏁 Quiz ${session.code} ended!`);
        res.json({ success: true, message: 'Quiz ended', leaderboard });
    } else {
        // Send next question
        const question = session.questions[session.currentQuestionIndex];
        io.to(session.code).emit('quiz:question', question);
        io.to(session.code).emit('quiz:leaderboard', getLeaderboard(session));

        console.log(`➡️ Quiz ${session.code}: Question ${session.currentQuestionIndex + 1}`);
        res.json({ success: true, questionIndex: session.currentQuestionIndex });
    }
});

app.post('/api/sessions/:code/pause', (req, res) => {
    const session = quizSessions.get(req.params.code.toUpperCase());
    if (!session) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    session.status = 'paused';
    io.to(session.code).emit('host:paused');
    res.json({ success: true, message: 'Quiz paused' });
});

app.post('/api/sessions/:code/resume', (req, res) => {
    const session = quizSessions.get(req.params.code.toUpperCase());
    if (!session) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    session.status = 'active';
    io.to(session.code).emit('host:resumed');
    res.json({ success: true, message: 'Quiz resumed' });
});

app.get('/api/sessions/:code/leaderboard', (req, res) => {
    const session = quizSessions.get(req.params.code.toUpperCase());
    if (!session) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(getLeaderboard(session));
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log('');
    console.log('========================================');
    console.log('    KWIZ Backend Server');
    console.log('========================================');
    console.log('');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket ready on ws://localhost:${PORT}`);
    console.log('');

    // Create demo session
    createDemoSession();

    console.log('');
    console.log('📖 API Endpoints:');
    console.log('   GET  /                           - Server status');
    console.log('   GET  /api/sessions               - List sessions');
    console.log('   POST /api/sessions               - Create session');
    console.log('   POST /api/sessions/:code/start   - Start quiz');
    console.log('   POST /api/sessions/:code/next    - Next question');
    console.log('   POST /api/sessions/:code/pause   - Pause quiz');
    console.log('   POST /api/sessions/:code/resume  - Resume quiz');
    console.log('   GET  /api/sessions/:code/leaderboard - Get leaderboard');
    console.log('');
    console.log('💡 Demo quiz code: DEMO01');
    console.log('');
});
