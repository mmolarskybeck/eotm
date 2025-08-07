## Core Architecture & Development Rules

> **Non-negotiable guidelines** for all code contributions—ensuring consistency, maintainability, and performance.

---

### 1. The Golden Rule: Decouple Minigames from the Engine

- **Minigames** (Vue components) handle UI and capture player actions.
- **Tracking Engine** (Pinia store + reducer) handles all logic: updating traits, calculating profiles, setting flags.
- **Minigames must never** modify traits or profiles directly; they only call `trackBehavior(event, data)`.

---

### 2. Architecture & Key Patterns

- **Vue 3 + Composition API**: Use `<script setup>` everywhere.
- **State Management**: All shared state lives in Pinia stores under `src/stores/`.
- **Behavior Tracking**:

  1. **Import** the composable: `const { trackBehavior } = useBehaviorTracking(minigameId)`.
  2. **Emit** events with raw data: `trackBehavior(BehaviorEvent.CHOICE_MADE, { choiceId, durationMs, compliant })`.
  3. **No direct** calls to `adjustTrait` or similar in components.

- **Central ENUM**: `src/core/behaviorEvents.js` exports `BehaviorEvent`—use only these constants.
- **Shared Composables**:

  - `usePageHeader()` for CRT titles
  - `useNavigation()` for routing
  - `useCoSy()` for commentary triggers
  - `useBehaviorTracking()` for event API
  - `useDebug()` for dev-only controls

---

### 3. System Vocabulary: `BehaviorEvent` Enum

> **Single source of truth**—no magic strings.

```js
// src/core/behaviorEvents.js
export const BehaviorEvent = {
  TASK_COMPLETE: 'TASK_COMPLETE',
  TASK_ABANDON: 'TASK_ABANDON',
  CHOICE_MADE: 'CHOICE_MADE',
  REVISION: 'REVISION',
  TIMEOUT: 'TIMEOUT',
  EXPLORATION_ATTEMPT: 'EXPLORATION_ATTEMPT',
  RAPID_MULTI_CLICK: 'RAPID_MULTI_CLICK', // new stress indicator
  // ...add only with documented justification
}
```

---

### 4. Technical Constraints & Governance

- **Web-first & offline-capable**: Core features never require a network; GPT calls are optional.
- **Performance**: Batch event processing (e.g. every 100 ms), persist < 1 KB of summary data, lazy profile calculations.
- **Persistence**: Pinia-persist only for profile object (`traits`, `type`, `confidence`) and `behaviorHistory` (sliding window of last 20 events).
- **Adding events**: New entries in `BehaviorEvent` must include a one-sentence rationale and a reducer mapping.

---

### 5. Standard Procedure: Adding a New Minigame

1. **Create** `/src/minigames/YourGame/YourGame.vue` using `<script setup>`.
2. **Import**:

   ```js
   import { useBehaviorTracking } from '@/composables/useBehaviorTracking'
   import { BehaviorEvent } from '@/core/behaviorEvents'
   ```

3. **Setup**:

   ```js
   const { trackBehavior } = useBehaviorTracking('yourGameId')
   ```

4. **Emit events** at decision points:

   ```js
   trackBehavior(BehaviorEvent.CHOICE_MADE, { choiceId, durationMs })
   ```

5. **Add route** in `src/router/index.js`.
6. **Integrate debug**:

   ```js
   if (import.meta.env.DEV) addDebugButton('⏸ Pause', pauseGame)
   ```

7. **Test**: verify events appear in the debug overlay and drive profile shifts.

---

### 6. Final Mandate for AI Agents

**Your only role in minigame code is to report—never to decide.**

When implementing features, you **must** use `trackBehavior()` with the locked enums.

ll trait math, profile logic, and flag detection live in the central engine.
