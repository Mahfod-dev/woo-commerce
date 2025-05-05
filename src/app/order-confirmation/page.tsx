import React from 'react';
import OrderConfirmationContent from '@/components/OrderConfirmationContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmation - Thank You for Your Purchase',
  description: 'Your order has been successfully placed.',
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationContent />;
}