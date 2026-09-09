/**
 * GET /api/projects
 * Autodiscovery of Cloudflare Pages projects with Edge cache (s-maxage=3600).
 */

const ACCOUNT_ID = '9c48e0ad7e36cf970f20839768fe8a64';

const CATALOG = {
  'trujillo-ai-studio': {
    id: 'trujillo-ai-studio',
    title: 'Trujillo AI Studio',
    description: 'Asistente multimodal de ultra-alta velocidad en Groq LPU. Visión, razonamiento de código y streaming en el Edge.',
    url: 'https://ai.trujillomingorance.com',
    domain: 'ai.trujillomingorance.com',
    alt: 'groq.trujillomingorance.com',
    category: 'ai',
    keywords: 'ia ai groq qwen vision chatbot studio multimodal',
    stack: ['Groq LPU', 'Qwen Vision', 'Cloudflare Worker'],
    cta: 'Abrir IA'
  },
  'rewrite-ai': {
    id: 'rewrite-ai',
    title: 'Rewrite AI',
    description: 'Humanizador de texto 99.9% humano y corrector editorial. Proxy streaming en el Edge con calibración de estilo.',
    url: 'https://rewrite.trujillomingorance.com',
    domain: 'rewrite.trujillomingorance.com',
    alt: 'rewrite-ai-azu.pages.dev',
    category: 'ai',
    keywords: 'rewrite humanizer anti-ia turnitin groq',
    stack: ['Pages Functions', 'Groq LPU', 'Workers AI'],
    cta: 'Abrir Rewrite'
  },
  'focusguard': {
    id: 'focusguard',
    title: 'FocusGuard SaaS & AdShield',
    description: 'Filtrado DNS Zero-Trust. Bloquea anuncios, telemetría, malware y rastreadores a nivel de red.',
    url: 'https://focusguard.trujillomingorance.com',
    domain: 'focusguard.trujillomingorance.com',
    alt: 'adshield.focusguard.trujillomingorance.com',
    category: 'security',
    keywords: 'focusguard adshield dns adblock zero-trust',
    stack: ['DNS-over-HTTPS', 'Zero-Trust', 'D1 & KV'],
    cta: 'Abrir FocusGuard'
  },
  'alberto-portfolio': {
    id: 'alberto-portfolio',
    title: 'Portfolio Profesional',
    description: 'Perfil técnico de Alberto Trujillo. SysAdmin, seguridad, proyectos y contacto.',
    url: 'https://alberto.trujillomingorance.com',
    domain: 'alberto.trujillomingorance.com',
    alt: 'alberto-portfolio.pages.dev',
    category: 'engineering',
    keywords: 'portfolio alberto cv sysadmin devops',
    stack: ['Cloudflare Pages', 'Vanilla JS', 'Security Eng'],
    cta: 'Ver Portfolio'
  },
  'trujillo-guides': {
    id: 'trujillo-guides',
    title: 'Trujillo Engineering Guides',
    description: 'Runbooks de producción, arquitecturas Edge y guías de sistemas.',
    url: 'https://guides.trujillomingorance.com',
    domain: 'guides.trujillomingorance.com',
    alt: 'trujillo-guides.pages.dev',
    category: 'engineering',
    keywords: 'guias guides documentacion devops cloudflare',
    stack: ['Technical Docs', 'DevOps', 'Edge'],
    cta: 'Explorar Guías'
  },
  'rocky-setter': {
    id: 'rocky-setter',
    title: 'Sitio Web de Rocky (Setter Inglés)',
    description: 'Ficha veterinaria, galería táctil, microchip y vCard de emergencia.',
    url: 'https://rocky.trujillomingorance.com',
    domain: 'rocky.trujillomingorance.com',
    alt: 'rocky-setter.pages.dev',
    category: 'apps',
    keywords: 'rocky setter perro veterinaria microchip',
    stack: ['Pages Functions', 'vCard', 'Touch UI'],
    cta: 'Conocer a Rocky'
  },
  'atm-labs-hub': {
    id: 'atm-labs-hub',
    title: 'ATM Labs Hub (Portal Central)',
    description: 'Directorio vivo del ecosistema. Autodescubrimiento de proyectos en Cloudflare Pages.',
    url: 'https://labs.trujillomingorance.com',
    domain: 'labs.trujillomingorance.com',
    alt: 'atm-labs-hub.pages.dev',
    category: 'engineering',
    keywords: 'labs atm hub central directorio',
    stack: ['Central Hub', 'Edge Gateway', 'Pages Functions'],
    cta: 'Estás aquí',
    current: true
  },
  'domain-root': {
    id: 'domain-root',
    title: 'Apex Domain Gateway',
    description: 'Enrutador del dominio raíz y telemetría 404 para subdominios no asignados.',
    url: 'https://trujillomingorance.com',
    domain: 'trujillomingorance.com',
    alt: 'domain-root-2r5.pages.dev',
    category: 'engineering',
    keywords: 'root apex gateway dns wildcard',
    stack: ['Pages', 'DNS', 'Edge'],
    cta: 'Abrir raíz'
  },
  bitpulse: {
    id: 'bitpulse',
    title: 'BitPulse — Bitcoin Command Center',
    description: 'Telemetría de mempool, comisiones sat/vB, halving y Fear & Greed. Sin backend.',
    url: 'https://atrumin16.github.io/BitPulse/',
    domain: 'atrumin16.github.io/BitPulse',
    alt: 'GitHub Pages',
    category: 'apps',
    keywords: 'bitpulse bitcoin mempool crypto dashboard',
    stack: ['Mempool API', 'Vanilla JS', 'Zero-Backend'],
    cta: 'Abrir Dashboard'
  }
};

