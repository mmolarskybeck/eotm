// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Intro from '@/screens/Intro.vue'
import Quiz from '@/minigames/Quiz/Quiz.vue'
import PowerHour from '@/minigames/PowerHour/PowerHour.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'intro', component: Intro },
    { path: '/quiz', name: 'quiz', component: Quiz },
    { path: '/power-hour', name: 'powerHour', component: PowerHour },
    {
      path: '/tab-discipline',
      component: () => import('@/minigames/TabDiscipline/TabDisciplineView.vue'),
      children: [
        { path: '', redirect: { name: 'TabDisciplineWork' } },
        {
          path: 'work',
          name: 'TabDisciplineWork',
          component: () => import('@/minigames/TabDiscipline/views/WorkTask.vue')
        },
        {
          path: 'feed',
          name: 'TabDisciplineFeed',
          component: () => import('@/minigames/TabDiscipline/views/SimuFeed.vue')
        },
        {
          path: 'hr',
          name: 'TabDisciplineHR',
          component: () => import('@/minigames/TabDiscipline/views/HRPortal.vue')
        }
      ]
    },
    // …
  ],
})
