// src/components/CheckoutContent.tsx (Updated version)
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/app/styles/checkout.css';
import { formatPrice } from '@/lib/wooClient';
import { createOrder } from '@/lib/woo';
import { useCart } from './CartProvider';
import { useNotification } from '@/context/notificationContext';
import StripePaymentForm from './StripePaymentForm';

const CheckoutContent = () => {
	const router = useRouter();
	const { items, clearCart } = useCart();
	const { addNotification } = useNotification();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [orderError, setOrderError] = useState('');
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		postalCode: '',
		country: 'France',
		paymentMethod: 'card-direct', // Seul le paiement par carte direct est supporté
	});
  
	// État pour le suivi de commande
	const [orderCreated, setOrderCreated] = useState(false);
	const [orderDetails, setOrderDetails] = useState<{
		orderId: number;
		total: string;
	} | null>(null);

	const subtotal = items.reduce(
		(total, item) => total + parseFloat(item.price) * item.quantity,
		0
	);
	const shippingCost = subtotal > 100 ? 0 : 7.99;
	const total = subtotal + shippingCost;

	useEffect(() => {
		// Redirection vers la page d'accueil si le panier est vide
		if (items.length === 0 && !orderCreated) {
			router.push('/');
		}
	}, [items, router, orderCreated]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setOrderError('');

		try {
			// Préparation des données de commande pour WooCommerce
			const orderData = {
				payment_method: 'stripe',
				payment_method_title: 'Carte de crédit (Direct)',
				set_paid: false, // Le paiement sera confirmé séparément
				billing: {
					first_name: formData.firstName,
					last_name: formData.lastName,
					address_1: formData.address,
					city: formData.city,
					state: '', // Optionnel
					postcode: formData.postalCode,
					country: formData.country,
					email: formData.email,
					phone: formData.phone,
					company: '' // Champ potentiellement requis par WooCommerce
				},
				shipping: {
					first_name: formData.firstName,
					last_name: formData.lastName,
					address_1: formData.address,
					city: formData.city,
					state: '', // Optionnel
					postcode: formData.postalCode,
					country: formData.country,
					company: '' // Champ potentiellement requis par WooCommerce
				},
				line_items: items.map(item => ({
					product_id: item.id,
					quantity: item.quantity
				})),
				shipping_lines: [
					{
						method_id: 'flat_rate',
						method_title: subtotal > 100 ? 'Livraison gratuite' : 'Tarif forfaitaire',
						total: shippingCost.toString()
					}
				]
			};

			// Création de la commande dans WooCommerce
			const order = await createOrder(orderData);
			
			if (!order) {
				throw new Error('Échec de création de la commande');
			}

			// Stockage des détails de commande pour le traitement du paiement
			setOrderDetails({
				orderId: order.id,
				total: order.total
			});
			
			// Stockage des informations de commande pour la page de confirmation
			localStorage.setItem('lastOrder', JSON.stringify({
				orderId: order.id,
				orderNumber: order.id.toString(),
				orderDate: new Date().toISOString(),
				total: order.total
			}));
			
			setOrderCreated(true);
			
			// Notification de succès
			addNotification({
				type: 'success',
				message: `Commande #${order.id} créée. Veuillez compléter le paiement.`,
				duration: 3000
			});
			
		} catch (error) {
			console.error('Erreur lors du traitement de la commande:', error);
			setOrderError('Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.');
			
			addNotification({
				type: 'error',
				message: 'Échec de création de la commande. Veuillez réessayer.',
				duration: 7000
			});
			setIsSubmitting(false);
		}
	};
	
	// Gestion du succès du paiement
	const handlePaymentSuccess = async (paymentIntentId: string) => {
		try {
			// Mise à jour du statut de la commande dans WooCommerce
			const response = await fetch('/api/update-order-payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					orderId: orderDetails?.orderId,
					paymentIntentId,
					paymentMethod: 'card-direct',
				}),
			});
			
			if (!response.ok) {
				throw new Error('Échec de mise à jour du statut de paiement');
			}
			
			// Vidage du panier après paiement réussi
			clearCart();
			
			// Affichage de la notification de succès
			addNotification({
				type: 'success',
				message: 'Paiement réussi ! Redirection vers la confirmation de commande...',
				duration: 3000
			});
			
			// Redirection vers la page de confirmation de commande
			setTimeout(() => {
				router.push('/order-confirmation');
			}, 1500);
			
		} catch (error) {
			console.error('Erreur lors de la mise à jour du statut de paiement:', error);
			addNotification({
				type: 'error',
				message: 'Paiement effectué, mais nous avons rencontré un problème lors de la mise à jour de votre commande. Veuillez contacter le support.',
				duration: 7000
			});
			
			// Redirection vers la confirmation puisque le paiement a réussi
			router.push('/order-confirmation');
		}
	};
	
	// Gestion des erreurs de paiement
	const handlePaymentError = (errorMessage: string) => {
		addNotification({
			type: 'error',
			message: `Échec du paiement: ${errorMessage}`,
			duration: 7000
		});
	};

	const isFormValid = () => {
		const { firstName, lastName, email, phone, address, city, postalCode } =
			formData;
		return (
			firstName &&
			lastName &&
			email &&
			phone &&
			address &&
			city &&
			postalCode
		);
	};
	
	// Afficher le formulaire de paiement si la commande est créée, sinon afficher le formulaire de commande
	if (orderCreated && orderDetails) {
		return (
			<div className='checkout-container'>
				<h1 className='text-3xl font-bold mb-6'>Finaliser votre paiement</h1>
				
				<div className='max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md'>
					<h2 className='text-xl font-medium mb-4'>Commande #{orderDetails.orderId}</h2>
					<p className='mb-6'>Veuillez compléter votre paiement pour confirmer votre commande.</p>
					
					<StripePaymentForm 
						orderId={orderDetails.orderId}
						orderTotal={orderDetails.total}
						paymentMethod="card-direct"
						onSuccess={handlePaymentSuccess}
						onError={handlePaymentError}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className='checkout-container'>
			<h1 className='text-3xl font-bold mb-6'>Paiement</h1>

			<div className='checkout-grid'>
				<div className='checkout-form'>
					<h2 className='text-xl font-semibold mb-4'>
						Informations de facturation
					</h2>

					<form onSubmit={handleSubmit}>
						<div className='form-row'>
							<div className='form-group'>
								<label
									htmlFor='firstName'
									className='form-label'>
									Prénom
								</label>
								<input
									type='text'
									id='firstName'
									name='firstName'
									value={formData.firstName}
									onChange={handleChange}
									className='form-input'
									required
								/>
							</div>

							<div className='form-group'>
								<label
									htmlFor='lastName'
									className='form-label'>
									Nom
								</label>
								<input
									type='text'
									id='lastName'
									name='lastName'
									value={formData.lastName}
									onChange={handleChange}
									className='form-input'
									required
								/>
							</div>
						</div>

						<div className='form-row'>
							<div className='form-group'>
								<label
									htmlFor='email'
									className='form-label'>
									Email
								</label>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleChange}
									className='form-input'
									required
								/>
							</div>

							<div className='form-group'>
								<label
									htmlFor='phone'
									className='form-label'>
									Téléphone
								</label>
								<input
									type='tel'
									id='phone'
									name='phone'
									value={formData.phone}
									onChange={handleChange}
									className='form-input'
									required
								/>
							</div>
						</div>

						<div className='form-group'>
							<label
								htmlFor='address'
								className='form-label'>
								Adresse
							</label>
							<input
								type='text'
								id='address'
								name='address'
								value={formData.address}
								onChange={handleChange}
								className='form-input'
								required
							/>
						</div>

						<div className='form-row'>
							<div className='form-group'>
								<label
									htmlFor='city'
									className='form-label'>
									Ville
								</label>
								<input
									type='text'
									id='city'
									name='city'
									value={formData.city}
									onChange={handleChange}
									className='form-input'
									required
								/>
							</div>

							<div className='form-group'>
								<label
									htmlFor='postalCode'
									className='form-label'>
									Code postal
								</label>
								<input
									type='text'
									id='postalCode'
									name='postalCode'
									value={formData.postalCode}
									onChange={handleChange}
									className='form-input'
									required
								/>
							</div>
						</div>

						<div className='form-group'>
							<label
								htmlFor='country'
								className='form-label'>
								Pays
							</label>
							<select
								id='country'
								name='country'
								value={formData.country}
								onChange={handleChange}
								className='form-input'
								required>
								<option value='France'>France</option>
								<option value='Belgium'>Belgique</option>
								<option value='Switzerland'>Suisse</option>
								<option value='Germany'>Allemagne</option>
								<option value='Italy'>Italie</option>
								<option value='Spain'>Espagne</option>
							</select>
						</div>

						<div className='form-group'>
							<h3 className='text-lg font-semibold mb-2'>
								Mode de paiement
							</h3>
							<div className='p-3 border rounded-md bg-gray-50'>
								<div className='font-medium'>Carte de crédit</div>
								<div className='text-xs text-gray-500'>Payez en toute sécurité avec votre carte de crédit sur ce site</div>
							</div>
							<input 
								type='hidden' 
								name='paymentMethod' 
								value='card-direct' 
							/>
						</div>
						
						{orderError && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
								{orderError}
							</div>
						)}

						<button
							type='submit'
							className='checkout-btn mt-4'
							disabled={isSubmitting || !isFormValid()}>
							{isSubmitting
								? 'Traitement en cours...'
								: `Continuer vers le paiement - ${formatPrice(total)}`}
						</button>
					</form>
				</div>

				<div className='checkout-summary'>
					<h2 className='text-xl font-semibold mb-4'>
						Récapitulatif de commande
					</h2>

					<div className='mb-4'>
						{items.map((item) => (
							<div
								key={item.key}
								className='cart-item'>
								<div className='relative w-20 h-20'>
									<Image
										src={
											item.image ||
											'/images/placeholder.jpg'
										}
										alt={item.name}
										fill
										className='cart-item-img'
									/>
								</div>
								<div className='cart-item-info'>
									<span className='cart-item-name'>
										{item.name}
									</span>
									<span className='cart-item-price'>
										{formatPrice(parseFloat(item.price))}
									</span>
									<span className='cart-item-quantity'>
										Qté: {item.quantity}
									</span>
								</div>
							</div>
						))}
					</div>

					<div className='summary-item'>
						<span>Sous-total</span>
						<span>{formatPrice(subtotal)}</span>
					</div>

					<div className='summary-item'>
						<span>Livraison</span>
						<span>
							{shippingCost === 0
								? 'Gratuite'
								: formatPrice(shippingCost)}
						</span>
					</div>

					<div className='summary-item summary-total'>
						<span>Total</span>
						<span>{formatPrice(total)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutContent;