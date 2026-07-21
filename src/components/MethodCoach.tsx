import type { CoachBlock, ExamplePair } from "../lib/methodology";

function Examples({ examples }: { examples: ExamplePair[] }) {
  return (
    <div className="example-stack">
      {examples.map((ex) => (
        <div key={ex.label} className="example-card">
          <div className="example-label">{ex.label}</div>
          <div className="example-row">
            <span className="example-tag">Assumption</span>
            <p>{ex.assumption}</p>
          </div>
          <div className="example-row">
            <span className="example-tag hyp">Hypothesis</span>
            <p>{ex.hypothesis}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MethodCoach({
  block,
  stepLabel,
}: {
  block: CoachBlock;
  stepLabel?: string;
}) {
  return (
    <aside className="method-coach">
      {stepLabel && <div className="kicker">{stepLabel}</div>}
      <h3>{block.title}</h3>
      <div className="why-box">
        <div className="why-label">Why this works</div>
        <p>{block.why}</p>
      </div>
      <ul className="guide-list">
        {block.tips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {block.watchOut && (
        <div className="watch-out">
          <strong>Watch out</strong>
          <p>{block.watchOut}</p>
        </div>
      )}
      {block.examples && block.examples.length > 0 && (
        <>
          <div className="why-label" style={{ marginTop: 14 }}>
            Examples
          </div>
          <Examples examples={block.examples} />
        </>
      )}
    </aside>
  );
}

export function PhaseMethodCard({
  title,
  why,
  tips,
  examples,
}: {
  title: string;
  why: string;
  tips: readonly string[];
  examples?: readonly ExamplePair[];
}) {
  return (
    <div className="card method-card">
      <div className="kicker">Read while you work</div>
      <h3 style={{ marginTop: 6 }}>{title}</h3>
      <div className="why-box">
        <div className="why-label">Why this works</div>
        <p>{why}</p>
      </div>
      <ul className="guide-list">
        {tips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {examples && examples.length > 0 && <Examples examples={[...examples]} />}
    </div>
  );
}
