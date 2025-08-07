# 🏢 Employee of the Month

Vue 3 + Vite + Pinia workplace simulator with psychological profiling systems.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

**Main entry point**: `src/main.js` → `src/App.vue` → `src/router/index.js`

## 📁 Project Structure

```
.
├── README.md
├── pph/                         # 🚨 Power Hour game (awaiting Vue migration)
├── devnotes/                    # Development documentation
│   ├── core.md                  # Essential context for AI development
│   ├── project-overview.md      # Technical architecture patterns
│   ├── minigame-architecture.md # Standard patterns for building minigames
│   ├── behavioral-systems.md    # Player profiling implementation
│   ├── api-integration.md       # GPT API & narrative system integration
|   ├── vision-doc.md            # Game concept and design overview
│   └── vue-migration.md         # Converting standalone JS to Vue
└── src/
    ├── assets/                  # Global styles (crt.css)
    ├── components/              # UI framework (CRT aesthetic, layout, debug)
    ├── composables/             # Shared Vue logic (navigation, headers, typewriter)
    ├── minigames/               # Self-contained interactive modules
    │   ├── Quiz/Quiz.vue        # ✅ Complete
    │   ├── PowerHour/           # 🔄 Needs Vue migration
    │   └── TabDiscipline/       # 🔄 Multi-component in development
    ├── router/index.js          # Vue Router configuration
    ├── screens/Intro.vue        # Top-level views (not minigames)
    ├── stores/useGameStore.js   # Pinia state (behavioral data, profiles)
    ├── App.vue                  # Main application shell
    └── main.js                  # Application entry point
```

## 📋 Implementation Status

### ✅ Completed

- **Personal Effectiveness Self-Assessment** - Full Vue component with behavioral timing
- **Centering Women** - Spatial puzzle (needs level expansion)
- **Core Architecture** - Vue 3 + Pinia store + CRT aesthetic + debug system

### 🔄 In Development

- **Productivity Power Hour** - Complex card management (Vue migration needed)
- **Tab Discipline Protocol** - Multi-tab attention testing
- **Redline Relay** - Stakeholder communication (by Bea)
- **Printer Panic** - Logic puzzle (by Bea)

### ❌ Not Yet Implemented

- Cross-minigame behavioral profiling algorithm
- GPT API integration for dynamic responses
- Narrative branching system (Ink.js or custom Vue)

## 📚 Documentation Guide

**For AI agents and developers: Read the relevant guide in `devnotes/` before making changes.**

### Essential Reading

- **`vision-doc.md`** - Game concept, narrative goals, design philosophy
- **`devnotes/core.md`** - Project constraints, CoSy voice, surveillance illusion
- **`devnotes/project-overview.md`** - Technical architecture patterns

### Development Guides

- **`devnotes/minigame-architecture.md`** - How to build minigames (study Quiz.vue)
- **`devnotes/behavioral-systems.md`** - Implementing player profiling
- **`devnotes/api-integration.md`** - GPT integration and narrative systems
- **`devnotes/vue-migration.md`** - Converting standalone JS to Vue

## 🔧 Technical Architecture

```
src/
├── minigames/           # Self-contained Vue components ("workplace modules")
├── stores/             # Pinia state (behavioral data, game progress)
├── composables/        # Shared Vue logic (navigation, headers, typewriter)
├── components/         # UI framework (CRT aesthetic, layout, debug)
└── router/             # Vue Router (minigame routing)
```

**Key Patterns:**

- All minigames use `<script setup>` Vue 3 composition API
- Behavioral tracking via `useGameStore()` Pinia store
- CRT terminal aesthetic via `src/assets/crt.css`
- Debug mode via `?debug=1` URL parameter

## 🎯 Current Development Priorities

1. **Complete Vue migration** of Power Hour minigame
2. **Implement behavioral profiling** algorithm across minigames
3. **Add GPT API integration** for dynamic CoSy responses
4. **Build narrative system** (Ink.js or custom Vue branching)

## 🛠️ Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Linting
npm run lint

# Enable debug mode
# Add ?debug=1 to URL for debug controls
```

## 🤖 For AI Agents

**When adding features:**

1. Read `devnotes/vision-doc.md` for game concept
2. Check `devnotes/core.md` for design constraints
3. Follow patterns from `devnotes/minigame-architecture.md`
4. Implement behavioral tracking per `devnotes/behavioral-systems.md`

**When debugging:**

- Use `?debug=1` URL parameter for debug controls
- Check `src/stores/useGameStore.js` for state issues
- Preserve corporate aesthetic in `src/assets/crt.css`

**Current unknowns needing implementation:**

- Behavioral profiling algorithms (see `devnotes/behavioral-systems.md`)
- GPT API patterns (see `devnotes/api-integration.md`)
- Narrative system choice (see `devnotes/api-integration.md`)

## ⚠️ Important Constraints

- **Corporate training illusion** - everything must feel like legitimate workplace software
- **Silent surveillance** - players never know they're being profiled
- **Graceful degradation** - core experience works without API calls
- **Web-first development** - Electron packaging at end of development
