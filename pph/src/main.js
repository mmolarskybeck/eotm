// src/main.js
// make sure this survives across blocks
window.scoreHistory = window.scoreHistory || [];

import './tracks.js';
import './ui-hooks.js';
import './game-logic.js'; // this will now put initGame on window
import './wellness.js'; // this will now put initGame on window

console.log('TRACK_POOL keys:', Object.keys(window.TRACK_POOL));

// call the global
window.addEventListener('DOMContentLoaded', window.initGame);
