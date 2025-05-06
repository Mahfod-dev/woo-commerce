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
		paymentMethod: 'card',
	});
  
	// New state for order tracking
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
		// Redirect to homepage if cart is empty
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
			// Prepare the order data for WooCommerce
			const orderData = {
				payment_method: formData.paymentMethod,
				payment_method_title: formData.paymentMethod === 'card' ? 'Credit Card' : 'PayPal',
				set_paid: false, // The payment will be confirmed separately
				billing: {
					first_name: formData.firstName,
					last_name: formData.lastName,
					address_1: formData.address,
					city: formData.city,
					state: '', // Optional
					postcode: formData.postalCode,
					country: formData.country,
					email: formData.email,
					phone: formData.phone,
					company: '' // Field potentially required by WooCommerce
				},
				shipping: {
					first_name: formData.firstName,
					last_name: formData.lastName,
					address_1: formData.address,
					city: formData.city,
					state: '', // Optional
					postcode: formData.postalCode,
					country: formData.country,
					company: '' // Field potentially required by WooCommerce
				},
				line_items: items.map(item => ({
					product_id: item.id,
					quantity: item.quantity
				})),
				shipping_lines: [
					{
						method_id: 'flat_rate',
						method_title: subtotal > 100 ? 'Free shipping' : 'Flat rate',
						total: shippingCost.toString()
					}
				]
			};

			// Create the order in WooCommerce
			const order = await createOrder(orderData);
			
			if (!order) {
				throw new Error('Failed to create order');
			}

			// Store order details for payment processing
			setOrderDetails({
				orderId: order.id,
				total: order.total
			});
			
			// Store the order info for confirmation page
			localStorage.setItem('lastOrder', JSON.stringify({
				orderId: order.id,
				orderNumber: order.id.toString(),
				orderDate: new Date().toISOString(),
				total: order.total
			}));
			
			setOrderCreated(true);
			
			// Success notification
			addNotification({
				type: 'success',
				message: `Order #${order.id} created. Please complete payment.`,
				duration: 3000
			});
			
		} catch (error) {
			console.error('Error processing order:', error);
			setOrderError('An error occurred while processing your order. Please try again.');
			
			addNotification({
				type: 'error',
				message: 'Failed to create order. Please try again.',
				duration: 7000
			});
			setIsSubmitting(false);
		}
	};
	
	// Handle successful payment
	const handlePaymentSuccess = async (paymentIntentId: string) => {
		try {
			// Update order status in WooCommerce (you'll need to create this API endpoint)
			const response = await fetch('/api/update-order-payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					orderId: orderDetails?.orderId,
					paymentIntentId,
				}),
			});
			
			if (!response.ok) {
				throw new Error('Failed to update order payment status');
			}
			
			// Clear the cart after successful payment
			clearCart();
			
			// Show success notification
			addNotification({
				type: 'success',
				message: 'Payment successful! Redirecting to order confirmation...',
				duration: 3000
			});
			
			// Redirect to order confirmation page
			setTimeout(() => {
				router.push('/order-confirmation');
			}, 1500);
			
		} catch (error) {
			console.error('Error updating payment status:', error);
			addNotification({
				type: 'error',
				message: 'Payment completed, but we had trouble updating your order. Please contact support.',
				duration: 7000
			});
			
			// Still redirect to confirmation since payment was successful
			router.push('/order-confirmation');
		}
	};
	
	// Handle payment error
	const handlePaymentError = (errorMessage: string) => {
		addNotification({
			type: 'error',
			message: `Payment failed: ${errorMessage}`,
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
	
	// Render payment form if order is created, otherwise show checkout form
	if (orderCreated && orderDetails) {
		return (
			<div className='checkout-container'>
				<h1 className='text-3xl font-bold mb-6'>Complete Your Payment</h1>
				
				<div className='max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md'>
					<h2 className='text-xl font-medium mb-4'>Order #{orderDetails.orderId}</h2>
					<p className='mb-6'>Please complete your payment to confirm your order.</p>
					
					<StripePaymentForm 
						orderId={orderDetails.orderId}
						orderTotal={orderDetails.total}
						onSuccess={handlePaymentSuccess}
						onError={handlePaymentError}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className='checkout-container'>
			<h1 className='text-3xl font-bold mb-6'>Checkout</h1>

			<div className='checkout-grid'>
				<div className='checkout-form'>
					<h2 className='text-xl font-semibold mb-4'>
						Billing Details
					</h2>

					<form onSubmit={handleSubmit}>
						<div className='form-row'>
							<div className='form-group'>
								<label
									htmlFor='firstName'
									className='form-label'>
									First Name
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
									Last Name
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
									Phone
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
								Address
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
									City
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
									Postal Code
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
								Country
							</label>
							<select
								id='country'
								name='country'
								value={formData.country}
								onChange={handleChange}
								className='form-input'
								required>
								<option value='France'>France</option>
								<option value='Belgium'>Belgium</option>
								<option value='Switzerland'>Switzerland</option>
								<option value='Germany'>Germany</option>
								<option value='Italy'>Italy</option>
								<option value='Spain'>Spain</option>
							</select>
						</div>

						<div className='form-group'>
							<h3 className='text-lg font-semibold mb-2'>
								Payment Method
							</h3>
							<div className='flex items-center space-x-4'>
								<label className='flex items-center'>
									<input
										type='radio'
										name='paymentMethod'
										value='card'
										checked={
											formData.paymentMethod === 'card'
										}
										onChange={handleChange}
										className='mr-2'
									/>
									Credit Card
								</label>

								<label className='flex items-center'>
									<input
										type='radio'
										name='paymentMethod'
										value='paypal'
										checked={
											formData.paymentMethod === 'paypal'
										}
										onChange={handleChange}
										className='mr-2'
									/>
									PayPal
								</label>
							</div>
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
								? 'Processing...'
								: `Continue to Payment - ${formatPrice(total)}`}
						</button>
					</form>
				</div>

				<div className='checkout-summary'>
					<h2 className='text-xl font-semibold mb-4'>
						Order Summary
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
										Qty: {item.quantity}
									</span>
								</div>
							</div>
						))}
					</div>

					<div className='summary-item'>
						<span>Subtotal</span>
						<span>{formatPrice(subtotal)}</span>
					</div>

					<div className='summary-item'>
						<span>Shipping</span>
						<span>
							{shippingCost === 0
								? 'Free'
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

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import '@/app/styles/checkout.css';
// import { formatPrice } from '@/lib/wooClient';
// import { createOrder, getPaymentLink } from '@/lib/woo';
// import { useCart } from './CartProvider';
// import { useNotification } from '@/context/notificationContext';

// const CheckoutContent = () => {
// 	const router = useRouter();
// 	const { items, clearCart } = useCart();
// 	const { addNotification } = useNotification();
// 	const [isSubmitting, setIsSubmitting] = useState(false);
// 	const [orderError, setOrderError] = useState('');
// 	const [formData, setFormData] = useState({
// 		firstName: '',
// 		lastName: '',
// 		email: '',
// 		phone: '',
// 		address: '',
// 		city: '',
// 		postalCode: '',
// 		country: 'France',
// 		paymentMethod: 'card',
// 	});

// 	const subtotal = items.reduce(
// 		(total, item) => total + parseFloat(item.price) * item.quantity,
// 		0
// 	);
// 	const shippingCost = subtotal > 100 ? 0 : 7.99;
// 	const total = subtotal + shippingCost;

// 	useEffect(() => {
// 		// Redirect to homepage if cart is empty
// 		if (items.length === 0) {
// 			router.push('/');
// 		}
// 	}, [items, router]);

// 	const handleChange = (
// 		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
// 	) => {
// 		const { name, value } = e.target;
// 		setFormData((prev) => ({
// 			...prev,
// 			[name]: value,
// 		}));
// 	};

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setIsSubmitting(true);
// 		setOrderError('');

// 		try {
// 			// Préparer les données de la commande pour WooCommerce
// 			const orderData = {
// 				payment_method: formData.paymentMethod,
// 				payment_method_title: formData.paymentMethod === 'card' ? 'Credit Card' : 'PayPal',
// 				set_paid: false, // Le paiement sera confirmé séparément
// 				billing: {
// 					first_name: formData.firstName,
// 					last_name: formData.lastName,
// 					address_1: formData.address,
// 					city: formData.city,
// 					state: '', // Optionnel
// 					postcode: formData.postalCode,
// 					country: formData.country,
// 					email: formData.email,
// 					phone: formData.phone,
// 					company: '' // Champ potentiellement requis par WooCommerce
// 				},
// 				shipping: {
// 					first_name: formData.firstName,
// 					last_name: formData.lastName,
// 					address_1: formData.address,
// 					city: formData.city,
// 					state: '', // Optionnel
// 					postcode: formData.postalCode,
// 					country: formData.country,
// 					company: '' // Champ potentiellement requis par WooCommerce
// 				},
// 				line_items: items.map(item => ({
// 					product_id: item.id,
// 					quantity: item.quantity
// 				})),
// 				shipping_lines: [
// 					{
// 						method_id: 'flat_rate',
// 						method_title: subtotal > 100 ? 'Free shipping' : 'Flat rate',
// 						total: shippingCost.toString()
// 					}
// 				]
// 			};

// 			// Envoyer la commande à WooCommerce
// 			const order = await createOrder(orderData);
			
// 			if (!order) {
// 				throw new Error('Failed to create order');
// 			}

// 			// Stocker les détails de la commande dans localStorage pour la page de confirmation
// 			localStorage.setItem('lastOrder', JSON.stringify({
// 				orderId: order.id,
// 				orderNumber: order.id.toString(),
// 				orderDate: new Date().toISOString(),
// 				total: order.total
// 			}));

// 			// Récupérer le lien de paiement WooCommerce
// 			const paymentUrl = await getPaymentLink(order.id);
			
// 			// Afficher une notification de succès
// 			addNotification({
// 				type: 'success',
// 				message: `Order #${order.id} created. Redirecting to payment...`,
// 				duration: 3000
// 			});

// 			// Clear cart after successful order
// 			clearCart();

// 			if (paymentUrl) {
// 				// Rediriger vers la page de paiement WooCommerce avec Stripe
// 				window.location.href = paymentUrl; // Utiliser window.location pour rediriger vers un domaine externe
// 			} else {
// 				// Si aucun lien de paiement n'est disponible, rediriger vers la page de confirmation
// 				router.push('/order-confirmation');
// 			}
// 		} catch (error) {
// 			console.error('Error processing order:', error);
// 			setOrderError('An error occurred while processing your order. Please try again.');
			
// 			addNotification({
// 				type: 'error',
// 				message: 'Failed to create order. Please try again.',
// 				duration: 7000
// 			});
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};

// 	const isFormValid = () => {
// 		const { firstName, lastName, email, phone, address, city, postalCode } =
// 			formData;
// 		return (
// 			firstName &&
// 			lastName &&
// 			email &&
// 			phone &&
// 			address &&
// 			city &&
// 			postalCode
// 		);
// 	};

// 	return (
// 		<div className='checkout-container'>
// 			<h1 className='text-3xl font-bold mb-6'>Checkout</h1>

// 			<div className='checkout-grid'>
// 				<div className='checkout-form'>
// 					<h2 className='text-xl font-semibold mb-4'>
// 						Billing Details
// 					</h2>

// 					<form onSubmit={handleSubmit}>
// 						<div className='form-row'>
// 							<div className='form-group'>
// 								<label
// 									htmlFor='firstName'
// 									className='form-label'>
// 									First Name
// 								</label>
// 								<input
// 									type='text'
// 									id='firstName'
// 									name='firstName'
// 									value={formData.firstName}
// 									onChange={handleChange}
// 									className='form-input'
// 									required
// 								/>
// 							</div>

// 							<div className='form-group'>
// 								<label
// 									htmlFor='lastName'
// 									className='form-label'>
// 									Last Name
// 								</label>
// 								<input
// 									type='text'
// 									id='lastName'
// 									name='lastName'
// 									value={formData.lastName}
// 									onChange={handleChange}
// 									className='form-input'
// 									required
// 								/>
// 							</div>
// 						</div>

// 						<div className='form-row'>
// 							<div className='form-group'>
// 								<label
// 									htmlFor='email'
// 									className='form-label'>
// 									Email
// 								</label>
// 								<input
// 									type='email'
// 									id='email'
// 									name='email'
// 									value={formData.email}
// 									onChange={handleChange}
// 									className='form-input'
// 									required
// 								/>
// 							</div>

// 							<div className='form-group'>
// 								<label
// 									htmlFor='phone'
// 									className='form-label'>
// 									Phone
// 								</label>
// 								<input
// 									type='tel'
// 									id='phone'
// 									name='phone'
// 									value={formData.phone}
// 									onChange={handleChange}
// 									className='form-input'
// 									required
// 								/>
// 							</div>
// 						</div>

// 						<div className='form-group'>
// 							<label
// 								htmlFor='address'
// 								className='form-label'>
// 								Address
// 							</label>
// 							<input
// 								type='text'
// 								id='address'
// 								name='address'
// 								value={formData.address}
// 								onChange={handleChange}
// 								className='form-input'
// 								required
// 							/>
// 						</div>

// 						<div className='form-row'>
// 							<div className='form-group'>
// 								<label
// 									htmlFor='city'
// 									className='form-label'>
// 									City
// 								</label>
// 								<input
// 									type='text'
// 									id='city'
// 									name='city'
// 									value={formData.city}
// 									onChange={handleChange}
// 									className='form-input'
// 									required
// 								/>
// 							</div>

// 							<div className='form-group'>
// 								<label
// 									htmlFor='postalCode'
// 									className='form-label'>
// 									Postal Code
// 								</label>
// 								<input
// 									type='text'
// 									id='postalCode'
// 									name='postalCode'
// 									value={formData.postalCode}
// 									onChange={handleChange}
// 									className='form-input'
// 									required
// 								/>
// 							</div>
// 						</div>

// 						<div className='form-group'>
// 							<label
// 								htmlFor='country'
// 								className='form-label'>
// 								Country
// 							</label>
// 							<select
// 								id='country'
// 								name='country'
// 								value={formData.country}
// 								onChange={handleChange}
// 								className='form-input'
// 								required>
// 								<option value='France'>France</option>
// 								<option value='Belgium'>Belgium</option>
// 								<option value='Switzerland'>Switzerland</option>
// 								<option value='Germany'>Germany</option>
// 								<option value='Italy'>Italy</option>
// 								<option value='Spain'>Spain</option>
// 							</select>
// 						</div>

// 						<div className='form-group'>
// 							<h3 className='text-lg font-semibold mb-2'>
// 								Payment Method
// 							</h3>
// 							<div className='flex items-center space-x-4'>
// 								<label className='flex items-center'>
// 									<input
// 										type='radio'
// 										name='paymentMethod'
// 										value='card'
// 										checked={
// 											formData.paymentMethod === 'card'
// 										}
// 										onChange={handleChange}
// 										className='mr-2'
// 									/>
// 									Credit Card
// 								</label>

// 								<label className='flex items-center'>
// 									<input
// 										type='radio'
// 										name='paymentMethod'
// 										value='paypal'
// 										checked={
// 											formData.paymentMethod === 'paypal'
// 										}
// 										onChange={handleChange}
// 										className='mr-2'
// 									/>
// 									PayPal
// 								</label>
// 							</div>
// 						</div>
						
// 						{orderError && (
// 							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
// 								{orderError}
// 							</div>
// 						)}

// 						<button
// 							type='submit'
// 							className='checkout-btn mt-4'
// 							disabled={isSubmitting || !isFormValid()}>
// 							{isSubmitting
// 								? 'Processing...'
// 								: `Complete Order - ${formatPrice(total)}`}
// 						</button>
// 					</form>
// 				</div>

// 				<div className='checkout-summary'>
// 					<h2 className='text-xl font-semibold mb-4'>
// 						Order Summary
// 					</h2>

// 					<div className='mb-4'>
// 						{items.map((item) => (
// 							<div
// 								key={item.key}
// 								className='cart-item'>
// 								<div className='relative w-20 h-20'>
// 									<Image
// 										src={
// 											item.image ||
// 											'/images/placeholder.jpg'
// 										}
// 										alt={item.name}
// 										fill
// 										className='cart-item-img'
// 									/>
// 								</div>
// 								<div className='cart-item-info'>
// 									<span className='cart-item-name'>
// 										{item.name}
// 									</span>
// 									<span className='cart-item-price'>
// 										{formatPrice(parseFloat(item.price))}
// 									</span>
// 									<span className='cart-item-quantity'>
// 										Qty: {item.quantity}
// 									</span>
// 								</div>
// 							</div>
// 						))}
// 					</div>

// 					<div className='summary-item'>
// 						<span>Subtotal</span>
// 						<span>{formatPrice(subtotal)}</span>
// 					</div>

// 					<div className='summary-item'>
// 						<span>Shipping</span>
// 						<span>
// 							{shippingCost === 0
// 								? 'Free'
// 								: formatPrice(shippingCost)}
// 						</span>
// 					</div>

// 					<div className='summary-item summary-total'>
// 						<span>Total</span>
// 						<span>{formatPrice(total)}</span>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default CheckoutContent;