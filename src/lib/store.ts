import type {
  Assumption,
  Experiment,
  Hypothesis,
  Learning,
  ProgramProfile,
  SprintState,
  WeekAction,
} from "./types";

const STORAGE_KEY = "gtm-sprint-v2";

const defaultState = (): SprintState => ({
  profile: {
    startupName: "",
    oneLiner: "",
    goal: "",
  },
  assumptions: [],
  hypotheses: [],
  experiments: [],
  learnings: [],
});

function uid() {
  return crypto.randomUUID();
}

function normalizeHypothesis(raw: Partial<Hypothesis> & { id: string }): Hypothesis {
  return {
    id: raw.id,
    assumptionId: raw.assumptionId ?? "",
    belief: raw.belief ?? "",
    action: raw.action ?? "",
    outcome: raw.outcome ?? "",
    timeframe: raw.timeframe ?? "",
    type: raw.type ?? "value",
    theme: raw.theme ?? "desirability",
    statement: raw.statement ?? "",
    customerWho: raw.customerWho ?? "",
    customerWhere: raw.customerWhere ?? "",
    motionId: raw.motionId ?? "",
    reachHow: raw.reachHow ?? "",
    tools: raw.tools ?? [],
    weeklyMetric: raw.weeklyMetric ?? "",
    weeklyTarget: raw.weeklyTarget ?? "",
    weekActions: (raw.weekActions as WeekAction[] | undefined) ?? [],
    isActiveBet: Boolean(raw.isActiveBet),
    feasibilityScore: raw.feasibilityScore ?? 0,
    feasibilityVerdict: raw.feasibilityVerdict ?? "",
    evidenceLevel: raw.evidenceLevel ?? "",
    hoursThisWeek: raw.hoursThisWeek ?? 0,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export function loadState(): SprintState {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) || localStorage.getItem("gtm-sprint-v1");
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as SprintState;
    return {
      ...defaultState(),
      ...parsed,
      hypotheses: (parsed.hypotheses ?? []).map((h) =>
        normalizeHypothesis(h as Hypothesis),
      ),
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: SprintState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createAssumption(
  partial: Omit<Assumption, "id" | "createdAt" | "isLeverage"> & {
    isLeverage?: boolean;
  },
): Assumption {
  return {
    ...partial,
    isLeverage: partial.isLeverage ?? false,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
}

export type HypothesisInput = Omit<
  Hypothesis,
  "id" | "createdAt" | "statement" | "isActiveBet"
> & {
  statement?: string;
  isActiveBet?: boolean;
};

export function createHypothesis(partial: HypothesisInput): Hypothesis {
  const statement =
    partial.statement ||
    `If we ${partial.action}, then ${partial.outcome} within ${partial.timeframe}.`;
  return normalizeHypothesis({
    ...partial,
    statement,
    isActiveBet: partial.isActiveBet ?? true,
    id: uid(),
    createdAt: new Date().toISOString(),
  });
}

export function createExperiment(
  partial: Omit<Experiment, "id" | "createdAt">,
): Experiment {
  return {
    ...partial,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
}

export function createLearning(
  partial: Omit<Learning, "id" | "createdAt">,
): Learning {
  return {
    ...partial,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
}

export function updateProfile(
  state: SprintState,
  profile: Partial<ProgramProfile>,
): SprintState {
  return { ...state, profile: { ...state.profile, ...profile } };
}

export function riskScore(a: Assumption) {
  return a.importance * 0.6 + (100 - a.evidence) * 0.4;
}

export function riskiestAssumptions(assumptions: Assumption[], n = 3) {
  return [...assumptions].sort((a, b) => riskScore(b) - riskScore(a)).slice(0, n);
}

export function composeHypothesis(action: string, outcome: string, timeframe: string) {
  const a = action.trim() || "…";
  const o = outcome.trim() || "…";
  const t = timeframe.trim() || "…";
  return `If we ${a}, then ${o} within ${t}.`;
}

export function activeBet(hypotheses: Hypothesis[]) {
  return hypotheses.find((h) => h.isActiveBet) ?? hypotheses[0] ?? null;
}
