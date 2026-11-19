import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getServiceBySlug } from '../data/servicesData';

const DEFAULT_ORIGIN = 'https://triaurexsite.vercel.app';

const staticSeoConfigs = {
  '/': {
    title: 'TRIAUREX | Digital Product Studio | Web, Mobile & UI/UX Design',
    description: 'TRIAUREX is an elite digital product studio crafting high-performance web applications, intuitive UI/UX design systems, and scalable mobile apps for global teams.',
    keywords: 'TRIAUREX, digital product studio, web development agency, UI UX design agency, React developers, mobile app development, Flutter apps, Python Flask backend, design systems',
    image: '/hero1.jpg',
    imageAlt: 'TRIAUREX - Creative Thinking. Digital Building.'
  },
  '/projects': {
    title: 'Our Projects & Client Work | TRIAUREX Portfolio',
    description: 'Explore TRIAUREX\'s featured client projects across web development, mobile applications, healthcare tech, tourism platforms, and e-commerce UX design.',
    keywords: 'TRIAUREX projects, web app portfolio, mobile app showcase, PRANARA travel website, VisitMax healthcare app, YRC Xerox ecommerce, UI UX case studies',
    image: '/images/casestudy/paranara.png',
    imageAlt: 'TRIAUREX Client Projects Showcase'
  },
  '/case-studies': {
    title: 'Technical Case Studies & Data Analytics | TRIAUREX',
    description: 'Deep-dive case studies into Power BI sales analytics, Flutter fintech apps, election data analysis, and scalable software architectures built by TRIAUREX.',
    keywords: 'Power BI case studies, data analytics dashboard, Flutter InvestPro app, SalaryFlow personal finance, HR analytics dashboard, business intelligence portfolio',
    image: '/images/project/Ecom.png',
    imageAlt: 'TRIAUREX Analytics & Technical Case Studies'
  }
};

function setOrUpdateMeta(selector, attributeName, attributeValue, content) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setOrUpdateCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const origin =
      typeof window !== 'undefined' &&
      window.location.origin &&
      !window.location.origin.includes('localhost') &&
      !window.location.origin.includes('127.0.0.1')
        ? window.location.origin
        : (import.meta.env.VITE_SITE_URL || DEFAULT_ORIGIN);

    let config = staticSeoConfigs[pathname];

    // Check if it's a dynamic service page
    if (!config && pathname.startsWith('/services/')) {
      const slug = pathname.replace('/services/', '').split('/')[0];
      const service = getServiceBySlug(slug);
      if (service) {
        config = {
          title: service.seoTitle,
          description: service.seoDescription,
          keywords: `${service.title}, ${service.tech?.join(', ')}, TRIAUREX services`,
          image: '/hero1.jpg',
          imageAlt: `${service.title} - TRIAUREX`
        };
      }
    }

    if (!config) {
      config = staticSeoConfigs['/'];
    }

    const canonicalUrl = `${origin}${pathname === '/' ? '/' : pathname}`;
    const imageUrl = config.image.startsWith('http') ? config.image : `${origin}${config.image}`;

    // 1. Title
    document.title = config.title;

    // 2. Standard Meta Tags
    setOrUpdateMeta('meta[name="title"]', 'name', 'title', config.title);
    setOrUpdateMeta('meta[name="description"]', 'name', 'description', config.description);
    setOrUpdateMeta('meta[name="keywords"]', 'name', 'keywords', config.keywords);
    setOrUpdateMeta('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Canonical Link
    setOrUpdateCanonical(canonicalUrl);

    // 4. Open Graph (Facebook, LinkedIn, WhatsApp)
    setOrUpdateMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setOrUpdateMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'TRIAUREX');
    setOrUpdateMeta('meta[property="og:title"]', 'property', 'og:title', config.title);
    setOrUpdateMeta('meta[property="og:description"]', 'property', 'og:description', config.description);
    setOrUpdateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setOrUpdateMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    setOrUpdateMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', config.imageAlt || config.title);

    // 5. Twitter / X Card
    setOrUpdateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setOrUpdateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', config.title);
    setOrUpdateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', config.description);
    setOrUpdateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    setOrUpdateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);
  }, [pathname]);

  return null;
}
