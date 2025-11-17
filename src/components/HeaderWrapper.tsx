// Server Component wrapper pour précharger les catégories
import { getCategories, WooCategory } from '@/lib/woo';
import Header from './Header';

export default async function HeaderWrapper() {
	// Précharger les catégories côté serveur
	let categories: WooCategory[] = [];
	try {
		console.log('🔍 [HeaderWrapper] Fetching categories on server...');
		categories = await getCategories();
		console.log(`✅ [HeaderWrapper] Successfully fetched ${categories.length} categories:`,
			categories.map(c => ({ id: c.id, name: c.name }))
		);
	} catch (error) {
		console.error('❌ [HeaderWrapper] Error preloading categories:', error);
		categories = [];
	}

	// Passer les catégories au Header (client component)
	return <Header initialCategories={categories} />;
}
