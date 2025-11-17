// Server Component wrapper pour le Header
// Les catégories ne sont plus préchargées ici pour améliorer les performances
// Le lien "Catégories" redirige directement vers /categories
import Header from './Header';

export default async function HeaderWrapper() {
	return <Header />;
}
