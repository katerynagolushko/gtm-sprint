export type MotionId =
  | "b2b_outbound"
  | "community"
  | "content_seo"
  | "paid_ads"
  | "warm_network"
  | "marketplace"
  | "product_viral";

export type ChannelPlaybook = {
  id: MotionId;
  label: string;
  bestFor: string;
  whereCustomerIs: string[];
  howToReach: string[];
  tools: { name: string; use: string }[];
  weeklyMetricExamples: string[];
  defaultActions: string[];
  testIdeas: string[];
};

/** Concrete acquisition motions founders can pick — where, how, tools, week metric. */
export const ACQUISITION_PLAYBOOKS: ChannelPlaybook[] = [
  {
    id: "b2b_outbound",
    label: "B2B outbound (email / LinkedIn)",
    bestFor: "Clear ICP, high ACV, you can name 100 accounts this week",
    whereCustomerIs: [
      "LinkedIn (titles + companies)",
      "Company websites / About pages",
      "Industry Slack/Discord (lurking for language)",
      "Conference speaker lists / podcast guests",
    ],
    howToReach: [
      "Personalized LinkedIn connect + 3-touch sequence",
      "Cold email with one sharp problem statement + CTA (call / demo / reply)",
      "Warm intro ask via mutual connections",
    ],
    tools: [
      { name: "LinkedIn Sales Navigator or basic search", use: "Find 50–100 ICP profiles" },
      { name: "Apollo / Hunter / Clay", use: "Emails + enrichment" },
      { name: "Instantly / Lemlist / Gmail", use: "Send sequences" },
      { name: "Cal.com / Calendly", use: "Book demos without back-and-forth" },
      { name: "Notion / Sheet", use: "Track sends → replies → booked" },
    ],
    weeklyMetricExamples: [
      "Replies from ICP",
      "Demo calls booked",
      "Qualified discovery calls completed",
    ],
    defaultActions: [
      "Write ICP in one sentence (role, company type, pain)",
      "Build a list of 50 target people",
      "Draft 3-touch outreach (connect / value / ask)",
      "Send first 25 touches by Wednesday",
      "Log replies and book every yes onto calendar",
    ],
    testIdeas: [
      "Cold outreach to 100 HR managers → ≥10% request a demo in 30 days",
      "LinkedIn DMs with problem-led opener → ≥8% reply rate this week",
    ],
  },
  {
    id: "community",
    label: "Communities & forums",
    bestFor: "Niche audiences that already discuss the pain publicly",
    whereCustomerIs: [
      "Reddit / Indie Hackers / specialized forums",
      "Slack / Discord communities",
      "Facebook Groups / WhatsApp circles",
      "Comment sections of niche newsletters",
    ],
    howToReach: [
      "Helpful posts (not pitches) that end with a soft CTA",
      "DM people who already complained about the problem",
      "Offer a free teardown / office hours for 5 people",
    ],
    tools: [
      { name: "Reddit / Discord / Slack", use: "Presence where the pain is named" },
      { name: "Typeform / Tally", use: "Short interest or interview signup" },
      { name: "Loom", use: "Personal video replies that convert lurkers" },
      { name: "Sheet", use: "Track posts → DMs → calls" },
    ],
    weeklyMetricExamples: [
      "DMs from people with the pain",
      "Interview bookings",
      "Waitlist signups from community",
    ],
    defaultActions: [
      "List 5 communities where the ICP already talks",
      "Collect 20 real phrases they use for the problem",
      "Post or comment helpfully in 3 places",
      "DM 15 people who showed the pain",
      "Book 5 conversations before Friday",
    ],
    testIdeas: [
      "Post a problem-led thread → ≥20 meaningful replies and 5 interview bookings",
      "Offer free teardown in Slack → ≥5 people book this week",
    ],
  },
  {
    id: "content_seo",
    label: "Content / social / SEO",
    bestFor: "You can teach a sharp point of view and capture demand inbound",
    whereCustomerIs: [
      "X / LinkedIn feeds of peers",
      "YouTube / podcasts in the niche",
      "Google search for the problem",
      "Newsletters they already open",
    ],
    howToReach: [
      "One flagship post or short video with a clear CTA",
      "Landing page behind the content (waitlist / audit / template)",
      "Distribute in 3 channels, not 10",
    ],
    tools: [
      { name: "Carrd / Framer / Webflow", use: "Simple landing page" },
      { name: "LinkedIn / X / YouTube Shorts", use: "Distribution" },
      { name: "Beehiiv / Substack (optional)", use: "Owned list" },
      { name: "GA4 / Plausible + UTM links", use: "See which post drove signups" },
    ],
    weeklyMetricExamples: [
      "Landing page signups from content",
      "CTA clicks",
      "Demo requests from inbound",
    ],
    defaultActions: [
      "Write the one promise of the landing page",
      "Ship page + one CTA this week",
      "Publish one distribution asset (post or short video)",
      "Share in 3 places your ICP already is",
      "Review signup quality Friday — ICP or noise?",
    ],
    testIdeas: [
      "Explainer + waitlist (Dropbox-style) → measure signup rate from target traffic",
      "LinkedIn post → landing → ≥X% of visitors join waitlist in 7 days",
    ],
  },
  {
    id: "paid_ads",
    label: "Paid ads (smoke test)",
    bestFor: "You can define a sharp offer and need traffic fast",
    whereCustomerIs: [
      "Meta / LinkedIn / Google / TikTok inventories",
      "Wherever lookalikes of your ICP already click",
    ],
    howToReach: [
      "Small budget to a landing page with one CTA",
      "2–3 creatives testing one message (not a brand campaign)",
      "Kill losers in 72 hours; scale only if CAC signal is sane",
    ],
    tools: [
      { name: "Meta Ads / LinkedIn Ads / Google Ads", use: "Buy attention" },
      { name: "Landing page + Stripe / waitlist", use: "Capture intent" },
      { name: "UTMs + Ads Manager", use: "Cost per signup / CPL" },
    ],
    weeklyMetricExamples: [
      "Cost per signup (CPL)",
      "Click → signup conversion %",
      "Qualified leads per $200 spent",
    ],
    defaultActions: [
      "One offer + one landing page live",
      "Two creatives, one audience",
      "Set a kill rule (e.g. pause if CPL > $X after 50 clicks)",
      "Run ≥$150–300 this week (or your min readable sample)",
      "Decide Friday: message works / audience wrong / offer weak",
    ],
    testIdeas: [
      "If we spend $300 on LinkedIn to ICP, then CPL ≤ $Y and ≥10 signups this week",
    ],
  },
  {
    id: "warm_network",
    label: "Warm network & intros",
    bestFor: "First 10 customers; trust matters more than scale",
    whereCustomerIs: [
      "Your phone contacts / alumni / ex-colleagues",
      "Investors, advisors, operators who know the ICP",
      "Customers of adjacent tools",
    ],
    howToReach: [
      "Ask for 3 intros with a forwardable blurb",
      "Offer a free setup / concierge for early users",
      "Host a tiny roundtable (5 seats) for the ICP",
    ],
    tools: [
      { name: "Phone / WhatsApp / email", use: "Direct asks" },
      { name: "Forwardable one-pager (Notion/Doc)", use: "Make intros easy" },
      { name: "Cal.com", use: "Book chats" },
    ],
    weeklyMetricExamples: [
      "Intros received",
      "Conversations booked",
      "Design partners committed",
    ],
    defaultActions: [
      "List 20 people who can intro you to the ICP",
      "Write a 5-line forwardable ask",
      "Send 10 asks by Wednesday",
      "Run every booked chat with a consistent script",
      "Ask every yes for one more intro",
    ],
    testIdeas: [
      "If we ask 15 warm contacts for intros, then ≥5 ICP conversations happen this week",
    ],
  },
  {
    id: "marketplace",
    label: "Existing platforms / marketplaces",
    bestFor: "Buyers already shop or hire somewhere (Product Hunt, Upwork, app stores, etc.)",
    whereCustomerIs: [
      "Product Hunt / G2 / directories",
      "Upwork / Fiverr / job boards",
      "App Store / Chrome Web Store / Shopify App Store",
      "Partner ecosystems",
    ],
    howToReach: [
      "List or launch where demand already pools",
      "Outbound to people who just posted a job/need",
      "Co-marketing with a complementary tool",
    ],
    tools: [
      { name: "The platform itself", use: "Distribution surface" },
      { name: "Landing + analytics", use: "Capture overflow traffic" },
      { name: "CRM sheet", use: "Follow up every inbound" },
    ],
    weeklyMetricExamples: [
      "Inbound leads from the platform",
      "Trials started",
      "Paid conversions from platform traffic",
    ],
    defaultActions: [
      "Pick ONE platform where buyers already look",
      "Ship a minimum listing / launch page",
      "Do daily follow-up for 7 days",
      "Message 20 adjacent sellers/buyers",
      "Measure conversion from profile views → CTA",
    ],
    testIdeas: [
      "If we list on X and outreach 20 adjacent buyers, then ≥5 trials start this week",
    ],
  },
  {
    id: "product_viral",
    label: "Product-led / invite loop",
    bestFor: "You already have some users; growth can live inside the product",
    whereCustomerIs: [
      "Inside your product (shares, invites, public links)",
      "Recipients of user-generated invites",
    ],
    howToReach: [
      "Add one invite / share surface with a clear reason to send",
      "Reward both sides lightly if needed",
      "Measure invite → signup conversion",
    ],
    tools: [
      { name: "Your product + analytics (PostHog / Mixpanel)", use: "Instrument the loop" },
      { name: "Referral links", use: "Attribute invites" },
    ],
    weeklyMetricExamples: [
      "Invites sent per active user",
      "Invite → signup %",
      "New users from invites",
    ],
    defaultActions: [
      "Define the one share moment in the product",
      "Ship the smallest invite CTA",
      "Ask 10 users personally to invite one peer",
      "Watch invite → signup for 7 days",
      "Interview 3 inviters about why they did/didn't share",
    ],
    testIdeas: [
      "Hotmail-style footprint: if every share includes invite X, then Y% of recipients convert in 7 days",
    ],
  },
];

export function playbookById(id: MotionId | "") {
  return ACQUISITION_PLAYBOOKS.find((p) => p.id === id);
}

export function buildWeekActions(playbook: ChannelPlaybook | undefined, custom: string[]) {
  const base = playbook?.defaultActions ?? [];
  const merged = [...base];
  for (const c of custom) {
    if (c.trim() && !merged.includes(c.trim())) merged.push(c.trim());
  }
  return merged.map((text, i) => ({
    id: `wa-${i}-${text.slice(0, 12)}`,
    text,
    done: false,
  }));
}
