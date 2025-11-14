// Composant pour afficher les badges stratégiques sur les produits
import React from 'react';

export type BadgeType =
	| 'best-seller'      // Le plus vendu
	| 'trending'         // Tendance
	| 'team-favorite'    // Coup de cœur équipe
	| 'expert-choice'    // Choix de l'expert
	| 'our-selection'    // Notre sélection
	| 'eco-friendly'     // Éco-responsable
	| 'premium-quality'  // Qualité premium
	| 'best-value'       // Meilleur rapport qualité/prix
	| 'limited-stock'    // Stock limité
	| 'last-pieces'      // Dernières pièces
	| 'limited-edition'  // Édition limitée
	| 'new'              // Nouveau
	| 'sale'             // Promotion
	| 'made-in-usa'      // Fabriqué aux USA
	| 'made-in-eu'       // Fabriqué en UE
	| 'made-in-france'   // Fabriqué en France
	| 'made-in-germany'  // Fabriqué en Allemagne
	| 'made-in-italy';   // Fabriqué en Italie

interface BadgeConfig {
	label: string;
	icon?: string;
	color: string;
	bgColor: string;
	borderColor?: string;
}

const BADGE_CONFIGS: Record<BadgeType, BadgeConfig> = {
	'best-seller': {
		label: 'Meilleure vente',
		icon: '🔥',
		color: 'text-orange-900',
		bgColor: 'bg-gradient-to-r from-orange-400 to-orange-500',
	},
	'trending': {
		label: 'Tendance',
		icon: '📈',
		color: 'text-pink-900',
		bgColor: 'bg-gradient-to-r from-pink-400 to-pink-500',
	},
	'team-favorite': {
		label: 'Coup de cœur',
		icon: '❤️',
		color: 'text-red-900',
		bgColor: 'bg-gradient-to-r from-red-400 to-red-500',
	},
	'expert-choice': {
		label: 'Choix expert',
		icon: '⭐',
		color: 'text-yellow-900',
		bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
	},
	'our-selection': {
		label: 'Notre sélection',
		icon: '✨',
		color: 'text-indigo-900',
		bgColor: 'bg-gradient-to-r from-indigo-400 to-indigo-500',
	},
	'eco-friendly': {
		label: 'Éco-responsable',
		icon: '🌱',
		color: 'text-green-900',
		bgColor: 'bg-gradient-to-r from-green-400 to-green-500',
	},
	'premium-quality': {
		label: 'Qualité premium',
		icon: '💎',
		color: 'text-purple-900',
		bgColor: 'bg-gradient-to-r from-purple-400 to-purple-500',
	},
	'best-value': {
		label: 'Meilleur prix',
		icon: '💰',
		color: 'text-emerald-900',
		bgColor: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
	},
	'limited-stock': {
		label: 'Stock limité',
		icon: '⚡',
		color: 'text-amber-900',
		bgColor: 'bg-gradient-to-r from-amber-400 to-amber-500',
	},
	'last-pieces': {
		label: 'Dernières pièces',
		icon: '⏰',
		color: 'text-rose-900',
		bgColor: 'bg-gradient-to-r from-rose-400 to-rose-500',
	},
	'limited-edition': {
		label: 'Édition limitée',
		icon: '🎯',
		color: 'text-violet-900',
		bgColor: 'bg-gradient-to-r from-violet-400 to-violet-500',
	},
	'new': {
		label: 'Nouveau',
		icon: '✨',
		color: 'text-cyan-900',
		bgColor: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
	},
	'sale': {
		label: 'Promo',
		icon: '🏷️',
		color: 'text-red-900',
		bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
	},
	'made-in-usa': {
		label: 'Made in USA',
		icon: '🇺🇸',
		color: 'text-blue-900',
		bgColor: 'bg-gradient-to-r from-blue-400 to-blue-500',
	},
	'made-in-eu': {
		label: 'Made in EU',
		icon: '🇪🇺',
		color: 'text-blue-900',
		bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
	},
	'made-in-france': {
		label: 'Made in France',
		icon: '🇫🇷',
		color: 'text-blue-900',
		bgColor: 'bg-gradient-to-r from-blue-500 to-red-400',
	},
	'made-in-germany': {
		label: 'Made in Germany',
		icon: '🇩🇪',
		color: 'text-yellow-900',
		bgColor: 'bg-gradient-to-r from-yellow-400 to-red-400',
	},
	'made-in-italy': {
		label: 'Made in Italy',
		icon: '🇮🇹',
		color: 'text-green-900',
		bgColor: 'bg-gradient-to-r from-green-400 to-red-400',
	},
};

