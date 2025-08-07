# Core Architecture & Development Rules
**Objective:** This document contains the essential technical rules for AI agents contributing to Employee of the Month. Adhering to these principles ensures all code is consistent, maintainable, and aligned with the project's core architecture.

**The Golden Rule:** Decouple Minigames from the Engine
The single most important principle of this architecture is separation of concerns.

**Minigames** are responsible for UI and capturing player actions. They emit events with raw data.

The **Central Store** (`useGameStore`) is responsible for all logic. It listens for events and is solely responsible for updating traits, calculating profiles, and managing state.

A minigame must NEVER directly modify player traits or profiles. It only reports what happened.

## Architecture & Key Patterns
**Vue 3:** All components must use `<script setup>` and the Composition API.

**State Management:** All shared state must live in the Pinia store (`src/stores/useGameStore.js`).

**Event-Driven Logic:** All behavioral tracking must go through the central trackBehavior action in the store. This is the only valid way to report player actions.

```
// CORRECT USAGE
import { useGameStore } from '@/stores/useGameStore';
import { BehaviorEvent } from '@/core/events'; // Import from the central ENUM file

const game = useGameStore();

function handlePlayerChoice(choiceData) {
  // Emit a standardized event with a raw data payload.
  game.trackBehavior(BehaviorEvent.CHOICE_MADE, {
    choiceId: choiceData.id,
    duration: 2150,
    compliant: false
  });
}
```
Shared Functionality: Use existing composables for cross-cutting concerns:

`usePageHeader()`: To set the main CRT screen title.

`useNavigation()`: For all routing changes.

`useCoSy()`: To request and display commentary.


## The System's Vocabulary: Core Behavior Events
Only use event types defined in the central BehaviorEvent enum. Do not use "magic strings." The AI must know and use this locked vocabulary.

```
// src/core/events.js (The Single Source of Truth)
export const BehaviorEvent = {
  TASK_COMPLETE: 'TASK_COMPLETE',       // Player successfully finished a module
  TASK_ABANDON: 'TASK_ABANDON',         // Player exited a module prematurely
  CHOICE_MADE: 'CHOICE_MADE',           // Player made a significant choice
  REVISION: 'REVISION',                 // Player went back to change an answer
  TIMEOUT: 'TIMEOUT',                   // A timer expired due to inactivity
  EXPLORATION_ATTEMPT: 'EXPLORATION_ATTEMPT'  // Player tried to access a restricted area
};
```

## Technical Constraints & Governance
**Web-First & Offline Capable**: All features must function without a network connection. API calls (like for GPT) are enhancements, not core requirements.

**Performance**: Code should be mindful of performance. Behavioral timing is critical, so avoid blocking the main thread. Event processing is batched.

**Adding New Events**: To add a new event to the BehaviorEvent enum, you must provide justification for why the existing events are insufficient to capture the new behavioral dimension.

## Standard Procedure: Adding a New Minigame
Follow these steps precisely:

**Create the View Component**: Build the minigame UI inside a single Vue component in `/src/minigames/`.

**Integrate Core Hooks**: Use usePageHeader() and import the useGameStore.

**Implement trackBehavior Calls**: Add trackBehavior() calls at all key decision points, using the official BehaviorEvent enums.

**Add Route**: Add the new minigame to the Vue Router configuration in /src/router/index.js.

**Implement Debug Tools**: In development mode (import.meta.env.DEV), use the injected addDebugButton function to add controls for skipping or manipulating your minigame's state.

## Final Mandate for AI Agents
Your primary goal is to write code that adheres to the decoupled event-driven architecture. When asked to add a feature to a minigame, your implementation must only involve emitting pre-defined events with raw context. You are not to implement any logic that directly calculates or modifies the player's psychological profile from within a minigame component.