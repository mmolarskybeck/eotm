// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Intro from '@/screens/Intro.vue'
import Quiz from '@/minigames/Quiz/Quiz.vue'
import PowerHour from '@/minigames/PowerHour/PowerHour.vue'
import TabDiscipline from '@/minigames/TabDiscipline/TabDiscipline.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'intro', component: Intro },
    { path: '/quiz', name: 'quiz', component: Quiz },
    { path: '/power-hour', name: 'powerHour', component: PowerHour },
    { path: '/tab-discipline', name: 'tabDiscipline', component: TabDiscipline },
    // …
  ],
})
