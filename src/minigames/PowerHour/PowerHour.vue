<!-- src/screens/PowerHour.vue -->
<template>
  <div class="main-text">
    <!-- Stub content -->
    <p>This minigame is still under construction.</p>
    <p>Check back soon for your Productivity Power Hour!</p>

    <!-- Back button -->
    <div class="minigame-list">
      <button class="btn ascii" @click="goBack">‹‹ Back to Menu</button>
    </div>
  </div>
</template>

<script setup>
import { usePageHeader } from '@/composables/usePageHeader.js';
import { useNavigation } from '@/composables/useNavigation.js';

// 1) Set this page’s header:
usePageHeader('ORCA.CORP // POWER HOUR', '-- PRODUCTIVITY MODULE --');

// 2) Grab your router-based goBack():
const { goBack } = useNavigation();
</script>

<style scoped>
.minigame-list {
  margin-top: 1.5em;
}
.action-primary {
  /* inherits your existing terminal-style button look */
}
</style>
