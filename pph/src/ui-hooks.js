// src/ui-hooks.js - UI rendering and modal logic for Productivity Power Hour
// Utility functions (if not already present)

import { tierEvaluations, statExtras, pickRandom } from './evaluations.js';
import { visibilityPledges } from './tracks.js';

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function sampleKeys(obj, n) {
  return shuffle(Object.keys(obj)).slice(0, n);
}

// Calculate final score
function calculateScore() {
  const complete = Object.values(gameState.progress).filter(
    (x) => x === 5
  ).length;

  const partialSteps = Object.values(gameState.progress).reduce((sum, val) => {
    return sum + (val < 5 ? val : 0);
  }, 0);

  const pledgeBonus = (gameState.successfulPledges || 0) * 5;
  const skipPenalty = Object.keys(gameState.skipUsed || {}).length;
  const burnoutPenalty = gameState.burnout;

  const baseScore = complete * 5 + (partialSteps / 5) * 2;

  return Math.round(baseScore + pledgeBonus - skipPenalty - burnoutPenalty);
}

// Render the main game UI
function renderGame() {
  // Status
  const statusEl = document.getElementById('status');
  statusEl.innerHTML = `
    <div>Burnout: ${'▓'.repeat(gameState.burnout)}${'░'.repeat(
    10 - gameState.burnout
  )} ${gameState.burnout}/10</div>
    <div>Actions Left: ${gameState.actionsLeft}</div>
  `;

  // Progress
  const progressEl = document.getElementById('progress');
  let html = '<div>Initiative Progress:</div>';
  if (gameState.openTracks.length) {
    gameState.openTracks.forEach((track) => {
      const done = gameState.progress[track] || 0;
      const skipped = gameState.skippedSteps[track] || [];
      let bar = '';

      for (let step = 1; step <= 5; step++) {
        if (step <= done) {
          // completed step
          if (skipped.includes(step)) {
            bar += '◻'; // hollow square for a skipped‐but‐credited step
          } else {
            bar += '■'; // solid square for a normal complete
          }
        } else {
          bar += '□'; // unstarted
        }
      }

      let pledgeBadge = '';
      if (gameState.pledgedTrack === track) {
        const rem = gameState.pledgeTurnsRemaining;
        pledgeBadge = ` 🕑 ${rem}`;
      }
      const failed = gameState.failedPledges[track] ? ' 🚩' : '';
      html += `<p>• ${track.padEnd(
        28,
        ' '
      )} [${bar}] ${done}/5${pledgeBadge}${failed}</p>`;
    });
  } else {
    html +=
      '<p>No initiatives currently underway. Friendly reminder that Power Hour has begun!</p>';
  }
  progressEl.innerHTML = html;

  // Feed
  const feedEl = document.getElementById('feed');
  let feedHtml = '';
  // inside renderGame, replacing your feed.forEach template
  gameState.feed.forEach((card, i) => {
    let stepHtml, titleHtml, descHtml, executeLabel;

    if (card.type === 'pledge') {
      // PLEDGE card
      stepHtml = 'Visibility Pledge';
      titleHtml = `Publicly commit to completing this track for bonus points.`;
      descHtml = '';
      executeLabel = 'Pledge';
    } else {
      // NORMAL task card
      stepHtml = `Step ${card.step}`;
      titleHtml = card.title;
      descHtml = '';
      executeLabel = 'Execute';
    }

    feedHtml += `
    <div class="retro-window ticket-card">
      <div class="window-header">
        <span class="window-title">Task Ticket</span>
      </div>
      <div class="window-body">
        <div class="card-step">${stepHtml}</div>
        <div class="card-track">${card.track}</div>
        <div class="card-title">${titleHtml}</div>
        <div class="card-desc">${descHtml}</div>
        <div class="actions">
        <button onclick="showCardModal(${card.id})">
  ${card.type === 'pledge' ? 'Pledge' : 'Execute'}
</button>
<button onclick="deleteCard(${card.id})">Delete</button>

        </div>
      </div>
    </div>
  `;
  });

  feedEl.innerHTML = feedHtml;
}

/**
 * Collapse a ticket‐card element with animation
 * (useful for manual card removal outside of Sync Avalanche)
 */
function collapseCard(button) {
  const card = button.closest('.ticket-card');
  card.classList.add('collapsing');
  setTimeout(() => card.remove(), 400);
}

/**
 * Gracefully close any visible modal by playing the collapse animation
 */
function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  const wrapper = document.querySelector('.modal-wrapper');
  if (wrapper) {
    wrapper.classList.add('collapsing');
    setTimeout(() => {
      if (overlay) overlay.remove();
    }, 400);
  } else if (overlay) {
    // fallback if wrapper isn’t found
    overlay.remove();
  }
}

