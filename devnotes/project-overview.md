# project-overview.md - Technical Architecture

_High-level architectural patterns and data flow for Employee of the Month. Explains how systems work together, while README covers what the project is._

## Core Application Flow

The application follows a linear flow to ensure global systems (state, UI, debug tools) are always available:

- **Entry (`main.js`)**: Initializes Vue, Pinia with persistence, and Router. Critical: Pinia persistence enables behavioral data survival across sessions.
- **Application Shell (`App.vue`)**: Global wrapper providing consistent Layout, Toast notifications, and save/load functions to all children via provide/inject.
- **Layout (`Layout.vue`)**: Provides CRT aesthetic framework, header/footer, and debug system integration.
- **Minigame Component**: Self-contained modules that implement behavioral tracking and feed data to the profile system.

## State Management Philosophy

**Pinia with Automatic Persistence**

- **Persistence is Critical**: `pinia-plugin-persistedstate` automatically saves entire game store to localStorage. Behavioral data must survive browser sessions for long-term psychological profiling.
- **Feature-Based Organization**: Store organized by minigame (`quiz`, `powerHour`) plus central `profile` object for cross-minigame correlation.
- **Actions for Analysis**: Raw player input processed into meaningful behavioral data through Pinia actions (e.g., `recordQuizAnswers` calculates averages and flags patterns).
- **Cross-Session Continuity**: Player profiles build over multiple sessions, enabling detection of long-term behavioral patterns.

## Component Communication Patterns

**Standard Vue patterns with specific roles:**

- **Parent → Child**: Props for direct data passing
- **Child → Parent**: Emits for event handling
- **Global App State**: Pinia store for cross-component data (minigame results, behavioral profiles)
- **Cross-Cutting Concerns**: Provide/inject for app-frame functionality:
  - **Debug System**: Components inject `addDebugButton` to register controls in global debug area
  - **Save/Load Functions**: Header buttons trigger functions provided by App.vue
  - **Page Headers**: `usePageHeader` composable allows any component to set CRT header text
- **Shared Functionality**: **Composables** abstract reusable logic like navigation (`useNavigation`), header management (`usePageHeader`), and terminal effects (`useTypewriter`). This prevents code duplication across minigames while maintaining consistent behaviors.

## Critical Integration Patterns

### Behavioral Tracking Architecture

**Goal**: Unified system for capturing player behavioral patterns across all minigames.

**Current Implementation**: Timer-based tracking in Quiz.vue (hesitation detection, timeout behavior).

**Target Pattern**:

- Single `trackBehavior(action, context)` function called from all minigames
- Events stored in Pinia with timestamp, minigame ID, session context
- Enables cross-minigame behavioral correlation (e.g., "does Quiz hesitation predict PowerHour burnout?")
- Behavioral data feeds into 5-profile classification system

### CoSy Commentary System

**Evolution from Static to Dynamic**:

- **Phase 1 (Current)**: Hard-coded responses in Vue templates based on state conditions (`v-if="flagged"`)
- **Phase 2 (Target)**: `useCoSy` composable sends behavioral context to GPT API, receives contextually-aware corporate responses
- **Fallback Strategy**: Static responses when API unavailable, ensuring core experience always works

### Profile Classification Integration

**Silent Psychological Profiling**:

- Behavioral events from all minigames feed into profile scoring algorithm
- 5 profile types (Model Adjacent, Observation Type B, etc.) calculated from cross-minigame patterns
- Profile affects narrative branching, environmental changes, CoSy commentary tone
- Player never explicitly told their profile - system observes silently

## Self-Containment Architecture

**Minigame Design Principles**:

- Each minigame is self-contained Vue component in `/src/minigames/`
- Complex minigames have sub-component architecture (TabDiscipline demonstrates this with Post.vue, SimuFeed.vue, WorkTask.vue, etc.)
- All minigames implement standard behavioral tracking hooks
- Shared logic abstracted to composables (`useNavigation`, `usePageHeader`, `useTypewriter`) rather than duplicated
- Minigames register own debug controls when in development mode

**Sub-Component Strategy**: Complex minigames like TabDiscipline break functionality into focused components - feed simulation, individual posts, work tasks, utility tabs. This pattern enables reusable behavioral tracking at granular levels.

## Development Systems

### Debug Architecture

- **Activation**: `?debug=1` URL parameter shows DebugArea component
- **Registration**: Minigames use `addDebugButton` via provide/inject to register custom controls
- **Scope**: Debug tools available in development mode, hidden in production
- **Purpose**: Skip to end states, manipulate behavioral data, test edge cases

### Performance Considerations

- **Lazy Loading**: Minigames loaded on-demand via async components for smaller initial bundle
- **State Throttling**: Rapid behavioral events (mouse movement, typing) batched before Pinia commits to prevent localStorage thrashing
- **Memory Management**: Behavioral event buffers cleared after profile calculations to prevent memory growth

### CRT Aesthetic System

- **Global Styling**: `/src/assets/crt.css` provides terminal look via CSS custom properties
- **Consistency**: All components inherit CRT aesthetic without individual styling
- **Performance**: CSS-based effects optimized for smooth animations without JavaScript overhead

## Integration Readiness

**Current State**: Core Vue architecture complete, Quiz.vue demonstrates full behavioral tracking pattern.

**Next Integration Points**:

- PowerHour Vue migration (complex state management test case)
- Cross-minigame behavioral correlation algorithm implementation
- GPT API integration for dynamic CoSy responses
- Profile-based environmental changes (UI modifications based on player classification)

**Architecture Validation**: Each new minigame should test the behavioral tracking patterns and confirm data flows correctly to profile system.
