import { MetadataRoute } from 'next';
import { languages } from '@/lib/translations';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.foxywall.xyz';

  const localeRoutes = languages.flatMap(({ code }) => [`/${code}`, `/${code}/blog`, `/${code}/refer`]);
  const routes = [...localeRoutes, '/privacy-policy', '/terms-of-service', '/refund-policy'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : 0.7,
  }));
}
