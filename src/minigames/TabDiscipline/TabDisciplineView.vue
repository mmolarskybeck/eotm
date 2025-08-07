<!-- src/minigames/TabDiscipline/TabDisciplineView.vue -->
<template>
  <div class="tab-view-wrapper">
    <!-- Tab Navigation -->
    <nav class="tab-container">
      <router-link 
        v-for="tab in tabs" 
        :key="tab.name" 
        :to="{ name: tab.name }" 
        class="tab" 
        active-class="active"
      >
        <span class="tab-label">{{ tab.label }}</span>
      </router-link>
    </nav>

    <!-- Tab Content rendered by Vue Router -->
    <div class="tab-content-pane">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePageHeader } from '@/composables/usePageHeader.js'

// Set the page header like other minigames
usePageHeader('TAB DISCIPLINE PROTOCOL', '-- ATTENTION & COMPLIANCE AUDIT --')

const tabs = ref([
  { name: 'TabDisciplineWork', label: 'RECON' },
  { name: 'TabDisciplineFeed', label: 'COMM' },
  { name: 'TabDisciplineHR', label: 'HR' }
])
</script>

<style scoped>
.tab-view-wrapper {
  display: flex;
  height: 100%;
  min-height: 400px;
}

.tab-container {
  display: flex;
  flex-direction: column;
  width: 120px;
  border-right: 2px solid var(--crt-green);
  background: rgba(0, 255, 0, 0.02);
  padding: 0;
}

.tab {
  position: relative;
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--crt-green);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);
  border-right: 3px solid transparent;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tab:hover {
  background: rgba(0, 255, 0, 0.05);
  border-right-color: rgba(0, 255, 0, 0.5);
  color: var(--crt-green);
  text-shadow: 0 0 8px var(--crt-green);
}

.tab.active {
  background: rgba(0, 255, 0, 0.08);
  border-right: 3px solid var(--crt-green);
  color: var(--crt-green);
  text-shadow: 0 0 12px var(--crt-green);
  box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.1);
}

/* File folder divider effect */
.tab::before {
  content: '';
  position: absolute;
  top: 0;
  right: -2px;
  width: 0;
  height: 0;
  border-left: 8px solid rgba(0, 255, 0, 0.3);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tab.active::before {
  opacity: 1;
  border-left-color: var(--crt-green);
}

.tab-label {
  display: block;
  position: relative;
  z-index: 2;
}

.tab-content-pane {
  flex: 1;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tab-view-wrapper {
    flex-direction: column;
    height: auto;
  }
  
  .tab-container {
    flex-direction: row;
    width: 100%;
    border-right: none;
    border-bottom: 2px solid var(--crt-green);
  }
  
  .tab {
    flex: 1;
    text-align: center;
    border-right: 1px solid rgba(0, 255, 0, 0.3);
    border-bottom: 3px solid transparent;
  }
  
  .tab:last-child {
    border-right: none;
  }
  
  .tab.active {
    border-right: 1px solid rgba(0, 255, 0, 0.3);
    border-bottom: 3px solid var(--crt-green);
  }
  
  .tab::before {
    display: none;
  }
}
</style>
