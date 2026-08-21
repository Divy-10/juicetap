import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from '../data/constants';

export default function SEO({
  title,
  description,
  path = '/',
  ogImage = '/assets/hero-machine.png',
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Fresh Juice. One Tap Away.`;
  const canonicalUrl = `${SITE_URL}${path}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name, content, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) setMeta('description', description);
    setMeta('og:title', fullTitle, 'property');
    if (description) setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    if (description) setMeta('twitter:description', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [fullTitle, description, canonicalUrl, ogImage]);

  return null;
}
