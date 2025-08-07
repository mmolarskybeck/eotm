// src/game-logic.js
// assume TRACK_POOL, shuffle, sampleKeys, renderGame, showModal, etc. are already on window

import { visibilityPledges } from './tracks.js';
import { hazardPool, moralePool } from './events.js';
import { tierEvaluations, statExtras, pickRandom } from './evaluations.js';
import { pledgeCompleteMoralePool } from './events.js';

const mainContentEl = document.getElementById('main-content');
const podEl = document.getElementById('wellness-pod');

// Provide missing helpers
function showWarning(msg) {
  showModal(msg);
}
function openTrack(track) {
  gameState.openTracks.push(track);
}
export function deleteCard(cardId) {
  // 1) find the real array index
  const idx = gameState.feed.findIndex((c) => c.id === cardId);
  if (idx < 0) return;

  consumeAction();
  decrementPledgeTimer();
  gameState.feed.splice(idx, 1);
  renderGame();
  refillFeed();
  checkEnd();
}

// -- CONFIG --
const FEED_SIZE = 4;
const ACTION_LIMIT = 20;
const BURNOUT_LIMIT = 10;
const RECOVERY_BURNOUT = 3;

// -- GAME STATE --
let gameState = {
  initialDraw: true,
  deck: [],
  feed: [],
  progress: {}, // { trackName: lastCompletedStep }
  skipUsed: {}, // { trackName: true }
  skippedSteps: {},
  pledgedTrack: null,
  pledgeTurnsRemaining: 0,
  failedPledges: {},
  openTracks: [], // order of opened tracks
  completed: 0,
  burnout: 0,
  burnoutCount: 0, // number of times sent to pod
  actionsLeft: ACTION_LIMIT,
  score: 0,
};

// expose to window so ui-hooks can see it
window.gameState = gameState;

// and any functions you call from the UI without imports
window.renderGame = renderGame;
window.refillFeed = refillFeed;
window.executeCard = executeCard;
window.deleteCard = deleteCard;
window.goToWellnessPod = goToWellnessPod;
window.returnFromPod = returnFromPod;
// etc., whatever you call from inline onclicks or from ui-hooks.js

// -- INITIALIZE GAME --
export function initGame() {
  gameState.burnout = 0;
  gameState.burnoutCount = 0;
  gameState.actionsLeft = ACTION_LIMIT;
  gameState.progress = {};
  gameState.skipUsed = {};
  gameState.skippedSteps = {};
  gameState.pledgedTrack = null;
  gameState.pledgeTurnsRemaining = 0;
  gameState.failedPledges = {};
  gameState.openTracks = [];
  gameState.completed = 0;
  gameState.score = 0;
  gameState.initialDraw = true;
  buildDeckAndFeed();
  renderGame();
}

function buildDeckAndFeed() {
  const selected = sampleKeys(TRACK_POOL, 5);
  gameState.deck = buildDeck(selected);
  gameState.feed = [];
  refillFeed();
}

let nextCardId = 1;

// -- DECK BUILDER --
function buildDeck(trackNames) {
  const deck = [];

  trackNames.forEach((track) => {
    TRACK_POOL[track].forEach((stepObj) => {
      deck.push({
        id: nextCardId++,
        type: 'task',
        track,
        step: stepObj.step,
        title: stepObj.title,
        description: stepObj.description,
      });
    });
    deck.push({ id: nextCardId++, type: 'pledge', track });
  });

  // pick 2 random hazards & 2 random morales each run
  // hazards & morales get IDs too
  hazardPool
    .slice(0, 2)
    .forEach((h) => deck.push({ id: nextCardId++, type: 'hazard', ...h }));
  moralePool
    .slice(0, 2)
    .forEach((m) => deck.push({ id: nextCardId++, type: 'morale', ...m }));

  return shuffle(deck);
}

