// src/app/account/orders/invoice/page.tsx
import React from 'react';
import OrderInvoice from '@/components/OrderInvoice';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Facture - Selectura',
	description: 'Visualisez et imprimez votre facture de commande',
};

export default async function OrderInvoicePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
	const params = await searchParams;
	const orderId = params.id ? parseInt(params.id, 10) : 0;

	return <OrderInvoice orderId={orderId} />;
}
