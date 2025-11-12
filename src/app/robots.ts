import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/account/orders/',
        '/order-confirmation',
        '/checkout',
        '/cart',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: 'https://selectura.co/sitemap.xml',
  }
}