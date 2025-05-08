import React from 'react';
import OrderConfirmationContent from '@/components/OrderConfirmationContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirmation de commande - Merci pour votre achat',
  description: 'Votre commande a été passée avec succès.',
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationContent />;
}