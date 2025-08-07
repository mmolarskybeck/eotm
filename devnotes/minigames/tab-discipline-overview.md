# Tab Discipline Protocol – Minigame Overview

_A multi-tab attentional discipline test masquerading as a sentence review task._

---

## 🧩 Summary

- **Location**: `src/minigames/TabDiscipline/`
- **Primary Component**: `TabDiscipline.vue`
- **Subcomponents**: Defined in `/components/`
  (`WorkTask.vue`, `SimuFeed.vue`, `UtilityTab.vue`, etc.)

---

## 🎯 Gameplay Objective

Complete a sentence-level compliance task while resisting distractions in adjacent tabs.

- **Work Tab**: Core task – evaluate surreal corporate statements
- **SimuFeed Tab**: Narrative-driven scrolling feed with emotional bait
- **Utility Tab**: No-impact screen intended to simulate productivity drift

The player’s _focus_ is the puzzle.

---

## 🧠 Behavioral Tracking

The system captures:

- **Tab focus time** per session
- **Switch frequency** and patterns
- **Emoji reaction profile** in SimuFeed
- **Response consistency** in WorkTask

Behavioral events are emitted via `trackBehavior()` using the centralized `BehaviorEvent` enum. Only raw data is recorded—profiling is computed centrally.

---

## 🗣️ CoSy Commentary Patterns

The CoSy system responds to behavioral **tendencies**, not correctness.

- _Example outputs_:

  - “Connectivity noted. Evaluation does not imply alignment.”
  - “Focus stable beyond baseline. Adjustment unnecessary.”
  - “You are present but unresponsive. Signal remains low.”

---

## 🧩 Subcomponent Roles

| Component        | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| `WorkTask.vue`   | Displays one sentence at a time for compliance review |
| `SimuFeed.vue`   | Infinite-scroll post feed, emoji interaction enabled  |
| `UtilityTab.vue` | Low-stakes faux-settings or distraction terminal      |
| `Post.vue`       | Individual feed post rendering                        |
| `Sentence.vue`   | Sentence unit display with decision buttons           |

---

## 🧪 Implementation Notes

- Written in Vue 3 using `<script setup>`
- Follows **multi-tab architecture**, each tab as a component
- Event timers and tab focus logic abstracted from DOM state
- **No direct profile modification** – all logic routes through store

---

## 📐 Development Reminders

- All behavior events must be defined in `BehaviorEvent.js`
- Use `trackBehavior()` only—minigames must never update traits directly
- Add debug hooks for tab switching, timer simulation, and event testing during development mode

---

## To Do

- Plan out visual flow?
