## Quiz Module – Integration & Architecture

A concise guide to wiring the 5‑question Quiz minigame in Vue 3, following our event‑driven tracking architecture.

---

### 1. Structure & Flow

* **Views:** `intro` → `question` → `summary` → (`flagged` / `timeout`)
* **Transitions:** User clicks **Proceed** → enters `question` view; answers advance index; final answer shows `summary`.
* **Timers:** 45s inactivity → `timeout`; 25s no input → `warning` flag (displayed via typewriter).

---

### 2. Core Composables & Store

* **Page Header:** `usePageHeader('ORCA.CORP // SELF‑CHECK‑IN', '-- CONFIDENTIAL ASSESSMENT --')`
* **Navigation:** `useNavigation().goBack()` on **Exit**
* **Behavior Tracking:**

  ```js
  const { trackBehavior } = useBehaviorTracking('quiz')
  ```
* **Quiz Results:** Use `useGameStore().recordQuizAnswers(answers)` to compute averages, flags, and persist summary.

---

### 3. Event‑Driven Tracking Points

Minigame emits only raw events; the central engine handles trait updates.

| Event                | When to emit                       | Payload highlights          |
| -------------------- | ---------------------------------- | --------------------------- |
| **ANSWER\_PROVIDED** | User selects an answer (1–5)       | `{ value, responseTimeMs }` |
| **REVISION**         | User clicks “Reconsider”           | `{ attempts: retryCount }`  |
| **QUIZ\_COMPLETED**  | Final submission in `summary` view | `{ averageScore, flagged }` |
| **TASK\_TIMEOUT**    | Timer expiration → `timeout` view  | `{ inactiveDurationMs }`    |
| **WARNING\_ISSUED**  | 20s inactivity → show warning      | `{ remainingMs }`           |

*Implement by calling:*

```js
trackBehavior(BehaviorEvent.ANSWER_PROVIDED, { value: n, responseTimeMs })
```

No direct trait mutations here.

---

### 4. Debug & Cleanup

* **Debug Buttons:** In `onMounted()`, use `addDebugButton()` to expose `stopTimer()` and `resetQuiz()` in dev mode.
* **Unmount Safety:** Clear all timeouts in `onBeforeUnmount()` to prevent leakage.

---

### 5. Testing & Validation

* **Smoke Test:** Walk through each view (`intro`→complete quiz→`summary`→`flagged`/`timeout`), confirm UI and transitions.
* **Tracking Validation:** Enable `?behav=1` overlay; verify events fire and profile drifts toward expected quiz‑centric trait adjustments.

---

*This brief omits code details; see `src/screens/Quiz.vue` for implementation specifics.*
