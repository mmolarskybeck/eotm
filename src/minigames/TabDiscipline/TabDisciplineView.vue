<!-- src/minigames/TabDiscipline/TabDisciplineView.vue -->
<template>
  <div class="tab-content-pane">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useTabs } from '@/composables/useTabs'

const { setTabs } = useTabs()

const tabs = [
  { name: 'TabDisciplineWork', label: 'TAB 1' },
  { name: 'TabDisciplineFeed', label: 'TAB 2' },
  { name: 'TabDisciplineHR', label: 'TAB 3' }
]

onMounted(() => {
  setTabs(tabs)
})

onUnmounted(() => {
  setTabs([])
})
</script>

<style scoped>
.tab-content-pane {
  flex: 1;
  padding: 1.5rem;
  /* Background removed - will use the crt-wrapper's background */
  background: transparent;
  overflow-y: auto;
}
</style>
