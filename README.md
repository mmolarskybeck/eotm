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
├── devnotes/                    # Development documentation
│   ├── core.md                  # Essential context for AI development
│   ├── project-overview.md      # Technical architecture patterns
└── src/
    ├── minigames/               # Self-contained interactive modules
    │   ├── Quiz/Quiz.vue        # ✅ Complete
    │   ├── PowerHour/           # 🔄 Needs Vue migration
    │   └── TabDiscipline/       # 🔄 In development
    ├── stores/useGameStore.js   # Pinia state (behavioral data, profiles)
    ├── composables/             # Shared Vue logic
    ├── components/              # UI framework
    └── router/                  # Vue Router configuration
```

## 📋 Implementation Status

### ✅ Completed
- **Personal Effectiveness Self-Assessment** - Full Vue component with behavioral timing
- **Core Architecture** - Vue 3 + Pinia store + CRT aesthetic + debug system

### 🔄 In Development
- **Productivity Power Hour** - Complex card management (Vue migration needed)
- **Tab Discipline Protocol** - Multi-tab attention testing
- **Centering Women** - Spatial puzzle (needs level expansion and Vue migration)
- **Redline Relay** - Stakeholder communication (by Bea)
- **Printer Panic** - Logic puzzle (by Bea)

### ❌ Not Yet Implemented
- Cross-minigame behavioral profiling algorithm
- GPT API integration for dynamic responses
- Narrative branching system (Ink.js or custom Vue)

## 📚 Documentation Guide

**For AI agents and developers: Read the relevant guide in `devnotes/` before making changes.**

### Essential Reading
- **`devnotes/core.md`** - Project constraints, CoSy voice, surveillance illusion
- **`devnotes/project-overview.md`** - Technical architecture patterns

### Development Guides
- **`devnotes/minigame-architecture.md`** - How to build minigames (study Quiz.vue)

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