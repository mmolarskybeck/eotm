// src/evaluations.js

export const tierEvaluations = {
  tier1: {
    title: 'High-Yield Output Recorded',
    range: [45, Infinity],
    lines: [
      'You sustained productivity without visible strain. This may be cited in future onboarding materials.',
      'Leadership noticed. They didn’t say anything, but they definitely noticed.',
      'Task completion velocity reached levels typically associated with light automation.',
      'Your cycle reflected consistent delivery across key task categories. Leadership has been informed.',
    ],
  },
  tier2: {
    title: 'Adequate Throughput Maintained',
    range: [30, 44],
    lines: [
      'Deliverables were tracked, timestamped, and mostly fine.',
      'You made steady progress. This has been auto-noted in your informal profile.',
      'Continued engagement at this level is encouraged and will be documented.',
      'Performance aligns with established expectations. No follow-up scheduled.',
    ],
  },
  tier3: {
    title: 'Workflow Drift Detected',
    range: [15, 29],
    lines: [
      'Several initiatives stalled mid-step. A light check-in may be scheduled.',
      'Task sequencing inconsistent. Some initiatives progressed; others remain stagnant.',
      'Output below optimal threshold. Additional oversight may be warranted.',
    ],
  },
  tier4: {
    title: 'Flagged for Recalibration',
    range: [0, 14],
    lines: [
      "Session archived under 'Training Anomalies.' Recommend stepping away from the console.",
      'Majority of initiatives left incomplete or improperly sequenced. Support review advised.',
      'Cycle closed with multiple gaps in required throughput. Coaching escalation likely.',
      'Performance may not meet renewal criteria. Review of eligibility in progress.',
    ],
  },
};

export const statExtras = {
  highBurnout: [
    'You maintained output despite elevated system load. Fatigue levels exceeded comfort thresholds. Recuperation is now advisable.',
    'Emotional latency exceeded recommended maximums. Please hydrate.',
  ],
  lowBurnout: [
    'Energy reserves remain curiously intact. Consider taking on additional work.',
    'You completed your productivity block with minimal wear. This suggests strong boundaries. Or alternative priorities.',
  ],
  pledgesSucceeded: [
    'Your public goals aligned with private outcomes. This is rare. And valued.',
    'Every commitment was completed within the window provided. Others will notice.',
  ],
  pledgesFailed: [
    'A visibility pledge was initiated, then not fulfilled. This pattern has been noted.',
    'Public declaration was not matched by delivery. A recalibration may be in order.',
    'A gap exists between what was promised and what occurred. We’ve made note of that in your file.',
    'You made promises. Some were aspirational.',
    'One or more pledges expired without fulfillment. Consider issuing a proactive clarification memo.',
  ],
};

// Utility to pick one at random
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
