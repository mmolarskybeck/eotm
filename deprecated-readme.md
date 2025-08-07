# 🏢 Employee of the Month (Web Build)

A retrofuturistic, darkly comedic workplace simulator built with Vue 3 and Vite. Players navigate a procedural office environment through interactive fiction, subtle puzzles, and quietly tracking systems.

This version is web-first. Electron wrapping is deferred until packaging.

## 🎯 Project Goals

- Deliver a polished single-player experience with psychological depth.
- Blend narrative branching (via Ink.js) with task-based minigames.
- Profile players silently across behavioral archetypes (e.g. Model Adjacent, Unassigned).
- Build rapidly using web technologies (Vue 3 + Vite + Pinia).
- Integrate calls to OpenAI’s GPT API to "voice" the role of CoSy (the Coaching System), an in-game fictive AI survelling players.
- Package for desktop (Steam, itch.io) using Electron **at the end of development**.

## 📁 Project Structure

```
.
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── devnotes/                    # Development documentation
│   ├── api-integration.md       # GPT API & narrative system integration
│   ├── behavioral-systems.md   # Player profiling implementation patterns
│   ├── core.md                 # Essential context for AI development
│   ├── minigame-architecture.md # Standard patterns for building minigames
│   └── project-overview.md     # High-level project structure overview
└── src/
    ├── App.vue
    ├── main.js
    ├── assets/
    │   └── crt.css
    ├── components/
    │   ├── CrtFooter.vue
    │   ├── CrtHeader.vue
    │   ├── DebugArea.vue
    │   └── Layout.vue
    ├── composables/
    │   ├── useNavigation.js
    │   ├── usePageHeader.js
    │   └── useTypewriter.js
    ├── minigames/               # Self-contained interactive modules
    │   ├── PowerHour/
    │   │   └── PowerHour.vue
    │   ├── Quiz/
    │   │   └── Quiz.vue
    │   └── TabDiscipline/
    │       ├── TabDiscipline.vue
    │       └── components/
    │           ├── Post.vue
    │           ├── Sentence.vue
    │           ├── SimuFeed.vue
    │           ├── UtilityTab.vue
    │           └── WorkTask.vue
    ├── router/
    │   └── index.js
    ├── screens/
    │   └── Intro.vue
    └── stores/
        └── useGameStore.js
```

## 🧠 Behavioral System

Player decisions are passively tracked and categorized into one of five types:

- **Model Adjacent** – eerily perfect, hyper-compliant
- **Observation Type B** – quiet, detached, easily ignored
- **Unresolved Integrator** – reflective but not assimilated
- **Low Reliability** – visibly erratic, still readable
- **Unassigned** – unclassifiable, resistant, possibly dangerous

These profiles influence room access, narrative branches, system tone, and glitch outcomes.

## 🧪 Technologies

- Vue 3 (`<script setup>`, Composition API)
- Vite (build tool)
- Pinia (state management)
- Ink.js (interactive narrative engine)
- GSAP (animation/composables)
- OpenAI GPT API (optional content generator)
- LocalStorage (offline save/load system)

## 📚 Developer Documentation

The `devnotes/` directory contains structured development documentation:

- **`core.md`** - Essential context and design philosophy for AI development
- **`project-overview.md`** - High-level project structure and entry points
- **`behavioral-systems.md`** - Implementation patterns for player profiling system
- **`minigame-architecture.md`** - Standard Vue component patterns for minigames
- **`api-integration.md`** - Strategy for GPT API integration and narrative systems

These files provide structured guidelines to maintain consistency and help contributors understand the project's psychological depth and technical patterns.

## 🛣️ Routes

- `/story/:nodeId` – narrative passages (Ink)
- `/minigame/:slug` – puzzle modules

## 💾 State

All gameplay state is stored via `useGameStore.js`, with a `saveState`/`loadState` action bound to `localStorage`.

## 🛠️ Dev Notes

### Install Dependencies

```bash
npm install
```

### Start dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Electron Packaging (Final Phase)

Electron will be added post-M7 to wrap the final build and produce desktop installers via `electron-builder`.
