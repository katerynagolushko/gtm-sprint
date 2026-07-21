export type ExamplePair = {
  label: string;
  assumption: string;
  hypothesis: string;
};

export type CoachBlock = {
  title: string;
  why: string;
  tips: string[];
  examples?: ExamplePair[];
  watchOut?: string;
};

/** Step-linked coaching for the hypothesis wizard (0–3). */
export const HYPOTHESIS_COACH: CoachBlock[] = [
  {
    title: "Start with the belief — then make it falsifiable",
    why: "Beliefs about your startup usually start as assumptions. A hypothesis is the instrument you use to prove or refute them. If you skip the plain-language belief, you end up testing tactics without knowing which business bet is at stake.",
    tips: [
      'Write "We believe…" in everyday language first.',
      "Link it to your leverage constraint — the one assumption that can kill the business if wrong.",
      "Ask a Growth Partner to challenge the wording so you are not only hunting confirmation.",
    ],
    watchOut:
      "Confirmation bias trap: “customers will love X” nudges you to only see supporting data. Prefer wording that can be proven wrong.",
    examples: [
      {
        label: "Mental health app",
        assumption: "Users want a built-in calendar to schedule self-care.",
        hypothesis:
          "If we add a calendar, at least 50% of active users will schedule ≥1 event/week in the first month.",
      },
      {
        label: "B2B SaaS",
        assumption: "HR managers struggle with engagement and want automated feedback.",
        hypothesis:
          "If we cold-outreach 100 HR managers, at least 10% will request a demo within 30 days.",
      },
    ],
  },
  {
    title: "Name one action you will actually run",
    why: "A hypothesis without a concrete action is still a wish. The action isolates the variable — so when results come in, you know what caused them. Discrete beats bundled: one intervention, one learning.",
    tips: [
      "Phrase it as “If we…” — launch, send, show, offer, observe.",
      "Keep it reversible and cheap when evidence is thin (discovery mode).",
      "Do not stack two features in one action (“calendar + reminders”).",
    ],
    examples: [
      {
        label: "D2C subscription",
        assumption: "Busy professionals will pay for a curated monthly snack box.",
        hypothesis:
          "If we launch a landing page with a pre-order button… (action = landing + CTA)",
      },
      {
        label: "Feature interest",
        assumption: "Users want daily journaling prompts.",
        hypothesis:
          "If we post an explainer video to our beta group with a signup CTA…",
      },
    ],
    watchOut:
      "Vague actions like “improve onboarding” cannot be tested. Name the artifact or move you will ship this week.",
  },
  {
    title: "Make the outcome measurable — and set a clock",
    why: "Precision avoids endless debate after the test. A % , count, or threshold plus a timeframe turns opinions into validated learning — quantitative evidence instead of post-hoc stories.",
    tips: [
      "State who, what metric, and what bar (e.g. 5% of visitors, 60% of beta users).",
      "Add “within…” so the experiment has a natural end.",
      "Vague → precise: “users find it useful” → “70% use it ≥1×/week in month one”.",
    ],
    examples: [
      {
        label: "Vague vs precise",
        assumption: "Users will find the calendar useful.",
        hypothesis:
          "70% of users will actively use the calendar ≥ once/week within the first month.",
      },
      {
        label: "Pricing",
        assumption: "Early adopters will pay $10/month.",
        hypothesis:
          "If we offer $10/month, ≥20% of users who finish onboarding will subscribe within 14 days.",
      },
    ],
    watchOut:
      "If you cannot imagine a result that would falsify this, the outcome is still too soft.",
  },
  {
    title: "Check testable · precise · discrete — then tag the bet",
    why: "A well-formed hypothesis describes one thing you can investigate. Tagging Value vs Growth and Desirability / Feasibility / Viability tells you which experiment library to pull from next — and whether weak evidence (discovery) or strong evidence (validation) is enough.",
    tips: [
      "Testable: can evidence support or refute it?",
      "Precise: metric + threshold are unambiguous.",
      "Discrete: one variable — not “feature A and B together”.",
      "Value hypotheses ask: problem real? want it solved? solution works? enough value?",
      "Growth hypotheses ask: which channel, market, or scale path?",
    ],
    watchOut:
      "If evidence supports you, either raise fidelity on the same bet or move to the next critical assumption — do not declare PMF from one weak signal.",
  },
];

