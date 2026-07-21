import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CaseStrip } from "../components/CaseStudyCard";
import { PhaseMethodCard } from "../components/MethodCoach";
import { playbookById, type MotionId } from "../lib/acquisition";
import { casesForStep } from "../lib/cases";
import { THEME_LABELS } from "../lib/content";
import { PHASE_METHOD } from "../lib/methodology";
import { useSprint } from "../lib/SprintContext";
import {
  EXPERIMENT_TYPES,
  type ExperimentCategory,
  type ExperimentStatus,
} from "../lib/types";

const STATUS_LABEL: Record<ExperimentStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  complete: "Complete",
  paused: "Paused",
};

function suggestExperimentType(motionId: string): string {
  switch (motionId) {
    case "paid_ads":
      return "Paid Ads";
    case "content_seo":
      return "Landing Page / Smoke Test";
    case "b2b_outbound":
    case "warm_network":
      return "Demo Request Outreach";
    case "community":
      return "Customer Interview";
    case "product_viral":
      return "A/B Test";
    default:
      return "Landing Page / Smoke Test";
  }
}

export function Experiments() {
  const { state, addExperiment, setExperimentStatus } = useSprint();
  const [params] = useSearchParams();
  const preselected =
    params.get("hypothesis") ||
    state.hypotheses.find((h) => h.isActiveBet)?.id ||
    state.hypotheses[0]?.id ||
    "";

  const [hypothesisId, setHypothesisId] = useState(preselected);
  const [name, setName] = useState("");
  const [design, setDesign] = useState("");
  const [experimentType, setExperimentType] = useState<string>(EXPERIMENT_TYPES[0]);
  const [category, setCategory] = useState<ExperimentCategory>("discovery");
  const [metric, setMetric] = useState("");
  const [criteria, setCriteria] = useState("");
  const [owner, setOwner] = useState("");
  const [deadline, setDeadline] = useState("");
  const [prefilledFor, setPrefilledFor] = useState("");

  const hypothesis = state.hypotheses.find((h) => h.id === hypothesisId);

  useEffect(() => {
    if (!hypothesis || prefilledFor === hypothesis.id) return;
    const pb = playbookById((hypothesis.motionId as MotionId) || "");
    setName(
      hypothesis.weeklyMetric
        ? `Acquire: ${hypothesis.weeklyTarget} ${hypothesis.weeklyMetric}`
        : hypothesis.statement.slice(0, 80),
    );
    setDesign(
      [
        `Customer: ${hypothesis.customerWho}`,
        `Where: ${hypothesis.customerWhere}`,
        `Reach: ${hypothesis.reachHow}`,
        hypothesis.tools.length ? `Tools: ${hypothesis.tools.join(", ")}` : "",
        pb ? `Motion: ${pb.label}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
    setExperimentType(suggestExperimentType(hypothesis.motionId));
    setMetric(hypothesis.weeklyMetric || "");
    setCriteria(
      hypothesis.weeklyTarget && hypothesis.weeklyMetric
        ? `Success if we hit ≥ ${hypothesis.weeklyTarget} ${hypothesis.weeklyMetric} within ${hypothesis.timeframe}.`
        : "",
    );
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDeadline(d.toISOString().slice(0, 10));
    setPrefilledFor(hypothesis.id);
  }, [hypothesis, prefilledFor]);

  const columns = useMemo(() => {
    const groups: Record<string, typeof state.experiments> = {
      not_started: [],
      in_progress: [],
      complete: [],
    };
    for (const e of state.experiments) {
      const key = e.status === "paused" ? "not_started" : e.status;
      groups[key]?.push(e);
    }
    return groups;
  }, [state.experiments]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!hypothesis || !name.trim() || !design.trim() || !metric.trim() || !criteria.trim()) {
      return;
    }
    addExperiment({
      hypothesisId: hypothesis.id,
      name: name.trim(),
      design: design.trim(),
      experimentType,
      category,
      metric: metric.trim(),
      criteria: criteria.trim(),
      theme: hypothesis.theme,
      owner: owner.trim(),
      deadline,
    });
    setName("");
    setDesign("");
    setMetric("");
    setCriteria("");
    setOwner("");
    setDeadline("");
    setPrefilledFor("");
  }

  return (
    <div className="wrap page">
      <div className="page-header">
        <div className="kicker">Step 05</div>
        <h1>Design the test</h1>
        <p>
          Prefills from your acquisition bet — customer, reach, tools, and Friday
          metric — so the Test Card matches what you’ll actually run this week.
        </p>
      </div>

      {state.hypotheses.length === 0 ? (
        <div className="empty">
          Build an acquisition bet first.
          <div style={{ marginTop: 12 }}>
            <Link to="/hypothesis" className="btn sm">
              Acquisition bet builder
            </Link>
          </div>
        </div>
      ) : (
        <>
          {hypothesis && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="why-label">From active bet</div>
              <p className="statement" style={{ margin: "8px 0" }}>
                {hypothesis.statement}
              </p>
              <div className="meta">
                {hypothesis.customerWho && (
                  <span className="pill">
                    ICP: {hypothesis.customerWho.slice(0, 48)}
                  </span>
                )}
                {hypothesis.weeklyTarget && (
                  <span className="pill signal">
                    Friday: {hypothesis.weeklyTarget} {hypothesis.weeklyMetric}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="grid-2" style={{ marginBottom: 22 }}>
            <form className="card form-grid" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="hyp">Acquisition bet</label>
                <select
                  id="hyp"
                  value={hypothesisId}
                  onChange={(e) => {
                    setHypothesisId(e.target.value);
                    setPrefilledFor("");
                  }}
                >
                  {state.hypotheses.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.isActiveBet ? "★ " : ""}
                      {h.statement}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="ename">Test name</label>
                <input id="ename" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="design">Experiment design (from your plan)</label>
                <textarea
                  id="design"
                  value={design}
                  onChange={(e) => setDesign(e.target.value)}
                  rows={6}
                />
              </div>
              <div
                className="row"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
              >
                <div className="field">
                  <label htmlFor="etype">Experiment type</label>
                  <select
                    id="etype"
                    value={experimentType}
                    onChange={(e) => setExperimentType(e.target.value)}
                  >
                    {EXPERIMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="cat">Category</label>
                  <select
                    id="cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExperimentCategory)}
                  >
                    <option value="discovery">Discovery — weak evidence OK</option>
                    <option value="validation">Validation — strong evidence</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="metric">Measure (weekly metric)</label>
                <input
                  id="metric"
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="criteria">Success criteria</label>
                <textarea
                  id="criteria"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                />
              </div>
              <div
                className="row"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
              >
                <div className="field">
                  <label htmlFor="owner">Assigned to</label>
                  <input
                    id="owner"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="Founder"
                  />
                </div>
                <div className="field">
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>
              <button className="btn" type="submit">
                Save experiment card
              </button>
            </form>

            <aside className="stack">
              <PhaseMethodCard {...PHASE_METHOD.experiment} />
              <Link to="/learnings" className="btn secondary">
                Next: capture Friday learning
              </Link>
              <Link to="/" className="btn ghost">
                Back to this week’s mission
              </Link>
            </aside>
          </div>

          <div className="board">
            {(
              [
                ["not_started", "Not started"],
                ["in_progress", "In progress"],
                ["complete", "Complete"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="board-col">
                <h3>{label}</h3>
                <div className="stack">
                  {columns[key].length === 0 && (
                    <div className="empty" style={{ padding: 16 }}>
                      None
                    </div>
                  )}
                  {columns[key].map((e) => {
                    const h = state.hypotheses.find((x) => x.id === e.hypothesisId);
                    return (
                      <div key={e.id} className="list-item">
                        <div className="meta">
                          <span className="pill">{THEME_LABELS[e.theme]}</span>
                          <span className="pill neutral">{e.experimentType}</span>
                        </div>
                        <h4>{e.name}</h4>
                        <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>
                          {h?.statement}
                        </p>
                        <p style={{ margin: 0, fontSize: 13 }}>
                          <strong>Measure:</strong> {e.metric}
                        </p>
                        <div className="row">
                          {(
                            [
                              "not_started",
                              "in_progress",
                              "complete",
                              "paused",
                            ] as ExperimentStatus[]
                          ).map((s) => (
                            <button
                              key={s}
                              type="button"
                              className="btn ghost sm"
                              onClick={() => setExperimentStatus(e.id, s)}
                            >
                              {STATUS_LABEL[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 28 }}>
        <CaseStrip
          cases={casesForStep("experiments")}
          title="How companies designed the test"
        />
      </div>
    </div>
  );
}
