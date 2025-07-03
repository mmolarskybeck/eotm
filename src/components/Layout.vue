<template>
  <div class="crt-wrapper">
    <CrtHeader
      :title="title"
      :subtitle="subtitle"
      :debug="debug"
      @toggle-debug="toggleDebug"
    />

    <main id="crt-main">
      <component v-if="title" :is="`h${level}`" class="crt-title">{{
        title
      }}</component>

      <component v-if="subtitle" :is="`h${level + 1}`" class="crt-subhead">{{
        subtitle
      }}</component>

      <slot />
      <CrtFooter />
    </main>
  </div>
  <DebugArea v-if="debug" />

  <div class="crt-glass" />
  <div class="scanlines" />
  <div class="bloom-overlay" />
</template>

<script setup>
import { ref, reactive, provide, inject, onMounted } from 'vue';
import CrtHeader from './CrtHeader.vue';
import CrtFooter from './CrtFooter.vue';
import DebugArea from './DebugArea.vue';

// props
const { title, subtitle, level } = defineProps({
  title: String,
  subtitle: String,
  level: { type: Number, default: 1 },
});

// F5 toggle
const debug = ref(
  new URLSearchParams(window.location.search).get('debug') === '1'
);
function toggleDebug() {
  const p = new URLSearchParams(window.location.search);
  if (debug.value) p.delete('debug');
  else p.set('debug', '1');
  window.location.search = p.toString();
}

// debug button registry
const debugButtons = reactive([]);
function addDebugButton(label, onClick) {
  debugButtons.push({ label, onClick });
}
provide('addDebugButton', addDebugButton);
provide('debugButtons', debugButtons);

// inject the statusLevel ref from App.vue
const statusLevel = inject('statusLevel');

// register “Cycle Status” only once when mounted
onMounted(() => {
  if (import.meta.env.DEV) {
    addDebugButton('Cycle Status', () => {
      const order = ['white', 'orange', 'red'];
      const next = order[(order.indexOf(statusLevel.value) + 1) % order.length];
      statusLevel.value = next;
    });
  }
});
</script>
