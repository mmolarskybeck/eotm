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
  { name: 'TabDisciplineWork', label: 'SHEETS' },
  { name: 'TabDisciplineFeed', label: 'FEED' },
  { name: 'TabDisciplineHR', label: 'PORTAL' }
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
  background: transparent;
  overflow-y: auto;
  min-height: 400px; /* Ensure minimum height for visual balance */
  display: flex;
  flex-direction: column;
}
</style>
