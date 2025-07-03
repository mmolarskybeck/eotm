<template>
  <header class="crt-header">
    <div class="header-info">
      <span class="header-item">
        <span class="status-label">STATUS: </span>
        <span :class="[statusClass]" id="header-status">{{ statusText }}</span>
      </span>
    </div>
    <nav class="header-controls" aria-label="Global Commands">
      <button class="btn ascii" @click="help" data-shortcut="F1">[HELP]</button>
      <button class="btn ascii" @click="save" data-shortcut="F2">[SAVE]</button>
      <button class="btn ascii" @click="load" data-shortcut="F3">[LOAD]</button>
      <button class="btn ascii" @click="back" data-shortcut="F4">[BACK]</button>

      <!-- only one debug‐toggle here: -->
      <button
        class="btn ascii btn-debug-toggle"
        :class="{ off: !debug }"
        @click="$emit('toggle-debug')"
        data-shortcut="F5"
      ></button>
    </nav>
  </header>
</template>

<script setup>
import { inject, computed } from 'vue';
import { useRouter } from 'vue-router';

const statusLevel = inject('statusLevel'); // from App.vue
const router = useRouter();
const doSave = inject('doSave', () => {});
const doLoad = inject('doLoad', () => {});
const doHelp = inject('doHelp', () => {});

const props = defineProps({ debug: Boolean });

// Map our internal levels to the text we actually want to display:
const STATUS_LABELS = {
  white: 'STABLE',
  orange: 'UNSTABLE',
  red: 'ERROR',
};

const statusText = computed(() => {
  return STATUS_LABELS[statusLevel.value] || statusLevel.value.toUpperCase();
});

const statusClass = computed(() => `status-${statusLevel.value}`);

function back() {
  router.back(); // goes back in history, like hitting the browser’s back button
}
function save() {
  doSave();
}
function load() {
  doLoad();
}
function help() {
  doHelp();
}
</script>

<style scoped></style>
