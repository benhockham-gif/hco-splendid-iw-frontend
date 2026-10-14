/* Splendid Trading: progressive enhancement (HCP-308, approved by Ben).
   Every page works fully without this file. It never changes slot contents, form fields or form actions,
   sets no cookies, uses no storage, and makes no outside requests. Its only request is a same-site POST
   of the Add to basket form (approved), falling back to a normal submit if that fails. */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  html.classList.add('js');
  /* 0. Gaps: add ?gaps to any URL to outline every block still hidden until its slot is wired */
  if (/[?&]gaps\b/.test(location.search)) html.classList.add('review');
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
      $$('.img img', why).forEach(function (p, n) { p.classList.toggle('is-on', n === i); }); /* v4.6: picture follows the message */
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

  /* 9. Home hero (v4.6): the images in data-iw-hero-images take turns, 7 s each; the new one shrinks into place over the old. One image, or reduced motion: the first stays */
  var heroBox = $('[data-iw-hero-images]'), pics = heroBox ? $$('img', heroBox) : [];
  if (pics.length > 1 && !reduce) {
    heroBox.classList.add('js-rot');
    var hi = 0; pics[0].classList.add('is-on');
    setInterval(function () { pics[hi].classList.remove('is-on'); hi = (hi + 1) % pics.length; pics[hi].classList.add('is-on'); }, 7000);
  }

  /* 8. Gaps: list the blocks hidden until their slot is wired (data-iw-pending) in the console */
  var pend = $$('[data-iw-pending]');
  if (pend.length && window.console) {
    var c = {};
    pend.forEach(function (e) { var n = e.getAttribute('data-iw-pending'); c[n] = (c[n] || 0) + 1; });
    console.warn('Splendid: ' + Object.keys(c).length + ' kinds of block are hidden until their slot is wired (data-iw-pending). Add ?gaps to the URL to see them. See HANDOVER.md, "Hidden until wired".', c);
  }
})();

/* HCP-563: subcategory tile images supplied by Ben (front-end assets), by category slug. */
(function(){var D=["bar-top-accessories","beer","bottles-jars","brandy-fortified-wine","champagne","cocktails","crystal-glassware","dash-bottles","hiballs-tumblers","hot-drinks","ice-champagne","jugs-pitchers-carafes","measures-pourers","metal-drinkware","openers","rocks","shake","shot-glasses","skewers","soda-siphons-cream-whippers","speciality","speed-rails","stir","strain","straws","trays","tumblers","wine"];
function run(){document.querySelectorAll('a.subtile[href^="/category/"]').forEach(function(a){var s=a.getAttribute("href").split("/")[2].split("?")[0];if(D.indexOf(s)<0)return;var i=a.querySelector("img");if(i){i.src="/assets/dept/"+s+".jpg";i.removeAttribute("srcset");}});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run();})();

/* Range page: pack steppers, the add-all bar's running total, colour and type tabs that switch in place (every piece is
   already on the page; quantities stay set across colours), and each shape's picture following the size under the pointer.
   Without this file the tabs are links and the quantities are typed; the form posts the same either way. */
(function () {
  'use strict';
  var form = document.querySelector('form.rorder');
  if (!form) return;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var L = function (k) { return form.getAttribute('data-l-' + k) || ''; };
  var money = function (n) { return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n); };
  var bar = form.querySelector('.rbar-t'), hint = bar ? bar.innerHTML : '';
  function clamp(v) { v = parseInt(v, 10); return isNaN(v) ? 0 : Math.max(0, Math.min(99, v)); }
  function sum() {
    var lines = 0, packs = 0, pieces = 0, total = 0;
    $$('.rrow', form).forEach(function (row) {
      var inp = row.querySelector('.rq-v'); if (!inp) return;
      var q = clamp(inp.value);
      row.classList.toggle('on', q > 0);
      if (!q) return;
      lines++; packs += q; pieces += q * (parseInt(row.getAttribute('data-pack'), 10) || 1); total += q * (parseFloat(row.getAttribute('data-price')) || 0);
    });
    if (!bar) return;
    if (!lines) { bar.innerHTML = hint; bar.classList.remove('sel'); return; }
    bar.classList.add('sel');
    bar.innerHTML = '';
    var b1 = document.createElement('b'); b1.textContent = lines + ' ' + (lines > 1 ? L('sizes') : L('size')) + ', ' + packs + ' ' + (packs > 1 ? L('packs') : L('pack'));
    var b2 = document.createElement('b'); b2.textContent = money(total);
    bar.appendChild(b1); bar.appendChild(document.createTextNode(' · ' + pieces + ' ' + (pieces === 1 ? L('piece') : L('pieces')) + ' · ')); bar.appendChild(b2);
  }
  form.addEventListener('click', function (e) {
    var b = e.target.closest('.rq-b'); if (!b) return;
    var inp = b.parentNode.querySelector('.rq-v');
    inp.value = clamp(clamp(inp.value) + parseInt(b.getAttribute('data-rq'), 10));
    sum();
  });
  form.addEventListener('input', function (e) { if (e.target.classList.contains('rq-v')) sum(); });
  form.addEventListener('reset', function () { setTimeout(sum, 0); });
  form.addEventListener('submit', function (e) { if (!$$('.rq-v', form).some(function (i) { return clamp(i.value) > 0; })) e.preventDefault(); });
  // The shape's picture follows the size under the pointer.
  $$('.rrow[data-img]', form).forEach(function (row) {
    row.addEventListener('mouseenter', function () { var im = row.closest('.rshape').querySelector('.rshape-im img'); if (im && im.src.indexOf(row.getAttribute('data-img')) < 0) im.src = row.getAttribute('data-img'); });
  });
  // Colour and type: switch what shows without a reload, and keep the address in step.
  function current() { var a = document.querySelector('[data-iw-range-colourtab][aria-current]'); return a ? a.getAttribute('data-colour') : ''; }
  function show(colour, type) {
    if (colour === null) colour = current();
    $$('[data-colour]').forEach(function (el) {
      if (el.hasAttribute('data-iw-range-colourtab')) { if (el.getAttribute('data-colour') === colour) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current'); }
      else el.hidden = colour !== '' && el.getAttribute('data-colour') !== colour;
    });
    $$('[data-iw-range-colour-link]').forEach(function (a) { if (new URL(a.href).searchParams.get('colour') === colour) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    $$('[data-iw-range-typetabs]').forEach(function (box) {
      if (box.hidden) return;
      $$('[data-iw-range-typetab]', box).forEach(function (a) { if ((a.getAttribute('data-type') || '') === type) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    });
    $$('[data-iw-range-groups]').forEach(function (gs) { if (gs.hidden) return; $$('[data-iw-range-group]', gs).forEach(function (g) { g.hidden = !!type && g.getAttribute('data-type') !== type; }); });
    var u = new URL(location.href);
    if (colour) u.searchParams.set('colour', colour); else u.searchParams.delete('colour');
    if (type) u.searchParams.set('type', type); else u.searchParams.delete('type');
    history.replaceState(null, '', u.pathname + u.search + '#shapes');
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-iw-range-colourtab],[data-iw-range-colour-link],[data-iw-range-family-link],[data-iw-range-typetab]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (a.hasAttribute('data-iw-range-typetab')) show(null, a.getAttribute('data-type') || '');
    else show(new URL(a.href).searchParams.get('colour') || '', '');
    var target = document.getElementById('shapes');
    if (!a.closest('#shapes') && target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  sum();
})();
