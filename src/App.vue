<template>
  <Layout :title="pageTitle" :subtitle="pageSubtitle">
    <router-view />
  </Layout>
  <Transition name="fade">
    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
  </Transition>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Layout from './components/Layout.vue'
import { useGameStore } from '@/stores/useGameStore.js'

// —— Router & Store ——
const router = useRouter()
const route = useRoute()
const game = useGameStore()

// —— Toast system ——
const toastMessage = ref('')
function showToast(msg) {
  toastMessage.value = msg
  setTimeout(() => (toastMessage.value = ''), 2000)
}
provide('toastMessage', toastMessage)
provide('showToast', showToast)

// —— Save & Load ——
function doSave() {
  // capture both game state and current route
  const payload = {
    ...game.$state,
    route: route.fullPath,
  }
  localStorage.setItem('save-default', JSON.stringify(payload))
  console.log('✅ Game saved:', payload)
  showToast('Game Saved!')
}

function doLoad() {
  const raw = localStorage.getItem('save-default')
  if (!raw) {
    console.warn('⚠️ No save data found')
    showToast('No Save Found')
    return
  }

  const saved = JSON.parse(raw) // ← this must be defined
  game.$patch(saved)

  // restore route if different
  if (saved.route && saved.route !== route.fullPath) {
    router.replace(saved.route)
  }

  console.log('✅ Game loaded:', saved)
  showToast('Game Loaded!')
}

provide('doSave', doSave)
provide('doLoad', doLoad)
provide('doHelp', () => alert('Help not implemented yet.'))

// —— Header Titles ——
const pageTitle = ref('')
const pageSubtitle = ref('')
function setTitles(title, subtitle) {
  pageTitle.value = title
  pageSubtitle.value = subtitle
}
provide('setTitles', setTitles)

// —— Status Level ——
const statusLevel = ref('white')
provide('statusLevel', statusLevel)
</script>
