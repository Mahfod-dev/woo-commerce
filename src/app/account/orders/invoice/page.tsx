// src/app/account/orders/invoice/page.tsx
import React from 'react';
import OrderInvoice from '@/components/OrderInvoice';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Facture - Selectura',
	description: 'Visualisez et imprimez votre facture de commande',
};

export default function OrderInvoicePage({ searchParams }: { searchParams: { id?: string } }) {
	const orderId = searchParams.id ? parseInt(searchParams.id, 10) : 0;

	return <OrderInvoice orderId={orderId} />;
}
