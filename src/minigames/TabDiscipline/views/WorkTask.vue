<!-- src/minigames/TabDiscipline/views/WorkTask.vue -->
<template>
  <div class="work-task-container">
  <p>Compare source values with reported figures. Mark discrepancies for review.</p>
    <div class="reconciliation-container">
      <div 
        :class="['data-comparison', { processing: isProcessing }]"
        id="current-comparison"
      >
        <div class="data-source">
          <div class="data-label">SOURCE DATABASE</div>
          <div class="category-header">{{ currentEntry.category }}</div>
          <div class="data-value">{{ currentEntry.source }}</div>
        </div>
        
        <div class="vs-separator">vs</div>
        
        <div class="data-source">
          <div class="data-label">REPORTED VALUE</div>
          <div class="category-header">{{ currentEntry.category }}</div>
          <div class="data-value" id="reported-value">
            <span v-if="!isEditing">{{ currentEntry.reported }}</span>
            <input 
              v-else
              ref="editInput"
              v-model="editValue"
              @keypress.enter="finishEdit"
              @blur="finishEdit"
              class="edit-input"
            />
          </div>
        </div>
        
        <div class="actions">
          <button class="btn btn--green match" @click="handleAction('match')">✓ MATCH</button>
          <button class="btn flag" @click="handleAction('flag')">⚠ FLAG</button>
          <button class="btn edit" @click="handleAction('edit')">✎ EDIT</button>
        </div>
      </div>

      <div class="stats">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.processed }}</div>
            <div class="stat-label">PROCESSED</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.matched }}</div>
            <div class="stat-label">MATCHED</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.flagged }}</div>
            <div class="stat-label">FLAGGED</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ accuracyRate }}%</div>
            <div class="stat-label">ACCURACY</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { usePageHeader } from '@/composables/usePageHeader'

// Set page headers using the composable
usePageHeader('QUARTERLY DATA RECONCILIATION', 'SYSTEM v2.1.7')

// Reactive state
const currentEntry = reactive({
  category: '',
  source: '',
  reported: '',
  isMatch: false,
  baseValue: 0,
  categoryFormat: null
})

const stats = reactive({
  processed: 0,
  matched: 0,
  flagged: 0,
  edited: 0
})

const isProcessing = ref(false)
const isEditing = ref(false)
const editValue = ref('')
const editInput = ref(null)

// Data categories
const categories = [
  { name: "Revenue", prefix: "$", suffix: "" },
  { name: "Employee Hours", prefix: "", suffix: " hrs" },
  { name: "Inventory Count", prefix: "", suffix: " units" },
  { name: "Expense Report", prefix: "$", suffix: "" },
  { name: "Utility Usage", prefix: "", suffix: " kWh" },
  { name: "Attendance Rate", prefix: "", suffix: "%" },
  { name: "Budget Allocation", prefix: "$", suffix: "" },
  { name: "Equipment Value", prefix: "$", suffix: "" }
]

// Computed accuracy rate
const accuracyRate = computed(() => {
  return stats.processed > 0 ? Math.round((stats.matched / stats.processed) * 100) : 100
})

// Format value helper
const formatValue = (value, category) => {
  let formatted = value
  if (category.name.includes("$") || category.prefix === "$") {
    formatted = value.toFixed(2)
  } else if (category.suffix === "%") {
    formatted = Math.min(100, Math.max(0, value)).toFixed(1)
  } else {
    formatted = Math.floor(value)
  }
  
  return `${category.prefix}${formatted}${category.suffix}`
}

// Generate new entry
const generateNewEntry = () => {
  const category = categories[Math.floor(Math.random() * categories.length)]
  const baseValue = Math.floor(Math.random() * 50000) + 100
  
  // Create source value
  const sourceValue = formatValue(baseValue, category)
  
  // Generate reported value with potential discrepancy
  let reportedValue
  const discrepancyType = Math.random()
  
  if (discrepancyType < 0.4) {
    // Exact match (40% chance)
    reportedValue = sourceValue
  } else if (discrepancyType < 0.6) {
    // Small decimal difference (20% chance)
    const newVal = baseValue + (Math.random() - 0.5) * 0.1
    reportedValue = formatValue(newVal, category)
  } else if (discrepancyType < 0.8) {
    // Off by 1-5 (20% chance)
    const offset = Math.floor(Math.random() * 5) + 1
    const newVal = Math.random() < 0.5 ? baseValue + offset : baseValue - offset
    reportedValue = formatValue(Math.max(0, newVal), category)
  } else {
    // Digit transposition or larger error (20% chance)
    const errorVal = baseValue * (0.95 + Math.random() * 0.1)
    reportedValue = formatValue(Math.floor(errorVal), category)
  }

  // Update current entry
  Object.assign(currentEntry, {
    category: category.name,
    source: sourceValue,
    reported: reportedValue,
    isMatch: sourceValue === reportedValue,
    baseValue: baseValue,
    categoryFormat: category
  })
}

