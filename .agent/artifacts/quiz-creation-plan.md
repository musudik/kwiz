# Quiz Creation & Role-Based Permissions Implementation Plan

## Overview
This plan outlines the implementation of quiz creation functionality with role-based access control.

## User Roles

| Role | Permissions |
|------|-------------|
| **Guest** | Join quizzes, play, view leaderboard |
| **Player** | All Guest + save stats, profile customization |
| **Creator** | All Player + create/edit own quizzes, host sessions |
| **Moderator** | All Creator + manage any quiz, ban players |
| **Admin** | Full access + approve role upgrades, manage users |

## Features to Implement

### Phase 1: Data Models & Store Updates ✅
- [x] Update UserStore with role field
- [x] Create QuizTemplateStore for saved quizzes
- [x] Add role request/approval types

### Phase 2: Quiz Creation UI ✅
- [x] Create Quiz screen (title, description, category, settings)
- [x] Add Question screen (text, options, correct answer, time limit)
- [x] Question list/reorder screen (Edit Quiz screen)
- [ ] Quiz preview mode
- [x] Quiz publish/save as draft

### Phase 3: My Quizzes Screen ✅
- [x] List user's created quizzes
- [x] Draft vs Published status
- [x] Edit/Delete actions
- [x] Share quiz code

### Phase 4: Role Management ✅
- [x] Request Creator role button
- [ ] Admin approval screen
- [x] Role badge on profile

### Phase 5: Server Updates
- [ ] Quiz CRUD endpoints
- [ ] Role management endpoints
- [ ] Permission middleware

---

## Detailed Implementation

### 1. User Store Updates (store/userStore.ts)

```typescript
export type UserRole = 'guest' | 'player' | 'creator' | 'moderator' | 'admin';

export interface UserProfile {
  // ... existing fields
  role: UserRole;
  roleRequestPending: boolean;
  createdQuizzes: string[]; // Quiz IDs
}
```

### 2. New Quiz Template Store (store/quizTemplateStore.ts)

```typescript
export interface QuizTemplate {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  coverImage?: string;
  questions: QuestionTemplate[];
  settings: QuizSettings;
  status: 'draft' | 'published';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
}

export interface QuestionTemplate {
  id: string;
  text: string;
  imageUrl?: string;
  options: { id: number; text: string }[];
  correctOptionIds: number[];
  timeLimit: number;
  points: number;
  type: 'mcq' | 'multi-select' | 'true-false';
}

export interface QuizSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showLeaderboard: boolean;
  allowLateJoin: boolean;
  maxParticipants: number;
}
```

### 3. New Screens to Create

| Screen | Route | Description |
|--------|-------|-------------|
| My Quizzes | `/my-quizzes` | List created quizzes |
| Create Quiz | `/create-quiz` | Quiz metadata form |
| Edit Quiz | `/edit-quiz/[id]` | Edit existing quiz |
| Add Question | `/add-question` | Question form |
| Quiz Preview | `/quiz-preview/[id]` | Preview before publish |
| Request Role | `/request-role` | Role upgrade request form |

### 4. Navigation Updates

Add "Create" tab for creators:
- Tab appears only for users with `creator`, `moderator`, or `admin` role
- Shows "My Quizzes" as main screen with FAB to create new

### 5. Server API Endpoints

```
POST   /api/quizzes              - Create quiz
GET    /api/quizzes              - List user's quizzes
GET    /api/quizzes/:id          - Get quiz details
PUT    /api/quizzes/:id          - Update quiz
DELETE /api/quizzes/:id          - Delete quiz
POST   /api/quizzes/:id/publish  - Publish quiz

POST   /api/roles/request        - Request role upgrade
GET    /api/roles/pending        - List pending requests (admin)
POST   /api/roles/approve/:id    - Approve role request
POST   /api/roles/reject/:id     - Reject role request
```

---

## Implementation Order

1. **Update UserStore** with role field
2. **Create QuizTemplateStore** for local quiz storage
3. **Create "My Quizzes" screen** with empty state
4. **Create "Create Quiz" screen** with form
5. **Create "Add Question" screen** with form
6. **Add navigation** for creators
7. **Server CRUD endpoints** for persistence
8. **Role request flow** on profile screen

---

## Files to Create/Modify

### New Files:
- `store/quizTemplateStore.ts` - Quiz template state
- `app/my-quizzes.tsx` - My quizzes list
- `app/create-quiz.tsx` - Quiz creation form
- `app/add-question.tsx` - Question creation form
- `app/edit-quiz/[id].tsx` - Edit quiz screen
- `components/ui/QuizCard.tsx` - Quiz card component
- `components/ui/QuestionCard.tsx` - Question card component

### Modified Files:
- `store/userStore.ts` - Add role field
- `app/(tabs)/_layout.tsx` - Add Create tab for creators
- `app/(tabs)/two.tsx` - Add role badge, request role button
- `server/index.js` - Add quiz CRUD endpoints

---

## UI Components Needed

1. **QuizCard** - Displays quiz in list (title, question count, status)
2. **QuestionCard** - Displays question in edit mode (reorderable)
3. **CategoryPicker** - Select quiz category
4. **TimeLimitPicker** - Select time limit per question
5. **OptionInput** - Input for answer options with correct marker

---

## Ready to Start?

I'll begin with:
1. Updating the UserStore with role support
2. Creating the QuizTemplateStore
3. Building the "My Quizzes" screen
4. Building the "Create Quiz" screen

Shall I proceed?
