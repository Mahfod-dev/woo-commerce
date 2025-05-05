import React, { useEffect } from 'react';
import Link from 'next/link';
import '@/app/styles/order-confirmation.css';
import { useRouter } from 'next/navigation';

const OrderConfirmationContent = () => {
  const router = useRouter();
  const orderNumber = `WOO-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate a random delivery date (5-7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5 + Math.floor(Math.random() * 3));
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    // This will prevent direct access to the confirmation page
    // by checking if the user came from the checkout page
    const referrer = document.referrer;
    if (!referrer.includes('/checkout')) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="confirmation-container">
      <div className="confirmation-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="confirmation-title">Thank You for Your Order!</h1>
      <p className="confirmation-subtitle">
        Your order has been placed successfully and is being processed.
      </p>
      
      <div className="confirmation-details">
        <div className="detail-row">
          <span className="detail-label">Order Number:</span>
          <span className="detail-value">{orderNumber}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Order Date:</span>
          <span className="detail-value">{orderDate}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Estimated Delivery:</span>
          <span className="detail-value">{formattedDeliveryDate}</span>
        </div>
      </div>
      
      <p className="mb-6">
        We&apos;ve sent a confirmation email with all the details of your order.
        If you have any questions, please contact our customer service.
      </p>
      
      <Link href="/" className="continue-shopping-btn">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmationContent;