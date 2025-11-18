// app/api/newsletter/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialiser Supabase
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialiser Resend pour l'email de bienvenue
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email } = body;

		// Validation de l'email
		if (!email || typeof email !== 'string') {
			return NextResponse.json(
				{ error: 'Email requis' },
				{ status: 400 }
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Email invalide' },
				{ status: 400 }
			);
		}

		// Récupérer l'IP et le user agent pour tracking (optionnel)
		const ip = request.headers.get('x-forwarded-for') ||
		           request.headers.get('x-real-ip') ||
		           'unknown';
		const userAgent = request.headers.get('user-agent') || 'unknown';

		// Vérifier si l'email existe déjà
		const { data: existingSubscriber, error: checkError } = await supabase
			.from('newsletter_subscribers')
			.select('id, is_active')
			.eq('email', email.toLowerCase())
			.single();

		if (checkError && checkError.code !== 'PGRST116') {
			// PGRST116 = aucune ligne trouvée (normal pour un nouvel abonné)
			throw checkError;
		}

		// Si l'email existe déjà
		if (existingSubscriber) {
			if (existingSubscriber.is_active) {
				return NextResponse.json(
					{
						success: true,
						message: 'Vous êtes déjà inscrit à notre newsletter',
						alreadySubscribed: true,
					},
					{ status: 200 }
				);
			} else {
				// Réactiver l'abonnement
				const { error: updateError } = await supabase
					.from('newsletter_subscribers')
					.update({
						is_active: true,
						updated_at: new Date().toISOString(),
					})
					.eq('email', email.toLowerCase());

				if (updateError) throw updateError;

				return NextResponse.json(
					{
						success: true,
						message: 'Votre abonnement a été réactivé avec succès',
						reactivated: true,
					},
					{ status: 200 }
				);
			}
		}

		// Insérer le nouvel abonné
		const { data: newSubscriber, error: insertError } = await supabase
			.from('newsletter_subscribers')
			.insert([
				{
					email: email.toLowerCase(),
					source: 'website',
					ip_address: ip.split(',')[0].trim(), // Prendre la première IP si plusieurs
					user_agent: userAgent.substring(0, 500), // Limiter la longueur
					is_active: true,
				},
			])
			.select()
			.single();

		if (insertError) {
			throw insertError;
		}

		// Envoyer un email de bienvenue (optionnel)
		try {
			await resend.emails.send({
				from: 'Selectura <onboarding@resend.dev>',
				to: [email],
				subject: 'Bienvenue dans la communauté Selectura ! 🎉',
				html: `
					<!DOCTYPE html>
					<html>
					<head>
						<style>
							body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
							.container { max-width: 600px; margin: 0 auto; padding: 20px; }
							.header {
								background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
								color: white;
								padding: 40px 30px;
								text-align: center;
								border-radius: 10px 10px 0 0;
							}
							.content {
								background: white;
								padding: 30px;
								border-radius: 0 0 10px 10px;
								box-shadow: 0 2px 4px rgba(0,0,0,0.1);
							}
							.button {
								display: inline-block;
								background: #4f46e5;
								color: white;
								padding: 12px 30px;
								text-decoration: none;
								border-radius: 8px;
								margin: 20px 0;
							}
							.footer {
								text-align: center;
								padding: 20px;
								color: #6b7280;
								font-size: 12px;
							}
						</style>
					</head>
					<body>
						<div class="container">
							<div class="header">
								<h1>🎉 Bienvenue chez Selectura !</h1>
							</div>
							<div class="content">
								<p>Bonjour,</p>
								<p>Merci de vous être inscrit à notre newsletter ! Vous faites maintenant partie d'une communauté exclusive qui bénéficie en avant-première de :</p>
								<ul style="color: #4f46e5;">
									<li>✨ Nos nouveaux produits avant tout le monde</li>
									<li>🎁 Des promotions exclusives réservées aux abonnés</li>
									<li>💡 Des conseils d'experts pour choisir les meilleurs produits</li>
									<li>📦 Des offres spéciales et codes promo</li>
								</ul>
								<p>Nous nous engageons à ne vous envoyer que du contenu de qualité, sans spam.</p>
								<div style="text-align: center;">
									<a href="https://selectura.co/products" class="button">Découvrir nos produits</a>
								</div>
								<p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
									<strong>P.S.</strong> Vous pouvez vous désabonner à tout moment en cliquant sur le lien en bas de nos emails.
								</p>
							</div>
							<div class="footer">
								<p>© ${new Date().getFullYear()} Selectura. Tous droits réservés.</p>
								<p>
									<a href="https://selectura.co/privacy" style="color: #4f46e5;">Politique de confidentialité</a> |
									<a href="https://selectura.co/contact" style="color: #4f46e5;">Nous contacter</a>
								</p>
							</div>
						</div>
					</body>
					</html>
				`,
			});
		} catch (emailError) {
			// Ne pas bloquer l'inscription si l'email échoue
			console.error('Erreur envoi email bienvenue:', emailError);
		}

		return NextResponse.json(
			{
				success: true,
				message: 'Merci pour votre inscription ! Vérifiez votre boîte mail.',
				subscriberId: newSubscriber.id,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Erreur inscription newsletter:', error);
		return NextResponse.json(
			{
				error: 'Erreur lors de l\'inscription',
				details: error instanceof Error ? error.message : 'Erreur inconnue',
			},
			{ status: 500 }
		);
	}
}

// Route GET pour récupérer les statistiques (optionnel, pour l'admin)
export async function GET() {
	try {
		// Compter le nombre total d'abonnés actifs
		const { count, error } = await supabase
			.from('newsletter_subscribers')
			.select('*', { count: 'exact', head: true })
			.eq('is_active', true);

		if (error) throw error;

		return NextResponse.json(
			{
				success: true,
				totalActiveSubscribers: count || 0,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Erreur récupération stats:', error);
		return NextResponse.json(
			{
				error: 'Erreur lors de la récupération des statistiques',
			},
			{ status: 500 }
		);
	}
}
