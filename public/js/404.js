(function () {
  'use strict';
  try {
    var host = window.location.hostname || 'trujillomingorance.com';
    var path = window.location.pathname || '/';
    var teleHost = document.getElementById('teleHost');
    var hostDisplay = document.getElementById('hostDisplay');
    var telePath = document.getElementById('telePath');
    if (teleHost) teleHost.textContent = host;
    if (hostDisplay) hostDisplay.textContent = host;
    if (telePath) telePath.textContent = path;

    var known = ['labs', 'ai', 'groq', 'focusguard', 'guides', 'guias', 'alberto', 'rocky', 'rewrite', 'www'];
    var isKnown = known.some(function (s) { return host.indexOf(s + '.') === 0; });
    var isSubdomain = host.indexOf('.trujillomingorance.com') !== -1 && !isKnown;

    if (isSubdomain) {
      var pageTitle = document.getElementById('pageTitle');
      var errorTitle = document.getElementById('errorTitle');
      var badgeText = document.getElementById('badgeText');
      var teleRouting = document.getElementById('teleRouting');
      if (pageTitle) pageTitle.textContent = 'Subdominio No Asignado | ATM Software Labs';
      if (errorTitle) errorTitle.textContent = 'Subdominio no asignado en el perímetro';
      if (badgeText) badgeText.textContent = 'DNS WILDCARD • SUBDOMINIO NO ASIGNADO';
      if (teleRouting) teleRouting.textContent = 'DNS Comodín Activo • Sin servicio mapeado';
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
  var copyWrap = copyBtn ? copyBtn.closest('button') : document.getElementById('copyDiagnostics');
  function copyDiagnostics() {
    var host = (document.getElementById('teleHost') && document.getElementById('teleHost').textContent) || window.location.hostname;
    var path = (document.getElementById('telePath') && document.getElementById('telePath').textContent) || window.location.pathname;
    var text = 'Diagnóstico Perimetral ATM Software Labs:\nHost: ' + host + '\nRuta: ' + path + '\nEstado: HTTP 404\nEdge: Cloudflare Anycast\nFecha: ' + new Date().toISOString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (copyBtn) {
          copyBtn.textContent = 'Copiado al portapapeles';
          setTimeout(function () { copyBtn.textContent = 'Copiar diagnóstico'; }, 2500);
        }
      }).catch(function () {});
    }
  }
  if (copyWrap) copyWrap.addEventListener('click', copyDiagnostics);
  else if (copyBtn) copyBtn.addEventListener('click', copyDiagnostics);
})();
