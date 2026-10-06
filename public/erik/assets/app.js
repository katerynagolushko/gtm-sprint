(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // build dot grids
  document.querySelectorAll('[data-dots]').forEach(el => {
    const n = +el.dataset.dots, frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const d = document.createElement('i');
      d.style.transitionDelay = (reduce ? 0 : Math.min(i * (n > 50 ? 6 : 28), 1400)) + 'ms';
      frag.appendChild(d);
    }
    el.appendChild(frag);
  });
  // stagger matrix + tickets
  document.querySelectorAll('.m-row i').forEach((c, i) => c.style.setProperty('transition-delay', i * 70 + 'ms'));
  document.querySelectorAll('.mtg rect').forEach((r, i) => r.style.transitionDelay = 500 + i * 110 + 'ms');
  document.querySelectorAll('.track i').forEach((r, i) => r.style.transitionDelay = i * 120 + 'ms');

  // count-up
  const fmt = (v, el) => el.dataset.format === 'comma' ? v.toLocaleString('en-US') : String(v);
  const count = el => {
    const end = +el.dataset.count;
    if (reduce) { el.textContent = fmt(end, el); return; }
    const t0 = performance.now(), dur = 1100;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(end * e), el);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const reveal = el => {
    el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(count);
  };
  const targets = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
    }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(el => io.observe(el));
  }

  // clocks
  const clocks = document.querySelectorAll('time[data-tz]');
  const tick = () => clocks.forEach(t => {
    t.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: t.dataset.tz }).format(new Date());
  });
  tick(); setInterval(tick, 15000);

  // 60-second read meter
  const bar = document.querySelector('[data-progress]'), rt = document.querySelector('[data-readtime]');
  let raf = 0;
  const onScroll = () => {
    raf = 0;
    const h = document.documentElement.scrollHeight - innerHeight;
    const p = h > 0 ? Math.min(Math.max(scrollY / h, 0), 1) : 1;
    bar.style.setProperty('--p', p);
    const s = Math.round(p * 60);
    rt.textContent = `0:${String(s).padStart(2, '0')}`.replace('0:60', '1:00');
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();

  // copy email
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const label = b.querySelector('[data-copy-label]'), orig = label.textContent;
    try { await navigator.clipboard.writeText(b.dataset.copy); label.textContent = 'copied ✓'; }
    catch { location.href = 'mailto:' + b.dataset.copy; return; }
    setTimeout(() => (label.textContent = orig), 1600);
  }));
})();
