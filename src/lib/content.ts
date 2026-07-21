export const PHASES = [
  {
    id: "setup",
    step: "01",
    title: "Set the frame",
    path: "/setup",
    blurb: "Name the company, the goal, and what this sprint must prove.",
  },
  {
    id: "assumptions",
    step: "02",
    title: "Map assumptions",
    path: "/assumptions",
    blurb: "List desirability, feasibility, and viability beliefs. Plot importance vs evidence.",
  },
  {
    id: "leverage",
    step: "03",
    title: "Pick leverage",
    path: "/leverage",
    blurb: "Choose the single riskiest constraint. One focus until it breaks.",
  },
  {
    id: "hypothesis",
    step: "04",
    title: "Acquisition bet",
    path: "/hypothesis",
    blurb: "Who, where, how to reach them, tools, and the Friday success number.",
  },
  {
    id: "experiment",
    step: "05",
    title: "Design the test",
    path: "/experiments",
    blurb: "Turn the weekly bet into a Test Card with design and criteria.",
  },
  {
    id: "learn",
    step: "06",
    title: "Learn & decide",
    path: "/learnings",
    blurb: "Capture observations, insights, and persevere / pivot / pause / kill.",
  },
] as const;

export const GUIDE = {
  assumptionVsHypothesis: {
    title: "Assumption → Hypothesis",
    points: [
      'Assumption = broad untested belief ("We believe…")',
      "Hypothesis = testable, measurable, falsifiable",
      "Formula: Action + Expected outcome + Timeframe",
    ],
  },
  goodHypothesis: {
    title: "A good hypothesis is",
    points: [
      "Testable — evidence can support or refute it",
      "Precise — clear metric and threshold",
      "Discrete — one variable, not a bundle",
    ],
  },
  mapAxes: {
    title: "Assumption map",
    points: [
      "Y-axis: Importance — top = business dies if wrong",
      "X-axis: Evidence — left = strong evidence, right = none",
      "Focus: top-right = Important + No evidence",
    ],
  },
  experimentPick: {
    title: "Pick the right experiment",
    points: [
      "Type of hypothesis — desirability / feasibility / viability",
      "Uncertainty — less evidence → cheaper, faster tests",
      "Urgency — time and money until the next decision",
    ],
  },
  decision: {
    title: "After results",
    points: [
      "Evidence refutes → Pivot, Pause, or Kill",
      "Evidence supports → Next critical hypothesis, or same one at higher fidelity",
    ],
  },
};

export const THEME_LABELS = {
  desirability: "Desirability",
  feasibility: "Feasibility",
  viability: "Viability",
} as const;

export const THEME_HINTS = {
  desirability: "Do customers want this? Enough reachable customers?",
  feasibility: "Can we build, deliver, and scale it?",
  viability: "Can we capture enough value? Should we do this?",
} as const;