interface ProductBadgeProps {
	type: BadgeType;
	className?: string;
	showIcon?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

export default function ProductBadge({
	type,
	className = '',
	showIcon = true,
	size = 'md'
}: ProductBadgeProps) {
	const config = BADGE_CONFIGS[type];

	const sizeClasses = {
		sm: 'text-[10px] px-2 py-0.5',
		md: 'text-xs px-2.5 py-1',
		lg: 'text-sm px-3 py-1.5',
	};

	return (
		<span
			className={`
				inline-flex items-center gap-1
				${sizeClasses[size]}
				${config.bgColor}
				${config.color}
				font-bold
				rounded-full
				shadow-md
				backdrop-blur-sm
				border border-white/20
				whitespace-nowrap
				${className}
			`}
		>
			{showIcon && config.icon && (
				<span className="text-[1em]">{config.icon}</span>
			)}
			<span>{config.label}</span>
		</span>
	);
}

// Helper pour déterminer automatiquement les badges d'un produit
export function getProductBadges(product: {
	featured?: boolean;
	on_sale?: boolean;
	stock_quantity?: number | null;
	date_created?: string;
	tags?: { name: string; slug: string }[];
}): BadgeType[] {
	const badges: BadgeType[] = [];

	// Promotion
	if (product.on_sale) {
		badges.push('sale');
	}

	// Nouveau (moins de 14 jours)
	if (product.date_created) {
		const createdDate = new Date(product.date_created);
		const twoWeeksAgo = new Date();
		twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
		if (createdDate >= twoWeeksAgo) {
			badges.push('new');
		}
	}

	// Stock limité
	if (product.stock_quantity !== null && product.stock_quantity !== undefined) {
		if (product.stock_quantity <= 3 && product.stock_quantity > 0) {
			badges.push('last-pieces');
		} else if (product.stock_quantity <= 10 && product.stock_quantity > 3) {
			badges.push('limited-stock');
		}
	}

	// Produit phare
	if (product.featured) {
		badges.push('best-seller');
	}

	// Tags spéciaux
	if (product.tags) {
		const tagSlugs = product.tags.map(t => t.slug);
		const tagNames = product.tags.map(t => t.name.toLowerCase());

		// Provenance (priorité haute - affiché en premier)
		if (tagSlugs.includes('made-in-usa') || tagNames.some(n => n.includes('usa') || n.includes('états-unis'))) {
			badges.unshift('made-in-usa'); // unshift pour mettre en premier
		} else if (tagSlugs.includes('made-in-eu') || tagNames.some(n => n.includes('europe') || n.includes('ue'))) {
			badges.unshift('made-in-eu');
		} else if (tagSlugs.includes('made-in-france') || tagNames.some(n => n.includes('france') || n.includes('français'))) {
			badges.unshift('made-in-france');
		} else if (tagSlugs.includes('made-in-germany') || tagNames.some(n => n.includes('allemagne') || n.includes('germany'))) {
			badges.unshift('made-in-germany');
		} else if (tagSlugs.includes('made-in-italy') || tagNames.some(n => n.includes('italie') || n.includes('italy'))) {
			badges.unshift('made-in-italy');
		}

		// Caractéristiques
		if (tagSlugs.includes('eco-responsable') || tagSlugs.includes('eco-friendly')) {
			badges.push('eco-friendly');
		}
		if (tagSlugs.includes('premium') || tagSlugs.includes('qualite-premium')) {
			badges.push('premium-quality');
		}
		if (tagSlugs.includes('coup-de-coeur') || tagSlugs.includes('team-favorite')) {
			badges.push('team-favorite');
		}
		if (tagSlugs.includes('expert-choice') || tagSlugs.includes('choix-expert')) {
			badges.push('expert-choice');
		}
		if (tagSlugs.includes('meilleur-prix') || tagSlugs.includes('best-value')) {
			badges.push('best-value');
		}
		if (tagSlugs.includes('edition-limitee') || tagSlugs.includes('limited-edition')) {
			badges.push('limited-edition');
		}
	}

	return badges;
}
