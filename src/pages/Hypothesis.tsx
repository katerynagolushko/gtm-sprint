import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FeasibilityPanel } from "../components/FeasibilityPanel";
import { MethodCoach } from "../components/MethodCoach";
import {
  ACQUISITION_PLAYBOOKS,
  buildWeekActions,
  playbookById,
  type MotionId,
} from "../lib/acquisition";
import { THEME_LABELS } from "../lib/content";
import {
  evaluateWeekFeasibility,
  type EvidenceLevel,
} from "../lib/feasibility";
import { HYPOTHESIS_COACH } from "../lib/methodology";
import { composeHypothesis } from "../lib/store";
import { useSprint } from "../lib/SprintContext";
import type { HypothesisType, Theme } from "../lib/types";

const STEP_LABELS = [
  "Belief",
  "Customer",
  "Reach & tools",
  "Weekly win",
  "Activate",
] as const;

export function Hypothesis() {
  const { state, addHypothesis } = useSprint();
  const navigate = useNavigate();
  const leverage = state.assumptions.find((a) => a.isLeverage);
  const defaultAssumption = leverage || state.assumptions[0];

  const [step, setStep] = useState(0);
  const [assumptionId, setAssumptionId] = useState(defaultAssumption?.id || "");
  const [belief, setBelief] = useState(
    defaultAssumption ? `We believe ${defaultAssumption.text}` : "We believe ",
  );
  const [customerWho, setCustomerWho] = useState("");
  const [customerWhere, setCustomerWhere] = useState("");
  const [motionId, setMotionId] = useState<MotionId | "">("");
  const [reachHow, setReachHow] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [action, setAction] = useState("");
  const [weeklyMetric, setWeeklyMetric] = useState("");
  const [weeklyTarget, setWeeklyTarget] = useState("");
  const [timeframe, setTimeframe] = useState("7 days");
  const [type, setType] = useState<HypothesisType>("growth");
  const [theme, setTheme] = useState<Theme>(defaultAssumption?.theme || "desirability");
  const [evidenceLevel, setEvidenceLevel] = useState<EvidenceLevel>("none");
  const [hoursThisWeek, setHoursThisWeek] = useState(10);
  const [budgetUsd, setBudgetUsd] = useState(0);
  const [forceAck, setForceAck] = useState(false);

  const playbook = playbookById(motionId);

  useEffect(() => {
    if (!assumptionId && defaultAssumption) {
      setAssumptionId(defaultAssumption.id);
      setBelief(`We believe ${defaultAssumption.text}`);
      setTheme(defaultAssumption.theme);
    }
  }, [assumptionId, defaultAssumption]);

  const outcome = useMemo(() => {
    if (!weeklyTarget.trim() || !weeklyMetric.trim()) return "";
    return `we get at least ${weeklyTarget.trim()} ${weeklyMetric.trim()}`;
  }, [weeklyTarget, weeklyMetric]);

  const statement = useMemo(
    () => composeHypothesis(action, outcome || "…", timeframe),
    [action, outcome, timeframe],
  );

  const weekActions = useMemo(() => buildWeekActions(playbook, []), [playbook]);

  const feasibility = useMemo(
    () =>
      evaluateWeekFeasibility({
        customerWho,
        customerWhere,
        motionId,
        reachHow,
        tools: selectedTools,
        action,
        weeklyMetric,
        weeklyTarget,
        timeframe,
        evidenceLevel,
        hoursThisWeek,
        budgetUsd,
      }),
    [
      customerWho,
      customerWhere,
      motionId,
      reachHow,
      selectedTools,
      action,
      weeklyMetric,
      weeklyTarget,
      timeframe,
      evidenceLevel,
      hoursThisWeek,
      budgetUsd,
    ],
  );

  const coach =
    step === 0
      ? HYPOTHESIS_COACH[0]
      : step === 1
        ? {
            title: "Name where the customer already is",
            why: "Acquisition fails when founders invent channels. Start from places the ICP already hangs out — then pick one motion for this week.",
            tips: [
              "Who: role + company type + pain in one sentence",
              "Where: 2–4 concrete places (not “social media”)",
              "If you cannot name where they are, do interviews before ads",
            ],
            watchOut: "“Everyone online” is not a place. Specificity is the strategy.",
          }
        : step === 2
          ? {
              title: "Pick one reach motion + tools you’ll open",
              why: "Choosing a motion gives defaults for checklist, tools, and a realistic weekly metric — and feeds the feasibility check.",
              tips: [
                "One motion this week — not five",
                "Tools should match the motion",
                "Write reach in verbs: DM, email, post, list",
              ],
              examples: playbook
                ? [
                    {
                      label: playbook.label,
                      assumption: playbook.bestFor,
                      hypothesis: playbook.testIdeas[0] ?? "",
                    },
                  ]
                : undefined,
            }
          : step === 3
            ? {
                title: "Friday number + honest capacity",
                why: "Feasibility is mostly “can we run and measure this in 7 days with the hours/budget we have?” Targets without hours are fiction.",
                tips: [
                  "Set hours you’ll actually protect",
                  "Evidence level changes how ambitious the target can be",
                  "Watch the live feasibility score on the right",
                ],
                watchOut: "If the score is red, shrink before you activate.",
              }
            : {
                title: "Only activate a week-feasible bet",
                why: "Activating a no-go plan creates theatre. Apply the smaller test, or fix blockers, then commit.",
                tips: [
                  "Green = run the checklist",
                  "Amber = noisy signal — maybe shrink target",
                  "Red = blocked until you shrink or fix",
                ],
              };

  const canNext =
    step === 0
      ? Boolean(assumptionId && belief.trim())
      : step === 1
        ? Boolean(customerWho.trim() && customerWhere.trim())
        : step === 2
          ? Boolean(motionId && reachHow.trim() && selectedTools.length > 0)
          : step === 3
            ? Boolean(action.trim() && weeklyMetric.trim() && weeklyTarget.trim())
            : true;

  const canActivate =
    Boolean(outcome) &&
    (feasibility.verdict !== "nogo" || forceAck);

  function toggleTool(name: string) {
    setSelectedTools((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    );
  }

  function applyMotion(id: MotionId) {
    const pb = playbookById(id);
    setMotionId(id);
    setForceAck(false);
    if (pb) {
      if (!customerWhere.trim()) {
        setCustomerWhere(pb.whereCustomerIs.slice(0, 2).join("; "));
      }
      if (!reachHow.trim()) setReachHow(pb.howToReach[0] ?? "");
      setSelectedTools(pb.tools.slice(0, 3).map((t) => t.name));
      if (!weeklyMetric.trim()) setWeeklyMetric(pb.weeklyMetricExamples[0] ?? "");
      if (!action.trim()) {
        setAction(
          pb.id === "b2b_outbound"
            ? "run a 3-touch outbound sequence to our ICP list"
            : pb.id === "paid_ads"
              ? "run a small paid smoke test to a single landing page"
              : pb.id === "content_seo"
                ? "ship a landing page and distribute one content asset"
                : pb.id === "community"
                  ? "post helpfully and DM people showing the pain"
                  : pb.id === "warm_network"
                    ? "ask warm contacts for forwardable intros"
                    : "run the chosen acquisition motion with our ICP",
        );
      }
      if (pb.id === "paid_ads" && budgetUsd < 150) setBudgetUsd(250);
    }
  }

  function applyShrink() {
    const s = feasibility.suggestedShrink;
    if (!s) return;
    setAction(s.action);
    setWeeklyTarget(s.weeklyTarget);
    setWeeklyMetric(s.weeklyMetric);
    setTimeframe("7 days");
    setForceAck(false);
    setStep(3);
  }

  function save() {
    if (!canActivate || !outcome) return;
    const h = addHypothesis({
      assumptionId,
      belief: belief.trim(),
      action: action.trim(),
      outcome: outcome.trim(),
      timeframe: timeframe.trim() || "7 days",
      type,
      theme,
      customerWho: customerWho.trim(),
      customerWhere: customerWhere.trim(),
      motionId,
      reachHow: reachHow.trim(),
      tools: selectedTools,
      weeklyMetric: weeklyMetric.trim(),
      weeklyTarget: weeklyTarget.trim(),
      weekActions,
      statement,
      feasibilityScore: feasibility.score,
      feasibilityVerdict: feasibility.verdict,
      evidenceLevel,
      hoursThisWeek,
    });
    navigate(`/?activated=${h.id}`);
  }

  const showFeasibility = step >= 3;

  return (
    <div className="wrap page">
      <div className="page-header">
        <div className="kicker">Acquisition bet builder</div>
        <h1>Turn a belief into this week’s customer plan</h1>
        <p>
          Build the bet, then get live feedback on whether it’s actually
          testable in 7 days — before you activate.
        </p>
      </div>

      {state.assumptions.length === 0 ? (
        <div className="empty">
          Map at least one assumption first (even a rough one).
          <div style={{ marginTop: 12 }}>
            <Link to="/assumptions" className="btn sm">
              Map assumptions
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid-2 hyp-layout">
          <div className="card">
            <div className="wizard-steps">
              {STEP_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className={`ws ${step === i ? "on" : ""} ${step > i ? "done" : ""}`}
                  onClick={() => setStep(i)}
                >
                  {i + 1}. {label}
                </button>
              ))}
            </div>

            {step === 0 && (
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="assump">Riskiest assumption</label>
                  <select
                    id="assump"
                    value={assumptionId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setAssumptionId(id);
                      const a = state.assumptions.find((x) => x.id === id);
                      if (a) {
                        setBelief(`We believe ${a.text}`);
                        setTheme(a.theme);
                      }
                    }}
                  >
                    {state.assumptions.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.isLeverage ? "★ " : ""}
                        We believe {a.text}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="belief">Plain-language belief</label>
                  <textarea
                    id="belief"
                    value={belief}
                    onChange={(e) => setBelief(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="evidence">Evidence you already have</label>
                  <select
                    id="evidence"
                    value={evidenceLevel}
                    onChange={(e) =>
                      setEvidenceLevel(e.target.value as EvidenceLevel)
                    }
                  >
                    <option value="none">None — pure guess</option>
                    <option value="weak">Weak — anecdotes / 1–2 chats</option>
                    <option value="some">Some — interviews or small test</option>
                    <option value="strong">Strong — clear prior signal</option>
                  </select>
                  <span className="hint">
                    Less evidence → cheaper, smaller Friday targets.
                  </span>
                </div>
                <div className="field">
                  <label htmlFor="htype">Bet type</label>
                  <select
                    id="htype"
                    value={type}
                    onChange={(e) => setType(e.target.value as HypothesisType)}
                  >
                    <option value="growth">Growth — channel / acquisition</option>
                    <option value="value">Value — problem / offer / willingness</option>
                  </select>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="who">Who is the customer? (ICP)</label>
                  <textarea
                    id="who"
                    value={customerWho}
                    onChange={(e) => setCustomerWho(e.target.value)}
                    placeholder="HR managers at 50–200 person SaaS companies who run engagement surveys manually"
                  />
                </div>
                <div className="field">
                  <label htmlFor="where">Where are they this week?</label>
                  <textarea
                    id="where"
                    value={customerWhere}
                    onChange={(e) => setCustomerWhere(e.target.value)}
                    placeholder="LinkedIn (Head of People titles); #hr Slack communities"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-grid">
                <div className="field">
                  <label>Acquisition motion (pick one)</label>
                  <div className="motion-grid">
                    {ACQUISITION_PLAYBOOKS.map((pb) => (
                      <button
                        key={pb.id}
                        type="button"
                        className={`motion-card ${motionId === pb.id ? "on" : ""}`}
                        onClick={() => applyMotion(pb.id)}
                      >
                        <strong>{pb.label}</strong>
                        <span>{pb.bestFor}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {playbook && (
                  <>
                    <div className="field">
                      <label htmlFor="reach">How will you reach them?</label>
                      <textarea
                        id="reach"
                        value={reachHow}
                        onChange={(e) => setReachHow(e.target.value)}
                      />
                      <div className="chip-row">
                        {playbook.howToReach.map((h) => (
                          <button
                            key={h}
                            type="button"
                            className="chip"
                            onClick={() => setReachHow(h)}
                          >
                            Use: {h.slice(0, 42)}…
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="field">
                      <label>Tools you’ll use</label>
                      <div className="tool-grid">
                        {playbook.tools.map((t) => (
                          <label key={t.name} className="tool-item">
                            <input
                              type="checkbox"
                              checked={selectedTools.includes(t.name)}
                              onChange={() => toggleTool(t.name)}
                            />
                            <span>
                              <strong>{t.name}</strong>
                              <em>{t.use}</em>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="action">What exactly will you do? (If we…)</label>
                  <textarea
                    id="action"
                    value={action}
                    onChange={(e) => {
                      setAction(e.target.value);
                      setForceAck(false);
                    }}
                    placeholder="send 50 personalized LinkedIn + email sequences to ICP"
                  />
                </div>
                <div
                  className="row"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
                >
                  <div className="field">
                    <label htmlFor="target">Friday target (number)</label>
                    <input
                      id="target"
                      value={weeklyTarget}
                      onChange={(e) => {
                        setWeeklyTarget(e.target.value);
                        setForceAck(false);
                      }}
                      placeholder="8"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="metric">Success metric</label>
                    <input
                      id="metric"
                      value={weeklyMetric}
                      onChange={(e) => setWeeklyMetric(e.target.value)}
                      placeholder="demo calls booked"
                      list="metric-suggestions"
                    />
                    <datalist id="metric-suggestions">
                      {(playbook?.weeklyMetricExamples ?? []).map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}
                >
                  <div className="field">
                    <label htmlFor="time">Timeframe</label>
                    <input
                      id="time"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="hours">Hours this week</label>
                    <input
                      id="hours"
                      type="number"
                      min={0}
                      max={60}
                      value={hoursThisWeek}
                      onChange={(e) => {
                        setHoursThisWeek(Number(e.target.value) || 0);
                        setForceAck(false);
                      }}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="budget">Ad budget (USD)</label>
                    <input
                      id="budget"
                      type="number"
                      min={0}
                      value={budgetUsd}
                      onChange={(e) => {
                        setBudgetUsd(Number(e.target.value) || 0);
                        setForceAck(false);
                      }}
                      disabled={motionId !== "paid_ads"}
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="htheme">Theme</label>
                  <select
                    id="htheme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as Theme)}
                  >
                    {(Object.keys(THEME_LABELS) as Theme[]).map((t) => (
                      <option key={t} value={t}>
                        {THEME_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="callout">
                  <strong>Hypothesis preview</strong>
                  <p className="statement" style={{ marginTop: 8 }}>
                    {statement}
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="form-grid">
                <div className="activate-summary">
                  <div className="kicker">Your week looks like this</div>
                  <p className="statement">{statement}</p>
                  <div className="mission-grid" style={{ marginTop: 14 }}>
                    <div className="mission-cell">
                      <div className="why-label">Customer</div>
                      <p>{customerWho}</p>
                    </div>
                    <div className="mission-cell">
                      <div className="why-label">Where</div>
                      <p>{customerWhere}</p>
                    </div>
                    <div className="mission-cell">
                      <div className="why-label">Reach</div>
                      <p>{reachHow}</p>
                    </div>
                    <div className="mission-cell highlight">
                      <div className="why-label">Friday win</div>
                      <p className="mission-metric">
                        {weeklyTarget} {weeklyMetric}
                      </p>
                    </div>
                  </div>
                  <div className="meta" style={{ marginTop: 12 }}>
                    <span className="pill amber">{hoursThisWeek}h this week</span>
                    <span className="pill neutral">Evidence: {evidenceLevel}</span>
                    {selectedTools.map((t) => (
                      <span key={t} className="pill neutral">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="why-label" style={{ marginTop: 16 }}>
                    Checklist on Home
                  </div>
                  <ol className="guide-list">
                    {weekActions.map((a) => (
                      <li key={a.id}>{a.text}</li>
                    ))}
                  </ol>
                </div>

                {feasibility.verdict === "nogo" && (
                  <label className="force-ack">
                    <input
                      type="checkbox"
                      checked={forceAck}
                      onChange={(e) => setForceAck(e.target.checked)}
                    />
                    <span>
                      I understand this is not week-feasible as scored — activate
                      anyway (not recommended).
                    </span>
                  </label>
                )}
              </div>
            )}

            <div className="row" style={{ marginTop: 18 }}>
              {step > 0 && (
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  className="btn"
                  disabled={!canNext}
                  onClick={() => setStep(step + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="btn"
                  disabled={!canActivate}
                  onClick={save}
                >
                  {feasibility.verdict === "nogo" && !forceAck
                    ? "Fix feasibility to activate"
                    : "Activate this week’s bet"}
                </button>
              )}
            </div>
          </div>

          <div className="stack sticky-coach">
            {showFeasibility ? (
              <>
                <FeasibilityPanel
                  result={feasibility}
                  onApplyShrink={
                    feasibility.suggestedShrink ? applyShrink : undefined
                  }
                  showActivateHint={step === 4}
                />
                <div className="card">
                  <div className="why-label">What this score means</div>
                  <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--ink-soft)" }}>
                    It judges whether <em>this week’s test</em> is runnable and
                    readable — not whether the company will succeed forever.
                    Shrink until Friday can produce a clear hit/miss.
                  </p>
                </div>
              </>
            ) : (
              <MethodCoach
                block={coach}
                stepLabel={`Coach · ${STEP_LABELS[step]}`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
