import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Mes commandes | Gestion des commandes',
	description: 'Consultez vos commandes, suivez leur statut et accédez à votre historique d\'achats.',
	robots: 'noindex, nofollow', // Page privée utilisateur
};

export default function OrdersPage() {
	redirect('/account?tab=orders');
}