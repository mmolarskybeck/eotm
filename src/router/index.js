// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Intro from '../screens/Intro.vue';
import Quiz from '../screens/Quiz.vue';
import PowerHour from '../screens/PowerHour.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'intro', component: Intro },
    { path: '/quiz', name: 'quiz', component: Quiz },
    { path: '/power-hour', name: 'powerHour', component: PowerHour },
    // …
  ],
});
