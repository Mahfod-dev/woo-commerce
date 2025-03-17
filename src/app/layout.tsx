// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';
import { NotificationProvider } from '@/context/notificationContext';
import { AnimationProvider } from '@/components/AnimationProvider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Votre Boutique en Ligne | Shop Exclusif',
	description:
		"Découvrez notre collection unique qui redéfinit l'expérience shopping avec des produits soigneusement sélectionnés.",
	keywords: 'boutique, e-commerce, produits, shopping, en ligne',
};

// Exemple de catégories pour le header (dans une implémentation réelle, ces données viendraient d'une API)
const mockCategories = [
	{ id: 1, name: 'Électronique', slug: 'electronique' },
	{ id: 2, name: 'Mode', slug: 'mode' },
	{ id: 3, name: 'Maison', slug: 'maison' },
	{ id: 4, name: 'Sports', slug: 'sports' },
	{ id: 5, name: 'Beauté', slug: 'beaute' },
];

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='fr'>
			<head />
			<body
				className={`${geistSans.className} ${geistMono.className} antialiased`}>
				<AnimationProvider>
					<NotificationProvider>
						<CartProvider>
							<Header categories={mockCategories} />
							<main className='flex-grow min-h-screen pt-16 md:pt-20'>
								{children}
							</main>
							<Footer />
						</CartProvider>
					</NotificationProvider>
				</AnimationProvider>
			</body>
		</html>
	);
}
