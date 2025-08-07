# Employee of the Month – Behavioral-Tracking Architecture (v 1.0)

### 1. Core 3-Trait Model

| Trait              | Scale | Question it answers                           | How we infer it                                                                     |
| ------------------ | ----- | --------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Compliance**     | 0–100 | _“Do they follow the rules?”_                 | Task completion vs. abandonment, rule-breaking events                               |
| **Intentionality** | 0–100 | _“Are they mentally present and deliberate?”_ | Response times, revisions, help requests                                            |
| **Consistency**    | 0–100 | _“How steady are they over time?”_            | **Calculated** from recent swings in Compliance & Intentionality (inverse variance) |

> **Key rule:** _Consistency is never modified directly._ It is derived on-demand from the last 20 significant events (or last 5 min, whichever is shorter).

---

### 2. Personality Profiles (Centroid Method)

We represent each personality as a “target point” in 3-D trait space. The player’s current profile is simply the **closest centroid**.

| Profile             | C   | I   | Consistency | Archetype                          |
| ------------------- | --- | --- | ----------- | ---------------------------------- |
| **Model Adjacent**  | 95  | 60  | 90          | Perfect, almost robotic compliance |
| **Observation B**   | 82  | 15  | 85          | Passive, half-present              |
| **Integrator**      | 55  | 75  | 55          | Thoughtful, questioning            |
| **Low Reliability** | 40  | 50  | 20          | Emotional, error-prone             |
| **Unassigned**      | 15  | 20  | 10          | Chaotic rule-breaker               |

_Confidence_ = 100 – (distance to nearest centroid).
No ranges, no overlaps, no tie-breakers.

**C = Compliance** – This measures how much the player follows the expected rules and instructions.

**I = Intentionality** – This measures how thoughtful and deliberate the player's actions are (vs. rushed, random, or passive).

---

### 3. Event Pipeline (Keep-It-Simple)

```
Minigame → emitEvent() → Central Reducer → update Traits (EMA) → derive Consistency → pick Profile
```

- **emitEvent(type, payload)** – minigames report what happened; they never touch traits.
- **Central Reducer** – single file that knows how each event nudges Compliance or Intentionality, using an **Exponential Moving Average (EMA)** so recent behaviour matters most.

---

### 4. Standard Event Vocabulary

| Constant              | Payload fields                      | Main trait(s) affected                       |
| --------------------- | ----------------------------------- | -------------------------------------------- |
| `TASK_COMPLETE`       | `{ impact?: 'minor'│'major' }`      | +Compliance                                  |
| `TASK_ABANDON`        | `{ impact?: ... }`                  | –Compliance                                  |
| `CHOICE_MADE`         | `{ durationMs, compliant, impact }` | ±Compliance, ±Intentionality (based on time) |
| `REVISION`            | `{ durationMs }`                    | +Intentionality                              |
| `TIMEOUT`             | none                                | –Compliance, –Intentionality                 |
| `EXPLORATION_ATTEMPT` | none                                | –Compliance, +Intentionality                 |

_New events require a short design note explaining which trait they influence and why._

---

### 5. Key Algorithms (Plain-English)

- **EMA update** – Think of a kitchen scale that forgets old weight slowly; every new event nudges the needle but doesn’t fling it.
- **Consistency** – Look at the last 20 nudges; if they point roughly the same way, Consistency is high. If they zig-zag, it drops.
- **Baseline timing** – Until the player has made 5 decisions, use default quiz means (e.g., 3.5 s ± 1.2 s). After that, shift to their personal median.

---

### 6. Ephemeral Narrative Flags

| Flag                | Trigger                                                                          | Auto-clear                              | Narrative use               |
| ------------------- | -------------------------------------------------------------------------------- | --------------------------------------- | --------------------------- |
| `frustration_spike` | ≥ 5 fails in 10 s                                                                | 30 s                                    | Sharper CoSy tone           |
| `exploration_mode`  | ≥ 3 distinct actions in 5 s                                                      | 60 s                                    | Encouraging curiosity       |
| `panic_state`       | Action speed > 2× baseline                                                       | 45 s                                    | Calming prompts             |
| `sabotage_flag`     | Compliance < 25 for 3 tasks **and** Intentionality > 70 **and** Consistency > 60 | Clears once Compliance > 40 for 3 tasks | Recognise “steady saboteur” |

Flags never alter traits; they just colour the next CoSy line.

---

### 7. Storage & Performance Budget

- **We persist only:**
  `compliance`, `intentionality`, `consistency` (3 floats)
  20 recent event deltas (ring-buffer)
  `profile`, `confidence`, player timing baseline
  **≈ 1 KB**

- **We never store:** raw event log, calculated Consistency values, or older history.

- **Runtime:**

  - Process & buffer events every 100 ms **or** every 10 events.
  - Single localStorage write per batch.
  - Profile recalculated only when a minigame ends or the UI requests it.

---

### 8. Governance Checklist

1. **One Enum to rule them all** – `src/core/BehaviorEvent.js`.
2. Reducer + trait maths live in `src/core/behaviorEngine.js`.
3. All tuning constants in `src/core/behaviorConfig.js`.
4. Minigames must call `completeMinigame()` when done.
5. Pull request adding a new event must include:

   - Justification sentence
   - Trait-impact mapping
   - Unit-test update

---

### 9. Why This Meets KISS / DRY / YAGNI

- **KISS:** Three traits, one distance formula, one reducer.
- **DRY:** All math lives in one place; no duplicated trait logic.
- **YAGNI:** No raw event history, no unused extra traits, no premature ML.

---

### 10. Immediate Next Steps

#### Stub Out Core Files

- Create a single BehaviorEvent.js (your enum),
- A behaviorConfig.js (timing defaults, EMA half-life, window size),
- And profileCentroids.js (the five 3-trait vectors).

#### Sketch the Behavior Engine API

- Define its surface (e.g. emitEvent(type, data), getTraits(), getProfile(), getFlags()) in comments or pseudocode—no implementation yet.

#### Refactor One Minigame (Proof-of-Concept)

- Pick Quiz.vue, replace its store calls with emitEvent stubs
- Console-log the “new traits + profile” to confirm your pipeline is wired.

#### Build the Real Reducer Skeleton

- Flesh out the engine’s internal flow:
  - event queue → EMA update → on-demand stability calc → centroid classification → flags.

#### Quick Manual Smoke Test

- In dev mode, fire known event sequences (e.g. 5 timeouts → frustration_spike)
- Verify traits move roughly toward the expected centroid.

#### Add a Simple Debug Overlay

- Show live trait bars, profile name, confidence, and any active flags behind a ?behav=1 toggle.

#### Iterate & Tune

- Play through the Quiz, note if traits/profile feel right,
- Tweak timing defaults or centroids in behaviorConfig.js (no code rewrites).

#### Roll Out to Remaining Minigames

- Copy/paste your working Quiz pattern into PowerHour, TabDiscipline, etc.,
- Remove any direct trait tweaks, ensuring they all use emitEvent.

#### Document the Integration Flow

- Write a short “How to Hook In” note for each new minigame: import the event enum, call emitEvent(), call completeMinigame().

#### Light Governance

- Agree on a simple PR checklist: “No magic strings in events,” “No direct trait calls,” “New events get documented.”
- Rely on your AI-helper to flag any violations.

#### Plan a Play-Through Review

- After you’ve ported all current minigames, play start-to-finish together.
- Observe where profiles feel off, adjust weights or centroids, and lock in defaults.

---

_This document is the single source of truth for behavioural tracking until we hit real-world data and iterate._
