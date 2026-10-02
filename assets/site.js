/* Splendid Trading: progressive enhancement (HCP-308, approved by Ben).
   Every page works fully without this file. It never changes slot contents, form fields or form actions,
   sets no cookies, uses no storage, and makes no outside requests. Its only request is a same-site POST
   of the Add to basket form (approved), falling back to a normal submit if that fails. */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  html.classList.add('js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }

  /* 1. Panels: tap again to close; outside tap or Esc closes */
  function closeUsps(except) {
    $$('.usp.is-open').forEach(function (u) { if (u !== except) { u.classList.remove('is-open'); u.setAttribute('aria-expanded', 'false'); } });
  }
  $$('.usp').forEach(function (u) {
    u.setAttribute('role', 'button');
    u.setAttribute('aria-expanded', 'false');
    function toggle() {
      var open = !u.classList.contains('is-open');
      closeUsps(u);
      u.classList.toggle('is-open', open);
      u.setAttribute('aria-expanded', String(open));
      if (!open) u.blur();
    }
    u.addEventListener('click', toggle);
    u.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  d.addEventListener('click', function (e) {
    if (!e.target.closest('.usp')) closeUsps();
    $$('details.sort[open]').forEach(function (x) { if (!x.contains(e.target)) x.open = false; });
  });
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeUsps();
    $$('details.sort[open]').forEach(function (x) { x.open = false; });
    var ft = $('#filter-toggle'); if (ft) ft.checked = false;
  });

  /* 2. Quantity stepper around every number input */
  function btn(t, label) { var b = d.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('aria-label', label); return b; }
  $$('input.qty[type="number"]').forEach(function (inp) {
    var wrap = d.createElement('span');
    wrap.className = 'stepper' + (inp.classList.contains('sm') ? ' sm' : '');
    var less = btn('\u2212', 'Decrease'), more = btn('+', 'Increase');
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(less); wrap.appendChild(inp); wrap.appendChild(more);
    function step(n) {
      var min = parseInt(inp.min || '1', 10) || 1;
      inp.value = Math.max(min, (parseInt(inp.value, 10) || min) + n);
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
    less.addEventListener('click', function () { step(-1); });
    more.addEventListener('click', function () { step(1); });
  });

  /* 3. Running total on the product page (reads the prices already on the page) */
  function money(s) { var m = /([\d,]+\.\d{2})/.exec(s || ''); return m ? parseFloat(m[1].replace(/,/g, '')) : NaN; }
  var gbp = window.Intl ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }) : null;
  var buy = $('.buy');
  if (buy && gbp) {
    var rt = $('.runtotal', buy), rv = rt && $('.rt-v', rt), q = $('form[data-iw-add-to-basket] input[name="quantity"]', buy);
    var priceEl = $('.packbox [data-iw-product-price]', buy) || $('[data-iw-product-unit-price]', buy);
    if (rt && rv && q && priceEl) {
      var upd = function () {
        var n = parseInt(q.value, 10) || 1, p = money(priceEl.textContent);
        if (isNaN(p)) { rt.hidden = true; return; }
        rt.hidden = n < 2;
        rv.textContent = gbp.format(p * n);
      };
      q.addEventListener('input', upd);
      upd();
    }
  }

  /* 4. Add to basket without a reload, then "Added" (falls back to a normal submit).
     Review copies (html.review) have no basket behind them, so they only show the "Added" state. */
  function added(b) {
    b.classList.add('is-added');
    clearTimeout(b._t);
    b._t = setTimeout(function () { b.classList.remove('is-added'); }, 2000);
  }
  $$('form[data-iw-add-to-basket]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (!window.fetch || !window.FormData) return;
      var b = $('button[type="submit"]', f);
      e.preventDefault();
      if (!b || b.classList.contains('is-busy')) return;
      if (html.classList.contains('review')) { added(b); return; }
      b.classList.add('is-busy');
      fetch(f.getAttribute('action') || location.href, { method: 'POST', body: new FormData(f), credentials: 'same-origin', headers: { 'X-Requested-With': 'site.js' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          b.classList.remove('is-busy');
          added(b);
        })
        .catch(function () { b.classList.remove('is-busy'); HTMLFormElement.prototype.submit.call(f); });
    });
  });

  /* 5. Header: favourites + basket drop into the department row once stuck (all browsers) */
  var hdr = $('.hdr'), page = $('.page');
  if (hdr && page) {
    var ticking = false;
    var check = function () {
      ticking = false;
      var z = parseFloat(getComputedStyle(page).zoom) || 1, top = parseFloat(getComputedStyle(hdr).top) || 0;
      html.classList.toggle('is-stuck', innerWidth >= 1024 && scrollY > 0 && hdr.getBoundingClientRect().top <= top * z + 1);
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
    addEventListener('resize', check);
    check();
  }

  /* 6. "Why buy" carousel: arrows, dots, autoplay that pauses on hover or focus */
  var why = $('.why'), slides = why ? $$('.slide', why) : [];
  if (slides.length > 1) {
    var i = 0, timer = null;
    why.classList.add('js-car');
    var arrow = function (dir) {
      var b = d.createElement('button');
      b.type = 'button'; b.className = 'why-arrow';
      b.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
      b.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6') + '"></path></svg>';
      return b;
    };
    var ctrl = d.createElement('div'), dots = d.createElement('div'), prev = arrow('prev'), next = arrow('next');
    ctrl.className = 'why-ctrl'; dots.className = 'why-dots';
    var go = function (k, user) {
      i = (k + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-on', n === i); s.setAttribute('aria-hidden', n === i ? 'false' : 'true'); });
      $$('button', dots).forEach(function (b, n) { b.classList.toggle('is-on', n === i); b.setAttribute('aria-current', n === i ? 'true' : 'false'); });
      if (user) start();
    };
    var start = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(i + 1); }, 6000); };
    slides.forEach(function (s, k) {
      var b = d.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', (k + 1) + ' of ' + slides.length);
      b.appendChild(d.createElement('span'));
      b.addEventListener('click', function () { go(k, true); });
      dots.appendChild(b);
    });
    ctrl.appendChild(dots); ctrl.appendChild(prev); ctrl.appendChild(next);
    ($('.bars', why) || $('.slides', why)).insertAdjacentElement('afterend', ctrl);
    prev.addEventListener('click', function () { go(i - 1, true); });
    next.addEventListener('click', function () { go(i + 1, true); });
    why.addEventListener('mouseenter', function () { clearInterval(timer); });
    why.addEventListener('mouseleave', start);
    why.addEventListener('focusin', function () { clearInterval(timer); });
    why.addEventListener('focusout', start);
    go(0); start();
  }

  /* 7. Scroll-in: sections and cards below the fold fade up as they arrive */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    var prep = function (el, delay) {
      var r = el.getBoundingClientRect();
      if (!r.height || r.top < innerHeight * 0.96) return;
      el.classList.add('rv');
      if (delay) el.style.transitionDelay = delay + 'ms';
      io.observe(el);
    };
    $$('.sechead, .why, .talk, .nores').forEach(function (el) { prep(el, 0); });
    $$('.grid, .subtiles, .depts').forEach(function (g) {
      var cols = getComputedStyle(g).gridTemplateColumns.split(' ').length || 1;
      Array.prototype.slice.call(g.children).forEach(function (li, k) { prep(li, (k % cols) * 90); });
    });
  }
})();
