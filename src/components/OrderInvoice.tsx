'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useNotification } from '@/context/notificationContext';
import { formatPrice } from '@/lib/wooClient';
import { Order, OrderItem } from '@/lib/orders';
import '@/app/styles/account.css';

interface OrderInvoiceProps {
	orderId: number;
}

const OrderInvoice: React.FC<OrderInvoiceProps> = ({ orderId }) => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const { addNotification } = useNotification();
	const [order, setOrder] = useState<Order | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isPrinting, setIsPrinting] = useState(false);

	useEffect(() => {
		const fetchOrder = async () => {
			// Attendre que NextAuth soit chargé
			if (status === 'loading') return;

			setIsLoading(true);
			try {
				// Vérifier l'authentification avec NextAuth
				if (!session?.user) {
					addNotification({
						type: 'warning',
						message:
							'Veuillez vous connecter pour voir les détails de votre commande',
						duration: 5000,
					});
					router.push('/login');
					return;
				}

				// Récupérer la vraie commande via l'API
				const response = await fetch(`/api/order/${orderId}`);
				if (!response.ok) {
					if (response.status === 404) {
						addNotification({
							type: 'error',
							message: 'Commande non trouvée',
							duration: 5000,
						});
					} else {
						addNotification({
							type: 'error',
							message:
								'Erreur lors de la récupération de la commande',
							duration: 5000,
						});
					}
					router.push('/account');
					return;
				}

				const { order } = await response.json();
				setOrder(order);
			} catch (error) {
				console.error(
					'Erreur lors de la récupération de la commande:',
					error
				);
				addNotification({
					type: 'error',
					message: 'Échec du chargement des détails de la commande',
					duration: 5000,
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrder();
	}, [orderId, session, status, addNotification, router]);

	// Formater la date pour l'affichage
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// Générer le numéro de facture
	const generateInvoiceNumber = (orderId: number) => {
		return `FACT-${new Date().getFullYear()}-${orderId
			.toString()
			.padStart(5, '0')}`;
	};

	// Gérer l'impression de la facture
	const handlePrint = () => {
		setIsPrinting(true);
		setTimeout(() => {
			window.print();
			setIsPrinting(false);
		}, 300);
	};

	// Gérer le téléchargement de la facture au format PDF
	const handleDownload = async () => {
		if (!order) return;

		try {
			addNotification({
				type: 'info',
				message: 'Génération du PDF en cours...',
				duration: 2000,
			});

			// Import des modules de génération PDF
			const { default: jsPDF } = await import('jspdf');
			const { default: html2canvas } = await import('html2canvas');

			// Créer une copie de l'élément à capturer
			const element = document.querySelector('.invoice-content');
			if (!element) {
				throw new Error('Élément de facture non trouvé');
			}

			// Configuration pour html2canvas
			const canvas = await html2canvas(element as HTMLElement, {
				scale: 2,
				useCORS: true,
				logging: false,
				backgroundColor: '#ffffff',
				allowTaint: false,
			});

			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('p', 'mm', 'a4');
			
			// Calculer les dimensions pour adapter au format A4
			const imgWidth = 210; // A4 width in mm
			const pageHeight = 295; // A4 height in mm
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			let heightLeft = imgHeight;

			let position = 0;

			// Ajouter la première page
			pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;

			// Ajouter des pages supplémentaires si nécessaire
			while (heightLeft >= 0) {
				position = heightLeft - imgHeight;
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
			}

			// Télécharger le PDF
			const invoiceNumber = generateInvoiceNumber(order.id);
			pdf.save(`${invoiceNumber}.pdf`);

			addNotification({
				type: 'success',
				message: 'Facture téléchargée avec succès',
				duration: 3000,
			});
		} catch (error) {
			console.error('Erreur lors de la génération du PDF:', error);
			addNotification({
				type: 'error',
				message: 'Erreur lors de la génération du PDF',
				duration: 5000,
			});
		}
	};

	if (isLoading) {
		return (
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='flex items-center justify-center py-12'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
				</div>
				<p className='text-center text-gray-500'>
					Chargement des détails de la facture...
				</p>
			</div>
		);
	}

	if (!order) {
		return (
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='text-center py-16'>
					<svg
						className='mx-auto h-12 w-12 text-gray-400'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
						/>
					</svg>
					<h3 className='mt-2 text-sm font-medium text-gray-900'>
						Commande introuvable
					</h3>
					<p className='mt-1 text-sm text-gray-500'>
						Nous n'avons pas pu trouver la commande que vous
						recherchez.
					</p>
					<div className='mt-6'>
						<Link
							href='/account?tab=orders'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
							Retour à Mes Commandes
						</Link>
					</div>
				</div>
			</div>
		);
	}

	// Variantes d'animation
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	// Calculer les totaux
	const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
	const shipping = 0; // Livraison gratuite pour l'instant
	const total = order.total;

	return (
		<div className='bg-gray-50 min-h-screen py-16 print:py-0 print:bg-white account-container'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0 account-content'>
				<motion.div
					variants={containerVariants}
					initial='hidden'
					animate='visible'
					className='print:animate-none'>
					{/* En-tête - Visible uniquement lorsqu'il n'y a pas d'impression */}
					<motion.div
						variants={itemVariants}
						className='flex flex-col md:flex-row md:items-center md:justify-between mb-8 print:hidden'>
						<div>
							<Link
								href={`/account/orders/${order.id}`}
								className='text-indigo-600 hover:text-indigo-800 flex items-center mb-4'>
								<svg
									className='h-5 w-5 mr-2'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M10 19l-7-7m0 0l7-7m-7 7h18'
									/>
								</svg>
								Retour à la commande
							</Link>
							<h1 className='text-3xl font-bold text-gray-900'>
								Facture
							</h1>
							<p className='text-gray-500 mt-1'>
								Commande #{order.id}
							</p>
						</div>
						<div className='mt-4 md:mt-0 flex flex-col sm:flex-row gap-2'>
							<button
								onClick={handlePrint}
								disabled={isPrinting}
								className='inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'>
								{isPrinting ? (
									<>
										<svg
											className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
										</svg>
										Impression en cours...
									</>
								) : (
									<>
										<svg
											className='h-4 w-4 mr-2'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
											/>
										</svg>
										Imprimer la facture
									</>
								)}
							</button>
							<button
								onClick={handleDownload}
								className='inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
								<svg
									className='h-4 w-4 mr-2'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
									/>
								</svg>
								Télécharger PDF
							</button>
						</div>
					</motion.div>

					{/* Contenu de la facture */}
					<motion.div
						variants={itemVariants}
						className='invoice-content bg-white rounded-lg shadow-lg overflow-hidden mb-8 p-8 print:shadow-none print:p-0'>
						{/* En-tête de facture avec logo */}
						<div className='flex flex-col md:flex-row md:justify-between md:items-start mb-10'>
							<div className='mb-6 md:mb-0'>
								<div className='h-10 w-auto relative mb-2'>
									<Image
										src='/selectura.png
                    '
										alt='Selectura'
										fill
										className='object-contain'
									/>
								</div>
								<p className='text-gray-500 text-sm'>
									Selectura
								</p>
								<p className='text-gray-500 text-sm'>
									15442 Venture Blvd.,201
								</p>
								<p className='text-gray-500 text-sm'>
									Sherman Oaks, California CA 91403
								</p>
								<p className='text-gray-500 text-sm'>
									support@flowcontent.io
								</p>
							</div>

							<div className='text-right'>
								<h2 className='text-2xl font-bold text-gray-900'>
									FACTURE
								</h2>
								<p className='text-gray-700 font-medium'>
									{generateInvoiceNumber(order.id)}
								</p>
								<p className='text-gray-500 text-sm mt-2'>
									Date : {formatDate(order.created_at)}
								</p>
								<p className='text-gray-500 text-sm'>
									Commande #: {order.id}
								</p>
								<div className='mt-2 inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded'>
									{order.status.toUpperCase()}
								</div>
							</div>
						</div>

						{/* Détails de facturation et livraison */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-10'>
							<div>
								<h3 className='text-gray-900 font-medium mb-2'>
									Facturer à :
								</h3>
								<p className='text-gray-700'>
									{order.billing_address?.first_name || ''}{' '}
									{order.billing_address?.last_name || ''}
								</p>
								{order.billing_address?.company && (
									<p className='text-gray-700'>
										{order.billing_address.company}
									</p>
								)}
								<p className='text-gray-700'>
									{order.billing_address?.address_1 || ''}
								</p>
								{order.billing_address?.address_2 && (
									<p className='text-gray-700'>
										{order.billing_address.address_2}
									</p>
								)}
								<p className='text-gray-700'>
									{order.billing_address?.postcode || ''}{' '}
									{order.billing_address?.city || ''}
								</p>
								{order.billing_address?.state && (
									<p className='text-gray-700'>
										{order.billing_address.state}
									</p>
								)}
								<p className='text-gray-700'>
									{order.billing_address?.country || ''}
								</p>
								<p className='text-gray-700 mt-2'>
									{order.billing_address?.email || ''}
								</p>
								<p className='text-gray-700'>
									{order.billing_address?.phone || ''}
								</p>
							</div>

							<div>
								<h3 className='text-gray-900 font-medium mb-2'>
									Livrer à :
								</h3>
								<p className='text-gray-700'>
									{order.shipping_address?.first_name || ''}{' '}
									{order.shipping_address?.last_name || ''}
								</p>
								{order.shipping_address?.company && (
									<p className='text-gray-700'>
										{order.shipping_address.company}
									</p>
								)}
								<p className='text-gray-700'>
									{order.shipping_address?.address_1 || ''}
								</p>
								{order.shipping_address?.address_2 && (
									<p className='text-gray-700'>
										{order.shipping_address.address_2}
									</p>
								)}
								<p className='text-gray-700'>
									{order.shipping_address?.postcode || ''}{' '}
									{order.shipping_address?.city || ''}
								</p>
								{order.shipping_address?.state && (
									<p className='text-gray-700'>
										{order.shipping_address.state}
									</p>
								)}
								<p className='text-gray-700'>
									{order.shipping_address?.country || ''}
								</p>
							</div>
						</div>

						{/* Mode de paiement */}
						<div className='mb-8'>
							<h3 className='text-gray-900 font-medium mb-2'>
								Mode de paiement :
							</h3>
							<p className='text-gray-700'>
								Carte de crédit (Stripe)
							</p>
						</div>

						{/* Tableau des articles de la commande */}
						<table className='min-w-full border border-gray-200 mb-8'>
							<thead>
								<tr className='bg-gray-50'>
									<th className='px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Article
									</th>
									<th className='px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Référence
									</th>
									<th className='px-6 py-3 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Prix
									</th>
									<th className='px-6 py-3 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Quantité
									</th>
									<th className='px-6 py-3 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Total
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{order.items.map((item, index) => (
									<tr key={index}>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
											{item.product_name}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											SKU-{item.product_id}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right'>
											{formatPrice(item.price)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right'>
											{item.quantity}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right'>
											{formatPrice(item.subtotal)}
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* Totaux */}
						<div className='ml-auto w-full md:w-1/2 lg:w-1/3'>
							<div className='border-t border-gray-200 pt-4'>
								<div className='flex justify-between py-2'>
									<span className='text-sm text-gray-500'>
										Sous-total
									</span>
									<span className='text-sm text-gray-900 font-medium'>
										{formatPrice(subtotal)}
									</span>
								</div>
								<div className='flex justify-between py-2'>
									<span className='text-sm text-gray-500'>
										Livraison
									</span>
									<span className='text-sm text-gray-900 font-medium'>
										{shipping === 0
											? 'Gratuite'
											: formatPrice(shipping)}
									</span>
								</div>
								{/* Vous pouvez ajouter la TVA, les remises, etc. ici */}
								<div className='flex justify-between py-2 border-t border-gray-200'>
									<span className='text-base text-gray-900 font-bold'>
										Total
									</span>
									<span className='text-base text-indigo-600 font-bold'>
										{formatPrice(total)}
									</span>
								</div>
							</div>
						</div>

						{/* Notes et conditions */}
						<div className='mt-12 border-t border-gray-200 pt-8'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
								<div>
									<h3 className='text-gray-900 font-medium mb-2'>
										Notes :
									</h3>
									<p className='text-gray-600 text-sm'>
										Nous vous remercions de votre commande !
										Si vous avez des questions concernant
										cette facture, veuillez contacter notre
										service client.
									</p>
								</div>
								<div>
									<h3 className='text-gray-900 font-medium mb-2'>
										Conditions générales :
									</h3>
									<p className='text-gray-600 text-sm'>
										Le paiement est dû dans les 30 jours.
										Tous les produits restent la propriété
										de Selectura jusqu'au paiement intégral.
									</p>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Pied de page */}
					<motion.div
						variants={itemVariants}
						className='text-center text-gray-500 text-sm mt-8 print:mt-12'>
						<p>
							Selectura (operated by DevHighway) • Tax ID :
							US123456789
						</p>
						<p>
							15442 Venture Blvd.,201, Sherman Oaks, California CA
							91403
						</p>
						<p className='print:hidden'>
							Cette facture a été générée le{' '}
							{new Date().toLocaleDateString('fr-FR')}
						</p>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
};

export default OrderInvoice;
