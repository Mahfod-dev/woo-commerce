// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartContext from '@/components/CartContext';

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
				<CartContext>
					<Header />
					<main className='flex-grow pt-16 md:pt-20'>{children}</main>
					<Footer />
				</CartContext>
			</body>
		</html>
	);
}
