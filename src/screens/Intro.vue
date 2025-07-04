<!-- src/screens/Intro.vue -->
<template>
  <div class="main-text">
    <div class="warning typewriter" :class="color">
      <span class="typewriter-line">
        <span class="typewriter-text" ref="textEl">{{ fullText }}</span>
        <span class="cursor" ref="cursorEl">█</span>
      </span>
    </div>

    <p>Please complete these mandatory activities to continue:</p>

    <ul class="minigame-list">
      <li>
        <button class="action-primary" @click="goTo('powerHour')">Productivity Power Hour</button>
      </li>
      <li>
        <button class="action-primary" @click="goTo('quiz')">Self-Assessment Quiz</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { typeTextWithCursor } from '../composables/useTypewriter.js'

// ← 1) import & call this before anything else:
import { usePageHeader } from '../composables/usePageHeader.js'
usePageHeader('ORCA.CORP // COACHING PORTAL', '-- ONBOARDING START --')

// navigation helper
const router = useRouter()
function goTo(name) {
  router.push({ name })
}

// typewriter effect

const color = 'typewriter.green'
const fullText = '> WELCOME NEW USER'
const textEl = ref(null)
const cursorEl = ref(null)
onMounted(() => {
  typeTextWithCursor(textEl.value, cursorEl.value, fullText, 50)
})
</script>
