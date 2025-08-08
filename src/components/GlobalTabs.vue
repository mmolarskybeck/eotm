<!-- src/components/GlobalTabs.vue -->
<template>
  <nav v-if="tabsState.isVisible" class="global-tab-container">
    <div class="tab-list" :style="gliderStyle" :data-active-route="route.name">
      <div class="tab-glider"></div>
      <router-link
        v-for="(tab, index) in tabsState.tabs"
        :key="tab.name"
        :to="{ name: tab.name }"
        class="tab-button"
        active-class="active"
        :data-tab-index="index"
      >
        <span class="tab-label">{{ tab.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useTabs } from '@/composables/useTabs'
import { useRoute } from 'vue-router'

const { tabsState } = useTabs()
const route = useRoute()

const gliderStyle = computed(() => {
  const activeIndex = tabsState.tabs.findIndex((tab) => tab.name === route.name)
  const tabHeight = 88 // Height per tab
  const tabGap = 4 // Gap between tabs
  const totalOffset = activeIndex >= 0 ? activeIndex * (tabHeight + tabGap) : 0

  return {
    '--active-tab-index': activeIndex >= 0 ? activeIndex : 0,
    '--tab-height': `${tabHeight}px`,
    '--glider-offset': `${totalOffset}px`,
    '--active-route-name': route.name || 'none',
  }
})
</script>

<style scoped>
/* CSS custom properties for precise control */
.global-tab-container {
  --tab-width: 44px;
  --tab-height: 88px;
  --tab-border-width: 2px;
  --tab-border-radius: 8px;
  --tab-color: var(--green);
  --tab-bg-base: rgba(0, 0, 0, 0.9);
  --tab-bg-hover: rgba(0, 255, 0, 0.1);
  --tab-bg-active: rgba(0, 0, 0, 0.96);
  --glider-bg: linear-gradient(
    90deg,
    rgba(0, 255, 136, 0.2) 0%,
    rgba(0, 255, 136, 0.5) 30%,
    rgba(0, 255, 136, 0.7) 50%,
    rgba(0, 255, 136, 0.5) 70%,
    rgba(0, 255, 136, 0.2) 100%
  );
}

/* Position the tab container to align with CRT wrapper left edge */
.global-tab-container {
  position: absolute;
  /* Align to left edge of .crt-wrapper:
     50% - center of viewport
     400px - half of .crt-wrapper max-width (800px)
     var(--tab-width) - width of tab to position outside */
  left: calc(50% - 400px - var(--tab-width));
  top: 180px;
  z-index: 2;
}

/* Flexbox container for tabs with spacing */
.tab-list {
  position: relative;
  display: flex;
  flex-direction: column;
  width: var(--tab-width);
  gap: 4px; /* Add spacing between tabs */
}

/* Individual tab styling with precise border management */
.tab-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Exact sizing */
  width: var(--tab-width);
  height: var(--tab-height); /* Positioning - overlap right border with CRT wrapper */
  margin-right: calc(-1 * var(--tab-border-width));
  margin-bottom: 0; /* Remove border collapse since we have gap now */

  /* Text styling */
  text-decoration: none;
  color: var(--tab-color);
  font-family: var(--font-ui);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 0 4px rgba(0, 255, 136, 0.3);

  /* Vertical text layout */
  writing-mode: vertical-lr;
  text-orientation: mixed;

  /* Visual styling */
  background: var(--tab-bg-base);
  border: var(--tab-border-width) solid var(--tab-color);
  border-right: none; /* Open side toward CRT wrapper */
  border-radius: var(--tab-border-radius) 0 0 var(--tab-border-radius);

  /* CRT glow effect on borders to match crt-wrapper */
  box-shadow: inset 0 0 10px rgba(0, 255, 136, 0.1), 0 0 4px rgba(0, 255, 136, 0.3),
    0 0 8px rgba(0, 255, 136, 0.15);
  transition: all 0.2s ease;

  /* Normal z-index */
  z-index: 2;
}

/* Hover state */
.tab-button:hover {
  background: var(--tab-bg-hover);
  color: var(--tab-color);
  text-shadow: 0 0 8px var(--tab-color);
  box-shadow: inset 0 0 15px rgba(0, 255, 136, 0.2), 0 0 8px rgba(0, 255, 136, 0.4);
  transform: translateX(-1px); /* Subtle hover effect */
}

/* Active state - back to normal styling */
.tab-button.active {
  background: var(--tab-bg-active);
  color: var(--tab-color);
  text-shadow: 0 0 12px var(--tab-color);
  box-shadow: inset 0 0 25px rgba(0, 255, 136, 0.3);
  filter: brightness(1.1);
}

