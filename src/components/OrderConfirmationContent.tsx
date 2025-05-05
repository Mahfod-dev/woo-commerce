'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/app/styles/order-confirmation.css';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/wooClient';
import { getOrderById } from '@/lib/woo';

interface OrderInfo {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  total: string;
}

const OrderConfirmationContent = () => {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate a random delivery date (5-7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5 + Math.floor(Math.random() * 3));
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const loadOrderInfo = async () => {
      try {
        // Récupérer les informations de commande depuis localStorage
        const storedOrderInfo = localStorage.getItem('lastOrder');
        
        if (storedOrderInfo) {
          const parsedOrderInfo: OrderInfo = JSON.parse(storedOrderInfo);
          setOrderInfo(parsedOrderInfo);
          
          // Tenter de récupérer des informations supplémentaires depuis l'API
          if (parsedOrderInfo.orderId) {
            const orderDetails = await getOrderById(parsedOrderInfo.orderId);
            if (orderDetails) {
              // Mettre à jour avec des informations plus complètes si disponibles
              setOrderInfo(prev => ({
                ...prev!,
                total: orderDetails.total
              }));
            }
          }
        } else {
          // Si pas d'info de commande, rediriger vers la page d'accueil
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading order information:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrderInfo();
  }, [router]);

  if (isLoading) {
    return (
      <div className="confirmation-container">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <p className="text-center text-gray-500">Loading order information...</p>
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div className="confirmation-container">
        <h2 className="text-xl font-bold text-red-600">Order information not found</h2>
        <p className="mb-6">We couldn't find your order information. Please contact customer service.</p>
        <Link href="/" className="continue-shopping-btn">
          Return to Home
        </Link>
      </div>
    );
  }

  // Formatter la date
  const orderDate = new Date(orderInfo.orderDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
          <span className="detail-value">#{orderInfo.orderNumber}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Order Date:</span>
          <span className="detail-value">{orderDate}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Estimated Delivery:</span>
          <span className="detail-value">{formattedDeliveryDate}</span>
        </div>
        {orderInfo.total && (
          <div className="detail-row">
            <span className="detail-label">Total:</span>
            <span className="detail-value">{formatPrice(parseFloat(orderInfo.total))}</span>
          </div>
        )}
      </div>
      
      <p className="mb-6">
        We&apos;ve sent a confirmation email with all the details of your order.
        If you have any questions, please contact our customer service.
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
        <Link href="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
        
        <Link href={`/my-account/orders/${orderInfo.orderId}`} className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition-colors">
          Track Order
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationContent;