import type { FeasibilityResult, FeasibilityVerdict } from "../lib/feasibility";

const VERDICT_COPY: Record<
  FeasibilityVerdict,
  { label: string; className: string }
> = {
  go: { label: "Feasible this week", className: "go" },
  stretch: { label: "Stretch for one week", className: "stretch" },
  nogo: { label: "Not feasible in a week", className: "nogo" },
};

export function FeasibilityPanel({
  result,
  onApplyShrink,
  showActivateHint,
}: {
  result: FeasibilityResult;
  onApplyShrink?: () => void;
  showActivateHint?: boolean;
}) {
  const v = VERDICT_COPY[result.verdict];

  return (
    <div className={`feasibility-panel ${v.className}`}>
      <div className="feasibility-head">
        <div>
          <div className="kicker">Week-feasibility check</div>
          <h3>{v.label}</h3>
        </div>
        <div className="feasibility-score" aria-label={`Score ${result.score} of 100`}>
          <span className="n">{result.score}</span>
          <span className="l">/ 100</span>
        </div>
      </div>
      <p className="feasibility-summary">{result.summary}</p>

      <div className="feasibility-meter">
        <i style={{ width: `${result.score}%` }} />
      </div>

      <ul className="feasibility-checks">
        {result.checks.map((c) => (
          <li key={c.id} className={c.status}>
            <span className="feasibility-dot" aria-hidden />
            <div>
              <strong>{c.label}</strong>
              <p>{c.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      {result.suggestedShrink && (
        <div className="feasibility-shrink">
          <div className="why-label">Suggested smaller test</div>
          <p className="shrink-title">{result.suggestedShrink.title}</p>
          <p>{result.suggestedShrink.why}</p>
          <p className="shrink-plan">
            <strong>If we</strong> {result.suggestedShrink.action}
            <br />
            <strong>Friday:</strong> {result.suggestedShrink.weeklyTarget}{" "}
            {result.suggestedShrink.weeklyMetric}
          </p>
          {onApplyShrink && (
            <button type="button" className="btn sm" onClick={onApplyShrink}>
              Apply smaller test to form
            </button>
          )}
        </div>
      )}

      {showActivateHint && result.verdict === "nogo" && (
        <div className="watch-out" style={{ marginTop: 12 }}>
          <strong>Activate blocked</strong>
          <p>
            Fix the failed checks or apply the smaller test. You can still force
            activate only after acknowledging the risk.
          </p>
        </div>
      )}
      {showActivateHint && result.verdict === "stretch" && (
        <div className="callout" style={{ marginTop: 12 }}>
          <strong>Stretch bet:</strong> you can activate, but expect a noisy Friday
          signal. Consider shrinking the target.
        </div>
      )}
    </div>
  );
}
