import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { fetchSprintState, persistSprintState } from "./cloud";
import {
  createAssumption,
  createExperiment,
  createHypothesis,
  createLearning,
  defaultState,
  loadState,
  saveState,
  type HypothesisInput,
} from "./store";
import type {
  Assumption,
  Decision,
  Experiment,
  ExperimentCategory,
  ExperimentStatus,
  Hypothesis,
  Learning,
  ProgramProfile,
  SprintState,
  Theme,
} from "./types";

type SprintContextValue = {
  state: SprintState;
  hydrating: boolean;
  setProfile: (p: Partial<ProgramProfile>) => void;
  addAssumption: (input: {
    text: string;
    theme: Theme;
    importance?: number;
    evidence?: number;
  }) => void;
  updateAssumption: (id: string, patch: Partial<Assumption>) => void;
  removeAssumption: (id: string) => void;
  setLeverage: (id: string) => void;
  addHypothesis: (input: HypothesisInput) => Hypothesis;
  updateHypothesis: (id: string, patch: Partial<Hypothesis>) => void;
  setActiveBet: (id: string) => void;
  toggleWeekAction: (hypothesisId: string, actionId: string) => void;
  addExperiment: (input: {
    hypothesisId: string;
    name: string;
    design: string;
    experimentType: string;
    category: ExperimentCategory;
    metric: string;
    criteria: string;
    theme: Theme;
    owner: string;
    deadline: string;
  }) => Experiment;
  updateExperiment: (id: string, patch: Partial<Experiment>) => void;
  setExperimentStatus: (id: string, status: ExperimentStatus) => void;
  addLearning: (input: {
    experimentId: string;
    observations: string;
    insights: string;
    actions: string;
    decision: Decision;
  }) => Learning;
  resetAll: () => void;
};

const SprintContext = createContext<SprintContextValue | null>(null);

export function SprintProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState<SprintState>(() => loadState(null));
  const [hydrating, setHydrating] = useState(Boolean(userId));
  const skipNextPersist = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!userId) {
        setState(defaultState());
        setHydrating(false);
        return;
      }

      setHydrating(true);
      const remote = await fetchSprintState(userId);
      if (cancelled) return;

      skipNextPersist.current = true;
      if (remote) {
        setState(remote);
        saveState(remote, userId);
      } else {
        const local = loadState(userId);
        setState(local);
        await persistSprintState(userId, local);
      }
      setHydrating(false);
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || hydrating) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      void persistSprintState(userId, state);
    }, 400);
    return () => window.clearTimeout(t);
  }, [state, userId, hydrating]);

  const setProfile = useCallback((p: Partial<ProgramProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }));
  }, []);

  const addAssumption = useCallback(
    (input: {
      text: string;
      theme: Theme;
      importance?: number;
      evidence?: number;
    }) => {
      const a = createAssumption({
        text: input.text,
        theme: input.theme,
        importance: input.importance ?? 70,
        evidence: input.evidence ?? 15,
      });
      setState((s) => ({ ...s, assumptions: [a, ...s.assumptions] }));
    },
    [],
  );

  const updateAssumption = useCallback((id: string, patch: Partial<Assumption>) => {
    setState((s) => ({
      ...s,
      assumptions: s.assumptions.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }, []);

  const removeAssumption = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      assumptions: s.assumptions.filter((a) => a.id !== id),
    }));
  }, []);

  const setLeverage = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      assumptions: s.assumptions.map((a) => ({
        ...a,
        isLeverage: a.id === id,
      })),
    }));
  }, []);

  const addHypothesis = useCallback((input: HypothesisInput) => {
    const h = createHypothesis({ ...input, isActiveBet: true });
    setState((s) => ({
      ...s,
      hypotheses: [h, ...s.hypotheses.map((x) => ({ ...x, isActiveBet: false }))],
    }));
    return h;
  }, []);

  const updateHypothesis = useCallback((id: string, patch: Partial<Hypothesis>) => {
    setState((s) => ({
      ...s,
      hypotheses: s.hypotheses.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    }));
  }, []);

  const setActiveBet = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      hypotheses: s.hypotheses.map((h) => ({
        ...h,
        isActiveBet: h.id === id,
      })),
    }));
  }, []);

  const toggleWeekAction = useCallback((hypothesisId: string, actionId: string) => {
    setState((s) => ({
      ...s,
      hypotheses: s.hypotheses.map((h) =>
        h.id !== hypothesisId
          ? h
          : {
              ...h,
              weekActions: h.weekActions.map((a) =>
                a.id === actionId ? { ...a, done: !a.done } : a,
              ),
            },
      ),
    }));
  }, []);

  const addExperiment = useCallback(
    (input: {
      hypothesisId: string;
      name: string;
      design: string;
      experimentType: string;
      category: ExperimentCategory;
      metric: string;
      criteria: string;
      theme: Theme;
      owner: string;
      deadline: string;
    }) => {
      const e = createExperiment({
        ...input,
        status: "not_started",
      });
      setState((s) => ({ ...s, experiments: [e, ...s.experiments] }));
      return e;
    },
    [],
  );

  const updateExperiment = useCallback((id: string, patch: Partial<Experiment>) => {
    setState((s) => ({
      ...s,
      experiments: s.experiments.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const setExperimentStatus = useCallback((id: string, status: ExperimentStatus) => {
    setState((s) => ({
      ...s,
      experiments: s.experiments.map((e) => (e.id === id ? { ...e, status } : e)),
    }));
  }, []);

  const addLearning = useCallback(
    (input: {
      experimentId: string;
      observations: string;
      insights: string;
      actions: string;
      decision: Decision;
    }) => {
      const l = createLearning(input);
      setState((s) => ({
        ...s,
        learnings: [l, ...s.learnings],
        experiments: s.experiments.map((e) =>
          e.id === input.experimentId ? { ...e, status: "complete" as const } : e,
        ),
      }));
      return l;
    },
    [],
  );

  const resetAll = useCallback(() => {
    if (!confirm("Clear all sprint data for your account?")) return;
    const empty = defaultState();
    setState(empty);
    if (userId) void persistSprintState(userId, empty);
  }, [userId]);

  const value = useMemo(
    () => ({
      state,
      hydrating,
      setProfile,
      addAssumption,
      updateAssumption,
      removeAssumption,
      setLeverage,
      addHypothesis,
      updateHypothesis,
      setActiveBet,
      toggleWeekAction,
      addExperiment,
      updateExperiment,
      setExperimentStatus,
      addLearning,
      resetAll,
    }),
    [
      state,
      hydrating,
      setProfile,
      addAssumption,
      updateAssumption,
      removeAssumption,
      setLeverage,
      addHypothesis,
      updateHypothesis,
      setActiveBet,
      toggleWeekAction,
      addExperiment,
      updateExperiment,
      setExperimentStatus,
      addLearning,
      resetAll,
    ],
  );

  return <SprintContext.Provider value={value}>{children}</SprintContext.Provider>;
}

export function useSprint() {
  const ctx = useContext(SprintContext);
  if (!ctx) throw new Error("useSprint must be used within SprintProvider");
  return ctx;
}
