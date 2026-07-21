import { playbookById, type MotionId } from "../lib/acquisition";
import { activeBet } from "../lib/store";
import { useSprint } from "../lib/SprintContext";
import { Link } from "react-router-dom";

export function ThisWeekMission() {
  const { state, toggleWeekAction, setActiveBet } = useSprint();
  const bet = activeBet(state.hypotheses);
  const playbook = playbookById((bet?.motionId as MotionId) || "");

  if (!bet) {
    return (
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="mission-empty card">
          <div className="kicker">This week’s job</div>
          <h2>No active acquisition bet yet</h2>
          <p>
            Hypotheses only matter when they become a weekly customer-acquisition
            mission: who, where, how you’ll reach them, with which tools, and what
            number proves it by Friday.
          </p>
          <Link to="/hypothesis" className="btn">
            Build this week’s acquisition bet
          </Link>
        </div>
      </section>
    );
  }

  const done = bet.weekActions.filter((a) => a.done).length;
  const total = bet.weekActions.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="wrap section" style={{ paddingTop: 0 }}>
      <div className="mission-board">
        <div className="mission-main card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="kicker">This week’s acquisition bet</div>
            <div className="meta">
              {bet.feasibilityVerdict && (
                <span
                  className={`pill ${
                    bet.feasibilityVerdict === "go"
                      ? ""
                      : bet.feasibilityVerdict === "stretch"
                        ? "amber"
                        : "risk"
                  }`}
                >
                  Week-feasible: {bet.feasibilityVerdict} ({bet.feasibilityScore})
                </span>
              )}
              <span className="pill signal">{pct}% of actions done</span>
            </div>
          </div>
          <h2 className="mission-title">{bet.statement}</h2>
          <div className="progress-bar" style={{ margin: "12px 0 18px" }}>
            <i style={{ width: `${pct}%` }} />
          </div>

          <div className="mission-grid">
            <div className="mission-cell">
              <div className="why-label">Customer</div>
              <p>{bet.customerWho || "—"}</p>
            </div>
            <div className="mission-cell">
              <div className="why-label">Where they are</div>
              <p>{bet.customerWhere || "—"}</p>
            </div>
            <div className="mission-cell">
              <div className="why-label">How you’ll reach them</div>
              <p>{bet.reachHow || "—"}</p>
            </div>
            <div className="mission-cell highlight">
              <div className="why-label">Friday success metric</div>
              <p className="mission-metric">
                {bet.weeklyTarget || "?"} {bet.weeklyMetric || "results"}
              </p>
              <span className="mission-window">by end of {bet.timeframe || "this week"}</span>
            </div>
          </div>

          {bet.tools.length > 0 && (
            <div className="mission-tools">
              <div className="why-label">Tools for this bet</div>
              <div className="meta" style={{ marginTop: 8 }}>
                {bet.tools.map((t) => (
                  <span key={t} className="pill neutral">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mission-actions">
            <div className="why-label">Do these this week</div>
            <ul className="mission-checklist">
              {bet.weekActions.map((a) => (
                <li key={a.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={a.done}
                      onChange={() => toggleWeekAction(bet.id, a.id)}
                    />
                    <span className={a.done ? "done" : ""}>{a.text}</span>
                  </label>
                </li>
              ))}
            </ul>
            {total === 0 && (
              <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
                No checklist yet — rebuild the bet in the hypothesis wizard to
                generate weekly actions.
              </p>
            )}
          </div>

          <div className="row" style={{ marginTop: 16 }}>
            <Link to={`/experiments?hypothesis=${bet.id}`} className="btn">
              Log the test card
            </Link>
            <Link to="/learnings" className="btn secondary">
              Record Friday results
            </Link>
            <Link to="/hypothesis" className="btn ghost sm">
              New bet
            </Link>
          </div>
        </div>

        <aside className="stack">
          {playbook && (
            <div className="card">
              <div className="kicker">Playbook</div>
              <h3 style={{ margin: "6px 0 8px" }}>{playbook.label}</h3>
              <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14 }}>
                {playbook.bestFor}
              </p>
              <div className="why-label" style={{ marginTop: 14 }}>
                Test ideas in this motion
              </div>
              <ul className="guide-list">
                {playbook.testIdeas.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {state.hypotheses.length > 1 && (
            <div className="card">
              <div className="why-label">Switch active bet</div>
              <div className="stack" style={{ marginTop: 8 }}>
                {state.hypotheses.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    className={`list-item ${h.isActiveBet ? "active" : ""}`}
                    style={{ textAlign: "left", cursor: "pointer", width: "100%" }}
                    onClick={() => setActiveBet(h.id)}
                  >
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                      {h.statement}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
