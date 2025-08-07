<template>
  <div class="text-sm text-gray-700">
    Review the sentence below:
    <div class="mt-2 p-2 border rounded bg-gray-100">
      “Your cooperation is already reflected in the outcome.”
    </div>
    <div class="mt-2 space-x-2">
      <button class="btn" @click="$emit('interact', 'compliant')">Compliant</button>
      <button class="btn" @click="$emit('interact', 'needs-revision')">Needs Revision</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkTask',
}
</script>
