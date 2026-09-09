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
    alt: '',
    featured: true,
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
    alt: '',
    featured: true,
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
    alt: '',
    featured: true,
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
    alt: '',
    featured: true,
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
    alt: '',
    featured: true,
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
    alt: '',
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
    alt: 'trujillomingorance.com',
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
    alt: '',
    category: 'engineering',
    keywords: 'root apex gateway dns wildcard',
    stack: ['Pages', 'DNS', 'Edge'],
    cta: 'Abrir raíz'
  },
};

const HIDDEN = new Set(['neurolock', 'manual-de-bloqueo', 'domain-root', 'atm-labs-hub']);
const FEATURED_ORDER = [
  'trujillo-ai-studio',
  'rewrite-ai',
  'trujillo-guides',
  'focusguard',
  'alberto-portfolio'
];

function ownHost(value) {
  if (!value) return '';
  const host = String(value).replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
  if (!host || host.includes('pages.dev') || /\.dev$/i.test(host)) return '';
  if (host === 'trujillomingorance.com' || host.endsWith('.trujillomingorance.com')) return host;
  return '';
}

function pickCustomDomain(project) {
  const domains = Array.isArray(project.domains) ? project.domains : [];
  for (const d of domains) {
    const host = ownHost(d);
    if (host) return host;
  }
  return '';
}

function polish(item) {
  if (!item) return null;
  const domain = ownHost(item.domain || item.url);
  if (!domain) return null;
  if (domain === 'trujillomingorance.com' || domain === 'labs.trujillomingorance.com') return null;
  const featured = FEATURED_ORDER.indexOf(item.id) !== -1 || !!item.featured;
  return Object.assign({}, item, {
    domain,
    url: item.url && ownHost(item.url) ? item.url : ('https://' + domain),
    alt: '',
    featured: featured,
    rank: featured ? FEATURED_ORDER.indexOf(item.id) : 100
  });
}

function mergeProject(cfProject) {
  const name = cfProject.name || '';
  if (HIDDEN.has(name)) return null;
  const known = CATALOG[name] || {};
  const domain = ownHost(known.domain) || pickCustomDomain(cfProject);
  if (!domain) return null;
  return polish({
    id: name,
    title: known.title || name,
    description: known.description || 'Servicio del ecosistema trujillomingorance.com.',
    url: known.url || ('https://' + domain),
    domain,
    alt: '',
    featured: FEATURED_ORDER.indexOf(name) !== -1 || !!known.featured,
    category: known.category || 'apps',
    keywords: known.keywords || name,
    stack: known.stack || ['Cloudflare Pages'],
    cta: known.cta || 'Abrir',
    current: !!known.current,
    source: 'cloudflare'
  });
}

function fallbackCatalog() {
  return Object.values(CATALOG).map(polish).filter(Boolean).map(function (item) {
    return Object.assign({ source: 'fallback' }, item);
  }).sort(function (a, b) { return (a.rank || 100) - (b.rank || 100); });
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
  const cacheKey = new Request(new URL('/api/projects?v=featured-2', request.url), { method: 'GET' });

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
        const extras = [CATALOG['trujillo-ai-studio']].map(polish).filter(Boolean);
        const seen = new Set(mapped.map((p) => p.id));
        extras.forEach((item) => {
          if (item && !seen.has(item.id) && !seen.has(item.domain)) {
            mapped.push(Object.assign({ source: 'catalog' }, item));
            seen.add(item.id);
          }
        });
        if (mapped.length) {
          projects = mapped.sort(function (a, b) { return (a.rank || 100) - (b.rank || 100); });
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
