import { useEffect } from 'react';
import { SITE_NAME, SITE_URL, COMPANY, CONTACT, SOCIAL } from '../data/constants';

export default function SEO({
  title,
  fullTitleOverride,
  description,
  path = '/',
  ogImage = '/assets/hero-machine.png',
  noindex = false,
  schemaData = null,
}) {
  const pageTitle = fullTitleOverride
    ? fullTitleOverride
    : title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} – Fresh Valencia Orange Juice Machines`;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${cleanPath}`;

  const resolvedOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  useEffect(() => {
    // 1. Update Title
    document.title = pageTitle;

    // Helper to insert/update meta elements
    const setMeta = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMeta('name', 'description', description);
    setMeta(
      'name',
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 3. Open Graph Tags
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:locale', 'en_IN');
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', resolvedOgImage);

    // 4. Twitter / X Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', resolvedOgImage);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Structured Data Injection
    const scriptId = 'juicetap-jsonld';
    let scriptEl = document.getElementById(scriptId);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.setAttribute('id', scriptId);
      scriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEl);
    }

    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: COMPANY.name,
        alternateName: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.jpg`,
        description:
          'JuiceTap is India’s premier smart automated orange juice vending technology company serving 100% freshly squeezed Valencia orange juice.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: COMPANY.address,
          addressLocality: 'Surat',
          addressRegion: 'Gujarat',
          postalCode: '394510',
          addressCountry: 'IN',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: `+91-${CONTACT.phoneRaw}`,
          contactType: 'customer service',
          availableLanguage: ['English', 'Hindi', 'Gujarati'],
        },
        sameAs: [SOCIAL.instagram, SOCIAL.linkedin, SOCIAL.youtube, SOCIAL.googleBusiness].filter(
          Boolean
        ),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
    ];

    if (!noindex) {
      const breadcrumbItems = [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
      ];

      if (cleanPath !== '/') {
        const pathName = title || cleanPath.replace('/', '').replace(/-/g, ' ');
        const formattedName = pathName.charAt(0).toUpperCase() + pathName.slice(1);
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: formattedName,
          item: canonicalUrl,
        });
      }

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      });
    }

    if (schemaData) {
      if (Array.isArray(schemaData)) {
        schemas.push(...schemaData);
      } else {
        schemas.push(schemaData);
      }
    }

    scriptEl.textContent = JSON.stringify(schemas, null, 2);
  }, [pageTitle, description, canonicalUrl, resolvedOgImage, noindex, cleanPath, title, schemaData]);

  return null;
}
