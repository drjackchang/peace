/* PEACE Study — routing, language, and data-driven rendering */
(function () {
  'use strict';

  var D = window.PEACE_DATA;
  var T = window.PEACE_I18N;
  var PAGES = ['about', 'framework', 'consortium', 'datahub', 'log'];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var lang = 'en';
  try { var saved = localStorage.getItem('peace-lang'); if (saved && T[saved]) lang = saved; } catch (e) {}
  var page = 'about';

  function t(key, vars) {
    var s = (T[lang] && T[lang][key] !== undefined) ? T[lang][key] : (T.en[key] !== undefined ? T.en[key] : key);
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function field(o, f) { return o[f + '_' + lang] || o[f + '_en'] || ''; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function country(code) { return (D.countries[code] && D.countries[code][lang]) || code.toUpperCase(); }
  function flag(code) { return '<span class="fi fi-' + esc(code) + '" aria-hidden="true"></span>'; }
  function fmt(n) { return Number(n).toLocaleString(lang === 'zh' ? 'zh-TW' : 'en-US'); }
  function siteFor(code) { return D.sites.filter(function (s) { return s.country === code; })[0]; }
  function chip(code) {
    return '<span class="chip">' + flag(code) + esc(country(code)) + '</span>';
  }
  function fmtDate(d) {
    var p = String(d).split('-');
    if (p.length === 1) return p[0];
    if (lang === 'zh') return p[0] + ' 年 ' + Number(p[1]) + ' 月' + (p[2] ? ' ' + Number(p[2]) + ' 日' : '');
    var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(p[1]) - 1];
    return (p[2] ? Number(p[2]) + ' ' : '') + m + ' ' + p[0];
  }

  /* ── Rendering ─────────────────────────────────── */
  function renderGroups() {
    $('#groups').innerHTML = D.groups.map(function (g) {
      return '<article class="group-card g-' + esc(g.id) + '">' +
        '<div class="g-id">' + esc(t('group')) + ' ' + esc(g.id) + '</div>' +
        '<h3>' + esc(field(g, 'name')) + '</h3>' +
        '<ul>' + g.countries.map(function (c) { return '<li>' + flag(c) + esc(country(c)) + '</li>'; }).join('') + '</ul>' +
        '</article>';
    }).join('');
  }

  function personCard(s) {
    var lines = [field(s, 'position'), field(s, 'dept'), field(s, 'inst')].filter(Boolean);
    return '<article class="person' + (s.role === 'pi' ? ' is-pi' : '') + '">' +
      '<div class="where">' + flag(s.country) + '<span>' + esc(country(s.country)) + '</span></div>' +
      '<h3>' + esc(s.name) + '</h3>' +
      '<p class="role">' + esc(t(s.role === 'pi' ? 'role_pi' : 'role_nc')) + '</p>' +
      lines.map(function (l) { return '<p class="meta">' + esc(l) + '</p>'; }).join('') +
      '</article>';
  }

  function renderPeople() {
    $('#people-pi').innerHTML = D.sites.filter(function (s) { return s.role === 'pi'; }).map(personCard).join('');
    $('#people-nc').innerHTML = D.sites.filter(function (s) { return s.role === 'nc'; }).map(personCard).join('');
    var open = [];
    D.groups.forEach(function (g) { g.countries.forEach(function (c) { if (!siteFor(c)) open.push(c); }); });
    $('#open-countries').innerHTML = open.map(chip).join('');
  }

  function renderHub() {
    var grouped = {};
    D.groups.forEach(function (g) { g.countries.forEach(function (c) { grouped[c] = true; }); });
    var siteCountries = D.sites.map(function (s) { return s.country; })
      .filter(function (c, i, a) { return a.indexOf(c) === i; });

    $('#stats').innerHTML =
      '<div class="stat"><b>' + esc(t('dh_stat_target')) + '</b><span>' + esc(t('dh_stat_target_l')) + '</span></div>' +
      '<div class="stat"><b>' + siteCountries.length + '</b><span>' + esc(t('dh_stat_sites_l')) + '</span></div>';

    var html = D.groups.map(function (g) {
      var hasN = typeof g.n === 'number';
      var pct = hasN ? Math.min(100, Math.round(g.n / g.target * 100)) : 0;
      var bar = hasN
        ? '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + g.target + '" aria-valuenow="' + g.n + '"><i style="width:' + pct + '%"></i></div>' +
          '<p class="bar-caption">' + esc(t('dh_n_of', { n: fmt(g.n), t: fmt(g.target) })) + '</p>'
        : '';
      return '<article class="hub-group g-' + esc(g.id) + '">' +
        '<div class="hub-head"><h3><small>' + esc(t('group')) + ' ' + esc(g.id) + '</small>' + esc(field(g, 'name')) + '</h3>' +
        '<span class="target">' + esc(t('dh_target', { n: g.target })) + '</span></div>' +
        bar +
        '<div class="chips">' + g.countries.map(chip).join('') + '</div></article>';
    }).join('');

    var extra = siteCountries.filter(function (c) { return !grouped[c]; });
    if (extra.length) {
      html += '<article class="hub-group no-group"><div class="hub-head"><h3>' + esc(t('dh_additional_h')) + '</h3></div>' +
        '<div class="chips">' + extra.map(chip).join('') + '</div></article>';
    }
    $('#hub').innerHTML = html;

  }

  function renderLog() {
    var items = (D.timeline || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    if (!items.length) { $('#timeline').innerHTML = '<li class="tl-empty">' + esc(t('log_empty')) + '</li>'; return; }
    $('#timeline').innerHTML = items.map(function (e) {
      var link = e.link ? ' <a href="' + esc(e.link) + '" target="_blank" rel="noopener">' + esc(t('log_link')) + ' →</a>' : '';
      return '<li><div class="tl-meta"><time datetime="' + esc(e.date) + '">' + esc(fmtDate(e.date)) + '</time>' +
        '<span class="tl-type">' + esc(t('type_' + e.type)) + '</span></div>' +
        '<p class="tl-text">' + esc(field(e, 'text')) + link + '</p></li>';
    }).join('');
  }

  function renderAll() {
    renderGroups(); renderPeople(); renderHub(); renderLog();
    $$('.js-updated').forEach(function (el) { el.textContent = fmtDate(D.updated); el.setAttribute('datetime', D.updated); });
  }

  /* ── Language ──────────────────────────────────── */
  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
    $$('[data-i18n]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n')); });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    $('#menu-btn').setAttribute('aria-label', t('menu'));
    renderAll();
    setTitle();
  }
  function setTitle() {
    var base = t('doc_title');
    var map = { framework: 'nav_framework', consortium: 'nav_consortium', datahub: 'nav_datahub', log: 'nav_log' };
    document.title = map[page] ? t(map[page]).replace(/&amp;/g, '&') + ' · ' + base.split(' | ')[0] : base;
  }
  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.dataset.lang;
      try { localStorage.setItem('peace-lang', lang); } catch (e) {}
      applyLang();
    });
  });

  /* ── Mobile menu ───────────────────────────────── */
  var menuBtn = $('#menu-btn'), nav = $('#site-nav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }
  menuBtn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!nav.classList.contains('open')); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  /* ── Routing (#about, #framework, …) ───────────── */
  function route() {
    var h = location.hash.replace('#', '');
    page = PAGES.indexOf(h) > -1 ? h : 'about';
    $$('.page').forEach(function (s) { s.hidden = s.dataset.page !== page; });
    $$('.site-nav a[data-page]').forEach(function (a) {
      if (a.dataset.page === page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    setTitle();
    window.scrollTo(0, 0);
    updateCta();
  }
  window.addEventListener('hashchange', route);

  /* ── Vignette tabs ─────────────────────────────── */
  var tabs = $$('.vig-tab');
  function selectTab(tab) {
    tabs.forEach(function (x) {
      var on = x === tab;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      var next = tabs[(i + k + tabs.length) % tabs.length];
      selectTab(next); next.focus();
    });
  });

  /* ── Mobile sticky survey bar ──────────────────── */
  var mcta = $('#mcta');
  var visibleCtas = {};
  function updateCta() {
    var aboutCtaVisible = page === 'about' && (visibleCtas['hero-cta'] || visibleCtas['about-cta']);
    var show = !aboutCtaVisible;
    mcta.classList.toggle('show', show);
    mcta.setAttribute('aria-hidden', String(!show));
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visibleCtas[en.target.id] = en.isIntersecting; });
      updateCta();
    });
    ['hero-cta', 'about-cta'].forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  applyLang();
  route();
})();
