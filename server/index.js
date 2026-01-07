/**
 * KWIZ Backend Server
 * Simple Node.js server for testing real-time quiz functionality
 */

// Load environment variables from .env file
require('dotenv').config();

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
    const { title, hostName, questions, code: requestedCode } = req.body;

    // Validate questions are provided
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Questions are required to create a quiz session'
        });
    }

    // Use provided code if valid, otherwise generate new one
    let finalCode = requestedCode;
    if (!finalCode || quizSessions.has(finalCode)) {
        finalCode = generateQuizCode();
    }

    const session = {
        id: uuidv4(),
        code: finalCode,
        title: title || 'New Quiz',
        hostName: hostName || 'Anonymous Host',
        questions: questions,
        totalQuestions: questions.length,
        currentQuestionIndex: -1,
        status: 'waiting',
        participants: new Map(),
        createdAt: new Date(),
    };
    quizSessions.set(session.code, session);
    console.log(`📋 New session created: ${session.code} - "${session.title}" by ${session.hostName} (${questions.length} questions)`);
    res.json({ success: true, code: session.code, id: session.id });
});

// AI Question Generation (Premium Feature)
// Priority: 1) OpenRouter (default, free tier available), 2) OpenAI, 3) Mock data
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// System prompt for AI question generation
const AI_SYSTEM_PROMPT = `You are a quiz question generator. Generate a trivia question with exactly 4 answer options. 
Return ONLY a valid JSON object with this exact format (no markdown, no code blocks):
{"text": "question text here", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0}
The correctIndex should be 0, 1, 2, or 3 indicating which option is correct.`;

app.post('/api/ai/generate-question', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    console.log(`🤖 AI Generation request: "${prompt}"`);

    // Try OpenRouter first (default - has free tier with Devstral 2)
    if (OPENROUTER_API_KEY) {
        try {
            console.log('📡 Using OpenRouter API...');
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'https://kwiz.app',
                    'X-Title': 'KWIZ Quiz App',
                },
                body: JSON.stringify({
                    // Devstral 2512 - Free tier model
                    model: 'mistralai/devstral-2512:free',
                    messages: [
                        { role: 'system', content: AI_SYSTEM_PROMPT },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 300,
                }),
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                let content = data.choices[0].message.content;
                // Clean up response - remove markdown code blocks if present
                content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

                try {
                    const question = JSON.parse(content);
                    console.log('✅ OpenRouter Generated question:', question.text);
                    return res.json({ success: true, question, provider: 'openrouter' });
                } catch (parseError) {
                    console.error('Failed to parse OpenRouter response:', content);
                }
            } else if (data.error) {
                console.error('OpenRouter API error:', data.error);
            }
        } catch (error) {
            console.error('OpenRouter API error:', error.message);
        }
    }

    // Fallback to OpenAI if configured
    if (OPENAI_API_KEY) {
        try {
            console.log('📡 Falling back to OpenAI API...');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: AI_SYSTEM_PROMPT },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 200,
                }),
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                const content = data.choices[0].message.content;
                try {
                    const question = JSON.parse(content);
                    console.log('✅ OpenAI Generated question:', question.text);
                    return res.json({ success: true, question, provider: 'openai' });
                } catch (parseError) {
                    console.error('Failed to parse OpenAI response:', content);
                }
            }
        } catch (error) {
            console.error('OpenAI API error:', error.message);
        }
    }

    // Fallback: return a mock question (for demo/testing)
    const mockQuestions = [
        {
            text: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            correctIndex: 2,
        },
        {
            text: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            correctIndex: 1,
        },
        {
            text: 'Who painted the Mona Lisa?',
            options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
            correctIndex: 1,
        },
        {
            text: 'What is the largest ocean on Earth?',
            options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
            correctIndex: 3,
        },
        {
            text: 'In what year did World War II end?',
            options: ['1943', '1944', '1945', '1946'],
            correctIndex: 2,
        },
    ];

    const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
    console.log('📝 Returning mock question (no API key configured)');
    res.json({ success: true, question: randomQuestion, provider: 'mock' });
});

