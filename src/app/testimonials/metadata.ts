import { Metadata } from 'next';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Témoignages clients | Notre boutique en ligne',
  description: 'Découvrez ce que nos clients pensent de nos produits et services. Des avis authentiques sur notre boutique en ligne.',
  openGraph: {
    title: 'Témoignages clients | Notre boutique en ligne',
    description: 'Découvrez ce que nos clients pensent de nos produits et services. Des avis authentiques sur notre boutique en ligne.',
    images: [
      {
        url: '/images/testimonial-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Témoignages clients',
      },
    ],
  },
};