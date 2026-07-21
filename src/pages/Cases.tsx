import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { CASE_KINDS, COMPANY_CASES, casesForKind } from "../lib/cases";

export function Cases() {
  const [kind, setKind] = useState<(typeof CASE_KINDS)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const base = casesForKind(kind);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (c) =>
        c.company.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.kind.toLowerCase().includes(q) ||
        c.bet.toLowerCase().includes(q) ||
        c.takeaway.toLowerCase().includes(q),
    );
  }, [kind, query]);

  return (
    <div className="wrap page">
      <div className="page-header">
        <div className="kicker">Company experiments</div>
        <h1>See how real teams tested bets</h1>
        <p>
          Visual case studies — bet → test → result — from companies founders
          already know. Pattern-match the experiment type, then steal the move
          for your sprint. Stories are public lean-startup lore, simplified for
          learning (not official company disclosures).
        </p>
      </div>

      <div className="case-filters card">
        <div className="field" style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
          <label htmlFor="case-q">Search</label>
          <input
            id="case-q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Dropbox, photos, landing page…"
          />
        </div>
        <div className="case-kind-row" role="group" aria-label="Experiment type">
          {CASE_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              className={`case-kind ${kind === k ? "on" : ""}`}
              onClick={() => setKind(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="case-legend">
        <span>
          <i className="leg theme-desirability" /> Want it?
        </span>
        <span>
          <i className="leg theme-feasibility" /> Can we build it?
        </span>
        <span>
          <i className="leg theme-viability" /> Will they pay?
        </span>
        <span>
          <i className="leg theme-growth" /> How does it spread?
        </span>
      </div>

      <p className="case-count">
        Showing {filtered.length} of {COMPANY_CASES.length} cases
      </p>

      <div className="case-gallery">
        {filtered.map((c) => (
          <CaseStudyCard key={c.id} c={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          No cases match. Clear filters or{" "}
          <button type="button" className="btn sm" onClick={() => { setKind("All"); setQuery(""); }}>
            reset
          </button>
        </div>
      )}

      <div className="card" style={{ marginTop: 28 }}>
        <h3 style={{ marginTop: 0 }}>Use a case in your sprint</h3>
        <p style={{ color: "var(--ink-soft)", marginTop: 0 }}>
          Pick an experiment type that matches your uncertainty. Write your own
          If / then / within. Keep it cheaper than building the full product.
        </p>
        <div className="row">
          <Link to="/hypothesis" className="btn">
            Craft your hypothesis
          </Link>
          <Link to="/experiments" className="btn secondary">
            Design a test card
          </Link>
          <Link to="/guide" className="btn ghost">
            Methodology library
          </Link>
        </div>
      </div>
    </div>
  );
}