// Bulk AI Question Generation - generates multiple unique questions in one call
app.post('/api/ai/generate-questions-bulk', async (req, res) => {
    const { prompt, count = 5 } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const questionCount = Math.min(Math.max(count, 1), 10); // Limit between 1-10
    console.log(`🤖 Bulk AI Generation request: ${questionCount} questions for "${prompt}"`);

    // System prompt for bulk generation
    const BULK_SYSTEM_PROMPT = `You are a quiz question generator. Generate exactly ${questionCount} UNIQUE and DIFFERENT trivia questions based on the user's topic.
Each question must be completely different from the others - different facts, different concepts.
Return ONLY a valid JSON array with this exact format (no markdown, no code blocks):
[
  {"text": "question 1 text", "options": ["A", "B", "C", "D"], "correctIndex": 0},
  {"text": "question 2 text", "options": ["A", "B", "C", "D"], "correctIndex": 1},
  ...
]
The correctIndex should be 0, 1, 2, or 3 indicating which option is correct.
Make sure each question tests a DIFFERENT fact or concept. Do NOT repeat similar questions.`;

    // Try OpenRouter first
    if (OPENROUTER_API_KEY) {
        try {
            console.log('📡 Using OpenRouter API for bulk generation...');
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'https://kwiz.app',
                    'X-Title': 'KWIZ Quiz App',
                },
                body: JSON.stringify({
                    model: 'mistralai/devstral-2512:free',
                    messages: [
                        { role: 'system', content: BULK_SYSTEM_PROMPT },
                        { role: 'user', content: `Generate ${questionCount} unique quiz questions about: ${prompt}` }
                    ],
                    temperature: 0.9, // Higher temperature for more variety
                    max_tokens: 1500, // More tokens for multiple questions
                }),
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                let content = data.choices[0].message.content;
                // Clean up response
                content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

                try {
                    const questions = JSON.parse(content);
                    if (Array.isArray(questions) && questions.length > 0) {
                        console.log(`✅ OpenRouter Generated ${questions.length} unique questions`);
                        return res.json({ success: true, questions, provider: 'openrouter' });
                    }
                } catch (parseError) {
                    console.error('Failed to parse bulk response:', content);
                }
            } else if (data.error) {
                console.error('OpenRouter API error:', data.error);
            }
        } catch (error) {
            console.error('OpenRouter bulk API error:', error.message);
        }
    }

    // Fallback to OpenAI
    if (OPENAI_API_KEY) {
        try {
            console.log('📡 Falling back to OpenAI for bulk generation...');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: BULK_SYSTEM_PROMPT },
                        { role: 'user', content: `Generate ${questionCount} unique quiz questions about: ${prompt}` }
                    ],
                    temperature: 0.9,
                    max_tokens: 1500,
                }),
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                let content = data.choices[0].message.content;
                content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

                try {
                    const questions = JSON.parse(content);
                    if (Array.isArray(questions) && questions.length > 0) {
                        console.log(`✅ OpenAI Generated ${questions.length} unique questions`);
                        return res.json({ success: true, questions, provider: 'openai' });
                    }
                } catch (parseError) {
                    console.error('Failed to parse OpenAI bulk response:', content);
                }
            }
        } catch (error) {
            console.error('OpenAI bulk API error:', error.message);
        }
    }

    // Fallback: return mock questions
    const mockQuestions = [
        { text: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctIndex: 2 },
        { text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1 },
        { text: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Michelangelo'], correctIndex: 1 },
        { text: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3 },
        { text: 'In what year did WW2 end?', options: ['1943', '1944', '1945', '1946'], correctIndex: 2 },
    ];

    const selectedQuestions = mockQuestions.slice(0, questionCount);
    console.log(`📝 Returning ${selectedQuestions.length} mock questions`);
    res.json({ success: true, questions: selectedQuestions, provider: 'mock' });
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

// Helper function to send answer stats and then advance to next question
function endCurrentQuestion(sessionCode) {
    const session = quizSessions.get(sessionCode);
    if (!session || session.status !== 'active') return;

    const currentQuestionIndex = session.currentQuestionIndex;
    const currentQuestion = session.questions[currentQuestionIndex];

    // Calculate and send answer statistics for the current question
    const answerStats = calculateAnswerStats(session, currentQuestionIndex);
    io.to(session.code).emit('quiz:answer-stats', {
        questionId: currentQuestion.id,
        correctOptionIds: currentQuestion.correctOptionIds,
        stats: answerStats,
    });

    console.log(`📊 Quiz ${session.code}: Sent stats for Q${currentQuestionIndex + 1}`);

    // Wait 3 seconds for reveal phase, then advance
    setTimeout(() => advanceToNextQuestion(sessionCode), 3000);
}

// Helper function to advance to next question (called after reveal)
function advanceToNextQuestion(sessionCode) {
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

        // Emit leaderboard one final time
        io.to(session.code).emit('quiz:leaderboard', leaderboard);
        io.to(session.code).emit('quiz:ended', { final: true });

        console.log(`🏁 Quiz ${session.code} ended!`);
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

        // Schedule end of this question (timer runs for timeLimit seconds)
        const timer = setTimeout(() => endCurrentQuestion(sessionCode), question.timeLimit * 1000);
        activeTimers.set(sessionCode, timer);
    }
}

// Calculate answer statistics for a question
function calculateAnswerStats(session, questionIndex) {
    const question = session.questions[questionIndex];
    const stats = {};

    // Initialize stats for all options
    question.options.forEach(opt => {
        stats[opt.id] = { count: 0, percentage: 0, text: opt.text };
    });

    // Count votes for each option
    let totalVotes = 0;
    session.participants.forEach(participant => {
        const answer = participant.answers.find(a => a.questionId === question.id);
        if (answer && answer.selectedOptionIds.length > 0) {
            answer.selectedOptionIds.forEach(optId => {
                if (stats[optId]) {
                    stats[optId].count++;
                    totalVotes++;
                }
            });
        }
    });

    // Calculate percentages
    Object.keys(stats).forEach(optId => {
        stats[optId].percentage = totalVotes > 0
            ? Math.round((stats[optId].count / totalVotes) * 100)
            : 0;
    });

    return stats;
}

app.post('/api/sessions/:code/start', (req, res) => {
    const session = quizSessions.get(req.params.code.toUpperCase());
    if (!session) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    const autoAdvance = req.query.auto === 'true' || req.body.auto === true;

    session.status = 'active';
    session.currentQuestionIndex = 0;

    // Send session update first so client knows the question index
    io.to(session.code).emit('session:update', {
        currentQuestionIndex: session.currentQuestionIndex,
        status: session.status,
    });

    io.to(session.code).emit('quiz:started');
    io.to(session.code).emit('quiz:question', session.questions[0]);

    console.log(`🎮 Quiz ${session.code} started!${autoAdvance ? ' (auto-advance enabled)' : ''}`);

    // If auto-advance is enabled, schedule end of first question after timer
    if (autoAdvance) {
        const question = session.questions[0];
        const timer = setTimeout(() => endCurrentQuestion(session.code), question.timeLimit * 1000);
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
    console.log('✅ Server ready - Host a quiz from the app to get started!');
    console.log('');
});
