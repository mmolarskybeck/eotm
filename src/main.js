// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

// pull in your CRT stylesheet once, globally:
import './assets/crt.css';

createApp(App)
  .use(router) // ← tell Vue about the router
  .mount('#app');
