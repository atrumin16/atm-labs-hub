(function () {
  'use strict';

  function $(id) {
    return document.getElementById(id);
  }

  function h(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null && text !== '') n.textContent = text;
    return n;
  }

  function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  var state = {
    projects: [],
    filter: 'all',
    query: ''
  };

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

  function iconFor(category) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '28');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (category === 'ai') path.setAttribute('d', 'M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1v1a4 4 0 0 1-4 4h0a4 4 0 0 1-4-4v-1H7a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4Z');
    else if (category === 'security') path.setAttribute('d', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z');
    else if (category === 'engineering') path.setAttribute('d', 'M16 18l6-6-6-6M8 6l-6 6 6 6');
    else path.setAttribute('d', 'M12 2l10 5-10 5L2 7l10-5z');
    svg.appendChild(path);
    return svg;
  }

  function renderCard(project) {
    var card = h('article', 'app-card' + (project.current ? ' current-hub' : ''));
    card.dataset.category = project.category || 'apps';
    card.dataset.keywords = project.keywords || '';

    var header = h('div', 'card-header');
    var iconWrap = h('div', 'app-icon ' + ((project.category || 'apps') + '-icon'));
    iconWrap.appendChild(iconFor(project.category));
    header.appendChild(iconWrap);
    var badges = h('div', 'card-badges');
    badges.appendChild(h('span', 'subdomain-tag', project.domain || ''));
    badges.appendChild(h('span', project.current ? 'status-tag core' : 'status-tag active', project.current ? 'Portal Principal' : 'Online'));
    header.appendChild(badges);
    card.appendChild(header);

    var body = h('div', 'card-body');
    body.appendChild(h('h2', 'card-title', project.title || ''));
    body.appendChild(h('p', 'card-description', project.description || ''));
    var stack = h('div', 'tech-stack');
    (project.stack || []).forEach(function (item) {
      stack.appendChild(h('span', 'tech-pill', item));
    });
    body.appendChild(stack);
    card.appendChild(body);

    var footer = h('div', 'card-footer');
    footer.appendChild(h('span', 'subdomain-alt', project.alt || ''));
    var launch = h('a', 'btn-launch' + (project.current ? ' secondary' : ''));
    launch.href = project.current ? '#top' : (project.url || '#');
    if (!project.current) {
      launch.target = '_blank';
      launch.rel = 'noopener';
    }
    launch.appendChild(h('span', null, project.cta || 'Abrir'));
    footer.appendChild(launch);
    card.appendChild(footer);
    return card;
  }

  function matches(project) {
    var q = state.query;
    var catOk = state.filter === 'all' || project.category === state.filter;
    if (!catOk) return false;
    if (!q) return true;
    var blob = [project.title, project.description, project.keywords, project.domain, project.alt].join(' ').toLowerCase();
    return blob.indexOf(q) !== -1;
  }

  function renderGrid() {
    var grid = $('projectsGrid');
    var noResults = $('noResults');
    var queryEl = $('noResultsQuery');
    if (!grid) return;
    clearNode(grid);
    var visible = state.projects.filter(matches);
    visible.forEach(function (p) { grid.appendChild(renderCard(p)); });
    if (noResults) noResults.classList.toggle('hidden', visible.length > 0);
    if (queryEl) queryEl.textContent = state.query || state.filter;
    var countEl = $('chip-count-all');
    if (countEl) countEl.textContent = String(state.projects.length);
    var metric = $('metric-count');
    if (metric) metric.textContent = String(state.projects.length);
  }

  async function loadProjects() {
    var grid = $('projectsGrid');
    if (grid) renderSkeletons(grid, 6);
    try {
      var res = await fetch('/api/projects', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      state.projects = Array.isArray(data.projects) ? data.projects : [];
    } catch (err) {
      state.projects = [];
    }
    renderGrid();
  }

  function init() {
    var searchInput = $('projectSearch');
    var clearBtn = $('clearSearch');
    var chips = document.querySelectorAll('.filter-chip');
    var btnReset = $('btnResetFilters');

    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInput) { searchInput.focus(); searchInput.select(); }
      } else if (e.key === '/' && document.activeElement !== searchInput) {
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
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        state.filter = chip.dataset.filter || 'all';
        renderGrid();
      });
    });
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        state.query = '';
        state.filter = 'all';
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');
        chips.forEach(function (c) { c.classList.toggle('active', c.dataset.filter === 'all'); });
        renderGrid();
      });
    }

    loadProjects();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