export const PHASE_METHOD = {
  setup: {
    title: "Why set a frame first",
    why: "Without a named decision this sprint must unlock, experiments become a random backlog. Startups cannot afford product-led detours — the goal is to learn what customers want and will pay for as fast as possible.",
    tips: [
      "Write the decision, not a feature list (“validate demo demand from cold outreach”).",
      "Keep pre-work light: Lean Canvas, customer clarity, MSC, weekly KPIs.",
      "Speed of learning is the competitive advantage — Ash Maurya.",
    ],
  },
  assumptions: {
    title: "Why map assumptions",
    why: "Every new idea requires leaps of faith. If the riskiest ones are false, the rest of the plan is irrelevant. Mapping importance × evidence surfaces the top-right quadrant: critical + little evidence — where experiments should start.",
    tips: [
      "Capture first, censor later. One sticky per belief.",
      "Order: desirability → feasibility → viability.",
      "Assumption = “We believe…”. Hypothesis comes after you pick leverage.",
    ],
    examples: [
      {
        label: "Rule of thumb",
        assumption: "Broad, untested (“We believe busy pros will pay…”)",
        hypothesis: "Testable (“If we launch a pre-order page, ≥5% convert in 2 weeks”)",
      },
    ],
  },
  leverage: {
    title: "Why one constraint",
    why: "Optimizing everything wastes resources and creates an unmanageable backlog. Theory of Constraints style: find the one bottleneck that unlocks the most flow. Whole team focuses there until it breaks — then move to the next.",
    tips: [
      "Prefer Important + No evidence from your map.",
      "Pick with a Growth Partner when you can — they challenge pet assumptions.",
      "Feeling inefficient focusing on one thing is normal; scattered focus is worse.",
    ],
  },
  hypothesis: {
    title: "Why craft a formal hypothesis",
    why: "Validated learning means testable hypotheses, designed experiments, and data — not executing a plan and inventing a story afterward. The formula Action + Outcome + Timeframe makes the bet falsifiable.",
    tips: [
      "Greek root of hypothesis: “to suppose” — an educated guess when data is thin.",
      "Instruments to prove or refute assumptions — not slogans for the pitch deck.",
      "Use the step coach on the right as you write.",
    ],
  },
  experiment: {
    title: "Why a Test Card",
    why: "The Test Card forces four things explicit before you spend: what must be true, how you will test, what you will measure, and what success looks like. Discovery allows weak evidence; validation demands strong evidence.",
    tips: [
      "Match experiment type to D/F/V, uncertainty, and urgency.",
      "Less evidence → cheaper and faster. Raise fidelity as you learn.",
      "Isolate one variable so results are attributable.",
    ],
    examples: [
      {
        label: "Journaling feature",
        assumption: "Users want daily journaling prompts.",
        hypothesis:
          "Explainer video to beta → measure signups → validate if ≥60% hand-raise, then higher-fidelity test.",
      },
    ],
  },
  learn: {
    title: "Why Learning Cards",
    why: "Running tests without capturing insights is theatre. Learning Cards make observations, deductions, and next actions explicit — so the team can persevere, pivot, pause, or kill with shared evidence.",
    tips: [
      "Refuted → Pivot, Pause, or Kill.",
      "Supported → next critical hypothesis OR same one at higher fidelity.",
      "Loop back to the assumption map — the program is a cycle, not a checklist.",
    ],
  },
} as const;