const HIDDEN = new Set(['neurolock', 'manual-de-bloqueo']);

function pickCustomDomain(project) {
  const domains = Array.isArray(project.domains) ? project.domains : [];
  const custom = domains.find((d) => typeof d === 'string' && d.includes('trujillomingorance.com'));
  if (custom) return custom;
  const first = domains.find((d) => typeof d === 'string');
  return first || '';
}

function mergeProject(cfProject) {
  const name = cfProject.name || '';
  if (HIDDEN.has(name)) return null;
  const known = CATALOG[name] || {};
  const domain = known.domain || pickCustomDomain(cfProject);
  const url = known.url || (domain ? 'https://' + domain : '');
  if (!url) return null;
  return {
    id: name,
    title: known.title || name,
    description: known.description || (cfProject.latest_deployment && cfProject.latest_deployment.url) || 'Proyecto en Cloudflare Pages.',
    url,
    domain: domain || name,
    alt: known.alt || (name + '.pages.dev'),
    category: known.category || 'apps',
    keywords: known.keywords || name,
    stack: known.stack || ['Cloudflare Pages'],
    cta: known.cta || 'Abrir',
    current: !!known.current,
    source: 'cloudflare'
  };
}

function fallbackCatalog() {
  return Object.values(CATALOG).map((item) => Object.assign({ source: 'fallback' }, item));
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, max-age=60',
      'Access-Control-Allow-Origin': 'https://labs.trujillomingorance.com'
    }
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url), { method: 'GET' });

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const token = env.CF_API_TOKEN || env.CLOUDFLARE_API_TOKEN || '';
  const accountId = env.CF_ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || ACCOUNT_ID;

  let projects = fallbackCatalog();
  let source = 'fallback';

  if (token) {
    try {
      const res = await fetch(
        'https://api.cloudflare.com/client/v4/accounts/' + encodeURIComponent(accountId) + '/pages/projects',
        { headers: { Authorization: 'Bearer ' + token } }
      );
      if (res.ok) {
        const data = await res.json();
        const rows = Array.isArray(data.result) ? data.result : [];
        const mapped = rows.map(mergeProject).filter(Boolean);
        const extras = [CATALOG.bitpulse, CATALOG['trujillo-ai-studio']].filter(Boolean);
        const seen = new Set(mapped.map((p) => p.id));
        extras.forEach((item) => {
          if (item && !seen.has(item.id)) mapped.push(Object.assign({ source: 'catalog' }, item));
        });
        if (mapped.length) {
          projects = mapped;
          source = 'cloudflare';
        }
      }
    } catch (err) {
      source = 'fallback';
    }
  }

  const response = jsonResponse({
    success: true,
    source,
    count: projects.length,
    projects
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://labs.trujillomingorance.com',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
  });
}
