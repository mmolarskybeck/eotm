# Productivity Power Hour 
## Core Mechanics & Design Principles

### Overview

  * **Type**: Real-time card-based triage simulation.
  * **Goal**: Complete one full **Task Track** (5 ordered steps) under a **20‑action limit** while managing **Burnout**, reacting to Hazards/Morale events, and optionally using high-risk **Visibility Pledges**.
  * **Narrative Framing**: A mandatory “Performance Block” overseen by CoSy’s Productivity Optimization Initiative.

  ---
  
### 🔧 Core Mechanics

#### **Card Feed**

  * **Hand size**: 4 cards drawn continuously.
  * **Deck composition**:
      * 5 Tracks × 5 Task Steps each
      * 5 Visibility Pledges (one per Track)
      * 2 Hazard cards
      * 2 Morale Bonus cards

#### **Actions & Limits**

  * **Actions**: 20 total; each action = Execute a Step, Delete a Task, or Pledge.
  * **Track Completion**: First to finish all 5 Steps on any Track “wins” the session.
  * **Skips**: 1 skip per Track (cost: +1 Burnout, –1 Score).

#### **Burnout**

  * **Meter**: 0 → 10 (10 triggers Wellness Pod).
  * **Increments**:
      * Opening 2nd–5th Tracks: +1, +2, +3, +4
      * Failing Pledges: +2
      * Hazard cards resolved: +1–2
      * Skips: +1 each
  * **Decrements**: Morale cards (–1 to –2).
  * **Warnings**: 7 → ⚠️ Warning Zone, 9 → 🚨 Critical Zone.

#### **Wellness Pod**

  * **Trigger**: Burnout = 10.
  * **Effect**: Pause session, reset Burnout to **3**.
  * **Progressive Events**: On the **2nd and 3rd trips** to the Wellness Pod, new strategic cards are injected into the deck to alter the session's dynamics.

#### **Visibility Pledges**

  * **Commitment**: Finish a Track within **5 actions**.
  * **Outcome**: Success **+5 Score**; Failure **+2 Burnout** & log flag.
  * **Availability**: **Locked Round 1**; unlocked in subsequent sessions.

-----

### 🧠 Behavioral Tracking & Profiles

  * **Logged Metrics**:
      * Action order and speed
      * Burnout trends
      * Pledge success/failure
      * Skip usage
      * Reaction to Hazards/Morale
  * **Profiles Inferred**: Model Adjacent, Observation Type B, Unresolved Integrator, Low Reliability, Unassigned.
  * **Impact**: Shapes future module access, CoSy dialogue, and hidden paths.

-----

### 🎨 UI/UX Outline

  * **Layout**: Sidebar (Status, Restart), Main panel (Dashboard + Card Feed).
  * **Dashboard**: Burnout meter, Action counter, Track progress bars.
  * **Feed Cards**: Header (Track & Step), body (description), footer (actions).
  * **Wellness Pod Screen**: Minimal UI, narrative text, return button.
  * **Tutorial Carousel**: Pre-session slides explaining feed, burnout, pledges.

-----

### 🏛️ Vue Migration Architecture Plan

This section outlines the high-level strategy for porting *Power Hour* from its current JavaScript implementation to the project's main Vue 3 + Pinia architecture.

#### **1. Centralized State (Pinia)**

The global `gameState` object and `window` functions will be eliminated. All game state (deck, feed, burnout, actionsLeft, etc.) will be moved into a dedicated module within the main Pinia store (`useGameStore`).

  * **Actions**: Game logic functions (`executeCard`, `adjustBurnout`, `handlePledge`) will become **Pinia actions**.
  * **Reactivity**: The UI will automatically update based on changes to the store's state, removing the need for manual `renderGame()` calls.

#### **2. Component-Based Architecture**

The monolithic HTML and UI-hooks will be broken down into focused, reusable Vue components.

  * **`<PowerHourView>`**: The main parent component that manages the overall game phase (`intro`, `playing`, `pod`, `results`).
  * **`<Dashboard>`**: A component to display reactive data like the Burnout meter, Action counter, and Track progress.
  * **`<CardFeed>`**: A component that uses a `v-for` loop to render cards based on the `feed` array in the Pinia store.
  * **`<GameCard>`**: A single card component that emits events (e.g., `@execute`, `@delete`) when interacted with.
  * **`<WellnessPodView>`**: A view that appears conditionally when the game state dictates.

#### **3. Standardized Data Structures (To-Do)**

The migration presents the ideal opportunity to unify all card data structures.

  * **Goal**: All cards (Task, Hazard, Morale, Pledge) will share a consistent object structure.
  * **Proposed Structure**: A card will have a `type` and a `payload`, allowing the game engine to handle them polymorphically.
    ```javascript
    // Example Task Card
    { type: 'task', payload: { track: 'Synergy', step: 1, ... } }
    // Example Morale Card
    { type: 'event', payload: { id: 'Leftover Donuts', burnoutChange: -2 } }
    ```

#### **4. Implementing Core Logic**

The game's unique rules will be implemented within the new architecture.

  * **Pledge Locking (To-Do)**: The Pinia store's `initGame` action will be responsible for this rule. It will check the session count and conditionally add Pledge cards to the deck only after the first round.
  * **Behavioral Tracking**: All component interactions (`@execute`, `@delete`, etc.) will trigger Pinia actions, which will in turn call the central `trackBehavior()` service before modifying the state. This ensures all player actions are captured by the profiling system.