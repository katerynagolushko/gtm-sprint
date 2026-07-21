import type { MotionId } from "./acquisition";
import { playbookById } from "./acquisition";

export type EvidenceLevel = "none" | "weak" | "some" | "strong";
export type FeasibilityVerdict = "go" | "stretch" | "nogo";

export type FeasibilityInput = {
  customerWho: string;
  customerWhere: string;
  motionId: MotionId | "";
  reachHow: string;
  tools: string[];
  action: string;
  weeklyMetric: string;
  weeklyTarget: string;
  timeframe: string;
  evidenceLevel: EvidenceLevel;
  hoursThisWeek: number;
  budgetUsd: number;
};

export type FeasibilityCheck = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

export type FeasibilityResult = {
  verdict: FeasibilityVerdict;
  score: number; // 0–100
  summary: string;
  checks: FeasibilityCheck[];
  blockers: string[];
  fixes: string[];
  suggestedShrink: {
    title: string;
    action: string;
    weeklyTarget: string;
    weeklyMetric: string;
    why: string;
  } | null;
};

const VAGUE_WHO =
  /\b(everyone|anybody|users|people|businesses|companies|smbs?|enterprises?|the market)\b/i;
const VAGUE_WHERE =
  /\b(online|internet|social media|everywhere|various|etc\.?)\b/i;
const HEAVY_BUILD =
  /\b(rebuild|full product|platform|hire (a |an )?(team|agency|engineer)|raise|series|brand campaign|dominate|go viral)\b/i;
const SEO_LONG =
  /\b(rank on google|seo|organic traffic|content engine|thought leadership)\b/i;

function parseDays(timeframe: string): number {
  const t = timeframe.trim().toLowerCase();
  if (!t) return 7;
  const week = t.match(/(\d+)\s*weeks?/);
  if (week) return Number(week[1]) * 7;
  const day = t.match(/(\d+)\s*days?/);
  if (day) return Number(day[1]);
  if (t.includes("week") || t.includes("friday")) return 7;
  if (t.includes("month")) return 30;
  const bare = t.match(/^(\d+)$/);
  if (bare) return Number(bare[1]);
  return 7;
}

