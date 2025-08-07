// src/events.js
export const hazardPool = [
  {
    id: 'Surprise Policy Reorg',
    title: '🔒 Surprise Policy Reorg',
    description: `CoSy has realigned operational priorities. Please revisit all workflows, immediately.`,
    burnout: 2,
  },
  {
    id: 'Mission-Critical Outage',
    title: '💥 Mission-Critical Outage',
    description: `System integrity compromised. IT suggests waiting ‘a bit.’ Your deadline remains unchanged.`,
    burnout: 1,
  },
  {
    id: 'Performance Review Surprise',
    title: '📉 Performance Review Surprise',
    description: `Your quarterly evaluation has been moved up without notice. Summarize your value in one paragraph or less.`,
    burnout: 2,
  },
  {
    id: 'File Retrieval Failure',
    title: '📂 File Retrieval Failure',
    description: `The document you need exists—but not for you. CoSy recommends submitting an “Access Clarification Request.”`,
    burnout: 1,
  },
  {
    id: 'Nearby Construction',
    title: '🚧 Construction, Somewhere Nearby',
    description: `Drilling has begun two floors down. Duration unknown. Noise-canceling is discouraged by policy.`,
    burnout: 1,
  },
];

export const moralePool = [
  {
    id: 'Leftover Donuts (Unclaimed)',
    title: '🍩 Leftover Donuts (Unclaimed)',
    description: `One jelly. One powdered. Procured for a meeting, once. They are now yours.`,
    burnout: -2,
  },
  {
    id: 'Executive Acclaim',
    title: '🎖️ Executive Acclaim',
    description: `A senior executive paused near your cubicle and smiled ambiguously.`,
    extraAction: 1,
  },
  {
    id: 'Confidential Thank-You',
    title: '📬 Envelope Marked “Confidential”',
    description: `Inside: a generic thank-you note, unsigned. You tack it to your cubicle wall.`,
    extraAction: 1,
  },
  {
    id: 'Unexpected Window Seat',
    title: '🪟 Unexpected Window Seat',
    description: `A reshuffle grants you temporary access to natural light. You feel… briefly unstoppable.`,
    extraAction: 2,
  },
  {
    id: 'Hallway Jazz',
    title: '📻 Hallway Music Resumes',
    description: `Smooth-jazz covers of corporate anthems flood the halls. You feel… lightly affirmed.`,
    burnout: -1,
  },
];

export const pledgeCompleteMoralePool = [
  {
    title: 'Retrospective Kudos',
    description:
      'CoSy notes your thorough follow-through. Take a moment to appreciate this breeze of satisfaction.',
    extraAction: 1,
  },
  {
    title: 'Backlog Clearance',
    description:
      'Outstanding work ahead of schedule. Enjoy this rare lull in the workflow.',
    extraAction: 1,
  },
  {
    title: 'Proactive Reporting',
    description:
      'Your initiative in post-hoc compliance is duly recorded. Here’s a spot of recognition.',
    extraAction: 1,
    burnout: -1,
  },
];

// src/events.js
export const burnoutBonuses = {
  ZenLoop: {
    id: 'Zen Loop',
    type: 'morale',
    title: 'Zen Loop',
    description:
      'You remembered to look out the window. A moment of detachment from outcomes.',
    effect: 'refillFeed',
    // no action cost, no burnout change
  },
  ProcessFlowHack: {
    id: 'Process Flow Hack',
    type: 'morale',
    title: 'Process Flow Hack',
    description:
      'A forgotten shortcut helps you auto-complete one step on your longest-running open track.',
    effect: 'advanceEarliest',
  },
  InboxClarity: {
    id: 'Inbox Clarity',
    type: 'morale',
    title: 'Inbox Clarity',
    description:
      'Your inbox… empty. No flagged items. Just a blinking cursor and the faint scent of lemon toner.',
    effect: 'clearInbox',
    burnout: -2,
    scoreBonus: 2,
  },
};

export const burnoutHazards = {
  ResidualFatigue: {
    id: 'Residual Fatigue',
    type: 'hazard',
    title: 'Residual Fatigue',
    description: 'You are not as restored as you’d hoped.',
    effect: 'nextTwoBurnout',
    burnout: 1, //  applies over two actions
    aftershockUses: 2,
  },
  SyncAvalanche: {
    id: 'Sync Avalanche',
    type: 'hazard',
    title: 'Sync Avalanche',
    description:
      'A flurry of overlapping invites descends like a calendar landslide.',
    effect: 'syncAvalanche',
  },
  HRMonitoringFlag: {
    id: 'HR Monitoring Flag',
    type: 'hazard',
    title: 'HR Monitoring Flag',
    description: 'Your behavior has triggered concern from HR Analytics.',
    effect: 'flagPenalty',
    burnout: 2, // only if discarded
  },
};
