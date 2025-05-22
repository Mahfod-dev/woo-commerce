import { Metadata } from 'next';
import ForgotPasswordClient from '@/components/ForgotPasswordClient';

export const metadata: Metadata = {
	title: 'Mot de passe oublié | Récupération de compte',
	description: 'Récupérez l\'accès à votre compte en réinitialisant votre mot de passe. Entrez votre email pour recevoir un lien de récupération sécurisé.',
	robots: 'noindex, nofollow', // Page privée, pas d'indexation
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordClient />;
}