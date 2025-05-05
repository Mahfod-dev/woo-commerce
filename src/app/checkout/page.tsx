import React from 'react';
import CheckoutContent from '@/components/CheckoutContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout - Complete Your Order',
  description: 'Secure checkout page to complete your purchase',
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}