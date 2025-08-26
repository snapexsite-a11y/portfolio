// تبديل الثيم (فاتح/داكن)
(function setupThemeToggle() {
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  const KEY = 'snapex-theme';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(KEY);
  const initial = saved || (prefersDark ? 'dark' : 'light');
  body.setAttribute('data-theme', initial);

  btn?.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem(KEY, next);
  });
})();

// قائمة الجوال القابلة للفتح والإغلاق
(function setupMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// تمرير سلس مع تعويض ارتفاع الهيدر الثابت
(function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector('.site-header');
      const offset = (header?.getBoundingClientRect().height || 0) + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// أكورديون الأسئلة الشائعة
(function setupAccordion() {
  const acc = document.getElementById('faq');
  if (!acc) return;

  acc.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    const panel = item.querySelector('.accordion-panel');
    if (!header || !panel) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      header.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();

// سنة ديناميكية في التذييل
document.getElementById('year')?.append(new Date().getFullYear());

// أنيميشن ظهور عند التمرير (Reveal)
(function setupReveal() {
  const elements = Array.from(document.querySelectorAll('.reveal'));
  if (!('IntersectionObserver' in window) || elements.length === 0) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => io.observe(el));
})();

// عدادات رقمية تتزايد حتى الهدف (للشارات والإحصائيات)
(function setupCounters() {
  const counters = document.querySelectorAll('.num[data-count]');
  if (counters.length === 0) return;
  const animate = (el) => {
    const target = Number(el.getAttribute('data-count')) || 0;
    const durationMs = 900;
    const startMs = performance.now();
    const startVal = Number(el.textContent?.replace(/[^\d]/g, '')) || 0;
    const step = (now) => {
      const p = Math.min(1, (now - startMs) / durationMs);
      const value = Math.floor(startVal + (target - startVal) * (p < 0.5 ? 2*p*p : -1 + (4 - 2*p) * p));
      el.textContent = String(value);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const ob = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        ob.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  counters.forEach(c => ob.observe(c));
})();

// سلايد شو تلقائي للمميزات (الثيمات)
(function setupFeaturesSlideshow() {
  const root = document.getElementById('featuresSlideshow');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.slide'));
  if (slides.length <= 1) return;
  let index = 0;
  const show = (i) => {
    slides.forEach((s, j) => s.classList.toggle('active', i === j));
    // تحديث النقاط
    document.querySelectorAll('#featuresIndicators .dot').forEach((d, j) => d.classList.toggle('active', i === j));
  };
  let timer = setInterval(next, 4000); // أبطأ قليلاً من الهيرو
  function next() { index = (index + 1) % slides.length; show(index); }
  function go(i) { index = i % slides.length; if (index < 0) index = slides.length - 1; show(index); resetTimer(); }
  function resetTimer() { clearInterval(timer); timer = setInterval(next, 4000); }

  // التنقل بالنقاط
  document.getElementById('featuresIndicators')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) go(parseInt(e.target.dataset.index));
  });

  // سحب باللمس
  let startX;
  root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  root.addEventListener('touchmove', (e) => {
    if (!startX) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else go(index - 1);
      startX = null;
    }
  });
  root.addEventListener('touchend', () => { startX = null; });

  show(index);
})();

// سلايد شو تلقائي للمميزات (الثيمات)
(function setupFeaturesSlideshow() {
  const root = document.getElementById('featuresSlideshow');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.slide'));
  if (slides.length <= 1) return;
  let index = 0;
  const show = (i) => {
    slides.forEach((s, j) => s.classList.toggle('active', i === j));
    // تحديث النقاط
    document.querySelectorAll('#featuresIndicators .dot').forEach((d, j) => d.classList.toggle('active', i === j));
  };
  let timer = setInterval(next, 4000); // أبطأ قليلاً من الهيرو
  function next() { index = (index + 1) % slides.length; show(index); }
  function go(i) { index = i % slides.length; if (index < 0) index = slides.length - 1; show(index); resetTimer(); }
  function resetTimer() { clearInterval(timer); timer = setInterval(next, 4000); }

  // التنقل بالنقاط
  document.getElementById('featuresIndicators')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) go(parseInt(e.target.dataset.index));
  });

  // سحب باللمس
  let startX;
  root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  root.addEventListener('touchmove', (e) => {
    if (!startX) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else go(index - 1);
      startX = null;
    }
  });
  root.addEventListener('touchend', () => { startX = null; });

  show(index);
})();