/* Text rotation for bottom-to-top reading */
.tab-label {
  display: block;
  position: relative;
  white-space: nowrap;
  transform: rotate(180deg);
  z-index: 1;
}

/* Animated glider - thin vertical line at right edge of tabs */
.tab-glider {
  position: absolute;
  top: 0;
  /* Position at the right edge of the tabs (which connects to CRT) */
  right: calc(-1 * var(--tab-border-width));
  width: 4px; /* Thin vertical line */
  height: var(--tab-height);

  /* Default gradient (fallback) */
  background: linear-gradient(
    180deg,
    rgba(0, 255, 136, 0.8) 0%,
    rgba(0, 255, 200, 1) 50%,
    rgba(0, 255, 136, 0.8) 100%
  );

  /* Rounded ends */
  border-radius: 2px;

  /* Default glow effect */
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.8), 0 0 16px rgba(0, 255, 136, 0.4),
    inset 0 0 4px rgba(255, 255, 255, 0.3);

  /* Animation */
  transform: translateY(var(--glider-offset));
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Layer above tabs so it's visible */
  z-index: 3;
  pointer-events: none;
}

/* Colorful glider styles for each tab */

/* SHEETS tab - Green tones */
.tab-list[data-active-route='TabDisciplineWork'] .tab-glider {
  background: linear-gradient(
    180deg,
    #00ff88 0%,
    #00ffcc 20%,
    #00ff88 40%,
    #22ffaa 60%,
    #00ff88 80%,
    #00ffcc 100%
  );
  box-shadow: 0 0 12px rgba(0, 255, 136, 1), 0 0 24px rgba(0, 255, 136, 0.6),
    0 0 36px rgba(0, 255, 136, 0.3), inset 0 0 6px rgba(255, 255, 255, 0.4);
}

/* FEED tab - Orange/Yellow tones */
.tab-list[data-active-route='TabDisciplineFeed'] .tab-glider {
  background: linear-gradient(
    180deg,
    #ffaa00 0%,
    #ff8800 20%,
    #ffcc44 40%,
    #ff9922 60%,
    #ffaa00 80%,
    #ff7700 100%
  );
  box-shadow: 0 0 12px rgba(255, 170, 0, 1), 0 0 24px rgba(255, 136, 0, 0.6),
    0 0 36px rgba(255, 119, 0, 0.3), inset 0 0 6px rgba(255, 255, 255, 0.4);
}

/* PORTAL tab - White/Blue tones */
.tab-list[data-active-route='TabDisciplineHR'] .tab-glider {
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #ccddff 20%,
    #ffffff 40%,
    #aaccff 60%,
    #ffffff 80%,
    #bbddff 100%
  );
  box-shadow: 0 0 12px rgba(255, 255, 255, 1), 0 0 24px rgba(204, 221, 255, 0.8),
    0 0 36px rgba(170, 204, 255, 0.4), inset 0 0 6px rgba(255, 255, 255, 0.6);
}

/* Responsive layout for smaller screens */
@media (max-width: 900px) {
  .global-tab-container {
    /* Switch to horizontal layout above the CRT */
    left: 50%;
    top: 140px;
    transform: translateX(-50%);
    width: auto;
    max-width: min(400px, 80vw);
  }

  .tab-list {
    flex-direction: row;
    width: auto;
    height: var(--tab-width);
  }

  .tab-button {
    /* Horizontal orientation */
    writing-mode: horizontal-tb;
    text-orientation: initial;
    width: auto;
    min-width: 80px;
    height: var(--tab-width);

    /* Remove margins since we have gap in horizontal mode too */
    margin-right: 0;
    margin-bottom: calc(-1 * var(--tab-border-width));
    margin-left: 0;

    /* Adjust borders for top connection */
    border-right: var(--tab-border-width) solid var(--tab-color);
    border-bottom: none;
    border-radius: var(--tab-border-radius) var(--tab-border-radius) 0 0;
  }

  .tab-button:last-child {
    margin-left: 0;
  }

  .tab-label {
    transform: none; /* No rotation needed horizontally */
  }

  .tab-glider {
    /* Horizontal line at bottom for mobile */
    top: auto;
    bottom: calc(-1 * var(--tab-border-width));
    right: auto;
    left: 0;
    width: 80px; /* Match min-width of tabs */
    height: 4px; /* Thin horizontal line */
    border-radius: 2px;
    transform: translateX(calc(var(--active-tab-index) * (80px + 4px))); /* Account for gap */
  }
}
</style>
