# Product Requirements Document (PRD)

## PRODUCT NAME - KWIZ (Real-Time Global Quiz Platform)

![Design Theme Reference](./design-reference.png)

---

## 1. Overview

This PRD defines the requirements for **KWIZ** — a **premium, engaging Real-Time Global Quiz Platform** built as a **mobile application using Expo (iOS & Android)**. The platform is designed primarily for **event organizers, educators, and corporate training teams** to host immersive, large-scale live quizzes with up to **500 concurrent global participants**, ensuring **ultra-low latency, high reliability, gamification elements, and seamless onboarding via QR codes**.

The application combines the excitement of competitive gaming with the simplicity of modern UX design, featuring a **warm, cozy visual theme**, animated mascots, and engaging feedback mechanisms that make learning and competition fun.

---

## 2. Vision Statement

> *"Transform every quiz into an unforgettable experience where learning meets excitement, and competition feels like play."*

---

## 3. Goals & Objectives

### Primary Goals
- Enable immersive real-time quizzes for live events, education, and corporate training
- Support up to **500 concurrent players globally** (scalable to 1000+)
- Minimize latency: question delivery < 200ms, answer submission < 300ms
- Simplify participant onboarding using **instant QR code access**
- Create a **visually stunning, premium experience** that delights users

### Secondary Goals
- Increase engagement through gamification (XP, levels, achievements, streaks)
- Build brand recognition through memorable mascot characters
- Enable hosts to customize quiz themes and branding
- Provide comprehensive analytics for organizers

---

## 4. Target Audience

### Primary Users
| User Type | Description | Key Needs |
|-----------|-------------|-----------|
| **Event Organizers** | Conferences, meetups, community events | Crowd engagement, easy setup, branding |
| **Educators & Trainers** | Teachers, corporate L&D teams | Assessment, progress tracking, engagement |
| **Team Leads** | Managers, HR professionals | Team building, knowledge sharing |

### Secondary Users
| User Type | Description | Key Needs |
|-----------|-------------|-----------|
| **Participants** | Employees, students, attendees, trainees | Fun experience, easy join, competition |
| **Spectators** | Live audience viewers | Watch leaderboards, engagement |

---

## 5. Design System & Visual Theme

### 5.1 Color Palette (Warm Chocolate Theme)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Primary Background** | `#5D4E42` | Main app background, deep brown |
| **Secondary Background** | `#6B5B4F` | Cards, elevated surfaces |
| **Accent Brown Light** | `#8B7355` | Secondary elements, dividers |
| **Cream** | `#F5E6D3` | Text, highlights, soft contrast |
| **Warm Beige** | `#E8D4C4` | Secondary text, muted elements |
| **Progress Orange** | `#E88A4C` | Progress bars, XP indicators |
| **Soft Gold** | `#D4A574` | Achievements, premium highlights |
| **Success Green** | `#7CB97C` | Correct answers, positive feedback |
| **Error Red** | `#CC6B6B` | Wrong answers, warnings |
| **Pure White** | `#FFFFFF` | High contrast text, icons |

### 5.2 Typography

| Element | Font Family | Weight | Size |
|---------|-------------|--------|------|
| **Display Titles** | Playfair Display / Merriweather | Bold | 32-48px |
| **Headings** | Outfit / Poppins | SemiBold | 20-28px |
| **Body Text** | Inter / Nunito | Regular | 14-18px |
| **Labels** | Inter / Nunito | Medium | 12-14px |
| **Numbers/Scores** | Space Mono / JetBrains Mono | Bold | Variable |

### 5.3 Visual Elements

#### Shadows & Depth
```css
/* Soft shadow for cards */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);

/* Elevated components */
box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(93, 78, 66, 0.3);

/* Inner glow for active elements */
box-shadow: inset 0 0 20px rgba(232, 138, 76, 0.2);
```

