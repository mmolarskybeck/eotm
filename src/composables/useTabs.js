// src/composables/useTabs.js
import { reactive, computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * @typedef {object} Tab
 * @property {string} name - The route name for the tab's navigation.
 * @property {string} label - The text to display on the tab.
 */

/**
 * @type {{
 *   tabs: Tab[],
 *   isVisible: boolean
 * }}
 */
const state = reactive({
  tabs: [],
  isVisible: false,
})

/**
 * A composable to manage global tabs that appear outside the main content area.
 */
export function useTabs() {
  const route = useRoute()

  /**
   * Sets the tabs to be displayed.
   * @param {Tab[]} newTabs - An array of tab objects. Pass an empty array to hide the tabs.
   */
  const setTabs = (newTabs) => {
    state.tabs = newTabs || []
    state.isVisible = state.tabs.length > 0
  }

  /**
   * A computed property that is true if a global tab is currently active.
   */
  const isTabActive = computed(() => {
    if (!state.isVisible) return false
    return state.tabs.some((tab) => tab.name === route.name)
  })

  return {
    tabsState: state,
    setTabs,
    isTabActive,
  }
}
