<!-- src/components/GlobalTabs.vue -->
<template>
  <nav v-if="tabsState.isVisible" class="global-tab-container">
    <router-link
      v-for="(tab, index) in tabsState.tabs"
      :key="tab.name"
      :to="{ name: tab.name }"
      class="tab"
      active-class="active"
      :data-tab-index="index"
    >
      <span class="tab-label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useTabs } from '@/composables/useTabs'

const { tabsState } = useTabs()
</script>

<style scoped>
.global-tab-container {
  position: absolute;
  /* Aligns the container relative to the .crt-wrapper.
     50% = center of screen
     400px = half of .crt-wrapper's max-width
     2.75rem = width of the tab itself */
  left: calc(50% - 400px - 2.75rem);
  top: 180px; /* Vertical alignment */
  display: flex;
  flex-direction: column;
  width: 2.75rem;
  gap: 2px;
  z-index: 2; /* Sits above the wrapper but below other effects */
}

.tab {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90px;
  padding: 1.5rem 0.75rem;
  text-decoration: none;
  color: var(--green);
  font-family: var(--font-crt);
  font-size: 0.65rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid var(--green);
  /* Rounded edges on the left (exterior) side */
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  text-shadow: var(--tw-shadow-base);
  box-shadow: inset 0 0 10px rgba(0, 255, 136, 0.1);
  /* Overlap the wrapper by the width of its border to hide it */
  margin-right: -2px;
}

.tab:hover {
  background: rgba(0, 255, 0, 0.1);
  color: var(--green);
  text-shadow: 0 0 8px var(--green);
  box-shadow: inset 0 0 15px rgba(0, 255, 136, 0.2), 0 0 8px rgba(0, 255, 136, 0.3);
}

/* Clean, simple active state with clip-path */
.tab.active {
  background: rgba(0, 0, 0, 0.96);
  color: var(--green);
  text-shadow: 0 0 12px var(--green);
  /* Add a subtle right-side glow to help blend with wrapper */
  box-shadow: 
    inset 0 0 25px rgba(0, 255, 136, 0.2),
    2px 0 8px rgba(0, 255, 136, 0.15);
  filter: brightness(1.1) contrast(1.15);
  z-index: 3;
  
  /* Extend further into the wrapper for better overlap */
  width: calc(2.75rem + 6px);
  margin-right: -6px;
  
  /* More precise clip-path that accounts for the border exactly */
  clip-path: polygon(
    0 0,                    /* top-left corner */
    calc(100% - 6px) 0,     /* top-right, more space */
    calc(100% - 3px) 1px,   /* step in 3px, offset by 1px */
    calc(100% - 2px) 2px,   /* step to 2px inside border */
    calc(100% - 2px) calc(100% - 2px), /* run along inside border */
    calc(100% - 3px) calc(100% - 1px),  /* step back out */
    calc(100% - 6px) 100%,  /* bottom-right */
    0 100%                  /* bottom-left corner */
  );
  
  /* Remove conflicting border styles */
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.tab-label {
  display: block;
  position: relative;
  z-index: 3;
  white-space: nowrap;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 900px) {
  .global-tab-container {
    /* Switch to horizontal layout above the CRT wrapper */
    flex-direction: row;
    top: 10px; /* Position above the main box */
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    max-width: 400px;
    margin-right: 0; /* Reset margin for horizontal layout */
  }

  .tab {
    writing-mode: horizontal-tb;
    text-orientation: initial;
    min-height: auto;
    padding: 0.5rem 1rem;
    border-right: 2px solid var(--green);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    margin-right: 0;
    margin-bottom: -2px; /* Overlap bottom border */
  }

  .tab.active {
    border-bottom-color: transparent;
  }
}
</style>
