// Server Component wrapper pour précharger les catégories
import { getCategories, WooCategory } from '@/lib/woo';
import Header from './Header';

export default async function HeaderWrapper() {
	// Précharger les catégories côté serveur
	let categories: WooCategory[] = [];
	try {
		categories = await getCategories();
	} catch (error) {
		console.error('Error preloading categories:', error);
		categories = [];
	}

	// Passer les catégories au Header (client component)
	return <Header initialCategories={categories} />;
}
