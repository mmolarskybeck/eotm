<template>
  <div class="main-text">
    <div class="panel">
      <div id="panelContent">
        <!-- INTRO -->
        <template v-if="view === 'intro'">
          <p>
            You have been randomly selected to complete a mandatory 5-question
            Personal Effectiveness Self-Assessment.
          </p>
          <p>Your answers will not be reviewed, unless necessary.</p>
          <p class="muted">
            Note: For your privacy, the system will time out after 45 seconds of
            inactivity. Unsubmitted responses will be
            <span class="danger">flagged</span>.
          </p>
          <p>Please remain at your station until completion.</p>
          <div class="actions">
            <button class="button" @click="goBack">[ EXIT ]</button>
            <button class="button" @click="begin">[ PROCEED ]</button>
          </div>
        </template>

        <!-- QUESTION -->
        <template v-else-if="view === 'question'">
          <h2>Question {{ qIndex + 1 }} of {{ questions.length }}</h2>
          <p>"{{ questions[qIndex] }}"</p>
          <div class="scale">
            <button
              v-for="n in 5"
              :key="n"
              class="button"
              @click="recordAnswer(n)"
            >
              {{ n }}
            </button>
          </div>

          <!-- 20-second warning -->
          <div v-if="showWarning" class="warning typewriter">
            <span class="typewriter-line">
              <span class="typewriter-text" ref="warningTextEl"></span>
              <span class="cursor" ref="warningCursorEl">█</span>
            </span>
          </div>
        </template>

        <!-- SUMMARY -->
        <template v-else-if="view === 'summary'">
          <template v-if="avg >= 3 || allOnes">
            <p><strong>Submission accepted.</strong></p>
            <p v-if="!allOnes">You may proceed.</p>
            <p v-else>(CoSy pauses.)</p>
            <p v-if="allOnes">"You were certain."</p>
          </template>
          <template v-else>
            <p class="danger">
              <strong>Low effectiveness rating.</strong>
            </p>
            <p>You are strongly encouraged to reconsider.</p>
            <p>Submit as-is or revise responses now.</p>
            <p class="muted">
              Note: Unrevised responses are made available to manager accounts.
            </p>
            <button class="button" @click="reconsider">Reconsider</button>
            <button class="button" @click="flagged">Submit Anyway</button>
          </template>
        </template>

        <!-- FLAGGED -->
        <template v-else-if="view === 'flagged'">
          <p>Submission logged.</p>
          <p>Manager access enabled.</p>
          <p>(CoSy: “Recorded.”)</p>
          <p>You may proceed.</p>
        </template>

        <!-- TIMEOUT -->
        <template v-else-if="view === 'timeout'">
          <h2>Session Timed Out</h2>
          <p>
            Your workstation detected <strong>45 seconds</strong> of
            inactivity.<br />
            Unsubmitted responses have been
            <span class="danger">flagged</span>.
          </p>
          <button class="button" @click="begin">Restart Quiz</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePageHeader } from '../composables/usePageHeader.js';
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  inject,
  nextTick,
} from 'vue';
import { useNavigation } from '../composables/useNavigation.js';
import { typeTextWithCursor } from '../composables/useTypewriter.js';

usePageHeader('ORCA.CORP // SELF-CHECK-IN', '-- CONFIDENTIAL ASSESSMENT --');

// router-based navigation
const { goBack } = useNavigation();

// optional debug button registry
const addDebugButton = inject('addDebugButton', () => {});

// 1) the quiz data & state
const questions = [
  'I maintain self-direction while accommodating consensus.',
  'I recognize when leadership does not require visibility.',
  'I receive redirection as a sign of institutional trust.',
  'I adapt my personality to meet evolving team needs.',
  'I express initiative only when aligned with known expectations.',
];
const view = ref('intro'); // 'intro' | 'question' | 'summary' | 'flagged' | 'timeout'
const qIndex = ref(0);
const answers = ref([]);

// warning & timeout timers
let inactivityTimer = null;
let warningTimer = null;
const showWarning = ref(false);
const warningTextEl = ref(null);
const warningCursorEl = ref(null);

// 2) computed helpers
const avg = computed(
  () => answers.value.reduce((a, b) => a + b, 0) / answers.value.length
);
const allOnes = computed(() => answers.value.every((v) => v === 1));

// 3) timer logic
function resetTimer() {
  clearTimeout(inactivityTimer);
  clearTimeout(warningTimer);
  showWarning.value = false;

  // show warning at 20 seconds remaining (i.e. after 25s)
  warningTimer = setTimeout(async () => {
    showWarning.value = true;
    await nextTick();
    typeTextWithCursor(
      warningTextEl.value,
      warningCursorEl.value,
      '> SUBMISSION WINDOW CLOSING...',
      50
    );
  }, 25000);

  inactivityTimer = setTimeout(() => {
    view.value = 'timeout';
    showWarning.value = false;
  }, 45000);
}

function stopTimer() {
  clearTimeout(inactivityTimer);
  clearTimeout(warningTimer);
}

// 4) screen transitions
function begin() {
  answers.value = [];
  qIndex.value = 0;
  view.value = 'question';
  resetTimer();
}

function recordAnswer(val) {
  answers.value.push(val);
  if (qIndex.value < questions.length - 1) {
    qIndex.value++;
    resetTimer();
  } else {
    view.value = 'summary';
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    showWarning.value = false;
  }
}

function reconsider() {
  answers.value = [];
  qIndex.value = 0;
  view.value = 'question';
  resetTimer();
}

function flagged() {
  view.value = 'flagged';
  clearTimeout(inactivityTimer);
  clearTimeout(warningTimer);
  showWarning.value = false;
}

onMounted(() => {
  if (import.meta.env.DEV) {
    addDebugButton('⏸ Stop Timer', stopTimer);
  }
  // Timer now starts when user clicks BEGIN; no reset on mount
});

onBeforeUnmount(() => {
  clearTimeout(inactivityTimer);
  clearTimeout(warningTimer);
});
</script>

<style scoped>
.header {
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.button {
  border: 1px solid #00ff99;
  background: transparent;
  color: #00ff99;
  padding: 0.4em 0.8em;
  cursor: pointer;
  text-transform: uppercase;
}
.button:hover {
  background: #00ff99;
  color: #000;
}

.scale {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.muted {
  color: #555;
  font-size: 0.9em;
  margin: 0.5em 0;
}

.danger {
  color: #ff3c3c;
}
/* Warning typewriter styling is inherited from global CRT CSS */
</style>