#### Border Radius
- **Cards & Containers:** 24px
- **Buttons:** 16px (pill shape for CTAs: 50%)
- **Input Fields:** 12px
- **Profile Images:** 50% (circular)
- **Progress Bars:** 8px

#### Glassmorphism Effects
```css
background: rgba(93, 78, 66, 0.7);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(245, 230, 211, 0.1);
```

### 5.4 Mascot System (KWIZ Characters)

Introduce cute, expressive 3D mascot characters that guide users and celebrate achievements:

| Character | Role | Appearance |
|-----------|------|------------|
| **Kwizzy the Cat** | Main mascot | Blue/teal cat with big eyes, wears hoodie |
| **Professor Owl** | Educator mode | Brown owl with glasses, scholarly look |
| **Sparky the Fox** | Speed rounds | Orange fox, energetic pose |
| **Bruno the Bear** | Team challenges | Friendly brown bear, team captain |

Characters appear in:
- Loading screens
- Victory/defeat animations
- Achievement unlocks
- Streak celebrations
- Tutorial guides

### 5.5 Animations & Micro-interactions

| Interaction | Animation Type | Duration |
|-------------|----------------|----------|
| **Screen transitions** | Smooth slide with parallax | 300ms |
| **Button press** | Scale down + haptic feedback | 100ms |
| **Correct answer** | Confetti + character dance | 800ms |
| **Wrong answer** | Gentle shake + encouragement | 400ms |
| **Score update** | Counting animation + bounce | 600ms |
| **Level up** | Burst particles + fanfare | 1200ms |
| **Streak milestone** | Fire trail + glow pulse | 1000ms |
| **Timer warning** | Pulse + color shift | 500ms loop |

---

## 6. User Roles & Permissions

### 6.1 Super Admin
- All Admin/Manager permissions
- Manage organization accounts
- Access global analytics
- Configure system settings
- Manage mascots and themes

### 6.2 Admin / Manager (Quiz Host)
- Create, edit, and schedule quizzes
- Import questions from templates/CSV
- Generate branded QR codes for quiz access
- Customize quiz themes and branding
- Start, pause, skip, and end live quizzes
- View participant profiles (name, avatar, join time, device, score)
- Remove/mute participants from ongoing quiz
- View real-time leaderboard and final results
- Export results to CSV/PDF
- Send in-app announcements to participants

### 6.3 Participant (Player)
- Join quiz via QR code or link (no persistent account required)
- Optional: Create profile for persistent stats
- Choose avatar/display name before joining
- Answer live quiz questions
- Use power-ups (if enabled)
- View own score, rank, and leaderboard
- Earn XP, badges, and achievements
- Share results to social media

### 6.4 Spectator (View-Only)
- Watch live quiz progression
- View real-time leaderboard
- Cannot submit answers
- Optional: React/cheer for participants

---

## 7. Core Features

### 7.1 Quiz Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Multiple Choice (MCQ)** | Single correct answer, 2-6 options | General knowledge, training |
| **Multi-Select** | Multiple correct answers | Complex topics |
| **True/False** | Binary choice | Quick assessments |
| **Image-Based** | Identify image content | Visual learning |
| **Speed Round** | Faster timers, bonus points | High-energy moments |
| **Poll Mode** | No correct answer, gather opinions | Feedback, ice-breakers |
| **Team Battle** | Teams compete collectively | Team building |
| **Survival Mode** | Wrong answer = elimination | High stakes fun |

### 7.2 Question Properties

```typescript
interface Question {
  questionId: string;
  quizId: string;
  type: 'mcq' | 'multi-select' | 'true-false' | 'image-based' | 'poll';
  text: string;
  imageUrl?: string;          // Optional question image
  audioUrl?: string;          // Optional audio clip
  options: Option[];          // 2-6 options
  correctOptions: number[];   // Indices of correct answers
  timeLimit: number;          // Seconds (10-120)
  points: number;             // Base points (100-1000)
  bonusTimePoints: boolean;   // Extra points for faster answers
  difficultyLevel: 'easy' | 'medium' | 'hard';
  category?: string;          // Optional category tag
  explanation?: string;       // Show after answer (educational)
}

interface Option {
  id: number;
  text: string;
  imageUrl?: string;          // Optional option image
}
```

