(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function h(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null && text !== '') n.textContent = text;
    return n;
  }

  function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  var FEATURED = {
    'trujillo-ai-studio': 0,
    'rewrite-ai': 1,
    'trujillo-guides': 2,
    focusguard: 3,
    'alberto-portfolio': 4
  };

  var HIDDEN_HOSTS = {
    'trujillomingorance.com': 1,
    'labs.trujillomingorance.com': 1,
    'rocky.trujillomingorance.com': 1
  };

  var state = {
    projects: [],
    query: '',
    expanded: false
  };

  function professionalHost(value) {
    if (!value) return '';
    var host = String(value).replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
    if (!host || host.indexOf('pages.dev') !== -1) return '';
    if (host === 'trujillomingorance.com' || host.slice(-23) === '.trujillomingorance.com') return host;
    return '';
  }

  function isOwnProject(project) {
    var host = professionalHost(project && project.domain) || professionalHost(project && project.url);
    if (!host || HIDDEN_HOSTS[host]) return false;
    var id = project.id || '';
    if (id === 'domain-root' || id === 'atm-labs-hub' || id === 'rocky-setter') return false;
    return true;
  }

  function isFeatured(project) {
    if (project.featured) return true;
    return Object.prototype.hasOwnProperty.call(FEATURED, project.id);
  }

  function applyTheme(theme) {
    var next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('trujillo_theme', next); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#ffffff' : '#080c14');
    var btn = $('theme-btn');
    if (btn) {
      btn.setAttribute('aria-label', next === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
      btn.title = next === 'light' ? 'Modo oscuro' : 'Modo claro';
    }
  }

  function renderSkeletons(grid, count) {
    clearNode(grid);
    for (var i = 0; i < count; i++) {
      var card = h('article', 'app-card skeleton-card');
      card.appendChild(h('div', 'skeleton-line skeleton-wide'));
      card.appendChild(h('div', 'skeleton-line'));
      card.appendChild(h('div', 'skeleton-line skeleton-short'));
      grid.appendChild(card);
    }
  }

  function renderCard(project) {
    var card = h('article', 'app-card');
    card.dataset.category = project.category || 'apps';
    var body = h('div', 'card-body');
    body.appendChild(h('p', 'card-kicker', project.domain || ''));
    body.appendChild(h('h2', 'card-title', project.title || ''));
    body.appendChild(h('p', 'card-description', project.description || ''));
    var stack = Array.isArray(project.stack) ? project.stack : [];
    if (stack.length) {
      var list = h('ul', 'tech-stack');
      stack.forEach(function (item) {
        list.appendChild(h('li', 'tech-pill', item));
      });
      body.appendChild(list);
    }
    card.appendChild(body);
    var footer = h('div', 'card-footer');
    var launch = h('a', 'btn-launch');
    launch.href = project.url || '#';
    launch.target = '_blank';
    launch.rel = 'noopener';
    launch.appendChild(h('span', null, project.cta || 'Abrir'));
    footer.appendChild(launch);
    card.appendChild(footer);
    return card;
  }

  function matches(project) {
    var q = state.query;
    if (!q) return true;
    var blob = [project.title, project.description, project.keywords, project.domain].join(' ').toLowerCase();
    return blob.indexOf(q) !== -1;
  }

  function renderGrid() {
    var grid = $('projectsGrid');
    var moreGrid = $('moreGrid');
    var moreWrap = $('moreWrap');
    var moreBtn = $('moreBtn');
    var noResults = $('noResults');
    var queryEl = $('noResultsQuery');
    if (!grid) return;

    var visible = state.projects.filter(matches);
    var featured = visible.filter(isFeatured);
    var rest = visible.filter(function (p) { return !isFeatured(p); });
    var searching = !!state.query;

    clearNode(grid);
    (searching ? visible : featured).forEach(function (p) { grid.appendChild(renderCard(p)); });

    if (moreGrid) clearNode(moreGrid);
    var showRest = !searching && rest.length > 0;
    if (moreWrap) moreWrap.classList.toggle('hidden', !showRest);
    if (moreGrid) moreGrid.classList.toggle('hidden', !showRest || !state.expanded);
    if (showRest && state.expanded && moreGrid) {
      rest.forEach(function (p) { moreGrid.appendChild(renderCard(p)); });
    }
    if (moreBtn) moreBtn.textContent = state.expanded ? 'Mostrar menos' : ('Mostrar más' + (rest.length ? ' (' + rest.length + ')' : ''));

    if (noResults) noResults.classList.toggle('hidden', visible.length > 0);
    if (queryEl) queryEl.textContent = state.query;
  }

  async function loadProjects() {
    var grid = $('projectsGrid');
    if (grid) renderSkeletons(grid, 5);
    try {
      var res = await fetch('/api/projects?v=hub6', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      state.projects = (Array.isArray(data.projects) ? data.projects : []).filter(isOwnProject);
    } catch (err) {
      state.projects = [];
    }
    renderGrid();
  }

  function init() {
    try {
      applyTheme(localStorage.getItem('trujillo_theme') || 'dark');
    } catch (e) {
      applyTheme('dark');
    }

    var themeBtn = $('theme-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
      });
    }

    var searchInput = $('projectSearch');
    var clearBtn = $('clearSearch');
    var moreBtn = $('moreBtn');
    var btnReset = $('btnResetFilters');

    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInput) { searchInput.focus(); searchInput.select(); }
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.query = (searchInput.value || '').trim().toLowerCase();
        if (clearBtn) clearBtn.classList.toggle('hidden', !state.query);
        renderGrid();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        state.query = '';
        clearBtn.classList.add('hidden');
        if (searchInput) searchInput.focus();
        renderGrid();
      });
    }
    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        state.expanded = !state.expanded;
        renderGrid();
      });
    }
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        state.query = '';
        state.expanded = false;
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');
        renderGrid();
      });
    }

    loadProjects();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
