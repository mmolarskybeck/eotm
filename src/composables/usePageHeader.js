// src/composables/usePageHeader.js
import { inject, onMounted } from 'vue';

export function usePageHeader(title, subtitle) {
  const set = inject('setTitles');
  onMounted(() => set(title, subtitle));
}