// Modal: simple notice
function showModal(message) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-position">
      <div class="modal-wrapper">
        <div class="modal-window">
          <div class="modal-header">
            <span class="modal-title">Notice</span>
            <button class="modal-close">✕</button>
          </div>
          <div class="modal-body"><p>${message.replace(/\n/g, '<br>')}</p></div>
          <div class="modal-footer">
            <button class="modal-ok">OK</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('.modal-close').onclick = () => closeModal();
  overlay.querySelector('.modal-ok').onclick = () => closeModal();
}

// Modal: confirmation
function confirmModal(title, message, onConfirm) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-position">
      <div class="modal-wrapper">
        <div class="modal-window">
          <div class="modal-header">
            <span class="modal-title">${title}</span>
            <button class="modal-close">✕</button>
          </div>
          <div class="modal-body"><p>${message.replace(/\n/g, '<br>')}</p></div>
          <div class="modal-footer">
            <button class="modal-cancel">Cancel</button>
            <button class="modal-confirm">Proceed</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('.modal-close').onclick = () => closeModal();
  overlay.querySelector('.modal-cancel').onclick = () => closeModal();
  overlay.querySelector('.modal-confirm').onclick = () => {
    closeModal();
    onConfirm();
  };
}

/**
 * Show a detailed modal for a task or pledge card,
 * then on Confirm call the right action.
 */

