import { Link } from "react-router-dom";
import { CaseStrip } from "../components/CaseStudyCard";
import { PhaseMethodCard } from "../components/MethodCoach";
import { casesForStep } from "../lib/cases";
import { THEME_LABELS } from "../lib/content";
import { PHASE_METHOD } from "../lib/methodology";
import { riskiestAssumptions, riskScore } from "../lib/store";
import { useSprint } from "../lib/SprintContext";

export function Leverage() {
  const { state, setLeverage } = useSprint();
  const top = riskiestAssumptions(state.assumptions, 5);
  const current = state.assumptions.find((a) => a.isLeverage);

  return (
    <div className="wrap page">
      <div className="page-header">
        <div className="kicker">Step 03</div>
        <h1>Pick your leverage</h1>
        <p>
          Do not optimize everything. Choose the one constraint that, if solved,
          unlocks the most growth. The whole team focuses there until it breaks.
        </p>
      </div>

      <div className="grid-2">
        <div className="stack">
          {top.length === 0 ? (
            <div className="empty">
              Map assumptions first, then select your riskiest constraint.
              <div style={{ marginTop: 12 }}>
                <Link to="/assumptions" className="btn sm">
                  Go to assumptions
                </Link>
              </div>
            </div>
          ) : (
            top.map((a, i) => (
              <button
                key={a.id}
                type="button"
                className={`list-item ${a.isLeverage ? "active" : ""}`}
                style={{ textAlign: "left", cursor: "pointer", width: "100%" }}
                onClick={() => setLeverage(a.id)}
              >
                <div className="meta">
                  <span className="pill signal">Risk score {Math.round(riskScore(a))}</span>
                  <span className="pill">{THEME_LABELS[a.theme]}</span>
                  {i === 0 && <span className="pill risk">Suggested</span>}
                  {a.isLeverage && <span className="pill risk">Selected</span>}
                </div>
                <h4>We believe {a.text}</h4>
                <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14 }}>
                  Importance {a.importance} · Evidence {a.evidence}
                </p>
              </button>
            ))
          )}
        </div>

        <aside className="stack">
          <PhaseMethodCard {...PHASE_METHOD.leverage} />
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Current constraint</h3>
            {current ? (
              <>
                <p className="statement">We believe {current.text}</p>
                <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
                  Next: turn this into a testable hypothesis — action, outcome,
                  timeframe.
                </p>
                <Link to="/hypothesis" className="btn" style={{ marginTop: 8 }}>
                  Craft hypothesis
                </Link>
              </>
            ) : (
              <p style={{ color: "var(--ink-soft)", margin: 0 }}>
                Select one assumption from the left. Prefer the top-right of your
                map: important + little evidence.
              </p>
            )}
          </div>
        </aside>
      </div>

      <div style={{ marginTop: 28 }}>
        <CaseStrip
          cases={casesForStep("leverage")}
          title="One constraint — Airbnb’s photo bet"
        />
      </div>
    </div>
  );
}