export const METHOD_CHAPTERS = [
  {
    id: "why",
    title: "Why experimentation matters",
    body: [
      "Business used to move slowly enough to build the wrong thing and still recover. That window is gone. Startups do not have the resources for long product-led misalignment.",
      "Your job is to learn what customers want — and will pay for — as quickly as possible, adjusting like a driver reading the road: Build → Measure → Learn.",
      "Bad learning is running a plan, then inventing a story. Validated learning is hypotheses → experiments → quantitative evaluation. Experiment smartly: fast, cheap, reversible.",
    ],
    quote: "Speed of learning is the new competitive advantage — Ash Maurya",
  },
  {
    id: "concepts",
    title: "Three foundations",
    body: [
      "Lean Startup: Hypothesis → Experiment → Data → Validate/Reject (Build-Measure-Learn).",
      "Scientific method: Ask → Hypothesize → Experiment → Analyze → Conclude. Hypotheses must be falsifiable.",
      "Design Thinking: Empathize → Define → Ideate → Prototype → Test — useful when you still need customer empathy before a sharp bet.",
    ],
  },
  {
    id: "assume",
    title: "Assumptions vs hypotheses",
    body: [
      "Assumptions are untested beliefs — broad, often accepted without evidence.",
      "Hypotheses are testable statements with conditions, expected outcomes, and criteria for validation or falsification.",
      "We start with assumptions, identify the riskiest, then craft good hypotheses for testing.",
    ],
    examples: [
      {
        label: "Mental health app",
        assumption: "Users want a built-in calendar for self-care routines.",
        hypothesis:
          "If we add a calendar, ≥50% of active users schedule ≥1 event/week in month one.",
      },
      {
        label: "D2C box",
        assumption: "Busy professionals will pay for a curated monthly snack box.",
        hypothesis:
          "If we launch a pre-order landing page, ≥5% of target visitors subscribe in two weeks.",
      },
      {
        label: "B2B SaaS",
        assumption: "HR managers need automated feedback tools.",
        hypothesis:
          "If we cold-outreach 100 HR managers, ≥10% request a demo within 30 days.",
      },
    ],
  },
  {
    id: "map",
    title: "Assumption mapping",
    body: [
      "List leaps of faith from your Lean Canvas and value proposition — desirability, then feasibility, then viability.",
      "Plot Importance (vertical) vs Evidence (horizontal). Top-right = riskiest: business-critical and unproven.",
      "Those become near-term experiments. Everything else waits.",
    ],
  },
  {
    id: "leverage",
    title: "Where is your leverage?",
    body: [
      "Old school: optimize everything, endless backlog.",
      "New school: one constraint at a time, one-page plan, right action at the right time.",
      "Your riskiest assumption — picked with a Growth Partner — is usually that constraint. Translate it into a hypothesis next.",
    ],
  },
  {
    id: "craft",
    title: "Crafting good hypotheses",
    body: [
      "Hypothesis comes from Greek “to suppose” — an educated guess when information is thin.",
      "Good hypotheses are testable, precise, and discrete. Formula: Action + Expected outcome + Timeframe.",
      "Value vs Growth types tell you what kind of learning you need next. Watch confirmation bias in the wording.",
    ],
  },
  {
    id: "test",
    title: "The testing process",
    body: [
      "Discovery experiments: weak evidence OK — find direction.",
      "Validation experiments: strong evidence required — confirm before you scale.",
      "Pick tests by hypothesis type (D/F/V), uncertainty, and urgency. Then run the 9-step loop and capture a Learning Card.",
    ],
  },
  {
    id: "falsify",
    title: "Falsification (penguin example)",
    body: [
      "Assumption: penguins can fly. Hypothesis: if we observe 20 penguins for a week, we will see at least one fly.",
      "Define “fly” clearly. Observe. None fly → hypothesis not supported in this sample.",
      "Same discipline applies to product bets: define the threshold that would prove you wrong before you run the test.",
    ],
  },
] as const;

export const QUALITY_CHECKS = [
  {
    id: "testable",
    title: "Testable",
    good: "Adding a calendar will increase engagement by 15% — measure before/after.",
    bad: "Customers will love the calendar.",
  },
  {
    id: "precise",
    title: "Precise",
    good: "70% of users use the calendar ≥1×/week within the first month.",
    bad: "Users will find the calendar useful.",
  },
  {
    id: "discrete",
    title: "Discrete",
    good: "The calendar alone will increase daily usage by 20%.",
    bad: "Calendar + reminders together will improve engagement.",
  },
] as const;
