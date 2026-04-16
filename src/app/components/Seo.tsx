import React from 'react';

export interface SeoProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_KEYWORDS = 'contract compliance checker, indian law compliance, legal ai india, contract risk analysis';
const DEFAULT_IMAGE = '/favicon.png';
const SITE_NAME = 'ContractCheck AI';

function normalizePath(path: string): string {
  if (!path) return '/';
  if (path.startsWith('/')) return path;
  return `/${path}`;
}

function upsertMetaByName(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

function upsertStructuredData(data?: Record<string, unknown> | Array<Record<string, unknown>>) {
  const existing = document.querySelector('script[data-seo-structured="route"]') as HTMLScriptElement | null;

  if (!data) {
    if (existing) existing.remove();
    return;
  }

  const normalized = Array.isArray(data) ? data : [data];
  const payload = normalized.length === 1 ? normalized[0] : normalized;

  const script = existing ?? document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.setAttribute('data-seo-structured', 'route');
  script.textContent = JSON.stringify(payload);

  if (!existing) {
    document.head.appendChild(script);
  }
}

export function Seo({
  title,
  description,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath = '/',
  type = 'website',
  image = DEFAULT_IMAGE,
  noIndex = false,
  structuredData,
}: SeoProps) {
  React.useEffect(() => {
    const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
    const safePath = normalizePath(canonicalPath);
    const canonicalUrl = `${siteUrl}${safePath}`;
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${normalizePath(image)}`;
    const robots = noIndex ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large';

    document.title = title;

    upsertMetaByName('description', description);
    upsertMetaByName('keywords', keywords);
    upsertMetaByName('robots', robots);

    upsertMetaByProperty('og:type', type);
    upsertMetaByProperty('og:site_name', SITE_NAME);
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', canonicalUrl);
    upsertMetaByProperty('og:image', imageUrl);

    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', imageUrl);

    upsertCanonical(canonicalUrl);
    upsertStructuredData(structuredData);
  }, [title, description, keywords, canonicalPath, type, image, noIndex, structuredData]);

  return null;
}