// Handle user actions
const handleAction = (action) => {
  if (action === 'edit') {
    handleEdit()
    return
  }
  
  isProcessing.value = true
  
  setTimeout(() => {
    stats.processed++
    
    if (action === 'match') {
      stats.matched++
    } else if (action === 'flag') {
      stats.flagged++
    }
    
    setTimeout(() => {
      isProcessing.value = false
      generateNewEntry()
    }, 300)
  }, 200)
}

// Handle edit mode
const handleEdit = () => {
  isEditing.value = true
  editValue.value = currentEntry.reported
  
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus()
      editInput.value.select()
    }
  })
}

// Finish editing
const finishEdit = () => {
  if (!isEditing.value) return
  
  currentEntry.reported = editValue.value
  stats.edited++
  stats.matched++ // Assume edit is to match
  stats.processed++
  
  isEditing.value = false
  
  setTimeout(() => {
    generateNewEntry()
  }, 500)
}

// Initialize on mount
onMounted(() => {
  generateNewEntry()
})
</script>

<style scoped>
.work-task-container {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reconciliation-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
}

.data-comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 1fr auto;
  gap: 1.5rem;
  align-items: center;
  padding: 2rem;
  border: 1px solid var(--green);
  border-radius: 8px;
  background: rgba(0, 255, 136, 0.05);
  transition: all 0.3s ease;
}

.data-comparison.processing {
  opacity: 0.7;
  transform: scale(0.98);
  background: rgba(255, 165, 0, 0.1);
}

.data-source {
  text-align: center;
  padding: 1rem;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
}

.data-label {
  font-size: 0.8em;
  color: var(--green);
  opacity: 0.7;
  margin-bottom: 0.5rem;
  font-family: var(--font-ui);
  letter-spacing: 0.1em;
}

.category-header {
  font-size: 0.9em;
  color: var(--orange);
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: var(--tw-shadow-orange);
}

.data-value {
  font-size: 1.8em;
  color: var(--green);
  font-family: var(--font-ui);
  font-weight: bold;
  text-shadow: var(--tw-shadow-base);
  min-height: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-separator {
  grid-column: 2;
  grid-row: 1;
  font-size: 1.5em;
  color: var(--orange);
  font-weight: bold;
  text-shadow: var(--tw-shadow-orange);
  text-align: center;
  padding: 0 1rem;
}

.actions {
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  min-width: 120px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn.flag {
  color: var(--orange);
  border-color: var(--orange);
  text-shadow: var(--tw-shadow-orange);
  box-shadow: inset 0 0 3px rgba(255, 165, 0, 0.2), 0 0 8px rgba(255, 165, 0, 0.4);
}

.btn.flag:hover {
  background: var(--orange);
  color: var(--bg);
  box-shadow: inset 0 0 6px rgba(255, 165, 0, 0.6), 0 0 12px rgba(255, 165, 0, 0.7);
}

.btn.edit {
  color: var(--white);
  border-color: var(--white);
}

.btn.edit:hover {
  background: var(--white);
  color: var(--bg);
}

.edit-input {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid var(--green);
  color: var(--green);
  font-family: var(--font-ui);
  font-size: inherit;
  font-weight: bold;
  text-align: center;
  padding: 0.25rem;
  border-radius: 4px;
  width: 100%;
  outline: none;
  text-shadow: var(--tw-shadow-base);
}

.edit-input:focus {
  border-color: var(--orange);
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.5);
}

.stats {
  border: 1px solid var(--green);
  border-radius: 8px;
  padding: 1.5rem;
  background: rgba(0, 255, 136, 0.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  text-align: center;
}

.stat-item {
  padding: 1rem;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
}

.stat-number {
  font-size: 2em;
  color: var(--green);
  font-family: var(--font-ui);
  font-weight: bold;
  text-shadow: var(--tw-shadow-base);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.8em;
  color: var(--green);
  opacity: 0.7;
  font-family: var(--font-ui);
  letter-spacing: 0.1em;
}

@media (max-width: 768px) {
  .data-comparison {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    text-align: center;
  }
  
  .vs-separator {
    grid-column: 1;
    grid-row: 2;
    padding: 1rem 0;
  }
  
  .actions {
    grid-column: 1;
    grid-row: 4;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