// helper to centralize “use up an action + check end”
function consumeAction() {
  gameState.actionsLeft--;
  checkEnd();
}
// -- FEED MANAGEMENT --
function refillFeed() {
  const firstDrawBuffer = [];
  const pendingEvents = [];

  // PHASE 1: draw until feed is full
  while (gameState.feed.length < FEED_SIZE && gameState.deck.length) {
    const card = gameState.deck.shift();

    // 1) auto-convert completed pledges here… (omitted for brevity)

    // 2) stash any hazard/morale on the very first fill
    if (card.type === 'hazard' || card.type === 'morale') {
      if (gameState.initialDraw) {
        firstDrawBuffer.push(card);
        continue;
      }
      pendingEvents.push(card);
      continue;
    }

    // 3) otherwise it's a task or pledge—load it into the feed
    gameState.feed.push(card);
  }

  // If this was the first-ever draw, restore those reserved events and re-run
  if (gameState.initialDraw) {
    gameState.initialDraw = false;
    gameState.deck.push(...firstDrawBuffer);
    shuffle(gameState.deck);
    return refillFeed();
  }

  // PHASE 2: we've got a full feed of task/pledge cards—show it
  renderGame();

  // then handle all buffered hazards & morale
  pendingEvents.forEach((evt) => {
    if (evt.type === 'hazard') {
      const effectText = `🔥 +${evt.burnout} burnout`;
      showModal(
        `<strong>${evt.title}</strong><br>` +
          `${evt.description}<br><br>` +
          `<em>Effect: ${effectText}</em>`
      );
      adjustBurnout(evt.burnout);
    } else {
      // morale
      let effectText = '';
      if (evt.hasOwnProperty('burnout')) {
        effectText =
          evt.burnout < 0
            ? `🔥 ${evt.burnout} burnout`
            : `🔥 +${evt.burnout} burnout`;
      } else if (evt.hasOwnProperty('extraAction')) {
        effectText = `🕐 +${evt.extraAction} action${
          evt.extraAction > 1 ? 's' : ''
        }`;
      }
      showModal(
        `<strong>${evt.title}</strong><br>` +
          `${evt.description}` +
          (effectText ? `<br><br><em>Effect: ${effectText}</em>` : '')
      );
      if (evt.burnout) adjustBurnout(evt.burnout);
      if (evt.extraAction) gameState.actionsLeft += evt.extraAction;
    }
  });

  // finally, check for end-of-game
  checkEnd();
}

// -- BURNOUT & WELLNESS POD --
function adjustBurnout(delta) {
  gameState.burnout = Math.min(
    Math.max(gameState.burnout + delta, 0),
    BURNOUT_LIMIT
  );
  checkWarnings();
  if (gameState.burnout >= BURNOUT_LIMIT) {
    sendToWellnessPod();
  }
}

function checkWarnings() {
  if (gameState.burnout === 7)
    showWarning('⚠️ Warning Zone: Elevated stress detected.');
  if (gameState.burnout === 9)
    showWarning('🚨 Critical Zone: Imminent wellness intervention.');
}

function sendToWellnessPod() {
  gameState.burnoutCount++;

  // 1) hide the live game
  const wrapper = document.getElementById('content-wrapper');
  wrapper.classList.add('pod-active');
}

// expose it so main.js and your HTML onclicks can see it
window.sendToWellnessPod = sendToWellnessPod;

function returnFromPod() {
  // 1) Reset burnout to the recovery level
  gameState.burnout = RECOVERY_BURNOUT;

  // 2) Inject new cards based on how many times we've been here
  if (gameState.burnoutCount === 2) {
    gameState.deck.push(
      {
        id: `morale-${Date.now()}`,
        type: 'morale',
        id: 'Zen Loop',
        effect: 'refillFeed',
      },
      {
        id: `hazard-${Date.now() + 1}`,
        type: 'hazard',
        id: 'Residual Fatigue',
        burnout: 1,
      }
    );
  } else if (gameState.burnoutCount === 3) {
    gameState.deck.push(
      {
        id: `morale-${Date.now()}`,
        type: 'morale',
        id: 'Process Flow Hack',
        effect: 'advanceEarliest',
      },
      {
        id: `hazard-${Date.now() + 1}`,
        type: 'hazard',
        id: 'HR Monitoring Flag',
        burnout: 2,
      }
    );
  }

  // 3) Shuffle, refill feed & re-render
  shuffle(gameState.deck);
  refillFeed();
  renderGame();

  // hide the pod + bring game back
  const wrapper = document.getElementById('content-wrapper');
  wrapper.classList.remove('pod-active');
}

// DEV HELPER - jump straight to the wellness pod for debugging purposes
window.debugPod = () => {
  // simulate burning out one more time
  gameState.burnoutCount++;
  // this will actually hide the game UI and show the pod
  sendToWellnessPod();
};

// DEV HELPER — jump straight to the end‐game screen
window.debugEnd = () => {
  // 1) Compute current score
  const score = calculateScore();

  // 2) Figure out which tier we’re in
  const tierKey = Object.keys(tierEvaluations).find((key) => {
    const [min, max] = tierEvaluations[key].range;
    return score >= min && score <= max;
  });
  const tierObj = tierEvaluations[tierKey];

  // 3) Build the base summary
  let fullSummary = pickRandom(tierObj.lines);

  // 4) Append any burnout‐ or pledge‐specific flavor
  if (gameState.burnout >= 8) {
    fullSummary += '\n\n' + pickRandom(statExtras.highBurnout);
  } else if (gameState.burnout <= 2) {
    fullSummary += '\n\n' + pickRandom(statExtras.lowBurnout);
  }
  if (
    (gameState.successfulPledges || 0) > 0 &&
    !Object.keys(gameState.failedPledges).length
  ) {
    fullSummary += '\n\n' + pickRandom(statExtras.pledgesSucceeded);
  } else if (Object.keys(gameState.failedPledges).length) {
    fullSummary += '\n\n' + pickRandom(statExtras.pledgesFailed);
  }

  // 5) Fire the end‐screen with exactly the same API as your normal endGame()
  showEndScreen(score, tierObj.title, fullSummary);
};

export function handlePledge(cardId) {
  const idx = gameState.feed.findIndex((c) => c.id === cardId);
  if (idx < 0) return;
  const card = gameState.feed[idx];
  const track = card.track;
  const desc = visibilityPledges[track] || '';

  if (gameState.progress[track] === 5) {
    showModal('Track already completed. Pledge not available.');
    return;
  }

  confirmModal(
    // 1) TITLE
    'Confirm Visibility Pledge',
    // 2) BODY
    `<em>${desc}</em><br>
     Publicly commit to complete <strong>${track}</strong> within your next <strong>5 actions</strong>.<br>
     If you succeed, receive <strong>+5 productivity points</strong>.<br>
     If you fail, you will receive a <strong>+2 burnout penalty</strong>.`,
    // 3) ON CONFIRM
    () => {
      // start 5-turn countdown
      gameState.pledgedTrack = track;
      gameState.pledgeTurnsRemaining = 5;

      // open the track if new
      if (!gameState.openTracks.includes(track)) {
        gameState.openTracks.push(track);
        gameState.progress[track] = 0;
      }

      // consume the pledge card & refresh
      gameState.feed.splice(idx, 1);
      refillFeed();
      renderGame();
    }
  );
}
// expose it so executeCard can call it:
window.handlePledge = handlePledge;

function decrementPledgeTimer() {
  if (!gameState.pledgedTrack) return;

  gameState.pledgeTurnsRemaining--;

  const track = gameState.pledgedTrack;

  // 1) Pledge succeeded?
  if (gameState.progress[track] === 5 && gameState.pledgeTurnsRemaining >= 0) {
    gameState.score += 5;
    showModal('👏 CoSy noticed your follow-through!');
    gameState.successfulPledges = (gameState.successfulPledges || 0) + 1;
    // clear pledge
    gameState.pledgedTrack = null;
    gameState.pledgeTurnsRemaining = 0;
    renderGame();
    return;
  }

  // 2) Pledge expired?
  if (gameState.pledgeTurnsRemaining <= 0) {
    // only penalize if incomplete
    if (gameState.progress[track] < 5) {
      adjustBurnout(2);
      showModal(`⚠️ Formal Reminder Logged for pledged track: ${track}`);
      // record the failure
      gameState.failedPledges[track] = true;
    }
    // clear pledge state (always)
    gameState.pledgedTrack = null;
    gameState.pledgeTurnsRemaining = 0;
    renderGame();
  }
}

export function executeCard(cardId) {
  const idx = gameState.feed.findIndex((c) => c.id === cardId);
  if (idx < 0) return;
  const card = gameState.feed[idx];
  const track = card.track;
  const current = gameState.progress[track] || 0;

  if (card.type === 'pledge') {
    return handlePledge(cardId);
  }

  // 2) skip mechanic
  if (card.step === current + 2) {
    if (!gameState.skipUsed[track]) {
      const msg = `
        <strong>Skip from step ${current + 1} → ${card.step}?</strong><br>
        <em>${card.description}</em><br><br>
        (+1 Burnout, –1 Score)
      `;
      window.confirmModal('Confirm Skip', msg, () => {
        adjustBurnout(1);
        gameState.score--;
        gameState.skipUsed[track] = true;
        gameState.skippedSteps[track] = current + 1;
        if (!gameState.openTracks.includes(track)) openTrack(track);
        completeExecution(track, idx);
      });
      return;
    } else {
      showModal('You’ve already used your one skip for this track.');
      return;
    }
  }

  // 3) enforce sequencing
  if (card.step !== current + 1) {
    showModal('Please adhere to CoSy-mandated productivity sequencing chains.');
    return;
  }

  // 4) normal play
  advanceStep(track, idx);
}

