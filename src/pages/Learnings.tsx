import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CaseStrip } from "../components/CaseStudyCard";
import { PhaseMethodCard } from "../components/MethodCoach";
import { casesForStep } from "../lib/cases";
import { THEME_LABELS } from "../lib/content";
import { PHASE_METHOD } from "../lib/methodology";
import { useSprint } from "../lib/SprintContext";
import type { Decision } from "../lib/types";

export function Learnings() {
  const { state, addLearning } = useSprint();
  const runnable = state.experiments.filter((e) => e.status !== "complete");
  const [experimentId, setExperimentId] = useState(runnable[0]?.id || "");
  const [observations, setObservations] = useState("");
  const [insights, setInsights] = useState("");
  const [actions, setActions] = useState("");
  const [decision, setDecision] = useState<Decision>("persevere");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!experimentId || !observations.trim() || !insights.trim()) return;
    addLearning({
      experimentId,
      observations: observations.trim(),
      insights: insights.trim(),
      actions: actions.trim(),
      decision,
    });
    setObservations("");
    setInsights("");
    setActions("");
    setExperimentId(
      state.experiments.find((x) => x.id !== experimentId && x.status !== "complete")
        ?.id || "",
    );
  }

  return (
    <div className="wrap page">
      <div className="page-header">
        <div className="kicker">Step 06</div>
        <h1>Learn & decide</h1>
        <p>
          Experiments without learning cards are theatre. Capture what you saw,
          what it means, and what you will do next.
        </p>
      </div>

      <div className="grid-2">
        <form className="card form-grid" onSubmit={onSubmit}>
          {state.experiments.length === 0 ? (
            <div className="empty">
              No experiments yet.
              <div style={{ marginTop: 12 }}>
                <Link to="/experiments" className="btn sm">
                  Design a test
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="field">
                <label htmlFor="exp">Experiment</label>
                <select
                  id="exp"
                  value={experimentId}
                  onChange={(e) => setExperimentId(e.target.value)}
                >
                  {state.experiments.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.status === "complete" ? "✓ " : ""}
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="obs">Observations</label>
                <textarea
                  id="obs"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="What you saw, heard, or measured in the field."
                />
              </div>
              <div className="field">
                <label htmlFor="ins">Insights</label>
                <textarea
                  id="ins"
                  value={insights}
                  onChange={(e) => setInsights(e.target.value)}
                  placeholder="What you deduce from those observations."
                />
              </div>
              <div className="field">
                <label htmlFor="act">Actions</label>
                <textarea
                  id="act"
                  value={actions}
                  onChange={(e) => setActions(e.target.value)}
                  placeholder="How you will change the business model, offer, or next test."
                />
              </div>
              <div className="field">
                <label htmlFor="dec">Decision</label>
                <select
                  id="dec"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as Decision)}
                >
                  <option value="persevere">Persevere — evidence supports</option>
                  <option value="pivot">Pivot — evidence refutes, change direction</option>
                  <option value="pause">Pause — wait / gather more</option>
                  <option value="kill">Kill — stop this bet</option>
                </select>
              </div>
              <button className="btn" type="submit">
                Save learning card
              </button>
            </>
          )}
        </form>

        <aside className="stack">
          <PhaseMethodCard {...PHASE_METHOD.learn} />
          <Link to="/assumptions" className="btn secondary">
            Back to assumption map
          </Link>
        </aside>
      </div>

      {state.learnings.length > 0 && (
        <div className="section" style={{ paddingTop: 36 }}>
          <div className="section-head">
            <div>
              <div className="kicker">Learning log</div>
              <h2>What you know now</h2>
            </div>
          </div>
          <div className="stack">
            {state.learnings.map((l) => {
              const e = state.experiments.find((x) => x.id === l.experimentId);
              const h = state.hypotheses.find((x) => x.id === e?.hypothesisId);
              return (
                <div key={l.id} className="list-item">
                  <div className="meta">
                    <span className="pill signal">{l.decision || "undecided"}</span>
                    {e && <span className="pill">{THEME_LABELS[e.theme]}</span>}
                    <span className="pill neutral">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4>{e?.name || "Experiment"}</h4>
                  {h && (
                    <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)" }}>
                      {h.statement}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: 14 }}>
                    <strong>Observed:</strong> {l.observations}
                  </p>
                  <p style={{ margin: 0, fontSize: 14 }}>
                    <strong>Insight:</strong> {l.insights}
                  </p>
                  {l.actions && (
                    <p style={{ margin: 0, fontSize: 14 }}>
                      <strong>Action:</strong> {l.actions}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <CaseStrip
          cases={casesForStep("learnings")}
          title="When evidence said pivot — Slack"
        />
      </div>
    </div>
  );
}
