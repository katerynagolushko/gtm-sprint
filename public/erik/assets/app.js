/* GTM first-pass — rule-based v1. Runs entirely in the browser; no network calls. */
(function () {
  'use strict';

  var form = document.getElementById('gtm-form');
  if (!form) return;

  // ---------- Industry map: keywords -> personas, pains, channels ----------
  var INDUSTRIES = [
    { id: 'finance', label: 'finance / back-office',
      kw: ['bookkeep', 'accounting', 'accountant', 'invoice', 'invoic', 'payroll', 'finance', 'financial', 'tax', 'expense', 'payment', 'billing', 'cfo', 'cash flow', 'cashflow', 'reconcil', 'spend', 'fintech', 'banking', 'lending'],
      pains: ['month-end close eating whole weekends', 'chasing late invoices', 'messy books right before tax deadlines'],
      theme: 'getting finance off the founder’s plate',
      roles: [
        { t: 'Owner / MD', w: 'Still does the books at night; feels the pain directly and signs off on tools.' },
        { t: 'Ops or finance lead', w: 'Owns the spreadsheet chaos; will champion anything that saves hours.' },
        { t: 'Their outside accountant', w: 'A channel, not a buyer: one accountant can bring ten clients.' }
      ],
      where: ['owner communities and local business meetups', 'LinkedIn search by ops/finance title', 'accountant and bookkeeper networks'] },
    { id: 'dev', label: 'developer tools',
      kw: ['api', 'developer', 'dev tool', 'devtool', 'code', 'coding', 'devops', 'sdk', 'infra', 'observability', 'testing', 'ci/cd', 'deploy', 'database', 'open source', 'llm ops', 'agent framework', 'engineer'],
      pains: ['on-call noise nobody has time to fix', 'slow, flaky deploys', 'glue code that keeps breaking'],
      theme: 'what’s actually slowing eng teams down',
      roles: [
        { t: 'CTO / head of engineering', w: 'Owns the budget and the pain of a slow team.' },
        { t: 'Staff or platform engineer', w: 'Tries the tool first; their yes is what gets it adopted.' },
        { t: 'Founding engineer at a seed startup', w: 'Moves fast, says yes to good tools, tells friends.' }
      ],
      where: ['GitHub issues and discussions on adjacent repos', 'dev Discords and meetups', 'Hacker News / technical newsletters'] },
    { id: 'health', label: 'health',
      kw: ['health', 'clinic', 'patient', 'care', 'medical', 'therapy', 'therapist', 'pharma', 'nhs', 'doctor', 'nurse', 'hospital', 'wellness', 'mental health', 'dental'],
      pains: ['admin time that should be patient time', 'no-shows and rebooking', 'compliance paperwork piling up'],
      theme: 'giving clinicians time back',
      roles: [
        { t: 'Practice manager', w: 'Runs operations day to day and usually picks the tools.' },
        { t: 'Clinical lead / owner', w: 'Cares about patient time and needs to trust it’s safe.' },
        { t: 'Digital or innovation lead', w: 'In bigger orgs, the person who runs pilots.' }
      ],
      where: ['practice-manager groups and forums', 'health-innovation events', 'warm intros via clinicians'] },
    { id: 'people', label: 'hiring / HR',
      kw: ['hiring', 'recruit', 'talent', 'hr ', 'human resources', 'onboarding', 'candidate', 'interview', 'employee', 'workforce', 'people team', 'benefits'],
      pains: ['great candidates dropping out mid-process', 'onboarding living in five docs', 'hiring managers ignoring the ATS'],
      theme: 'hiring without the chaos',
      roles: [
        { t: 'Head of people / talent', w: 'Owns the process and the tooling budget.' },
        { t: 'Founder who still hires', w: 'At small teams, the founder is the recruiter.' },
        { t: 'Hiring manager', w: 'Feels the slow process most; a strong internal voice.' }
      ],
      where: ['people-ops communities and Slack groups', 'LinkedIn by talent/people titles', 'HR meetups'] },
    { id: 'growth', label: 'sales / marketing',
      kw: ['sales', 'crm', 'lead', 'outbound', 'marketing', 'seo', 'ads', 'advertis', 'content', 'brand', 'social media', 'email campaign', 'pipeline', 'prospect', 'gtm', 'revenue'],
      pains: ['pipeline that looks busy but doesn’t convert', 'content nobody reads', 'reps spending half the day on research'],
      theme: 'pipeline that actually turns into meetings',
      roles: [
        { t: 'Head of growth / marketing', w: 'Owns the number and is always testing channels.' },
        { t: 'Sales lead or first AE', w: 'Feels the research and follow-up pain every day.' },
        { t: 'Founder doing founder-led sales', w: 'Early on, the founder is the whole GTM team.' }
      ],
      where: ['growth and RevOps communities', 'LinkedIn by growth/sales titles', 'small GTM dinners and meetups'] },
    { id: 'commerce', label: 'commerce / retail',
      kw: ['shop', 'ecommerce', 'e-commerce', 'store', 'retail', 'dtc', 'd2c', 'shopify', 'merchant', 'marketplace', 'fashion', 'vintage', 'inventory', 'restaurant', 'hospitality'],
      pains: ['returns eating the margin', 'stock that never matches reality', 'ad costs climbing every month'],
      theme: 'margin, stock and repeat customers',
      roles: [
        { t: 'Founder / brand owner', w: 'Decides fast and feels every margin point.' },
        { t: 'E-commerce or ops manager', w: 'Runs the store day to day; lives in the dashboards.' },
        { t: 'Agency or platform partner', w: 'A channel: they recommend tools to many merchants.' }
      ],
      where: ['merchant and founder communities', 'platform partner directories', 'trade shows and local retail meetups'] },
    { id: 'legal', label: 'legal / compliance',
      kw: ['legal', 'contract', 'compliance', 'law', 'lawyer', 'regulat', 'gdpr', 'soc 2', 'soc2', 'audit', 'policy'],
      pains: ['contracts stuck in review for weeks', 'compliance asks from every big customer', 'nobody owning the policies'],
      theme: 'getting deals through legal faster',
      roles: [
        { t: 'General counsel / legal lead', w: 'Owns the risk and the backlog.' },
        { t: 'COO / head of ops', w: 'At smaller companies, legal lands on ops.' },
        { t: 'Sales lead', w: 'Feels it when deals stall in review; a strong ally.' }
      ],
      where: ['in-house legal communities', 'LinkedIn by legal/ops titles', 'compliance and security events'] },
    { id: 'edu', label: 'education',
      kw: ['edu', 'learning', 'course', 'school', 'student', 'teacher', 'tutor', 'training', 'upskill', 'university', 'classroom', 'cohort'],
      pains: ['learners dropping off after week one', 'teachers buried in admin', 'proving the course actually worked'],
      theme: 'keeping learners engaged',
      roles: [
        { t: 'Head of learning / L&D', w: 'Owns the budget and needs to show results.' },
        { t: 'Teacher or course creator', w: 'The daily user; their love is your word of mouth.' },
        { t: 'School or program director', w: 'Signs off and cares about outcomes and safety.' }
      ],
      where: ['educator communities and conferences', 'L&D groups on LinkedIn', 'creator and cohort-course circles'] },
    { id: 'property', label: 'property / real estate',
      kw: ['property', 'real estate', 'landlord', 'rental', 'tenant', 'construction', 'housing', 'mortgage', 'estate agent', 'facilities'],
      pains: ['maintenance requests lost in WhatsApp', 'void periods between tenants', 'paperwork on every single unit'],
      theme: 'running properties with less admin',
      roles: [
        { t: 'Portfolio landlord', w: 'Owns enough units that admin hurts; decides alone.' },
        { t: 'Property manager', w: 'Runs the day to day and picks the tools.' },
        { t: 'Agency director', w: 'Can roll a tool out across many landlords.' }
      ],
      where: ['landlord forums and associations', 'property meetups', 'LinkedIn by property-management titles'] },
    { id: 'logistics', label: 'logistics / supply chain',
      kw: ['logistics', 'shipping', 'freight', 'supply chain', 'warehouse', 'fleet', 'delivery', 'courier', 'procurement', 'last mile'],
      pains: ['shipments nobody can track', 'quotes done by email and spreadsheet', 'drivers and routes planned by hand'],
      theme: 'fewer surprises between order and delivery',
      roles: [
        { t: 'Head of operations / logistics', w: 'Owns the cost and the late-delivery complaints.' },
        { t: 'Warehouse or fleet manager', w: 'Feels the daily mess; adoption lives or dies here.' },
        { t: 'Procurement lead', w: 'Signs contracts and compares vendors.' }
      ],
      where: ['logistics trade groups and shows', 'LinkedIn by ops/supply-chain titles', 'warm intros via 3PLs'] },
    { id: 'creator', label: 'creators / media',
      kw: ['creator', 'podcast', 'video', 'newsletter', 'media', 'audience', 'community', 'influencer', 'youtube', 'tiktok', 'streaming', 'music', 'publisher'],
      noOrg: true,
      pains: ['growing an audience without burning out', 'turning attention into revenue', 'editing that eats the week'],
      theme: 'growing an audience that actually pays',
      roles: [
        { t: 'Independent creator', w: 'Decides alone and moves fast; loves tools that save time.' },
        { t: 'Creator’s manager or producer', w: 'Runs operations for one or more creators.' },
        { t: 'Small media team lead', w: 'Has a budget and a content calendar to hit.' }
      ],
      where: ['creator communities and Discords', 'X / YouTube comments in the niche', 'creator meetups and podcasts'] },
    { id: 'security', label: 'security',
      kw: ['security', 'fraud', 'identity', 'auth', 'threat', 'vulnerab', 'privacy', 'encryption', 'phishing', 'cyber'],
      pains: ['alert fatigue', 'security questionnaires from every customer', 'access nobody remembers granting'],
      theme: 'less noise, fewer surprises',
      roles: [
        { t: 'CISO / head of security', w: 'Owns the risk and the budget.' },
        { t: 'Security or platform engineer', w: 'Evaluates the tool hands-on.' },
        { t: 'CTO at a scaling startup', w: 'Owns security until there’s a dedicated hire.' }
      ],
      where: ['security meetups and BSides-style events', 'security Slack groups', 'LinkedIn by security titles'] },
    { id: 'hardware', label: 'robotics / hardware',
      kw: ['robot', 'hardware', 'manufactur', 'factory', 'drone', 'sensor', 'iot', 'industrial', 'automation', 'machine'],
      pains: ['downtime nobody predicted', 'hard-to-hire manual work', 'pilots that never become rollouts'],
      theme: 'getting from pilot to rollout',
      roles: [
        { t: 'Plant or operations manager', w: 'Owns uptime and the line; runs pilots.' },
        { t: 'Head of automation / engineering', w: 'Evaluates the tech and its integration.' },
        { t: 'COO / site director', w: 'Signs the rollout once the pilot works.' }
      ],
      where: ['industry trade shows', 'LinkedIn by ops/engineering titles', 'warm intros via integrators'] },
    { id: 'consumer', label: 'consumer',
      kw: ['app ', 'apps', 'friends', 'dating', 'social', 'consumer', 'fitness', 'travel', 'gaming', 'game', 'food', 'parents', 'pet'],
      noOrg: true,
      pains: ['apps that feel built for someone else', 'never quite finding your people', 'plans that fall through last minute'],
      theme: 'what they wish existed',
      roles: [
        { t: 'Early-adopter user', w: 'The first fans; talk to them weekly.' },
        { t: 'Community or club organiser', w: 'Can bring a whole group at once.' },
        { t: 'Niche creator in the space', w: 'Distribution: one post can bring hundreds.' }
      ],
      where: ['niche subreddits and Discords', 'IRL clubs and meetups', 'creators who already talk to these users'] }
  ];

  var FALLBACK = { id: 'b2b', label: 'B2B (general)',
    pains: ['a manual process eating hours every week', 'tools that don’t talk to each other', 'decisions made on gut feel'],
    theme: 'the boring work that slows teams down',
    roles: [
      { t: 'Founder / CEO', w: 'At small companies, the decision-maker and the user.' },
      { t: 'Head of operations', w: 'Owns the process this probably fixes.' },
      { t: 'Team lead who feels the pain', w: 'Your internal champion; tries it first.' }
    ],
    where: ['LinkedIn by ops/leadership titles', 'founder communities', 'small curated dinners'] };

  // ---------- Helpers ----------
  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function stripEnd(s) { return clean(s).replace(/[.!\s]+$/, ''); }
  function lowerFirst(s) { return /^[A-Z]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
  function words(s) { return clean(s).split(' ').filter(Boolean); }
  function singular(w) {
    if (/ies$/i.test(w)) return w.replace(/ies$/i, 'y');
    if (/(ss|sh|ch|x)es$/i.test(w)) return w.replace(/es$/i, '');
    if (/s$/i.test(w) && !/ss$/i.test(w)) return w.replace(/s$/i, '');
    return w;
  }

  function detectIndustries(text) {
    var t = ' ' + text.toLowerCase() + ' ';
    var scored = INDUSTRIES.map(function (ind) {
      var n = 0;
      ind.kw.forEach(function (k) {
        var esc = k.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
        var re = new RegExp('(^|[^a-z])' + esc + (k.length <= 3 ? '(?![a-z])' : ''), 'i');
        if (re.test(t)) n += k.length > 4 ? 2 : 1;
      });
      return { ind: ind, n: n };
    }).filter(function (x) { return x.n > 0; }).sort(function (a, b) { return b.n - a.n; });
    if (!scored.length) return [FALLBACK];
    // keep a second industry only if it matched with some confidence
    return scored.filter(function (x, i) { return i === 0 || x.n >= 2; }).map(function (x) { return x.ind; });
  }

  // "AI bookkeeping for small agencies" -> "small agencies"
  function extractAudience(desc, market) {
    var m = clean(market);
    if (m) return m.replace(/^(for|to)\s+/i, '');
    var match = /\b(?:for|to help|helping)\s+(.+?)(?:\s+(?:to|who|that|so|with|by|in order)\b|[,.;—–-]|$)/i.exec(desc);
    return match ? clean(match[1]) : '';
  }

  function sizeOf(text) {
    var t = text.toLowerCase();
    if (/\b(enterprise|large|fortune|global|bank|banks|hospital|hospitals|government|public sector|corporate)/.test(t)) return 'large';
    if (/\b(small|smb|smbs|sme|smes|solo|freelanc|independent|agenc|local|shop|shops|studio|studios|practice|practices|1-|2-|5-|10-)/.test(t)) return 'small';
    if (/\b(startup|startups|seed|founder|founders|scaleup|scale-up)/.test(t)) return 'startup';
    return 'mid';
  }

  function audienceHead(aud) {
    // Strip geography/size noise and take the last noun-ish word
    var a = aud.replace(/\(.*?\)/g, '').replace(/,.*$/, '')
      .replace(/\b(in|across|within)\s+the\s+\w+$/i, '').replace(/\b(in|across)\s+[A-Z][\w.&-]*(\s+[A-Z][\w.&-]*)*$/, '');
    a = a.replace(/\b\d+\s*[–-]\s*\d+\s*(people|employees|staff)?\b/i, '');
    var ws = words(a).filter(function (w) { return !/^(the|a|an|and|or|of|small|large|mid-size|midsize|growing|busy|modern|uk|us|eu|european|london|local|independent)$/i.test(w); });
    return ws.length ? ws[ws.length - 1].replace(/[^\w'-]/g, '') : '';
  }

  // ---------- Generation ----------
  function buildPersonas(ind, size, head, aud) {
    var generic = /^(team|company|business|people|user|customer|org|organisation|organization|brand|client)$/i;
    var org = head && !ind.noOrg && !generic.test(singular(head)) ? singular(head).toLowerCase() : '';
    return ind.roles.map(function (r, i) {
      var title = r.t;
      if (i === 0 && org) {
        if (size === 'small' && /owner|founder|md|ceo/i.test(r.t)) title = cap(org) + ' owner / MD';
        else if (size === 'large') title = r.t.replace(/^Owner \/ MD|Founder \/ CEO/, 'VP / Director') + ' at a ' + org;
        else title = r.t + ' at a ' + (size === 'small' ? 'small ' : '') + org;
      }
      var whyText = r.w;
      if (size === 'large' && i === 0) whyText = 'Longer cycle: expect a pilot, security review and a few stakeholders.';
      if (size === 'startup' && i === 2) whyText = 'Startups talk to each other; one happy team brings the next.';
      return { title: title, why: whyText, where: ind.where[i] || ind.where[0] };
    });
  }

  function buildLines(name, desc, ind, aud, head, seed) {
    var one = lowerFirst(stripEnd(desc));
    var audPlural = aud ? lowerFirst(aud) : (head ? head.toLowerCase() : 'teams like yours');
    var org = head && !ind.noOrg ? singular(head).toLowerCase() : 'team';
    var pain = ind.pains[seed % ind.pains.length];
    var pain2 = ind.pains[(seed + 1) % ind.pains.length];
    var firstQ = ['Hi {first}', 'Hey {first}', 'Hi {first} —'][seed % 3].replace(/ —$/, '');

    var A = [
      firstQ + ' — a lot of ' + audPlural + ' I talk to mention ' + pain + '. We built ' + name + ' (' + one + ') for exactly that. Open to a 15-min look next week?',
      firstQ + ' — noticed ' + audPlural + ' often struggle with ' + pain + '. ' + name + ': ' + one + '. Worth a quick 15-minute call to see if it fits?'
    ][seed % 2];

    var B = [
      (ind.noOrg
        ? 'Quick question, {first}: how do you deal with ' + pain2 + ' today? We’re building ' + name + ' and I’d love 10 minutes of your honest take — no pitch.'
        : 'Quick question, {first}: how does your ' + org + ' handle ' + pain2 + ' today? We’re building ' + name + ' and I’d love 10 minutes of your honest take — no pitch.'),
      'Curious, {first} — is ' + pain2 + ' a real problem ' + (ind.noOrg ? 'for you' : 'at your ' + org) + ', or am I wrong? Building ' + name + ' around it and would value a 10-min reality check.'
    ][(seed >>> 1) % 2];

    var C = [
      'Hosting a small dinner for ' + audPlural + ' on ' + ind.theme + ' — 8 people, no slides. Would you want a seat? Happy to send details.',
      'We’re getting a few ' + audPlural + ' together to swap notes on ' + ind.theme + '. Small table, no pitch. Want me to save you a seat?'
    ][(seed >>> 2) % 2];

    return [
      { kind: 'Problem-first', text: A },
      { kind: 'Curious question', text: B },
      { kind: 'Warm / event', text: C }
    ];
  }

  // ---------- Scoring ----------
  function scoreLine(text, ctx) {
    var t = text.toLowerCase();
    var n = words(text).length;
    var notes = [];

    // Specificity (0-4)
    var spec = 0;
    var hd = (ctx.head || '').toLowerCase();
    if (hd && (t.indexOf(hd) !== -1 || t.indexOf(singular(hd)) !== -1 || t.indexOf(hd.slice(0, Math.max(4, hd.length - 3))) !== -1)) { spec++; notes.push('names the audience'); }
    if (ctx.ind.pains.some(function (p) { return t.indexOf(p.split(' ').slice(0, 2).join(' ').toLowerCase()) !== -1; }) || t.indexOf(ctx.ind.theme.split(' ').slice(0, 2).join(' ').toLowerCase()) !== -1) { spec++; notes.push('specific pain'); }
    if (ctx.name && t.indexOf(ctx.name.toLowerCase()) !== -1) spec++;
    if (/\d/.test(text)) { spec++; notes.push('concrete number'); }

    // Length (0-3)
    var len = n >= 14 && n <= 28 ? 3 : (n >= 10 && n <= 38 ? 2 : 1);
    if (len === 3) notes.push(n + ' words, easy to read');
    else if (n > 28) notes.push(n + ' words, a bit long — trim one clause');
    else notes.push(n + ' words, maybe too short');

    // Clear ask (0-3)
    var hasQ = /\?/.test(text);
    var askWord = /(\d+\s*-?\s*min|call|chat|look|seat|take|reality check|send details)/i.test(text);
    var ask = hasQ && askWord ? 3 : (hasQ ? 2 : (askWord ? 1 : 0));
    notes.push(ask === 3 ? 'clear, small ask' : ask === 2 ? 'question, but vague ask' : 'no clear ask');

    var you = (t.match(/\byou(r)?\b/g) || []).length;
    var me = (t.match(/\b(we|we’re|we're|i|i’d|i'd|our|us)\b/g) || []).length;
    var penalty = me > you ? 1 : 0;
    if (penalty) notes.unshift('more about us than them (−1)');
    var total = Math.max(1, Math.min(10, spec + len + ask - penalty));
    if (!ctx.head) notes.unshift('add a target market to make it sharper');
    var weak = /(too short|a bit long|vague|no clear|−1|add a target)/;
    notes.sort(function (x, y) { return (weak.test(y) ? 1 : 0) - (weak.test(x) ? 1 : 0); });
    return { total: total, spec: spec, len: len, ask: ask, why: notes.slice(0, 3).join(' · ') };
  }

  // ---------- Rendering (textContent only; no innerHTML of user input) ----------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function copyText(text, btn) {
    function done() {
      btn.textContent = 'Copied';
      btn.classList.add('is-done');
      setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, 1400);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      document.body.removeChild(ta); done();
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
  }

  var out = document.getElementById('gtm-out');
  var pList = document.getElementById('gtm-personas');
  var lList = document.getElementById('gtm-lines');
  var meta = document.getElementById('gtm-meta');
  var err = document.getElementById('gtm-error');

  function run(name, desc, market) {
    // Allow "Acme — AI bookkeeping…" typed into the name field
    if (!desc && /\s[—–-]\s/.test(name)) {
      var parts = name.split(/\s[—–-]\s/);
      name = clean(parts.shift()); desc = clean(parts.join(' - '));
    }
    if (!name || !desc) {
      err.textContent = 'Add a name and a one-line description.';
      err.hidden = false; out.hidden = true; return;
    }
    err.hidden = true;

    var text = desc + ' ' + market;
    var inds = detectIndustries(text);
    var ind = inds[0];
    var aud = extractAudience(desc, market);
    var head = audienceHead(aud);
    var size = sizeOf(aud + ' ' + desc);
    var seed = hash(name.toLowerCase() + '|' + desc.toLowerCase());

    var personas = buildPersonas(ind, size, head, aud);
    // If a second industry matched, swap in its strongest role as persona 3 for variety
    if (inds[1] && inds[1] !== FALLBACK) {
      var r = inds[1].roles[0];
      personas[2] = { title: r.t, why: r.w + ' (' + inds[1].label + ' angle)', where: inds[1].where[0] };
    }

    pList.textContent = '';
    personas.forEach(function (p) {
      var li = el('li', 'persona');
      li.appendChild(el('b', null, p.title));
      li.appendChild(el('span', null, p.why));
      li.appendChild(el('small', null, 'Find them: ' + p.where));
      pList.appendChild(li);
    });

    var lines = buildLines(name, desc, ind, aud, head, seed);
    lList.textContent = '';
    lines.forEach(function (ln) {
      var s = scoreLine(ln.text, { head: head, ind: ind, name: name });
      var li = el('li', 'line');
      li.appendChild(el('p', 'line__text', ln.text));
      var btn = el('button', 'copy', 'Copy');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copy ' + ln.kind.toLowerCase() + ' line');
      btn.addEventListener('click', function () { copyText(ln.text, btn); });
      li.appendChild(btn);
      var m = el('div', 'line__meta');
      m.appendChild(el('span', null, ln.kind));
      m.appendChild(el('span', 'line__score', s.total + '/10'));
      m.appendChild(el('span', null, 'specific ' + s.spec + '/4 · length ' + s.len + '/3 · ask ' + s.ask + '/3'));
      m.appendChild(el('span', 'line__why', s.why));
      li.appendChild(m);
      lList.appendChild(li);
    });

    meta.textContent = 'Read as: ' + ind.label + (aud ? ' · audience “' + aud + '”' : '') + ' · ' +
      (ind.noOrg ? 'consumers' : ({ small: 'small teams', large: 'larger orgs', startup: 'startups', mid: 'mid-size' })[size]) +
      '. Swap {first} for their name. A starting point to edit, not a script.';
    out.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    run(clean(document.getElementById('f-name').value), clean(document.getElementById('f-desc').value), clean(document.getElementById('f-market').value));
  });

  // Expose for testing
  window.__gtmFirstPass = run;
})();
