import { Link } from "react-router-dom";
import { PhaseMethodCard } from "../components/MethodCoach";
import { PHASE_METHOD } from "../lib/methodology";
import { useSprint } from "../lib/SprintContext";

export function Setup() {
  const { state, setProfile, resetAll } = useSprint();
  const { profile } = state;

  return (
    <div className="wrap page">
      <div className="page-header">
        <div className="kicker">Step 01</div>
        <h1>Set the frame</h1>
        <p>
          Clarity before experiments. Name the company, the bet, and what this
          sprint must prove.
        </p>
      </div>

      <div className="grid-2">
        <div className="card form-grid">
          <div className="field">
            <label htmlFor="name">Startup name</label>
            <input
              id="name"
              value={profile.startupName}
              onChange={(e) => setProfile({ startupName: e.target.value })}
              placeholder="Acme Health"
            />
          </div>
          <div className="field">
            <label htmlFor="oneliner">One-liner</label>
            <input
              id="oneliner"
              value={profile.oneLiner}
              onChange={(e) => setProfile({ oneLiner: e.target.value })}
              placeholder="Calendar for clinicians who hate EHR admin"
            />
          </div>
          <div className="field">
            <label htmlFor="goal">Sprint goal</label>
            <textarea
              id="goal"
              value={profile.goal}
              onChange={(e) => setProfile({ goal: e.target.value })}
              placeholder="In 2 weeks, validate whether HR managers will book a demo from cold outreach."
            />
            <span className="hint">
              Write the decision this sprint unlocks — not a feature backlog.
            </span>
          </div>
          <div className="row">
            <Link to="/assumptions" className="btn">
              Next: map assumptions
            </Link>
            <button type="button" className="btn ghost sm" onClick={resetAll}>
              Reset all data
            </button>
          </div>
        </div>

        <aside className="stack">
          <PhaseMethodCard {...PHASE_METHOD.setup} />
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Pre-work checklist</h3>
            <ul className="guide-list">
              <li>W3 clarity: who is the customer, what job, what value?</li>
              <li>Lean Canvas drafted (even messy)</li>
              <li>Customer insights consolidated</li>
              <li>Minimum success criteria named</li>
              <li>Weekly KPI tracking ready</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
