# EotM repo

The repository is a small Vue 3 + Vite project. The README describes it as a starter template for developing with Vue using the `<script setup>` syntax.
`package.json` lists the core dependencies (`vue`, `vue-router`, `pinia`) and several development tools like ESLint and Prettier.

## Entry Point

`src/main.js` creates the Vue app, installs the router and a Pinia store with a persisted‑state plugin, and mounts the app:

```
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './assets/crt.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')
```

## Application Shell

`src/App.vue` acts as the shell. It wraps routed pages in `Layout.vue`, exposes global “save/load/help” functions, manages a toast notification, and provides title/status state for child components:

```
<Layout :title="pageTitle" :subtitle="pageSubtitle">
  <router-view />
</Layout>
<Transition name="fade">
  <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
</Transition>
```

Inside the `<script setup>` block, the component provides handlers for saving and loading from `localStorage` and exposes functions via provide so that header buttons can trigger them.

## Layout and Global UI

`src/components/Layout.vue` composes the header (`CrtHeader.vue`), the page content slot, a footer, and some CRT visual effects. It also manages a “debug” mode toggled via a query parameter. When debug mode is on, a DebugArea appears with custom buttons:

```
const debug = ref(new URLSearchParams(window.location.search).get('debug') === '1')
function toggleDebug() {
const p = new URLSearchParams(window.location.search)
if (debug.value) p.delete('debug')
else p.set('debug', '1')
window.location.search = p.toString()
}
```

Debug buttons can be registered by child components using the `addDebugButton` function provided here. For example, the Quiz screen adds buttons when running in development mode.

## Routing

`src/router/index.js` defines three routes: an intro screen, a quiz, and a placeholder “Power Hour” screen:

```
export const router = createRouter({
history: createWebHistory(),
routes: [
{ path: '/', name: 'intro', component: Intro },
{ path: '/quiz', name: 'quiz', component: Quiz },
{ path: '/power-hour', name: 'powerHour', component: PowerHour },
// …
],
})
```

## State Management

The Pinia store (`useGameStore.js`) tracks quiz answers and whether the user was flagged. It can persist its state thanks to the Pinia persisted-state plugin:

```
export const useGameStore = defineStore('game', {
state: () => ({
quiz: {
answers: [],
average: null,
allOnes: false,
flagged: false,
completedAt: null,
},
}),
actions: {
recordQuizAnswers(answersArray) {
const avg = answersArray.reduce((a, b) => a + b, 0) / answersArray.length
this.quiz.answers = answersArray
this.quiz.average = avg
this.quiz.allOnes = answersArray.every((v) => v === 1)
this.quiz.flagged = avg < 3 && !this.quiz.allOnes
this.quiz.completedAt = Date.now()
},
resetQuiz() {
this.quiz = {
answers: [],
average: null,
allOnes: false,
flagged: false,
completedAt: null,
}
},
},
persist: true,
})
```

## Screens

`Intro.vue` shows a typewriter greeting and links to the mini‑games. It uses a helper to set the page header on mount.

`Quiz.vue` implements a multi-step quiz with inactivity timers, dynamic warnings, and summary logic. It registers debug buttons when in development mode.

`PowerHour.vue` is currently a stub screen with minimal content.

## Styling

`src/assets/crt.css` defines the “CRT terminal” look via custom CSS variables and lots of styling, including a debug area and toast notifications:

```
:root {
--green: #00ff88;
--orange: #ffa500;
--red: #ff0033;
--white: #ffffff;
--bg: #000;
/_ ... _/
}
```

The debug area style is defined near the end:

```
#debug-area {
max-width: 800px;
margin: 1rem auto;
display: flex;
gap: 1ch;
justify-content: center;
font-size: 0.75em;
color: var(--white);
text-shadow: 0 0 1px var(--white), 0 0 2px var(--white);
}
```

## Development Hints

The .vscode/extensions.json file lists recommended VS Code extensions, including Vue/Volar support, ESLint, and Prettier.

ESLint and Prettier are configured in `eslint.config.js` and `.prettierrc`, enforcing coding style.

## What to Explore Next

Vue Router Navigation – Look into how the router handles navigation between screens and how query parameters are used for debug mode.

Pinia and Persisted State – Examine how the store persists quiz data across refreshes via pinia-plugin-persistedstate.

Composition API Patterns – The app uses Vue 3’s `<script setup>` and composition functions (e.g., `usePageHeader`, `useNavigation`); learning more about these patterns will help you extend the app.

Styling & Effects – crt.css implements the retro “CRT” look. Understanding those CSS utilities can help you adjust the visual design.

Debug Tools – Components can register development-only debug buttons. Exploring this pattern could be useful when adding new minigames or diagnostics.

Overall, this codebase is a straightforward example of a Vue 3 single-page application using Vite, Pinia, Vue Router, and custom composables. Studying its router setup, store logic, and use of Vue’s provide/inject features provides a good foundation for building more complex features.