### 7.3 Gamification System

#### Experience Points (XP) & Levels
- Earn XP for every correct answer
- Bonus XP for speed, streaks, and difficulty
- Level up every 1000 XP
- Display current level and progress bar (like "Level 2 • 5 of 10")

#### Achievements & Badges
| Badge | Requirement | Icon |
|-------|-------------|------|
| **First Quiz** | Complete first quiz | 🌟 |
| **Speed Demon** | 5 answers in <3 seconds | ⚡ |
| **Perfect Score** | 100% accuracy in a quiz | 🏆 |
| **Streak Master** | 10 correct answers in a row | 🔥 |
| **Early Bird** | Join quiz within 30 seconds | 🐦 |
| **Social Butterfly** | Share results 5 times | 🦋 |
| **Team Player** | Win 3 team battles | 🤝 |

#### Streaks
- Visual streak counter with fire animation
- Streak multiplier (2x, 3x, 4x points)
- Streak freeze power-up available

### 7.4 Power-Ups (Optional Feature)

| Power-Up | Effect | Availability |
|----------|--------|--------------|
| **50:50** | Remove 2 wrong options | 1 per quiz |
| **Double Points** | 2x points for next question | 1 per quiz |
| **Time Freeze** | +10 seconds on timer | 1 per quiz |
| **Peek** | See percentage of other answers | 1 per quiz |
| **Shield** | Protect streak if wrong | 1 per quiz |

---

## 8. QR Code-Based Registration

### 8.1 QR Code Features
- Each quiz session generates a **unique, branded QR code**
- QR code includes quiz name and optional custom branding
- Visual QR design matches app theme (warm brown tones)
- QR code provides **one-time or multi-use access** (configurable)
- Animated QR display for projection screens
- Auto-refresh QR for security (optional)

### 8.2 Join Flow (Optimized for Speed)
```
1. Scan QR Code (or click link)
         ↓ (< 1 second)
2. App opens / Deep link handled
         ↓ (instant)
3. Quick profile setup:
   - Choose avatar (mascot selection)
   - Enter display name (auto-suggest available)
         ↓ (< 5 seconds)
4. Enter waiting lobby
         ↓ (host starts)
5. Quiz begins!
```

**Total join time target: < 8 seconds**

---

## 9. Screen-by-Screen Requirements

