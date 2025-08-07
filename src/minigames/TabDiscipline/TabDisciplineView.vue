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
  { name: 'TabDisciplineWork', label: 'TAB 1' },
  { name: 'TabDisciplineFeed', label: 'TAB 2' },
  { name: 'TabDisciplineHR', label: 'TAB 3' }
])
</script>

<style scoped>
.tab-view-wrapper {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 400px;
}

.tab-container {
  position: absolute;
  left: -2rem; /* Break out of the content padding to reach the CRT border */
  top: 0;
  display: flex;
  flex-direction: column;
  width: 42px; /* Slightly wider to accommodate the new design */
  padding: 0;
  gap: 2px;
  z-index: 10; /* Ensure tabs appear above content */
}

.tab {
  position: relative;
  display: block;
  padding: 2rem 0.5rem;
  text-decoration: none;
  color: var(--green);
  font-family: var(--font-crt); /* Use the CRT font for consistency */
  font-size: 0.6rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid var(--green);
  border-left: none; /* Flush against CRT border - no left border */
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  /* Create the file folder tab effect - rounded on RIGHT side now */
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Add CRT-style glow */
  text-shadow: var(--tw-shadow-base);
  box-shadow: inset 0 0 10px rgba(0, 255, 136, 0.1);
}

.tab:hover {
  background: rgba(0, 255, 0, 0.1);
  color: var(--green);
  text-shadow: 0 0 8px var(--green);
  box-shadow: inset 0 0 15px rgba(0, 255, 136, 0.2), 0 0 8px rgba(0, 255, 136, 0.3);
}

.tab.active {
  background: rgba(0, 255, 0, 0.2);
  color: var(--green);
  text-shadow: 0 0 12px var(--green);
  box-shadow: inset 0 0 20px rgba(0, 255, 136, 0.3), 0 0 12px rgba(0, 255, 136, 0.4);
  z-index: 2;
  /* Extend the active tab further into the content area */
  width: calc(100% + 8px);
  margin-left: -2px; /* Shift left to maintain flush against border */
}

/* Create a connecting bridge for the active tab */
.tab.active::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  bottom: -2px;
  width: 4px;
  background: rgba(0, 255, 0, 0.2);
  border-top: 2px solid var(--green);
  border-bottom: 2px solid var(--green);
  z-index: -1;
}

.tab-label {
  display: block;
  position: relative;
  z-index: 3;
  white-space: nowrap;
}

.tab-content-pane {
  flex: 1;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  margin-left: 40px; /* Adjust for the new tab width */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tab-view-wrapper {
    flex-direction: column;
    height: auto;
    margin-left: 0;
  }
  
  .tab-container {
    position: relative;
    left: -2rem; /* Extend to CRT border on mobile too */
    top: auto;
    flex-direction: row;
    width: calc(100% + 4rem); /* Full width plus the padding we broke out of */
    margin-bottom: 1rem;
  }
  
  .tab {
    flex: 1;
    text-align: center;
    border: 2px solid var(--green);
    border-top: none; /* Flush against top on mobile */
    border-radius: 0 0 8px 8px; /* Rounded bottom corners for mobile */
    margin-bottom: 0;
    margin-right: 4px;
    padding: 0.75rem 0.5rem;
    writing-mode: horizontal-tb;
    text-orientation: initial;
    min-height: auto;
  }
  
  .tab:last-child {
    margin-right: 0;
  }
  
  .tab.active {
    padding: 0.75rem 0.5rem 1rem 0.5rem;
  }
  
  .tab.active::after {
    top: -2px;
    bottom: auto;
    left: -2px;
    right: -2px;
    width: auto;
    height: 4px;
    border: none;
    border-left: 2px solid var(--green);
    border-right: 2px solid var(--green);
  }
  
  .tab-content-pane {
    border-left: none;
    border-top: 2px solid var(--green);
    margin-left: 0;
    margin-top: -2px;
  }
}
</style>
