import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const routesFilePath = path.join(rootDir, 'src', 'app', 'routes.tsx');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const robotsPath = path.join(rootDir, 'public', 'robots.txt');

const NOINDEX_EXACT = new Set([
  '/login',
  '/signup',
  '/dashboard',
  '/upload',
  '/payment',
  '/success',
  '/failure',
  '/profile',
]);

const NOINDEX_PREFIXES = ['/process/', '/result/', '/share/'];

const ROUTE_META = {
  '/': { changefreq: 'weekly', priority: '1.0' },
  '/pricing': { changefreq: 'weekly', priority: '0.9' },
  '/about': { changefreq: 'monthly', priority: '0.7' },
  '/contact': { changefreq: 'monthly', priority: '0.7' },
  '/privacy': { changefreq: 'monthly', priority: '0.5' },
};

function normalizeRoutePath(routePath) {
  if (!routePath || routePath === '/') return '/';
  return routePath.startsWith('/') ? routePath : `/${routePath}`;
}

function shouldIndexRoute(routePath) {
  if (!routePath || routePath === '*' || routePath.includes('*') || routePath.includes(':')) return false;
  if (NOINDEX_EXACT.has(routePath)) return false;
  if (NOINDEX_PREFIXES.some((prefix) => routePath.startsWith(prefix))) return false;
  return true;
}

function toXmlSafe(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemapXml(baseUrl, routes) {
  const lastmod = new Date().toISOString().slice(0, 10);

  const urlEntries = routes.map((routePath) => {
    const meta = ROUTE_META[routePath] || { changefreq: 'monthly', priority: '0.6' };

    return [
      '  <url>',
      `    <loc>${toXmlSafe(`${baseUrl}${routePath}`)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${meta.changefreq}</changefreq>`,
      `    <priority>${meta.priority}</priority>`,
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlEntries,
    '</urlset>',
    '',
  ].join('\n');
}

function buildRobotsTxt(baseUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    'Disallow: /dashboard',
    'Disallow: /upload',
    'Disallow: /process/',
    'Disallow: /result/',
    'Disallow: /payment',
    'Disallow: /success',
    'Disallow: /failure',
    'Disallow: /profile',
    'Disallow: /login',
    'Disallow: /signup',
    'Disallow: /share/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n');
}

function orderRoutes(routes) {
  const preferredOrder = ['/', '/pricing', '/about', '/contact', '/privacy'];
  const priorityIndex = new Map(preferredOrder.map((routePath, index) => [routePath, index]));

  return routes.sort((a, b) => {
    const ai = priorityIndex.has(a) ? priorityIndex.get(a) : Number.MAX_SAFE_INTEGER;
    const bi = priorityIndex.has(b) ? priorityIndex.get(b) : Number.MAX_SAFE_INTEGER;

    if (ai !== bi) return ai - bi;
    return a.localeCompare(b);
  });
}

async function main() {
  const baseUrl = (process.env.VITE_SITE_URL || 'https://contractcheck-ai.vercel.app').replace(/\/$/, '');
  const source = await readFile(routesFilePath, 'utf8');

  const discoveredRoutes = new Set();

  if (/\{\s*index:\s*true\s*,/m.test(source)) {
    discoveredRoutes.add('/');
  }

  const pathRegex = /path:\s*'([^']+)'/g;
  for (const match of source.matchAll(pathRegex)) {
    discoveredRoutes.add(normalizeRoutePath(match[1]));
  }

  const indexableRoutes = orderRoutes(
    [...discoveredRoutes]
      .map(normalizeRoutePath)
      .filter(shouldIndexRoute),
  );

  const sitemapXml = buildSitemapXml(baseUrl, indexableRoutes);
  const robotsTxt = buildRobotsTxt(baseUrl);

  await writeFile(sitemapPath, sitemapXml, 'utf8');
  await writeFile(robotsPath, robotsTxt, 'utf8');

  console.log(`Generated sitemap with ${indexableRoutes.length} route(s).`);
  console.log(`Wrote ${path.relative(rootDir, sitemapPath)} and ${path.relative(rootDir, robotsPath)}.`);
}

main().catch((error) => {
  console.error('Failed to generate SEO files:', error);
  process.exitCode = 1;
});