function parseTarget(raw: string): number | null {
  const m = raw.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

function specificityScore(who: string, where: string): { score: number; checks: FeasibilityCheck[] } {
  const checks: FeasibilityCheck[] = [];
  let score = 20;

  if (who.trim().length >= 24 && !VAGUE_WHO.test(who.trim())) {
    checks.push({
      id: "icp",
      label: "ICP is specific enough",
      status: "pass",
      detail: "Role / context / pain is named narrowly enough to build a list.",
    });
    score += 15;
  } else if (who.trim().length >= 10) {
    checks.push({
      id: "icp",
      label: "ICP is partly specific",
      status: "warn",
      detail: "Tighten to role + company type + pain. Vague ICPs invent fake conversion rates.",
    });
    score += 5;
  } else {
    checks.push({
      id: "icp",
      label: "ICP is too vague",
      status: "fail",
      detail: "You can’t test acquisition without a listable customer.",
    });
  }

  if (where.trim().length >= 16 && !VAGUE_WHERE.test(where.trim())) {
    checks.push({
      id: "where",
      label: "Customer location is concrete",
      status: "pass",
      detail: "Named places you can actually show up this week.",
    });
    score += 15;
  } else if (where.trim().length >= 6) {
    checks.push({
      id: "where",
      label: "Where they are needs sharpening",
      status: "warn",
      detail: "Replace “online / social media” with LinkedIn titles, a Slack, a subreddit, etc.",
    });
    score += 4;
  } else {
    checks.push({
      id: "where",
      label: "No place to reach them",
      status: "fail",
      detail: "Without a channel surface, a 7-day test isn’t runnable.",
    });
  }

  return { score, checks };
}

function motionFeasibility(
  input: FeasibilityInput,
  days: number,
  target: number | null,
): { delta: number; checks: FeasibilityCheck[]; shrink: FeasibilityResult["suggestedShrink"] } {
  const checks: FeasibilityCheck[] = [];
  let delta = 0;
  let shrink: FeasibilityResult["suggestedShrink"] = null;
  const pb = playbookById(input.motionId);
  const metric = input.weeklyMetric.toLowerCase();
  const action = input.action.toLowerCase();

  if (!input.motionId || !pb) {
    checks.push({
      id: "motion",
      label: "No acquisition motion selected",
      status: "fail",
      detail: "Pick one motion so tools and targets can be judged.",
    });
    return { delta: -25, checks, shrink };
  }

  checks.push({
    id: "motion",
    label: `Motion: ${pb.label}`,
    status: "pass",
    detail: pb.bestFor,
  });
  delta += 8;

  if (input.tools.length === 0) {
    checks.push({
      id: "tools",
      label: "No tools selected",
      status: "fail",
      detail: "A week test needs tools you can open today.",
    });
    delta -= 15;
  } else {
    checks.push({
      id: "tools",
      label: `${input.tools.length} tool(s) selected`,
      status: "pass",
      detail: input.tools.slice(0, 3).join(" · "),
    });
    delta += 8;
  }

  // Hours
  if (input.hoursThisWeek <= 0) {
    checks.push({
      id: "hours",
      label: "Hours this week not set",
      status: "warn",
      detail: "Assume you’ll under-execute. Set honest founder hours.",
    });
    delta -= 5;
  } else if (input.hoursThisWeek < 4) {
    checks.push({
      id: "hours",
      label: "Very few hours available",
      status: "fail",
      detail: `${input.hoursThisWeek}h is usually too little for list + outreach + follow-up.`,
    });
    delta -= 18;
    shrink = {
      title: "2-day calibration (tiny sample)",
      action: "run 10 manual touches to ICP and log reply quality",
      weeklyTarget: "3",
      weeklyMetric: "replies or conversations",
      why: "With under 4 hours, prove the message before a full weekly target.",
    };
  } else if (input.hoursThisWeek < 8) {
    checks.push({
      id: "hours",
      label: "Limited hours — keep the test tiny",
      status: "warn",
      detail: `${input.hoursThisWeek}h → favor warm intros, 25 touches, or 5 interviews.`,
    });
    delta -= 6;
  } else {
    checks.push({
      id: "hours",
      label: "Time budget looks workable",
      status: "pass",
      detail: `${input.hoursThisWeek}h reserved this week.`,
    });
    delta += 8;
  }

  // Time window
  if (days > 14) {
    checks.push({
      id: "window",
      label: "Window longer than a sprint week",
      status: "warn",
      detail: `${days} days — tighten to 7 if you want a Friday decision.`,
    });
    delta -= 6;
  } else if (days <= 10) {
    checks.push({
      id: "window",
      label: "Decision window fits a week",
      status: "pass",
      detail: `${days} days to hit or miss the number.`,
    });
    delta += 6;
  }

  // Heavy / long-cycle actions
  if (HEAVY_BUILD.test(action)) {
    checks.push({
      id: "heavy",
      label: "Action looks like a project, not a week test",
      status: "fail",
      detail: "Rebuilds, hiring, or brand campaigns won’t falsify a bet by Friday.",
    });
    delta -= 25;
    shrink = {
      title: "Concierge / smoke version",
      action: "deliver the promise manually to 5 ICP people (Wizard of Oz)",
      weeklyTarget: "5",
      weeklyMetric: "completed concierge deliveries or paid deposits",
      why: "Prove demand before the build.",
    };
  }

  if (
    input.motionId === "content_seo" &&
    (SEO_LONG.test(action) || metric.includes("rank") || metric.includes("organic"))
  ) {
    checks.push({
      id: "seo",
      label: "SEO/rank outcomes aren’t week-feasible",
      status: "fail",
      detail: "Ranking takes months. In 7 days, measure signups from distribution you control.",
    });
    delta -= 22;
    shrink = {
      title: "Distribution smoke test",
      action: "ship a landing page and distribute one post/video to ICP hangouts",
      weeklyTarget: "25",
      weeklyMetric: "landing page signups from that distribution",
      why: "Same motion, measurable in a week — without waiting on Google.",
    };
  }

  if (input.motionId === "paid_ads") {
    if (input.budgetUsd < 100) {
      checks.push({
        id: "budget",
        label: "Paid ads budget too low to learn",
        status: "fail",
        detail: `$${input.budgetUsd || 0} usually can’t produce a readable CPL signal.`,
      });
      delta -= 18;
      shrink = {
        title: "Warm + landing (no ads yet)",
        action: "drive 30 ICP visits from warm/community links to one landing page",
        weeklyTarget: "10",
        weeklyMetric: "signups or demo requests",
        why: "Learn message/offer before buying traffic.",
      };
    } else if (input.budgetUsd < 200) {
      checks.push({
        id: "budget",
        label: "Small paid budget — keep expectations low",
        status: "warn",
        detail: `$${input.budgetUsd} can hint at CTR/CPL, not prove a channel.`,
      });
      delta -= 4;
    } else {
      checks.push({
        id: "budget",
        label: "Paid budget can buy a signal",
        status: "pass",
        detail: `$${input.budgetUsd} reserved for the smoke test.`,
      });
      delta += 6;
    }
  }

  // Target sanity by motion
  if (target != null) {
    const ambitious =
      (input.motionId === "b2b_outbound" &&
        (metric.includes("demo") || metric.includes("call")) &&
        target > 12 &&
        input.evidenceLevel === "none") ||
      (input.motionId === "b2b_outbound" && metric.includes("reply") && target > 40) ||
      (input.motionId === "warm_network" && target > 15) ||
      (input.motionId === "community" &&
        (metric.includes("interview") || metric.includes("call")) &&
        target > 10 &&
        input.hoursThisWeek < 10) ||
      (input.motionId === "paid_ads" &&
        metric.includes("signup") &&
        target > 50 &&
        input.budgetUsd < 400);

    if (ambitious) {
      checks.push({
        id: "target",
        label: "Friday target looks ambitious for a first week",
        status: input.evidenceLevel === "none" ? "fail" : "warn",
        detail: `${target} ${input.weeklyMetric} with ${input.evidenceLevel} prior evidence is a stretch.`,
      });
      delta -= input.evidenceLevel === "none" ? 16 : 8;
      if (!shrink) {
        shrink = {
          title: "Calibrate then commit",
          action: input.action || "run the same motion on a smaller sample",
          weeklyTarget: String(Math.max(2, Math.round(target * 0.35))),
          weeklyMetric: input.weeklyMetric || "qualified replies",
          why: "Hit a smaller number first; raise the bar next week with evidence.",
        };
      }
    } else if (target > 0) {
      checks.push({
        id: "target",
        label: "Friday target is in a learnable range",
        status: "pass",
        detail: `${target} ${input.weeklyMetric} can be hit or missed clearly.`,
      });
      delta += 8;
    }
  } else {
    checks.push({
      id: "target",
      label: "Target isn’t a number",
      status: "fail",
      detail: "Use a countable Friday metric (e.g. 8 demos booked).",
    });
    delta -= 12;
  }

  // Evidence pairing
  if (input.evidenceLevel === "none" && input.motionId === "paid_ads") {
    checks.push({
      id: "evidence",
      label: "Paying for traffic with zero prior evidence",
      status: "warn",
      detail: "Consider 5 interviews or a warm smoke test before ads.",
    });
    delta -= 6;
  } else if (input.evidenceLevel === "none") {
    checks.push({
      id: "evidence",
      label: "No prior evidence — keep it discovery-cheap",
      status: "warn",
      detail: "Weak evidence is fine if the test is reversible and small.",
    });
    delta -= 2;
  } else if (input.evidenceLevel === "strong" || input.evidenceLevel === "some") {
    checks.push({
      id: "evidence",
      label: "Some evidence already exists",
      status: "pass",
      detail: "You can aim a bit higher — still keep one discrete variable.",
    });
    delta += 6;
  }

  if (input.motionId === "product_viral" && input.evidenceLevel === "none") {
    checks.push({
      id: "viral",
      label: "Viral loop needs existing users",
      status: "fail",
      detail: "Without users, invent an invite loop won’t produce a week signal.",
    });
    delta -= 20;
    shrink = {
      title: "Get 10 users manually first",
      action: "recruit 10 ICP users via warm/outbound and watch if they invite anyone",
      weeklyTarget: "10",
      weeklyMetric: "activated users",
      why: "Product-led growth tests require a seed of real users.",
    };
  }

  return { delta, checks, shrink };
}

export function evaluateWeekFeasibility(input: FeasibilityInput): FeasibilityResult {
  const days = parseDays(input.timeframe);
  const target = parseTarget(input.weeklyTarget);
  const checks: FeasibilityCheck[] = [];

  const spec = specificityScore(input.customerWho, input.customerWhere);
  checks.push(...spec.checks);

  if (!input.action.trim() || input.action.trim().length < 12) {
    checks.push({
      id: "action",
      label: "Action is missing or vague",
      status: "fail",
      detail: "Say what you’ll do in verbs: send, post, DM, launch, book…",
    });
  } else if (HEAVY_BUILD.test(input.action)) {
    checks.push({
      id: "action",
      label: "Action looks like a multi-week project",
      status: "fail",
      detail: "Shrink to a reversible move you can finish this week.",
    });
  } else {
    checks.push({
      id: "action",
      label: "Action is concrete enough to run",
      status: "pass",
      detail: input.action.trim().slice(0, 120),
    });
  }

  if (!input.reachHow.trim()) {
    checks.push({
      id: "reach",
      label: "Reach method missing",
      status: "fail",
      detail: "How will you actually contact or show up?",
    });
  } else {
    checks.push({
      id: "reach",
      label: "Reach method named",
      status: "pass",
      detail: input.reachHow.trim().slice(0, 120),
    });
  }

  if (!input.weeklyMetric.trim()) {
    checks.push({
      id: "metric",
      label: "No success metric",
      status: "fail",
      detail: "Friday needs a countable outcome.",
    });
  }

  const motion = motionFeasibility(input, days, target);
  checks.push(...motion.checks);

  // Re-check heavy action shrink
  let suggestedShrink = motion.shrink;
  if (!suggestedShrink && HEAVY_BUILD.test(input.action)) {
    suggestedShrink = {
      title: "Concierge / smoke version",
      action: "deliver the promise manually to 5 ICP people",
      weeklyTarget: "5",
      weeklyMetric: "completed conversations or deposits",
      why: "Prove demand before the build.",
    };
  }

  const failCount = checks.filter((c) => c.status === "fail").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;

  let score = Math.max(
    0,
    Math.min(100, spec.score + motion.delta + (input.action.trim().length >= 12 ? 10 : 0)),
  );

  // Completeness floor
  const requiredOk =
    input.customerWho.trim() &&
    input.customerWhere.trim() &&
    input.motionId &&
    input.tools.length > 0 &&
    input.action.trim() &&
    input.weeklyMetric.trim() &&
    target != null;

  if (!requiredOk) score = Math.min(score, 45);

  let verdict: FeasibilityVerdict = "go";
  if (failCount >= 2 || score < 45) verdict = "nogo";
  else if (failCount === 1 || warnCount >= 2 || score < 65) verdict = "stretch";

  const blockers = checks.filter((c) => c.status === "fail").map((c) => c.detail);
  const fixes = [
    ...checks.filter((c) => c.status === "fail" || c.status === "warn").map((c) => c.label),
  ].slice(0, 5);

  const summary =
    verdict === "go"
      ? "Feasible to test this week — run the checklist and decide Friday."
      : verdict === "stretch"
        ? "Borderline for one week — shrink the target or hours risk, or accept a noisy signal."
        : "Not feasible as written for a 7-day test — apply a smaller experiment first.";

  return {
    verdict,
    score,
    summary,
    checks,
    blockers,
    fixes,
    suggestedShrink,
  };
}
