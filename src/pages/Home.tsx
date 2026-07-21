import { Link } from "react-router-dom";
import { CaseStrip } from "../components/CaseStudyCard";
import { ThisWeekMission } from "../components/ThisWeekMission";
import { COMPANY_CASES } from "../lib/cases";
import { PHASES } from "../lib/content";
import { useSprint } from "../lib/SprintContext";

export function Home() {
  const { state } = useSprint();
  const featured = COMPANY_CASES.filter((c) =>
    ["dropbox", "zappos", "buffer", "airbnb"].includes(c.id),
  );
  const hasBet = state.hypotheses.some((h) => h.isActiveBet) || state.hypotheses.length > 0;

  return (
    <>
      <section className="wrap hero">
        <div>
          <div className="kicker">Customer acquisition sprint</div>
          <h1>
            GTM <em>Sprint</em>
          </h1>
          <p className="lede">
            One weekly bet: who the customer is, where they are, how you’ll reach
            them, which tools you’ll use, and the Friday number that proves it.
          </p>
          <div className="hero-actions">
            {!hasBet ? (
              <Link
                to={state.assumptions.length ? "/hypothesis" : "/setup"}
                className="btn"
              >
                Build this week’s bet
              </Link>
            ) : (
              <>
                <a href="#this-week" className="btn">
                  Continue this week’s mission
                </a>
                <Link to="/hypothesis" className="btn secondary">
                  Replace with a new bet
                </Link>
              </>
            )}
          </div>
        </div>
        <aside className="hero-panel">
          <h3>What this tool is for</h3>
          <div className="phase-mini">
            <div>
              <span className="n">01</span>
              <span>
                <strong>Not a hypothesis archive</strong>
                <br />
                One active acquisition mission with a checklist.
              </span>
            </div>
            <div>
              <span className="n">02</span>
              <span>
                <strong>Where + how + tools</strong>
                <br />
                Channel playbooks so you’re not guessing the stack.
              </span>
            </div>
            <div>
              <span className="n">03</span>
              <span>
                <strong>Friday metric</strong>
                <br />
                A number you can hit or miss — then decide.
              </span>
            </div>
          </div>
        </aside>
      </section>

      <div id="this-week">
        <ThisWeekMission />
      </div>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <div className="kicker">Full program path</div>
            <h2>If you need the longer loop</h2>
            <p>
              Map assumptions and pick leverage when you’re choosing what matters.
              Day-to-day, live inside this week’s mission above.
            </p>
          </div>
        </div>
        <div className="grid-3">
          {PHASES.map((p) => (
            <Link key={p.id} to={p.path} className="card clickable">
              <div className="step">Step {p.step}</div>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <CaseStrip cases={featured} title="How real companies tested acquisition bets" />
      </section>
    </>
  );
}
