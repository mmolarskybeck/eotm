<template>
  <div id="debug-area">
    <button
      v-for="(btn, i) in buttons"
      :key="i"
      class="btn-debug"
      @click="btn.onClick"
    >
      {{ btn.label }}
    </button>
  </div>
</template>

<script setup>
import { inject } from 'vue';
const buttons = inject('debugButtons', []);
</script>

<style scoped></style>
