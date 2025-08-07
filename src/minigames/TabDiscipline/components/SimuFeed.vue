<template>
  <div>
    <p class="text-sm text-gray-600 mb-2">Employee Reflections:</p>
    <div v-for="post in posts" :key="post.id" class="mb-4 p-3 border rounded bg-white">
      <p class="text-xs text-gray-400 mb-1">📎 {{ post.dept }} — {{ post.user }}</p>
      <p class="text-gray-800">{{ post.text }}</p>
      <div class="mt-2 flex space-x-1">
        <button
          v-for="emoji in ['👍', '🙂', '🌀', '❓', '🚫']"
          :key="emoji"
          @click="$emit('react', post.id, emoji)"
          class="text-sm hover:underline"
        >
          {{ emoji }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimuFeed',
  data() {
    return {
      posts: [
        {
          id: 1,
          dept: 'Logistics',
          user: 'M.R.',
          text: 'Completed task iteration 5. Still unsure why.',
        },
        { id: 2, dept: 'Wellness Ops', user: '—', text: 'I miss the hallway that used to echo.' },
      ],
    }
  },
}
</script>
