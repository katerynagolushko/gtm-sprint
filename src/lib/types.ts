export type Theme = "desirability" | "feasibility" | "viability";
export type HypothesisType = "value" | "growth";
export type ExperimentCategory = "discovery" | "validation";
export type ExperimentStatus =
  | "not_started"
  | "in_progress"
  | "complete"
  | "paused";
export type Decision = "persevere" | "pivot" | "pause" | "kill" | "";

export type WeekAction = {
  id: string;
  text: string;
  done: boolean;
};

export type Assumption = {
  id: string;
  text: string;
  theme: Theme;
  importance: number;
  evidence: number;
  isLeverage: boolean;
  createdAt: string;
};

export type Hypothesis = {
  id: string;
  assumptionId: string;
  belief: string;
  action: string;
  outcome: string;
  timeframe: string;
  type: HypothesisType;
  theme: Theme;
  statement: string;
  /** Customer acquisition plan */
  customerWho: string;
  customerWhere: string;
  motionId: string;
  reachHow: string;
  tools: string[];
  weeklyMetric: string;
  weeklyTarget: string;
  weekActions: WeekAction[];
  isActiveBet: boolean;
  /** Week-feasibility snapshot at activate time */
  feasibilityScore: number;
  feasibilityVerdict: "go" | "stretch" | "nogo" | "";
  evidenceLevel: "none" | "weak" | "some" | "strong" | "";
  hoursThisWeek: number;
  createdAt: string;
};

export type Experiment = {
  id: string;
  hypothesisId: string;
  name: string;
  status: ExperimentStatus;
  design: string;
  experimentType: string;
  category: ExperimentCategory;
  metric: string;
  criteria: string;
  theme: Theme;
  owner: string;
  deadline: string;
  createdAt: string;
};

export type Learning = {
  id: string;
  experimentId: string;
  observations: string;
  insights: string;
  actions: string;
  decision: Decision;
  createdAt: string;
};

export type ProgramProfile = {
  startupName: string;
  oneLiner: string;
  goal: string;
};

export type SprintState = {
  profile: ProgramProfile;
  assumptions: Assumption[];
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  learnings: Learning[];
};

export const EXPERIMENT_TYPES = [
  "Customer Interview",
  "Landing Page / Smoke Test",
  "Paid Ads",
  "Explainer Video",
  "Clickable Prototype",
  "Wizard of Oz",
  "A/B Test",
  "Concierge MVP",
  "Survey",
  "Observation",
  "Pre-order / Waitlist",
  "Demo Request Outreach",
] as const;
