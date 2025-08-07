<!-- src/components/TabBorderMask.vue -->
<template>
  <div v-if="showMask" class="tab-border-mask" :style="maskStyle"></div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTabs } from '@/composables/useTabs'

const route = useRoute()
const { tabsState } = useTabs()

// Track active tab position
const activeTabIndex = ref(-1)
const tabHeight = 94 // Height of each tab including gap

const showMask = computed(() => {
  return tabsState.isVisible && activeTabIndex.value >= 0
})

const maskStyle = computed(() => {
  if (activeTabIndex.value < 0) return {}
  
  // Calculate the vertical position based on the active tab
  const topOffset = 180 + (activeTabIndex.value * tabHeight)
  
  return {
    top: `${topOffset}px`,
    height: '90px' // Match tab height
  }
})

// Update active tab index based on route
const updateActiveTab = () => {
  const activeTab = tabsState.tabs.findIndex(tab => tab.name === route.name)
  activeTabIndex.value = activeTab
}

// Watch for route changes
onMounted(() => {
  updateActiveTab()
  // Use route watcher
  route.name // Trigger reactivity
})

// Update whenever route changes
onUnmounted(() => {
  activeTabIndex.value = -1
})

// Watch for route updates
const unwatch = route.afterEach(() => {
  updateActiveTab()
})
</script>

<style scoped>
.tab-border-mask {
  position: absolute;
  /* Position exactly where the left border of crt-wrapper is */
  left: calc(50% - 400px - 2px);
  width: 4px; /* Cover the 2px border with some extra */
  background: rgba(0, 0, 0, 0.96); /* Match crt-wrapper background */
  z-index: 101; /* Above the wrapper border but below active tab */
  pointer-events: none;
}
</style>
