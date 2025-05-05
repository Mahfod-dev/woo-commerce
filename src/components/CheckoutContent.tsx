import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/app/styles/checkout.css';
import { useCart } from './CartContext';
import { formatPrice } from '@/lib/wooClient';

const CheckoutContent = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 100 ? 0 : 7.99;
  const total = subtotal + shippingCost;

  useEffect(() => {
    // Redirect to homepage if cart is empty
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would normally send the order to your backend
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to success page (we'll create this later)
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const { firstName, lastName, email, phone, address, city, postalCode } = formData;
    return firstName && lastName && email && phone && address && city && postalCode;
  };

  return (
    <div className="checkout-container">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="checkout-grid">
        <div className="checkout-form">
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="postalCode" className="form-label">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="country" className="form-label">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="France">France</option>
                <option value="Belgium">Belgium</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Germany">Germany</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
              </select>
            </div>
            
            <div className="form-group">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Credit Card
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  PayPal
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="checkout-btn mt-4"
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? 'Processing...' : `Complete Order - ${formatPrice(total)}`}
            </button>
          </form>
        </div>
        
        <div className="checkout-summary">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="mb-4">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image || '/images/placeholder.jpg'}
                    alt={item.name}
                    fill
                    className="cart-item-img"
                  />
                </div>
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">{formatPrice(item.price)}</span>
                  <span className="cart-item-quantity">Qty: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-item">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="summary-item">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
          </div>
          
          <div className="summary-item summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;