export function skipStep(cardId) {
  const idx = gameState.feed.findIndex((c) => c.id === cardId);
  if (idx < 0) return;
  const card = gameState.feed[idx];
  const track = card.track;
  const prev = gameState.progress[track] || 0;
  const target = card.step; // this is prev+2

  // 1) Penalties
  adjustBurnout(1);
  gameState.score--;
  gameState.skipUsed[track] = true;

  // 2) Record the skipped‐over step for your UI
  if (!gameState.skippedSteps[track]) gameState.skippedSteps[track] = [];
  gameState.skippedSteps[track].push(prev + 1);

  // 3) Open the track if it wasn’t already
  if (!gameState.openTracks.includes(track)) openTrack(track);

  // 4) Jump progress _directly_ to the new step
  gameState.progress[track] = target;

  // 5) Consume the action, remove the card, refill & re‐render
  consumeAction();
  decrementPledgeTimer();
  gameState.feed.splice(idx, 1);
  refillFeed();
  renderGame();
  checkEnd();
}
window.skipStep = skipStep;

function advanceStep(track, idx) {
  const alreadyOpen = gameState.openTracks.includes(track);
  const countOpen = gameState.openTracks.length;

  // if it's a brand-new track...
  if (!alreadyOpen) {
    // warn on opening the 4th distinct track
    if (countOpen === 3) {
      confirmModal(
        'Confirm Track Opening',
        'Opening a 4th track may spike burnout. Proceed?',
        () => {
          adjustBurnout(countOpen);
          openTrack(track);
          completeExecution(track, idx);
        }
      );
      return;
    }
    // otherwise just open it with its normal penalty
    adjustBurnout(countOpen);
    openTrack(track);
  }

  // now finish the step itself
  completeExecution(track, idx);
}

function completeExecution(track, idx) {
  gameState.progress[track] = (gameState.progress[track] || 0) + 1;
  if (gameState.progress[track] === 5) gameState.completed++;
  consumeAction();
  decrementPledgeTimer();
  gameState.feed.splice(idx, 1);
  refillFeed();
  checkEnd();
  renderGame();
}

// -- SYNC AVALANCHE --
function handleSyncAvalanche() {
  // discard random feed card
  const idx = Math.floor(Math.random() * gameState.feed.length);
  animateDiscard(idx, () => {
    gameState.feed.splice(idx, 1);
    refillFeed();
    renderGame();
  });
}

// -- ENDGAME CHECK --
function checkEnd() {
  console.log('checkEnd:', gameState.actionsLeft, '<=', 0);
  if (gameState.actionsLeft <= 0) endGame();
}

function endGame() {
  const score = calculateScore();

  // 1) Figure out which tier bucket we’re in
  const tierKey = Object.keys(tierEvaluations).find((key) => {
    const [min, max] = tierEvaluations[key].range;
    return score >= min && score <= max;
  });
  const tierObj = tierEvaluations[tierKey];

  // 2) Pick a random line from that tier’s flavor text
  const tierTitle = tierObj.title;
  let fullSummary = pickRandom(tierObj.lines);

  // 3) Append any stat-specific flavor
  if (gameState.burnout >= 8) {
    fullSummary += '\n\n' + pickRandom(statExtras.highBurnout);
  } else if (gameState.burnout <= 2) {
    fullSummary += '\n\n' + pickRandom(statExtras.lowBurnout);
  }

  if (
    gameState.successfulPledges > 0 &&
    !Object.keys(gameState.failedPledges).length
  ) {
    fullSummary += '\n\n' + pickRandom(statExtras.pledgesSucceeded);
  } else if (Object.keys(gameState.failedPledges).length) {
    fullSummary += '\n\n' + pickRandom(statExtras.pledgesFailed);
  }

  // 4) Finally, hand off the three pieces to your end-screen renderer:
  showEndScreen(score, tierTitle, fullSummary);
}

function onGameOver(finalScore) {
  // 1) stash into your history
  window.scoreHistory.push(finalScore);
  // 2) *then* reset just the mini‐game
  initGame();
}

/**
 * Wipe everything and start over, from any state
 */
function resetGame() {
  // 1) Remove pod mode (if active)
  document.getElementById('content-wrapper').classList.remove('pod-active');
  // 2) If you keep wellness-pod visible-by-default via JS, hide it:
  const pod = document.getElementById('wellness-pod');
  if (pod) pod.style.display = 'none';

  // 3) Tear down end-screen (if present)
  const end = document.getElementById('end-screen');
  if (end) end.remove();

  // 4) Back to the main-content area
  document.getElementById('main-content').style.display = '';

  // 5) Re-init the game
  initGame();
}
// expose it globally so your sidebar button can call it
window.resetGame = resetGame;

// expose so main.js and your HTML onclicks can see it
window.initGame = initGame;
window.executeCard = executeCard;
window.deleteCard = deleteCard;
window.openTrack = openTrack;
window.completeExecution = completeExecution;
window.advanceStep = advanceStep;
window.adjustBurnout = adjustBurnout;
// any other functions you call globally…
