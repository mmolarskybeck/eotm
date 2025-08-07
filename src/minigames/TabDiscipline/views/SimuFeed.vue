<!-- src/minigames/TabDiscipline/views/SimuFeed.vue -->
<template>
  <div class="simu-feed-container">
    <div class="feed-wrapper">
      <div class="feed" ref="feedContainer">
        <div 
          v-for="post in posts" 
          :key="post.id"
          class="post-container"
          :class="{ 'new-post-animation': post.isNew }"
          :data-tone="post.tone"
        >
                    <div class="post-content">{{ post.content }}</div>
          
          <div class="post-footer">
            <div class="reaction-display">
              <span 
                v-for="(count, emoji) in post.reactions" 
                :key="`${post.id}-${emoji}`"
                v-show="count > 0"
                class="reaction-badge"
                :class="{ 'user-reacted': post.userEmoji === emoji }"
              >
                {{ emoji }} {{ count }}
              </span>
            </div>
            
            <div class="reaction-picker" v-show="!post.hasUserReacted">
              <button 
                v-for="emoji in availableEmojis" 
                :key="`picker-${emoji}`"
                @click="handleUserReaction(post, emoji)"
                class="reaction-btn"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notifications - positioned relative to the container -->
    <div class="toast-container">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="toast"
      >
        <span class="toast-name">{{ toast.name }}</span> reacted with <span class="toast-emoji">{{ toast.emoji }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { usePageHeader } from '@/composables/usePageHeader'

// Set page headers using the composable
usePageHeader('Simu.Feed', 'Simultaneous Communication Channel')

// Import all the logic data (converted to reactive/ref as needed)
const narrativeArcs = {
  vanishingMug: [
    { author: "Luis Rivera", content: "Missing: blue coffee mug with 'World's Okayest Employee' label." },
    { author: "Maria T.", content: "Spotted a similar mug in the wellness room... or was it a dream?" },
    { author: "Luis Rivera", content: "Got it back! But it was in the supply closet... on the top shelf?" },
    { author: "Luis Rivera", content: "Mug keeps moving. Kitchen to break room to my desk. Someone's messing with me" },
    { author: "Maria T.", content: "We should just start a mug-sharing program. Embrace the chaos." }
  ],
  ghostOfConfD: [
    { author: "Maria T.", content: "Booked Conference D, but lights flicker when no one's inside." },
    { author: "Aisha Hassan", content: "Chair arrangement keeps changing between meetings." },
    { author: "David Wilson", content: "Why does the calendar list recurring meetings for 'Room D - Occupant 0'?" },
    { author: "Facilities", content: "Conference D chair sensors show movement during unbooked hours" },
    { author: "Maria T.", content: "Room D now blocked out indefinitely. Good call." }
  ],
  paperclipMystery: [
    { author: "Min-Jae Park", content: "Office inventory: short by 732 paperclips. Unusual." },
    { author: "Ravi P.", content: "I've been unbending paperclips for a sculpture. Might be related?" },
    { author: "Min-Jae Park", content: "Returning 98 clips from my desk drawer. Count still off." },
    { author: "Min-Jae Park", content: "Paperclips now arranged in perfect geometric patterns. No one remembers doing this." }
  ],
  newHireMystery: [
    { author: "Anika Singh", content: "New person starting Monday. Anyone know what department?" },
    { author: "David Wilson", content: "Got welcome email for 'Alex Chen' but no manager assignment listed" },
    { author: "Maria T.", content: "Set up desk for Alex but nameplate says 'A. Chen – Dept TBD'" },
    { author: "Luis Rivera", content: "It's Wednesday. Still haven't met Alex. Badge shows active though" }
  ],
  efficiencyConsultant: [
    { author: "System", content: "Productivity consultant will observe workflows this week" },
    { author: "Ravi P.", content: "Consultant took notes on my bathroom break timing. Weird" },
    { author: "Zoe Brooks", content: "efficiency guy asked how many keystrokes I use per email............." },
    { author: "David Wilson", content: "Consultant's report recommends 'attention optimization protocols'" },
    { author: "System", content: "Efficiency improvements will be implemented gradually" }
  ]
}

const knownChars = [
  { name: "Jen Chang", allowedCategories: ["weirdness", "time_observations", "anyone_else"], customPosts: ["has anyone else noticed that the lobby carpet pattern never lines up?", "i swear the thermostat resets itself every hour.", "anyone know who replaced the staplers with plastic models?"] },
  { name: "Ravi P.", allowedCategories: ["lost_and_found", "form_questions", "task_updates", "tech_support"], customPosts: ["need Form HR-204 for vacation request—anyone point me to it?", "finally cleared my inbox—took all night.", "did anyone turn in a pair of glasses with a red frame?"] },
  { name: "Maria T.", allowedCategories: ["events", "nostalgia", "facilities", "praise_and_thanks"], customPosts: ["team lunch tomorrow at noon in the break room—bring your own tacos.", "does anyone remember when the coffee was free?", "facilities said they fixed the air conditioning—still hot."] },
  { name: "Luis Rivera", allowedCategories: ["events", "praise_and_thanks", "weekend_chat"], customPosts: ["Organizing a group card for Maria's work anniversary. Sign it in the break room!", "Anyone need a ride to the team lunch Thursday? I've got room for three", "Started a coffee fund collection. $5 gets you premium blend for the month"] },
  { name: "Zoe Brooks", allowedCategories: ["emoji_reactions", "complaints", "weekend_chat"], customPosts: ["coffee machine is broken again ugh ☕💔", "who keeps eating people's lunches from the fridge 🥪😤", "happy friday everyone!! weekend plans? 🎉"] }
]

const templates = {
  lost_and_found: ["Did anyone find a {ITEM} in the {LOCATION}?", "Missing {ITEM} - last seen in {LOCATION}"],
  events: ["{EVENT} at {TIME} in {LOCATION} - come for {SNACKS}.", "Don't forget about {EVENT} today at {TIME}!"],
  weirdness: ["Has anyone else noticed {WEIRD_THING} in the {LOCATION}?", "Is it just me or is there {WEIRD_THING} near the {LOCATION}?"],
  facilities: ["{ISSUE} in the {LOCATION} - {INSTRUCTION}.", "Maintenance alert: {ISSUE} - {INSTRUCTION}"],
  complaints: ["Why does the {COMPLAINT_THING} always {COMPLAINT_VERB} when {COMPLAINT_SITUATION}?"],
  weekend_chat: ["Hope everyone had a great weekend! Ready to tackle the week.", "Did anyone else try {FOOD_PLACE} over the weekend? Thoughts?", "Happy Monday everyone!", "TGIF! Anyone have fun weekend plans?"],
  tech_support: ["Is anyone else having issues with {ITEM}?", "The {ITEM} isn't working properly - submitted a ticket"],
  general: ["Just wanted to say thanks for all the hard work this week!", "Coffee machine is working great today!", "Beautiful weather outside today!"]
}

const poolData = {
  ITEM: ["stapler", "phone charger", "notebook", "badge", "umbrella", "coffee mug", "headphones"],
  LOCATION: ["break room", "parking lot", "conference room B", "supply closet", "3rd floor lobby"],
  EVENT: ["safety training", "team sync", "retirement party"],
  SNACKS: ["donuts", "pizza", "bagels", "cookies"],
  WEIRD_THING: ["lights flickering", "strange humming noise", "cold spot"],
  ISSUE: ["water pressure issues", "heating system maintenance", "elevator being out of service"],
  INSTRUCTION: ["expect fluctuations", "please use other floors", "notify facilities"],
  FOOD_PLACE: ["that new taco place", "the sushi spot downtown", "the deli around the corner"],
  COMPLAINT_THING: ["printer", "elevator", "computer"],
  COMPLAINT_VERB: ["jam", "stop", "freeze"],
  COMPLAINT_SITUATION: ["I'm running late", "I'm carrying coffee", "I'm about to save"]
}

const toneReacts = {
  positive: ['👍','❤️','😂'],
  neutral: ['👍','🤔','😮'],
  curious: ['🤔','😮'],
  worrisome: ['😢','🤔','😮']
}

const categoryTone = {
  lost_and_found: 'neutral',
  events: 'positive',
  weirdness: 'curious',
  facilities: 'worrisome',
  complaints: 'worrisome',
  weekend_chat: 'positive',
  tech_support: 'neutral',
  general: 'positive'
}

// Reactive state
const posts = ref([])
const toasts = ref([])
const availableEmojis = ['👍', '😂', '😮', '🤔', '❤️', '😢']
const feedContainer = ref(null)

// State for managing posts and narratives
const postHistory = reactive([])
const activeNarratives = reactive([])
const availableNarrativeKeys = ref(Object.keys(narrativeArcs))
const openLoops = reactive([])
const usedRandom = reactive(new Set())
const randomNames = ["Alex R.", "Ben C.", "Casey L.", "Devon P.", "Eli K.", "Frankie M."]

let reactionEngineTimeout = null
let postEngineTimeout = null
let postIdCounter = 0
let toastIdCounter = 0

// Utility functions
const getRandom = (arr) => {
  if (!arr || arr.length === 0) return ""
  return arr[Math.floor(Math.random() * arr.length)]
}

const getKnownChar = () => getRandom(knownChars)

const getRandomName = () => {
  const available = randomNames.filter(n => !usedRandom.has(n))
  if (available.length === 0) {
    usedRandom.clear()
    return getRandom(randomNames)
  }
  const pick = getRandom(available)
  usedRandom.add(pick)
  return pick
}

const randomTime = () => {
  const hour = Math.floor(Math.random() * 10) + 8
  const minutes = [0, 15, 30, 45]
  const minute = minutes[Math.floor(Math.random() * minutes.length)]
  const displayHour = hour > 12 ? hour - 12 : hour
  const displayMinute = minute < 10 ? `0${minute}` : minute
  const ampm = hour >= 12 ? 'PM' : 'AM'
  return `${displayHour}:${displayMinute} ${ampm}`
}

// Core logic functions
const getNameAndCategory = () => {
  if (Math.random() < 0.6) {
    const kc = getKnownChar()
    return { name: kc.name, categories: kc.allowedCategories, custom: kc.customPosts }
  } else {
    return { name: getRandomName(), categories: Object.keys(templates), custom: [] }
  }
}

const fillPlaceholders = (text, filledPlaceholders) => {
  return text.replace(/{(\w+)}/g, (_, key) => {
    if (filledPlaceholders[key]) return filledPlaceholders[key]
    let value
    if (key === 'TIME') value = randomTime()
    else value = getRandom(poolData[key] || [`placeholder_${key}`])
    filledPlaceholders[key] = value
    return value
  })
}

const fillPost = () => {
  const { name, categories, custom } = getNameAndCategory()
  let postContent = ""
  let cat = ''
  const filledPlaceholders = {}

  if (custom && custom.length > 0 && Math.random() < 0.3) {
    let message = getRandom(custom)
    postContent = `${name}: ${message}`
    cat = getRandom(categories)
  } else {
    cat = getRandom(categories)
    const availableTemplates = templates[cat]
    if (!availableTemplates || availableTemplates.length === 0) {
      // Fallback to a safe category if current one has no templates
      cat = 'weekend_chat'
    }
    const tmpl = getRandom(templates[cat])
    let prefix = ''
    
    if (cat === 'facilities') {
      prefix = 'Facilities: '
    } else {
      prefix = `${name}: `
    }
    
    let message = fillPlaceholders(tmpl, filledPlaceholders)
    postContent = prefix + message
  }
  
  // Format content properly
  const separatorIndex = postContent.indexOf(': ')
  if (separatorIndex > -1) {
    const prefix = postContent.substring(0, separatorIndex + 2)
    let content = postContent.substring(separatorIndex + 2)
    
    // Ensure we have actual content
    if (!content || content.trim() === '') {
      content = "Just checking in with everyone!"
    }
    
    if (name === "Zoe Brooks") {
      content = content.toLowerCase()
    } else if (content) {
      content = content.charAt(0).toUpperCase() + content.slice(1)
    }
    postContent = prefix + content
  }
  
  return {
    id: ++postIdCounter,
    content: postContent,
    tone: categoryTone[cat] || 'neutral',
    author: name,
    reactions: reactive({}),
    userEmoji: null,
    hasUserReacted: false,
    isNew: false
  }
}

const createPost = () => {
  const post = fillPost()
  
  // Check for duplicates
  if (postHistory.some(p => p.content === post.content)) {
    return createPost() // Try again
  }
  
  postHistory.unshift(post)
  if (postHistory.length > 50) {
    postHistory.pop()
  }
  
  return post
}

const handleUserReaction = (post, emoji) => {
  if (post.hasUserReacted) return
  
  post.userEmoji = emoji
  if (post.reactions[emoji]) {
    post.reactions[emoji]++
  } else {
    post.reactions[emoji] = 1
  }
  post.hasUserReacted = true
  
  console.log(`User reacted with ${emoji} to post ${post.id}. Current reactions:`, post.reactions)
}

const showReactionToast = (name, emoji) => {
  const toast = {
    id: ++toastIdCounter,
    name,
    emoji
  }
  toasts.value.push(toast)
  
  setTimeout(() => {
    const index = toasts.value.findIndex(t => t.id === toast.id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }, 4000)
}

const npcReactionEngine = () => {
  if (posts.value.length > 0) {
    const targetPost = getRandom(posts.value)
    
    // Only add reactions if there aren't too many already
    const reactionCount = Object.values(targetPost.reactions).reduce((sum, count) => sum + count, 0)
    if (reactionCount < 6) {
      const reactorName = getRandom(knownChars).name
      const postTone = targetPost.tone
      let possibleReactions = toneReacts[postTone] || toneReacts.neutral
      
      // Small chance for random reactions
      if (Math.random() < 0.02) {
        possibleReactions = availableEmojis
      }
      
      const reactionEmoji = getRandom(possibleReactions)
      
      // Update the post's reactions using Vue's reactivity
      if (targetPost.reactions[reactionEmoji]) {
        targetPost.reactions[reactionEmoji]++
      } else {
        // Use Vue.set equivalent for adding new reactive properties
        targetPost.reactions[reactionEmoji] = 1
      }
      
      // Show toast notification
      showReactionToast(reactorName, reactionEmoji)
      
      console.log(`NPC ${reactorName} reacted with ${reactionEmoji} to post ${targetPost.id}. Current reactions:`, targetPost.reactions)
    }
  }
  
  const nextReactionDelay = 5000 + Math.random() * 25000
  reactionEngineTimeout = setTimeout(npcReactionEngine, nextReactionDelay)
}

const postEngine = () => {
  const newPost = createPost()
  newPost.isNew = true
  posts.value.unshift(newPost)
  
  // Remove new animation class after animation completes
  nextTick(() => {
    setTimeout(() => {
      newPost.isNew = false
    }, 500)
  })
  
  // Keep only 50 most recent posts
  if (posts.value.length > 50) {
    posts.value.pop()
  }
  
  const nextPostDelay = 30000 + Math.random() * 60000
  postEngineTimeout = setTimeout(postEngine, nextPostDelay)
}

const generatePosts = () => {
  // Clear existing timeouts
  if (reactionEngineTimeout) {
    clearTimeout(reactionEngineTimeout)
  }
  if (postEngineTimeout) {
    clearTimeout(postEngineTimeout)
  }
  
  // Reset state
  posts.value = []
  toasts.value = []
  postHistory.splice(0, postHistory.length)
  activeNarratives.splice(0, activeNarratives.length)
  availableNarrativeKeys.value = Object.keys(narrativeArcs)
  openLoops.splice(0, openLoops.length)
  usedRandom.clear()
  postIdCounter = 0
  
  // Generate initial posts
  for (let i = 0; i < 10; i++) {
    const post = createPost()
    posts.value.push(post)
  }
  
  // Start engines
  npcReactionEngine()
  postEngine()
}

onMounted(() => {
  generatePosts()
})

onUnmounted(() => {
  if (reactionEngineTimeout) {
    clearTimeout(reactionEngineTimeout)
  }
  if (postEngineTimeout) {
    clearTimeout(postEngineTimeout)
  }
})
</script>

<style scoped>
.simu-feed-container {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.feed-wrapper {
  border: 1px solid var(--green);
  border-radius: 8px;
  background: rgba(0, 255, 136, 0.05);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.controls {
  text-align: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 255, 136, 0.3);
}

.generate-btn {
  min-width: 200px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.feed-header {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 255, 136, 0.3);
}

.feed-title {
  font-size: 1.2em;
  color: var(--green);
  font-family: var(--font-ui);
  font-weight: bold;
  text-shadow: var(--tw-shadow-base);
  margin-bottom: 0.5rem;
}

.feed-subtitle {
  font-size: 0.9em;
  color: var(--green);
  opacity: 0.7;
  margin: 0;
}

.feed {
  flex: 1;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.2);
}

.post-container {
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 255, 136, 0.2);
  background: rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.post-container:hover {
  background: rgba(0, 255, 136, 0.08);
}

.post-content {
  color: var(--green);
  font-family: var(--font-ui);
  font-size: 0.9em;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  text-shadow: var(--tw-shadow-base);
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reaction-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex-grow: 1;
}

.reaction-badge {
  display: inline-block;
  font-size: 0.75em;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: rgba(0, 255, 136, 0.2);
  color: var(--green);
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.reaction-badge.user-reacted {
  background: rgba(255, 165, 0, 0.3);
  color: var(--orange);
  border-color: var(--orange);
  text-shadow: var(--tw-shadow-orange);
}

.reaction-picker {
  display: flex;
  gap: 0.25rem;
}

.reaction-btn {
  background: transparent;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1em;
}

.reaction-btn:hover {
  transform: scale(1.2);
  background: rgba(0, 255, 136, 0.1);
  border-color: var(--green);
}

.toast-container {
  position: fixed;
  bottom: 4rem;
  right: 4rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  pointer-events: none;
  max-width: 300px;
}

.toast {
  background: rgba(0, 0, 0, 0.9);
  color: var(--green);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--green);
  font-family: var(--font-ui);
  font-size: 0.8em;
  text-shadow: var(--tw-shadow-base);
  animation: fadeInOut 4s ease-in-out forwards;
}

.toast-name {
  font-weight: bold;
  margin-right: 0.25rem;
}

.toast-emoji {
  font-size: 1.2em;
  margin: 0 0.25rem;
}

.new-post-animation {
  animation: slideDown 0.5s ease-out forwards;
  transform-origin: top;
}

@keyframes fadeInOut {
  0% { 
    opacity: 0; 
    transform: translateX(100%); 
  }
  20% { 
    opacity: 1; 
    transform: translateX(0); 
  }
  80% { 
    opacity: 1; 
    transform: translateX(0); 
  }
  100% { 
    opacity: 0; 
    transform: translateX(100%); 
  }
}

@keyframes slideDown {
  0% {
    transform: scaleY(0) translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: scaleY(1) translateY(0);
    opacity: 1;
  }
}

/* Scrollbar styling for the feed */
.feed::-webkit-scrollbar {
  width: 8px;
}

.feed::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.feed::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 136, 0.3);
  border-radius: 4px;
}

.feed::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 136, 0.5);
}
</style>