function showCardModal(cardId) {
  const idx = gameState.feed.findIndex((c) => c.id === cardId);
  if (idx < 0) return;
  const card = gameState.feed[idx];
  const track = card.track;
  const current = gameState.progress[track] || 0;

  let header, body, confirmLabel, onConfirm;

  if (card.type === 'pledge') {
    confirmLabel = 'Pledge';
    onConfirm = () => handlePledge(cardId);
    header = `Visibility Pledge`;
    body = visibilityPledges[track];
  } else if (card.step === current + 2 && !gameState.skipUsed[track]) {
    confirmLabel = 'Skip';
    onConfirm = () => skipStep(cardId);
    header = `Skip from ${current + 1} → ${card.step}?`;
    body = `<em>${card.description}</em><br><br>(+1 Burnout, –1 Score)`;
  } else {
    confirmLabel = 'Execute';
    onConfirm = () => executeCard(cardId);
    header = `Step ${card.step}: ${card.title}`;
    body = card.description || '';
  }

  // tear down any existing modal
  closeModal();

  // build the new one
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-position">
      <div class="modal-wrapper">
        <div class="modal-window">
          <div class="modal-header">
            <span class="modal-title">${header}</span>
            <button class="modal-close">✕</button>
          </div>
          <div class="modal-body"><p>${body}</p></div>
          <div class="modal-footer">
            <button class="modal-cancel">Cancel</button>
            <button class="modal-confirm">${confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('.modal-close').onclick = closeModal;
  overlay.querySelector('.modal-cancel').onclick = closeModal;
  overlay.querySelector('.modal-confirm').onclick = () => {
    closeModal();
    onConfirm();
  };
}

// expose globally
window.showCardModal = showCardModal;

// Animate discard (Sync Avalanche)
function animateDiscard(index, callback) {
  const cards = document.querySelectorAll('.ticket-card');
  const el = cards[index];
  if (!el) return callback();
  el.classList.add('collapsing');
  el.addEventListener('animationend', () => {
    el.remove();
    callback();
  });
}

// Navigate to Wellness Pod (placeholder)
function goToWellnessPod(burnoutCount) {
  // In HTML version: could redirect or show pod UI
  console.log('Entering Wellness Pod, count:', burnoutCount);
  // For now, immediate return simulation
  setTimeout(() => onReturnFromPod(), 1000);
}

function returnFromPod() {
  // 1) Swap the UIs
  document.getElementById('wellness-pod').style.display = 'none';
  document.getElementById('content-wrapper').style.display = '';
  document.getElementById('sidebar').style.display = '';

  // 2) Reset burnout meter
  gameState.burnout = 3;

  // 3) Add pod-return cards based on how many times we've been here
  if (gameState.burnoutCount === 2) {
    // 2nd trip: Zen Loop + Residual Fatigue
    gameState.deck.push(
      { type: 'morale', id: 'Zen Loop', effect: 'refill' },
      { type: 'hazard', id: 'Residual Fatigue', burnout: 1, aftershockUses: 2 }
    );
  } else if (gameState.burnoutCount === 3) {
    // 3rd trip: Process Flow Hack + HR Monitoring Flag
    gameState.deck.push(
      { type: 'morale', id: 'Process Flow Hack', effect: 'advanceEarliest' },
      { type: 'hazard', id: 'HR Monitoring Flag', burnout: 2 }
    );
  } else if (gameState.burnoutCount >= 4) {
    // 4th+ trip: you could inject additional “aftershock” or flavor cards here
    // e.g. gameState.deck.push({ type:'hazard', id:'Sync Avalanche', effect:'syncAvalanche' });
  }

  // 4) Shuffle, refill feed & re-render
  shuffle(gameState.deck);
  refillFeed();
  renderGame();
}

function showEndScreen(score) {
  // 1) Compute breakdown data
  const complete = Object.values(gameState.progress).filter(
    (x) => x === 5
  ).length;
  const partialSteps = Object.values(gameState.progress).reduce(
    (sum, v) => sum + (v < 5 ? v : 0),
    0
  );
  const pledgeBonus = (gameState.successfulPledges || 0) * 5;
  const skipPenalty = Object.keys(gameState.skipUsed || {}).length;
  const burnoutPenalty = gameState.burnout;
  const baseScore = complete * 5 + (partialSteps / 5) * 2;

  // 2) Tier & flavor text
  const tierKey = Object.keys(tierEvaluations).find((key) => {
    const [min, max] = tierEvaluations[key].range;
    return score >= min && score <= max;
  });
  const tierObj = tierEvaluations[tierKey];
  const tierTitle = tierObj.title;
  let fullSummary = pickRandom(tierObj.lines);

  // 3) Stat-specific extras
  if (gameState.burnout >= 8) {
    fullSummary += '\n\n' + pickRandom(statExtras.highBurnout);
  } else if (gameState.burnout <= 2) {
    fullSummary += '\n\n' + pickRandom(statExtras.lowBurnout);
  }
  if (
    gameState.successfulPledges > 0 &&
    Object.keys(gameState.failedPledges || {}).length === 0
  ) {
    fullSummary += '\n\n' + pickRandom(statExtras.pledgesSucceeded);
  } else if (Object.keys(gameState.failedPledges || {}).length) {
    fullSummary += '\n\n' + pickRandom(statExtras.pledgesFailed);
  }

  // 4) Hide the live game UI
  document.getElementById('main-content').style.display = 'none';

  // 5) Create or reuse end-screen container
  const wrapper = document.getElementById('content-wrapper');
  let end = document.getElementById('end-screen');
  if (!end) {
    end = document.createElement('div');
    end.id = 'end-screen';
    wrapper.appendChild(end);
  }

  // 6) Render all the pieces
  end.innerHTML = `
    <h1>📊 End of Power Hour</h1>
    <h2>${tierTitle}</h2>
    <h3>Final Score: ${score}</h3>

    <div class="score-breakdown">
      <p><strong>Completed Tracks:</strong> ${complete} × 5 = ${
    complete * 5
  }</p>
      <p><strong>Steps Completed:</strong> ${partialSteps} → ${(
    (partialSteps / 5) *
    2
  ).toFixed(1)}</p>
      <p><strong>Pledge Bonus:</strong> ${
        pledgeBonus ? '+' + pledgeBonus : '0'
      }</p>
      <p><strong>Skip Penalty:</strong> –${skipPenalty}</p>
      <p><strong>Burnout Penalty:</strong> –${burnoutPenalty}</p>
      <hr>
      <p><em>Base Score:</em> ${baseScore.toFixed(1)}</p>
    </div>

    <div class="evaluation-summary">
      <p>${fullSummary.replace(/\n/g, '<br>')}</p>
    </div>

    <div class="end-buttons">
      <button onclick="restartBlock()">Start New Block</button>
      <button onclick="exitSession()">End Session</button>
    </div>
  `;
}

// helper to tear down end-screen and restart
function restartBlock() {
  const end = document.getElementById('end-screen');
  if (end) end.remove();
  document.getElementById('main-content').style.display = '';
  initGame();
}

// expose for your HTML
window.restartBlock = restartBlock;

function exitSession() {
  window.location.reload(); // or route to a new screen or terminal outro
}

window.restartSession = () => {
  // 1) tear down the end screen
  const end = document.getElementById('end-screen');
  if (end) end.remove();

  // 2) show the game UI again
  document.getElementById('main-content').style.display = '';

  // 3) re-initialize everything
  initGame();
};

// Ensure these are available to game_logic.js
window.sampleKeys = sampleKeys;
window.shuffle = shuffle;
window.renderGame = renderGame;
window.showModal = showModal;
window.confirmModal = confirmModal;
window.showCardModal = showCardModal;
window.goToWellnessPod = goToWellnessPod;
window.returnFromPod = returnFromPod;
window.calculateScore = calculateScore;
window.showEndScreen = showEndScreen;
window.exitSession = exitSession;
