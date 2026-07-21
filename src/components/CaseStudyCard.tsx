import { Link } from "react-router-dom";
import type { CompanyCase } from "../lib/cases";

const THEME_PILL: Record<CompanyCase["theme"], string> = {
  desirability: "Desirability",
  feasibility: "Feasibility",
  viability: "Viability",
  growth: "Growth",
};

export function CaseStudyCard({
  c,
  compact = false,
}: {
  c: CompanyCase;
  compact?: boolean;
}) {
  return (
    <article className={`case-card ${compact ? "compact" : ""}`}>
      <header className="case-head">
        <div className={`case-mark theme-${c.theme}`} aria-hidden>
          {c.mark}
        </div>
        <div>
          <div className="case-company">{c.company}</div>
          <div className="case-meta">
            {c.sector} · {c.stage}
          </div>
        </div>
        <div className="case-pills">
          <span className="pill signal">{c.kind}</span>
          <span className="pill">{THEME_PILL[c.theme]}</span>
        </div>
      </header>

      <div className="case-flow" aria-label="Experiment flow">
        <div className="case-step">
          <span className="case-step-n">01</span>
          <span className="case-step-l">Bet</span>
          <p>{c.bet}</p>
        </div>
        <div className="case-arrow" aria-hidden>
          →
        </div>
        <div className="case-step">
          <span className="case-step-n">02</span>
          <span className="case-step-l">Test</span>
          <p>{c.test}</p>
        </div>
        <div className="case-arrow" aria-hidden>
          →
        </div>
        <div className="case-step">
          <span className="case-step-n">03</span>
          <span className="case-step-l">Result</span>
          <p>{c.result}</p>
        </div>
      </div>

      {!compact && (
        <>
          <div className="case-takeaway">
            <div className="why-label">Why it worked</div>
            <p>{c.takeaway}</p>
          </div>
          <div className="case-move">
            <div className="why-label">Your move</div>
            <p>{c.founderMove}</p>
            <Link to={`/${c.relatedStep}`} className="btn ghost sm">
              Try this in your sprint
            </Link>
          </div>
        </>
      )}
    </article>
  );
}

export function CaseStrip({
  cases,
  title = "From companies who ran the experiment",
}: {
  cases: CompanyCase[];
  title?: string;
}) {
  if (cases.length === 0) return null;
  return (
    <div className="case-strip">
      <div className="case-strip-head">
        <div className="kicker">{title}</div>
        <Link to="/cases" className="btn ghost sm">
          All company cases
        </Link>
      </div>
      <div className="case-strip-grid">
        {cases.map((c) => (
          <CaseStudyCard key={c.id} c={c} compact />
        ))}
      </div>
    </div>
  );
}
