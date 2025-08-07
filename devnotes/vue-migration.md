## Vue Migration – Standalone Games to Vue 3 (High-Level Guide)

**Goal:** Migrate legacy JS games (Power Hour, TabDiscipline, etc.) into Vue 3 + Pinia while preserving behavioral-tracking hooks, ensuring modularity, performance, and narrative flexibility.

---

### 1. Migration Strategy Overview

- **Preserve behavioral hooks:** Replace direct state logs with calls to `trackBehavior(type, payload)`.
- **Leverage Vue’s reactivity:** Swap global objects and manual DOM updates for Vue components, props, computed state.
- **Phased rollout:** Progress through state → structure → UI primitives → tracking → commentary in clear stages.

---

### 2. Phase 1: State Management (Pinia)

**Objective:** Move global `gameState` into a Pinia store with behavior-event buffering and precise persistence.

- **Store shape:** Mirror existing fields (deck, feed, progress, burnout, etc.) + `behaviorHistory` ring‑buffer + `sessionStart` timestamp + `profile` (traits, type, confidence).
- **Actions:** Convert game logic functions (`initGame`, `executeCard`, `increaseBurnout`, etc.) into Pinia actions.
- **Tracking API:** In each action, call `trackBehavior(type, data)`—no direct trait changes in minigames.
- **Persistence:** Enable persistence **only** for the core profile object and `behaviorHistory` (sliding window of last 20 events). Raw event logs and stability values are never stored.

---

### 3. Phase 2: Component Structure

**Objective:** Decompose monolithic HTML+JS into focused, reusable Vue components.

- **View wrapper:** Single `PowerHourView` that switches subcomponents by `gamePhase` (intro, playing, pod, results).
- **Feature components:** `Intro`, `Dashboard`, `Feed`, `WellnessPod`, `Results`—props in, events out.
- **Composables:** Use `usePageHeader()`, `useNavigation()`, and `useBehaviorTracking()` to share cross-cutting logic.
- **Composition API:** All code lives in `<script setup>`, with `computed` properties binding to Pinia store.

---

### 4. Phase 3: Debug & Visualization Early

**Objective:** Build visibility tools before migrating full UI.

- **Debug overlay (`?behav=1`):** Displays live trait bars, current `profile`, `confidence`, and ephemeral flags.
- **Event inspector:** Logs raw `trackBehavior` calls and reducer outputs in real time.
- **Benefit:** Immediate feedback as you port the first components of PowerHour, catching misfires early.

---

### 5. Phase 4: UI Primitives & Patterns

**Objective:** Replace hacky UI code with Vue-native primitives.

- **Modal component:** Swap `showModal()` DOM hacks for a `Modal.vue`—controlled via reactive props and emits.
- **Shared elements:** Standardize buttons, panels, toasts in `/components/` using CRT styling.
- **Lazy-loading:** Load heavy modules (subgames, analytics) only when needed.

---

### 6. Phase 5: Behavioral Tracking Integration

**Objective:** Embed `trackBehavior` at all decision and stress points, delegating flag logic to the reducer.

- **Raw event emission:** Components emit descriptive events (e.g. `BehaviorEvent.RAPID_MULTI_CLICK`), not flags.
- **Central reducer:** Sole authority for detecting patterns (e.g. panicState, frustrationSpike) and setting ephemeral flags.
- **Key hooks:** Card hover, choice made, burnout change, track opening—each calls `trackBehavior(type, payload)`.

---

### 7. Phase 6: CoSy Commentary Integration

**Objective:** Decouple commentary logic via a dedicated composable.

- **`useCoSy()` hook:** Encapsulates static/dynamic response selection and display.
- **Integration points:** Consumes current `profile` and flags; triggers on tracked events or phase transitions.
- **Fallback-first:** Implements static responses before integrating GPT enhancements.

---

### 8. Phase 7: Proof‑of‑Concept Migration

**Objective:** Migrate the first standalone game as POC—PowerHour is the priority.

- **PowerHour POC:** Build its main `PowerHourView` + `Dashboard` using the new store and components.
- **Verify pipeline:** Ensure `trackBehavior` calls update traits and flags as expected.
- **Leverage debug overlay** (built in Phase 3) for real‑time validation.

---

### 9. Phase 8: Rollout & Governance

**Objective:** Extend migration, establish rules for future minigames.

- **Port remaining games:** Apply the same pattern to TabDiscipline, Quiz (if needed), etc.
- **Governance checklist:**

  1. Minigames use `trackBehavior()` only.
  2. No direct trait manipulation in components.
  3. Event enums, config, and engine in `src/core/` only.
  4. PRs must update enums/config or add tests for new events.

- **Performance guardrails:** Batch tracks every 100 ms, persist minimal state, lazy-profile calc.

---

_This high‑level guide omits code details; refer to `src/` modules for actual implementations._
