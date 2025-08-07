## Minigame Architecture – Development Patterns & Standards

_High-level component patterns and behavioral-tracking contracts for Vue 3 minigames._

---

### 1. Core Design Philosophy

Every minigame must feel like legitimate corporate training while **silently profiling** player behavior.

> **Principle:** _How players act_ (timings, sequences, stress responses) is just as insightful as _what they choose_. We capture decision patterns, hesitation, and interaction flows via a unified event system.

---

### 2. Standard Component Structure

All minigames adhere to a consistent Vue 3 pattern:

- **Intro View**: Corporate instructions and briefing.
- **Gameplay View**: Core interactive UI where **`trackBehavior(type, payload)`** calls fire on key actions.
- **Completion View**: Outcome display with CoSy commentary.
- **Edge Case Views**: Timeout, error, or fallback states.

**Shared integration** via composables:

- **Page Headers**: `usePageHeader()` sets CRT-style titles.
- **Navigation**: `useNavigation()` for routing.
- **Behavior Tracking**: `useBehaviorTracking(minigameId)` returns `trackBehavior()`.
- **Debug Tools**: `useDebug()` exposes `addDebugButton()`.
- **Cleanup**: Use `onBeforeUnmount()` to clear timers/listeners.

---

### 3. Behavioral-Tracking Contract

#### Event Pipeline

```
Minigame emits → trackBehavior(event, data) → Central Engine → update traits → calculate profile/flags
```

- **Events:** Import from `BehaviorEvent` enum.
- **Payload:** Include minimal context (e.g., timing, choice details).
- **No direct trait changes** in components—every event is processed centrally.

#### Tracking Guidelines

- **Batch events** in memory; flush summaries periodically (e.g., every 5s or 10 events).
- **Minimal persistence**: store only summary data (`behaviorHistory` window, current traits, profile).
- **Raw events** are not persisted; flags (e.g. `frustration_spike`) are set by the engine.

---

### 4. Key Behavioral Indicators

Minigames should emit events for:

- **Decision Timing**: response times, hesitation durations
- **Sequence Patterns**: order of actions, backtracking, exploration
- **Stress Signals**: rapid clicks, repeated failures, timeouts
- **Compliance Tests**: rule-following vs rule-breaking actions
- **Risk Choices**: safe vs aggressive decisions

Each event maps to adjustments in **Compliance**, **Intentionality**, and emergent **Stability**, feeding into the global profile.

---

### 5. CoSy Commentary Integration

- Use a dedicated `useCoSy()` composable to handle:

  1. **Static responses** by event category + profile bias.
  2. **Fallback-first design** before adding GPT layer.
  3. **Ephemeral flags** (panic, frustration, sabotage) to influence tone.

Components simply call `useCoSy().trigger(category, context)`—no narrative logic in minigame code.

---

### 6. Self-Containment & Reusability

- **Isolation**: Minigames depend only on shared composables and store APIs.
- **Sub-Components**: Break complex UIs (tabs, feeds, tasks) into focused Vue components.
- **Shared Logic**: Centralize timing utilities, tracking hooks, and debug controls.

---

### 7. Development Standards

- **KISS & DRY**: One event system, one reducer, one set of enums—avoid duplicate logic.
- **YAGNI**: Only track what matters (no raw logs, no extra traits).
- **Performance**: Batch updates; persist <1 KB per session; lazy calculations.

---

### 8. Testing & Validation

- **Behavioral Tests**: Simulate event sequences to verify trait deltas and flag triggers.
- **UI Smoke Tests**: Confirm views render correctly for each `gamePhase`.
- **Integration Checks**: Ensure `trackBehavior()` calls appear in debug overlay and drive profile changes.

---

### 9. Summary

- Minigames **emit** behavior events via `trackBehavior()`.
- **Do not** modify traits directly.
- **Use** shared composables for headers, navigation, tracking, and commentary.
- **Keep** code minimal and focused on UI; business logic lives in centralized engines.

_This document is the authoritative guide to minigame structure and behavior integration—detailed code lives in `src/`._
