(function () {
  'use strict';

  function applyTheme(theme) {
    var next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('trujillo_theme', next); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#ffffff' : '#080c14');
    var btn = document.getElementById('theme-btn');
    if (btn) {
      btn.setAttribute('aria-label', next === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
      btn.title = next === 'light' ? 'Modo oscuro' : 'Modo claro';
    }
  }

  try {
    applyTheme(localStorage.getItem('trujillo_theme') || 'dark');
  } catch (e) {
    applyTheme('dark');
  }

  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  try {
    var host = window.location.hostname || 'trujillomingorance.com';
    var path = window.location.pathname || '/';
    var teleHost = document.getElementById('teleHost');
    var hostDisplay = document.getElementById('hostDisplay');
    var telePath = document.getElementById('telePath');
    if (teleHost) teleHost.textContent = host;
    if (hostDisplay) hostDisplay.textContent = host;
    if (telePath) telePath.textContent = path;

    var known = ['labs', 'ai', 'groq', 'focusguard', 'guides', 'guias', 'alberto', 'rewrite', 'www'];
    var isKnown = known.some(function (s) { return host.indexOf(s + '.') === 0; });
    var isSubdomain = host.indexOf('.trujillomingorance.com') !== -1 && !isKnown;

    if (isSubdomain) {
      var pageTitle = document.getElementById('pageTitle');
      var errorTitle = document.getElementById('errorTitle');
      var badgeText = document.getElementById('badgeText');
      var teleRouting = document.getElementById('teleRouting');
      if (pageTitle) pageTitle.textContent = 'Subdominio no asignado | ATM Labs';
      if (errorTitle) errorTitle.textContent = 'Subdominio no asignado en el perímetro';
      if (badgeText) badgeText.textContent = 'DNS WILDCARD · SUBDOMINIO NO ASIGNADO';
      if (teleRouting) teleRouting.textContent = 'DNS comodín activo · sin servicio mapeado';
    } else {
      var desc = document.getElementById('errorDesc');
      if (desc) {
        while (desc.firstChild) desc.removeChild(desc.firstChild);
        desc.appendChild(document.createTextNode('La ruta solicitada '));
        var codePath = document.createElement('code');
        codePath.textContent = path;
        desc.appendChild(codePath);
        desc.appendChild(document.createTextNode(' no existe en el servidor '));
        var codeHost = document.createElement('code');
        codeHost.textContent = host;
        desc.appendChild(codeHost);
        desc.appendChild(document.createTextNode('.'));
      }
      var routing = document.getElementById('teleRouting');
      if (routing) routing.textContent = 'Ruta no encontrada en el origen';
    }
  } catch (e) {}

  var copyBtn = document.getElementById('copyBtnText');
  var copyWrap = document.getElementById('btnCopyDiag');
  function copyDiagnostics() {
    var hostNow = (document.getElementById('teleHost') && document.getElementById('teleHost').textContent) || window.location.hostname;
    var pathNow = (document.getElementById('telePath') && document.getElementById('telePath').textContent) || window.location.pathname;
    var text = 'Diagnóstico perimetral ATM Labs:\nHost: ' + hostNow + '\nRuta: ' + pathNow + '\nEstado: HTTP 404\nEdge: Cloudflare Anycast\nFecha: ' + new Date().toISOString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (copyBtn) {
          copyBtn.textContent = 'Copiado';
          setTimeout(function () { copyBtn.textContent = 'Copiar diagnóstico'; }, 2500);
        }
      }).catch(function () {});
    }
  }
  if (copyWrap) copyWrap.addEventListener('click', copyDiagnostics);

  var backBtn = document.getElementById('btnBack');
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      if (window.history.length > 1) window.history.back();
      else window.location.href = 'https://labs.trujillomingorance.com';
    });
  }
})();
