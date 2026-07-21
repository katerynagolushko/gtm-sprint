import { useMemo, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { CaseStrip } from "../components/CaseStudyCard";
import { PhaseMethodCard } from "../components/MethodCoach";
import { casesForStep } from "../lib/cases";
import { THEME_HINTS, THEME_LABELS } from "../lib/content";
import { PHASE_METHOD } from "../lib/methodology";
import { riskScore } from "../lib/store";
import { useSprint } from "../lib/SprintContext";
import type { Theme } from "../lib/types";

export function Assumptions() {
  const { state, addAssumption, updateAssumption, removeAssumption } = useSprint();
  const [text, setText] = useState("");
  const [theme, setTheme] = useState<Theme>("desirability");
  const [selected, setSelected] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<string | null>(null);

  const sorted = useMemo(
    () => [...state.assumptions].sort((a, b) => riskScore(b) - riskScore(a)),
    [state.assumptions],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addAssumption({ text: text.trim(), theme });
    setText("");
  }

  function onPointerDown(id: string) {
    dragId.current = id;
    setSelected(id);
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragId.current || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    // x: left = high evidence → evidence = (1-x)*100
    // y: top = high importance → importance = (1-y)*100
    updateAssumption(dragId.current, {
      evidence: Math.round((1 - x) * 100),
      importance: Math.round((1 - y) * 100),
    });
  }

  function onPointerUp() {
    dragId.current = null;
  }

  return (
    <div className="wrap page">
      <div className="page-header">
        <div className="kicker">Step 02</div>
        <h1>Map assumptions</h1>
        <p>
          Capture beliefs in plain language. Plot them by importance and
          evidence. Top-right is where your sprint should live.
        </p>
      </div>

      <div className="grid-2">
        <div className="stack">
          <form className="card form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="assumption">We believe…</label>
              <textarea
                id="assumption"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="busy professionals will pay for a curated monthly snack box"
              />
            </div>
            <div className="field">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
              >
                {(Object.keys(THEME_LABELS) as Theme[]).map((t) => (
                  <option key={t} value={t}>
                    {THEME_LABELS[t]} — {THEME_HINTS[t]}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn" type="submit" disabled={!text.trim()}>
              Add assumption
            </button>
          </form>

          <div
            ref={mapRef}
            className="map"
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <span className="map-label y-top">High importance</span>
            <span className="map-label y-bottom">Low importance</span>
            <span className="map-label x-right">No evidence →</span>
            <span className="map-label quadrant">Riskiest quadrant</span>
            {state.assumptions.map((a) => (
              <button
                key={a.id}
                type="button"
                title={a.text}
                className={`map-dot ${a.theme} ${a.isLeverage ? "leverage" : ""} ${
                  selected === a.id ? "active" : ""
                }`}
                style={{
                  left: `${100 - a.evidence}%`,
                  top: `${100 - a.importance}%`,
                }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  onPointerDown(a.id);
                }}
              />
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>
            Drag dots to replot. Green = desirability, amber = feasibility,
            orange = viability.
          </p>
        </div>

        <aside className="stack">
          <PhaseMethodCard {...PHASE_METHOD.assumptions} />

          <div className="stack">
            {sorted.length === 0 && (
              <div className="empty">No assumptions yet. Start with desirability.</div>
            )}
            {sorted.map((a, i) => (
              <div
                key={a.id}
                className={`list-item ${selected === a.id ? "active" : ""}`}
                onClick={() => setSelected(a.id)}
              >
                <div className="meta">
                  <span className="pill neutral">#{i + 1} risk</span>
                  <span className="pill">{THEME_LABELS[a.theme]}</span>
                  {a.isLeverage && <span className="pill risk">Leverage</span>}
                </div>
                <h4>We believe {a.text}</h4>
                <div className="row">
                  <span className="pill amber">Importance {a.importance}</span>
                  <span className="pill neutral">Evidence {a.evidence}</span>
                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAssumption(a.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link to="/leverage" className="btn">
            Next: pick leverage
          </Link>
        </aside>
      </div>

      <div style={{ marginTop: 28 }}>
        <CaseStrip
          cases={casesForStep("assumptions")}
          title="Companies that started with customer belief"
        />
      </div>
    </div>
  );
}
