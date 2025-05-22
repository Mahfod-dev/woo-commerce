// src/components/CheckoutContent.tsx (Updated version)
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/app/styles/checkout.css';
import { formatPrice } from '@/lib/wooClient';
import { useCart } from './CartProvider';
import { useNotification } from '@/context/notificationContext';
import StripePaymentForm from './StripePaymentForm';
import { supabase } from '@/lib/supabase/client';
import { useSession } from 'next-auth/react';

const CheckoutContent = () => {
	const router = useRouter();
	const { items, clearCart } = useCart();
	const { addNotification } = useNotification();
	const { data: session } = useSession();
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
	const shippingCost = 0; // Livraison gratuite
	const total = subtotal + shippingCost;

	// Chargement des données utilisateur au démarrage
	useEffect(() => {
		const loadUserData = async () => {
			try {
				const { data: { user } } = await supabase.auth.getUser();
				if (user) {
					// Récupérer le profil utilisateur
					const { data: profile } = await supabase
						.from('profiles')
						.select('*')
						.eq('id', user.id)
						.single();
					
					if (profile) {
						// Pré-remplir les champs avec les données de profil
						setFormData(prevData => ({
							...prevData,
							firstName: profile.first_name || '',
							lastName: profile.last_name || '',
							email: profile.email || '',
							phone: profile.phone || '',
							// Utiliser l'adresse de livraison si disponible
							...(profile.shipping_address && {
								address: profile.shipping_address.address_1 || '',
								city: profile.shipping_address.city || '',
								postalCode: profile.shipping_address.postcode || '',
								country: profile.shipping_address.country || 'France',
							}),
						}));
					}
				}
			} catch (error) {
				console.error('Erreur lors du chargement des données utilisateur:', error);
			}
		};
		
		loadUserData();
	}, []);

	// Gestion des erreurs de paiement
	const handlePaymentError = (error: any) => {
		console.error('Erreur de paiement:', error);
		addNotification({
			type: 'error',
			message: 'Échec du paiement. Veuillez vérifier vos informations et réessayer.',
			duration: 7000
		});
	};

	// Gestion des changements dans le formulaire
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Soumission du formulaire de commande
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setOrderError('');

		try {
			// Vérification du panier
			if (items.length === 0) {
				throw new Error('Votre panier est vide.');
			}

			// Création des données de commande
			const orderData = {
				payment_method: formData.paymentMethod,
				payment_method_title: 'Carte bancaire',
				set_paid: false,
				billing: {
					first_name: formData.firstName,
					last_name: formData.lastName,
					address_1: formData.address,
					city: formData.city,
					postcode: formData.postalCode,
					country: formData.country,
					email: formData.email,
					phone: formData.phone
				},
				shipping: {
					first_name: formData.firstName,
					last_name: formData.lastName,
					address_1: formData.address,
					city: formData.city,
					postcode: formData.postalCode,
					country: formData.country
				},
				line_items: items.map(item => ({
					product_id: item.id,
					quantity: item.quantity
				})),
				shipping_lines: [
					{
						method_id: 'flat_rate',
						method_title: 'Livraison gratuite',
						total: shippingCost.toString()
					}
				]
			};

			// Récupération de l'ID utilisateur via NextAuth
			const userId = session?.user?.id;
			console.log('Session:', session);
			console.log('User ID from session:', userId);

			if (!userId) {
				console.warn('Utilisateur non connecté, la commande sera créée sans ID utilisateur');
			} else {
				// Enregistrer les adresses dans le profil utilisateur
				try {
					// Créer l'objet d'adresse au format attendu par le profil
					const shippingAddress = {
						first_name: formData.firstName,
						last_name: formData.lastName,
						address_1: formData.address,
						city: formData.city,
						postcode: formData.postalCode,
						country: formData.country,
					};
					
					const billingAddress = {
						first_name: formData.firstName,
						last_name: formData.lastName,
						address_1: formData.address,
						city: formData.city,
						postcode: formData.postalCode,
						country: formData.country,
						email: formData.email,
						phone: formData.phone,
					};
					
					// Mettre à jour le profil avec les adresses de livraison et facturation
					const { data: profileResponse, error: profileError } = await supabase
						.from('profiles')
						.update({
							shipping_address: shippingAddress,
							billing_address: billingAddress,
							updated_at: new Date().toISOString()
						})
						.eq('id', userId);
						
					if (profileError) {
						console.error('Erreur lors de la mise à jour du profil:', profileError);
					} else {
						console.log('Profil mis à jour avec les adresses de commande');
					}
				} catch (profileUpdateError) {
					console.error('Erreur inattendue lors de la mise à jour du profil:', profileUpdateError);
				}
			}

			// Création de la commande via l'API qui contourne RLS
			const orderResponse = await fetch('/api/create-order', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					total: total,
					items: items.map(item => ({
						product_id: item.id,
						product_name: item.name,
						quantity: item.quantity,
						price: item.price,
						subtotal: item.price * item.quantity,
						image_url: item.image || '/images/placeholder.jpg'
					})),
					billing_address: orderData.billing,
					shipping_address: orderData.shipping
				})
			});

			if (!orderResponse.ok) {
				const errorData = await orderResponse.json();
				throw new Error(errorData.error || 'Erreur lors de la création de la commande');
			}

			const { order } = await orderResponse.json();

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
	if (orderCreated && orderDetails) {
		return (
			<div className='checkout-container'>
				<div className='max-w-2xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-md'>
					<h2 className='text-2xl font-bold mb-4'>Finaliser votre commande</h2>
					<div className='mb-6 p-4 bg-blue-50 rounded-md border border-blue-200'>
						<p className='mb-2 font-semibold'>Commande #{orderDetails.orderId} créée avec succès!</p>
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
								className='form-input'>
								<option value='France'>France</option>
								<option value='Belgique'>Belgique</option>
								<option value='Suisse'>Suisse</option>
								<option value='Canada'>Canada</option>
								<option value='Luxembourg'>Luxembourg</option>
							</select>
						</div>

						{orderError && (
							<div className='error-message mt-4 p-3 bg-red-100 text-red-700 rounded-md'>
								{orderError}
							</div>
						)}

						<div className='form-submit mt-6'>
							<button
								type='submit'
								className='checkout-button'
								disabled={isSubmitting}>
								{isSubmitting ? 'Traitement...' : 'Procéder au paiement'}
							</button>
						</div>
					</form>
				</div>

				<div className='checkout-summary'>
					<h2 className='text-xl font-semibold mb-4'>
						Récapitulatif de commande
					</h2>

					<div className='summary-items'>
						<div className='items-list'>
							{items.map((item, index) => (
								<div
									key={index}
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
							<span className="font-medium bg-green-100 text-green-700 py-1 px-2 rounded-md text-xs">
								GRATUITE
							</span>
						</div>

						<div className='summary-item summary-total'>
							<span>Total</span>
							<span>{formatPrice(total)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutContent;