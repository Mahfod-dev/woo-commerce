import { Metadata } from 'next';
import ResetPasswordClient from '@/components/ResetPasswordClient';

export const metadata: Metadata = {
	title: 'Réinitialisation du mot de passe | Nouveau mot de passe',
	description: 'Créez un nouveau mot de passe sécurisé pour votre compte. Étape finale de la récupération de votre accès.',
	robots: 'noindex, nofollow', // Page privée, pas d'indexation
};

export default function ResetPasswordPage() {
	return <ResetPasswordClient />;
}