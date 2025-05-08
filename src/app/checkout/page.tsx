import React from 'react';
import CheckoutContent from '@/components/CheckoutContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paiement - Finaliser votre commande',
  description: 'Page de paiement sécurisée pour finaliser votre achat',
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}