### 9.1 Splash Screen
- Animated KWIZ logo with mascot wave
- Warm gradient background (#5D4E42 → #6B5B4F)
- Loading indicator with pulsing animation
- Duration: 2-3 seconds

### 9.2 Home Screen (Participant)
- Large QR scanner button (primary CTA)
- "Enter Quiz Code" text input alternative
- Recent quizzes (if profile exists)
- Current level, XP, streak display
- Mascot greeting with time-aware message
- Quick access to achievements and profile

### 9.3 Join Quiz Screen
- Avatar selector (6-8 cute mascot options)
- Display name input with validation
- Quiz preview (title, host name, participant count)
- Animated "Waiting for host..." indicator
- Participant list with avatars (max 20 visible)

### 9.4 Live Quiz Screen (Participant)
**Header:**
- Question number / total (e.g., "5 of 10")
- Progress bar (orange fill, rounded)
- Timer (circular countdown, color warning <5s)
- Current score with XP animation
- Streak indicator (🔥 x3)

**Question Area:**
- Large question text (cream color, readable)
- Optional image (expandable)
- Option buttons (2-6, evenly distributed)
- Selected state with smooth highlight

**Answer Grid:**
- Cream/beige text on brown cards
- Rounded corners (16px)
- Press animation (scale + haptic)
- Correct: Green glow + checkmark
- Wrong: Red shake + X mark

### 9.5 Results Screen
- Rank banner with trophy for top 3
- Animated score counter
- Mascot reaction (celebrate/encourage)
- Stats breakdown:
  - Correct/Wrong ratio
  - Average response time
  - XP earned
  - Streak achieved
- Leaderboard preview (top 10)
- Share button (social card generation)
- "Play Again" CTA

### 9.6 Admin Dashboard
- Clean card-based layout
- Quick actions: Create Quiz, Start Existing, View Analytics
- Recent quizzes with status indicators
- Live quiz monitoring panel
- Participant management tools
- Export and sharing options

### 9.7 Quiz Creation (Admin)
- Step-by-step wizard with progress indicator
- Question editor with live preview
- Bulk import (CSV, JSON)
- Question bank library
- Theme customizer
- QR code preview and download

---

## 10. Technical Architecture

### 10.1 Frontend (Mobile App)

```
Expo (React Native) with:
├── expo-router (navigation)
├── react-native-reanimated (animations)
├── lottie-react-native (mascot animations)
├── socket.io-client (real-time)
├── expo-haptics (tactile feedback)
├── expo-barcode-scanner (QR)
├── expo-av (audio effects)
├── zustand (state management)
├── react-query (server state)
└── styled-components / nativewind (styling)
```

### 10.2 Backend Services

```
Primary API (Node.js + TypeScript):
├── NestJS framework
├── Socket.IO (WebSocket server)
├── Redis (real-time state, pub/sub)
├── PostgreSQL (persistent data)
├── Prisma ORM
└── Bull (job queues)

Services:
├── Quiz Service (CRUD, templates)
├── Session Service (live game management)
├── Participant Service (join, score)
├── Analytics Service (metrics, exports)
├── Notification Service (push, in-app)
└── Media Service (images, QR codes)
```

### 10.3 Infrastructure

```
Cloud (AWS / GCP / Azure):
├── Kubernetes (container orchestration)
├── WebSocket Gateway (load balanced)
├── Redis Cluster (session state)
├── PostgreSQL (managed, replicated)
├── S3/Cloud Storage (media assets)
├── CDN (static assets, global)
├── CloudFront/Cloud CDN (edge caching)
└── Auto-scaling (based on connections)
```

### 10.4 Real-Time Architecture

```
┌─────────────────┐    WebSocket    ┌──────────────────┐
│  Participant 1  │◄────────────────►│                  │
├─────────────────┤                  │                  │
│  Participant 2  │◄────────────────►│  Socket Gateway  │
├─────────────────┤                  │  (Load Balanced) │
│  Participant N  │◄────────────────►│                  │
└─────────────────┘                  └────────┬─────────┘
                                              │
                                              ▼
                                     ┌────────────────┐
                                     │  Redis Pub/Sub │
                                     │  (State Sync)  │
                                     └────────────────┘
```

---

## 11. Data Model

```prisma
model Organization {
  id        String    @id @default(cuid())
  name      String
  branding  Json?     // Custom colors, logo
  admins    Admin[]
  quizzes   Quiz[]
  createdAt DateTime  @default(now())
}

model Admin {
  id             String        @id @default(cuid())
  email          String        @unique
  passwordHash   String
  name           String
  role           Role          @default(MANAGER)
  organization   Organization  @relation(fields: [orgId], references: [id])
  orgId          String
  quizzesCreated Quiz[]
  createdAt      DateTime      @default(now())
}

model Quiz {
  id          String        @id @default(cuid())
  title       String
  description String?
  status      QuizStatus    @default(DRAFT)
  theme       Json?         // Custom theme overrides
  settings    Json          // Time limits, power-ups, etc.
  questions   Question[]
  sessions    QuizSession[]
  createdBy   Admin         @relation(fields: [adminId], references: [id])
  adminId     String
  org         Organization  @relation(fields: [orgId], references: [id])
  orgId       String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Question {
  id              String   @id @default(cuid())
  quiz            Quiz     @relation(fields: [quizId], references: [id])
  quizId          String
  type            QuestionType
  text            String
  imageUrl        String?
  options         Json     // Array of {id, text, imageUrl?}
  correctOptions  Int[]
  timeLimit       Int      @default(30)
  points          Int      @default(100)
  difficulty      Difficulty @default(MEDIUM)
  explanation     String?
  order           Int
  createdAt       DateTime @default(now())
}

model QuizSession {
  id            String        @id @default(cuid())
  quiz          Quiz          @relation(fields: [quizId], references: [id])
  quizId        String
  code          String        @unique  // 6-digit join code
  qrCode        String        // Generated QR image URL
  status        SessionStatus @default(WAITING)
  currentQ      Int           @default(0)
  participants  Participant[]
  startedAt     DateTime?
  endedAt       DateTime?
  createdAt     DateTime      @default(now())
}

model Participant {
  id           String       @id @default(cuid())
  session      QuizSession  @relation(fields: [sessionId], references: [id])
  sessionId    String
  displayName  String
  avatarId     Int          @default(1)
  score        Int          @default(0)
  xpEarned     Int          @default(0)
  streak       Int          @default(0)
  maxStreak    Int          @default(0)
  answers      Answer[]
  status       ParticipantStatus @default(ACTIVE)
  deviceInfo   Json?
  joinedAt     DateTime     @default(now())
}

model Answer {
  id            String      @id @default(cuid())
  participant   Participant @relation(fields: [participantId], references: [id])
  participantId String
  questionId    String
  selectedOpts  Int[]
  isCorrect     Boolean
  pointsEarned  Int
  responseTime  Int         // Milliseconds
  submittedAt   DateTime    @default(now())
}

enum Role {
  SUPER_ADMIN
  MANAGER
}

enum QuizStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum SessionStatus {
  WAITING
  IN_PROGRESS
  PAUSED
  COMPLETED
}

enum QuestionType {
  MCQ
  MULTI_SELECT
  TRUE_FALSE
  IMAGE_BASED
  POLL
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum ParticipantStatus {
  ACTIVE
  REMOVED
  DISCONNECTED
}
```

---

## 12. Non-Functional Requirements

### 12.1 Performance
| Metric | Target |
|--------|--------|
| Concurrent participants | 500 (scalable to 1000+) |
| Question delivery latency | < 200ms |
| Answer submission ACK | < 300ms |
| App cold start | < 3 seconds |
| Screen transitions | < 300ms |
| QR scan to lobby | < 3 seconds |

### 12.2 Reliability
- 99.95% uptime SLA during live quizzes
- Graceful degradation on network issues
- Automatic reconnection with state recovery
- Offline answer queue (sync when reconnected)
- Real-time heartbeat monitoring

### 12.3 Security
- End-to-end encryption for quiz data
- QR codes expire after session ends
- Rate limiting on API endpoints
- Admin 2FA authentication
- Session token rotation
- Duplicate join prevention
- Answer submission validation

### 12.4 Scalability
- Horizontal scaling via Kubernetes
- Stateless WebSocket handlers
- Redis cluster for distributed state
- Database connection pooling
- CDN for static assets

### 12.5 Accessibility
- WCAG 2.1 AA compliance
- High contrast mode option
- Screen reader support
- Adjustable text sizes
- Haptic feedback alternatives

---

## 13. Success Metrics & KPIs

### User Engagement
| Metric | Target |
|--------|--------|
| Average join time (QR → lobby) | < 8 seconds |
| Session completion rate | > 95% |
| Average engagement time per quiz | > 10 minutes |
| Repeat participant rate | > 40% |
| Social share rate | > 15% |

### Performance
| Metric | Target |
|--------|--------|
| Uptime during events | 99.95% |
| P95 latency | < 300ms |
| Crash-free sessions | > 99.5% |
| Reconnection success rate | > 98% |

### Host Satisfaction
| Metric | Target |
|--------|--------|
| Quiz creation time | < 10 minutes |
| Host NPS score | > 50 |
| Feature adoption rate | > 60% |

---

## 14. Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- [ ] Project setup with Expo + TypeScript
- [ ] Design system implementation (colors, typography, components)
- [ ] Authentication flow (admin login)
- [ ] Basic quiz CRUD (admin)
- [ ] QR code generation and scanning
- [ ] Participant join flow (name + avatar)
- [ ] WebSocket connection setup

### Phase 2: Core Quiz Experience (Weeks 5-8)
- [ ] Live quiz flow (start, questions, answers, end)
- [ ] Real-time score updates
- [ ] Leaderboard display
- [ ] Timer implementation with animations
- [ ] Correct/wrong answer feedback
- [ ] Results screen with stats
- [ ] Basic admin controls

### Phase 3: Polish & Delight (Weeks 9-12)
- [ ] Mascot animations (Lottie)
- [ ] Sound effects and haptics
- [ ] Streak system with visual effects
- [ ] XP and level system
- [ ] Achievement badges
- [ ] Micro-animations throughout
- [ ] Performance optimization

### Phase 4: Advanced Features (Weeks 13-16)
- [ ] Power-ups implementation
- [ ] Team mode
- [ ] Additional question types (image, multi-select)
- [ ] Question bank and templates
- [ ] Analytics dashboard
- [ ] CSV/PDF exports
- [ ] Push notifications

---

## 15. Future Enhancements (Backlog)

| Feature | Priority | Complexity |
|---------|----------|------------|
| Multi-language support | High | Medium |
| Custom mascot creation | Medium | High |
| AI-powered question generation | Medium | High |
| Live streaming integration | Low | High |
| Persistent user profiles | High | Medium |
| Tournament brackets | Medium | Medium |
| Replay & recording | Low | Medium |
| Enterprise SSO | Medium | Medium |
| White-label solution | Low | High |
| AR question types | Low | Very High |

---

## 16. Assumptions & Constraints

### Assumptions
- Participants have stable internet connectivity (mobile data or WiFi)
- Devices support modern web standards and WebSocket connections
- Events have sufficient projection/display for QR codes
- Host manages one active quiz session at a time

### Constraints
- Initial release targets iOS 13+ and Android 8+
- Expo managed workflow limitations apply
- Real-time features require persistent socket connections
- Mascot animations require Lottie-compatible JSON files

### Dependencies
- Third-party: Google Fonts, Lottie animations, QR code library
- Services: Redis Cloud, PostgreSQL hosting, CDN provider
- Assets: Custom mascot designs (commissioning required)

---

## 17. Appendix

### A. Mascot Asset Requirements
- Format: Lottie JSON animations
- States needed per character:
  - Idle (looping)
  - Wave/greeting
  - Celebrate (victory)
  - Encourage (defeat)
  - Thinking
  - Excited (streak)
  - Sleep (waiting)

### B. Sound Effect Requirements
- Quiz start countdown (3, 2, 1, GO!)
- Correct answer chime
- Wrong answer buzz (gentle)
- Timer ticking (last 5 seconds)
- Level up fanfare
- Streak fire sound
- Button click
- Victory music
- Results reveal

### C. Color Accessibility Matrix
| Background | Text Color | Contrast Ratio | WCAG Level |
|------------|------------|----------------|------------|
| #5D4E42 | #F5E6D3 | 7.2:1 | AAA |
| #5D4E42 | #FFFFFF | 8.9:1 | AAA |
| #6B5B4F | #F5E6D3 | 5.8:1 | AA |
| #E88A4C | #5D4E42 | 4.6:1 | AA |

---

**Document Version:** 2.0  
**Last Updated:** January 5, 2026  
**Author:** Product Team  
**Status:** Ready for Development

---

*End of PRD*
