import { Metadata } from 'next';
import TestimonialsPageClient from '@/components/TestimonialsPageClient';
import '../styles/testimonials.css';

export const metadata: Metadata = {
	title: 'Témoignages clients | Notre boutique en ligne',
	description: 'Découvrez ce que nos clients pensent de nos produits et services. Des avis authentiques sur notre boutique en ligne de qualité.',
	keywords: ['témoignages', 'avis clients', 'satisfaction client', 'expérience client', 'évaluations'],
	openGraph: {
		title: 'Témoignages clients | Notre boutique en ligne',
		description: 'Découvrez ce que nos clients pensent de nos produits et services. Des avis authentiques sur notre boutique en ligne.',
		type: 'website',
		images: [
			{
				url: '/images/testimonial-1.jpg',
				width: 1200,
				height: 630,
				alt: 'Témoignages clients satisfaits',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Témoignages clients | Notre boutique en ligne',
		description: 'Découvrez les avis authentiques de nos clients satisfaits.',
		images: ['/images/testimonial-1.jpg'],
	},
};

export default function TestimonialsPage() {
	return <TestimonialsPageClient />;
}