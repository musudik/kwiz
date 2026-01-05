# KWIZ Server

Simple Node.js backend server for the KWIZ real-time quiz platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or use development mode with auto-reload
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server status |
| GET | `/api/sessions` | List all quiz sessions |
| POST | `/api/sessions` | Create a new quiz session |
| POST | `/api/sessions/:code/start` | Start a quiz |
| POST | `/api/sessions/:code/next` | Move to next question |
| POST | `/api/sessions/:code/pause` | Pause the quiz |
| POST | `/api/sessions/:code/resume` | Resume the quiz |
| GET | `/api/sessions/:code/leaderboard` | Get quiz leaderboard |

## WebSocket Events

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `join:quiz` | `{ code, displayName, avatarId }` | Join a quiz session |
| `submit:answer` | `{ questionId, selectedOptionIds, responseTime }` | Submit an answer |
| `leave:quiz` | - | Leave the current quiz |

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `connection:established` | `{ participantId }` | Connection confirmed |
| `connection:error` | `{ message }` | Connection error |
| `quiz:joined` | `{ session }` | Successfully joined quiz |
| `quiz:started` | - | Quiz has started |
| `quiz:question` | `{ question }` | New question received |
| `quiz:answer-result` | `{ isCorrect, pointsEarned, ... }` | Answer result |
| `quiz:leaderboard` | `[{ rank, displayName, score, ... }]` | Updated leaderboard |
| `quiz:ended` | `{ rank, totalParticipants, score }` | Quiz ended |
| `participants:count` | `count` | Participant count updated |
| `host:paused` | - | Quiz paused by host |
| `host:resumed` | - | Quiz resumed by host |

## Demo Quiz

A demo quiz is automatically created on server start with code: **DEMO01**

To test:
1. Start the server: `npm start`
2. Join the demo quiz in the app with code `DEMO01`
3. Start the quiz: `curl -X POST http://localhost:3001/api/sessions/DEMO01/start`
4. Advance questions: `curl -X POST http://localhost:3001/api/sessions/DEMO01/next`

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |

## Creating Custom Quizzes

```javascript
// POST /api/sessions
{
  "title": "My Custom Quiz",
  "hostName": "Quiz Master",
  "questions": [
    {
      "id": "q1",
      "text": "What is 2+2?",
      "options": [
        { "id": 0, "text": "3" },
        { "id": 1, "text": "4" },
        { "id": 2, "text": "5" }
      ],
      "correctOptionIds": [1],
      "timeLimit": 30,
      "points": 100,
      "type": "mcq"
    }
  ]
}
```
