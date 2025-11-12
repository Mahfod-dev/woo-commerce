'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
	name: string;
	url: string;
}

interface BreadcrumbSchemaProps {
	items?: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
	const pathname = usePathname();

	useEffect(() => {
		let breadcrumbItems: BreadcrumbItem[] = [];

		if (items) {
			// Utiliser les items fournis
			breadcrumbItems = items;
		} else {
			// Générer automatiquement depuis le pathname
			const pathSegments = pathname.split('/').filter(Boolean);

			// Toujours commencer par l'accueil
			breadcrumbItems = [
				{
					name: 'Accueil',
					url: 'https://selectura.co',
				},
			];

			// Ajouter les segments du chemin
			let currentPath = '';
			pathSegments.forEach((segment, index) => {
				currentPath += `/${segment}`;

				// Mapper les segments vers des noms lisibles
				const nameMap: Record<string, string> = {
					'products': 'Produits',
					'categories': 'Catégories',
					'about': 'À propos',
					'contact': 'Contact',
					'blog': 'Blog',
					'cart': 'Panier',
					'account': 'Mon compte',
					'faq': 'FAQ',
					'testimonials': 'Témoignages',
					'best-sellers': 'Meilleures ventes',
					'new-arrivals': 'Nouveautés',
					'promotions': 'Promotions',
					'flash-sale': 'Ventes flash',
					'shipping': 'Livraison',
					'returns': 'Retours',
					'terms': 'Conditions générales',
					'privacy-policy': 'Politique de confidentialité',
					'cookie-policy': 'Politique des cookies',
				};

				const name = nameMap[segment] || segment
					.split('-')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ');

				breadcrumbItems.push({
					name,
					url: `https://selectura.co${currentPath}`,
				});
			});
		}

		const breadcrumbSchema = {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			'itemListElement': breadcrumbItems.map((item, index) => ({
				'@type': 'ListItem',
				'position': index + 1,
				'name': item.name,
				'item': item.url,
			})),
		};

		// Créer ou mettre à jour le script JSON-LD
		const scriptId = 'breadcrumb-schema';
		let script = document.getElementById(scriptId) as HTMLScriptElement | null;

		if (!script) {
			script = document.createElement('script') as HTMLScriptElement;
			script.id = scriptId;
			script.type = 'application/ld+json';
			document.head.appendChild(script);
		}

		script.textContent = JSON.stringify(breadcrumbSchema);

		// Cleanup lors du démontage du composant
		return () => {
			const existingScript = document.getElementById(scriptId);
			if (existingScript) {
				existingScript.remove();
			}
		};
	}, [pathname, items]);

	return null;
}
