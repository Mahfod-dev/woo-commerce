// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialiser Resend avec la clé API depuis les variables d'environnement
const resend = new Resend(process.env.RESEND_API_KEY);

// Email de destination (ton email support)
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@flowcontent.io';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, subject, message } = body;

		// Validation des champs
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ error: 'Tous les champs sont requis' },
				{ status: 400 }
			);
		}

		// Validation de l'email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Email invalide' },
				{ status: 400 }
			);
		}

		// Mapper les sujets en français
		const subjectMap: Record<string, string> = {
			question: 'Question sur un produit',
			order: 'Suivi de commande',
			return: 'Retour ou remboursement',
			suggestion: 'Suggestion',
			other: 'Autre',
		};

		const subjectText = subjectMap[subject] || subject;

		// Template HTML pour l'email
		const htmlContent = `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body {
						font-family: Arial, sans-serif;
						line-height: 1.6;
						color: #333;
					}
					.container {
						max-width: 600px;
						margin: 0 auto;
						padding: 20px;
						background-color: #f9fafb;
					}
					.header {
						background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
						color: white;
						padding: 30px;
						border-radius: 10px 10px 0 0;
						text-align: center;
					}
					.content {
						background: white;
						padding: 30px;
						border-radius: 0 0 10px 10px;
						box-shadow: 0 2px 4px rgba(0,0,0,0.1);
					}
					.info-row {
						margin: 15px 0;
						padding: 10px;
						background: #f3f4f6;
						border-radius: 5px;
					}
					.label {
						font-weight: bold;
						color: #4f46e5;
					}
					.message-box {
						background: #f9fafb;
						padding: 20px;
						border-left: 4px solid #4f46e5;
						margin: 20px 0;
						border-radius: 5px;
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
						<h1>📧 Nouveau message de contact</h1>
						<p>Selectura - Formulaire de contact</p>
					</div>
					<div class="content">
						<div class="info-row">
							<span class="label">De :</span> ${name}
						</div>
						<div class="info-row">
							<span class="label">Email :</span> <a href="mailto:${email}">${email}</a>
						</div>
						<div class="info-row">
							<span class="label">Sujet :</span> ${subjectText}
						</div>
						<div class="message-box">
							<p class="label">Message :</p>
							<p>${message.replace(/\n/g, '<br>')}</p>
						</div>
						<p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
							<strong>Note :</strong> Vous pouvez répondre directement à cet email pour contacter ${name}.
						</p>
					</div>
					<div class="footer">
						<p>Cet email a été envoyé depuis le formulaire de contact de Selectura</p>
						<p>© ${new Date().getFullYear()} Selectura. Tous droits réservés.</p>
					</div>
				</div>
			</body>
			</html>
		`;

		// Envoyer l'email via Resend
		const { data, error: resendError } = await resend.emails.send({
			from: 'Selectura Contact <onboarding@resend.dev>', // Domaine par défaut Resend
			to: [SUPPORT_EMAIL],
			replyTo: email, // Permet de répondre directement au client
			subject: `[Selectura Contact] ${subjectText} - ${name}`,
			html: htmlContent,
			text: `
Nouveau message de contact Selectura

De: ${name}
Email: ${email}
Sujet: ${subjectText}

Message:
${message}

---
Vous pouvez répondre directement à cet email pour contacter ${name}.
			`.trim(),
		});

		if (resendError) {
			throw new Error(resendError.message);
		}

		return NextResponse.json(
			{
				success: true,
				message: 'Message envoyé avec succès',
				emailId: data?.id,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Erreur lors de l\'envoi de l\'email:', error);
		return NextResponse.json(
			{
				error: 'Erreur lors de l\'envoi du message',
				details: error instanceof Error ? error.message : 'Erreur inconnue',
			},
			{ status: 500 }
		);
	}
}
