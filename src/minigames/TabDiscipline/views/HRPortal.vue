<!-- src/minigames/TabDiscipline/views/HRPortal.vue -->
<template>
  <div class="hr-portal-container">
    <p>Corporate HR notifications and documents.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate.</p>
    <!-- TODO: Implement HR portal content -->
  </div>
</template>

<script setup>
import { usePageHeader } from '@/composables/usePageHeader'

// Set page headers using the composable
usePageHeader('HUMAN RESOURCES PORTAL', 'File tree')

// HR portal component logic will be implemented here
</script>

<style scoped>
.hr-portal-container {
  padding: 1rem;
}
</style>
