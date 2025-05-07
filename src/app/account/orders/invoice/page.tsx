// src/app/account/orders/[id]/invoice/page.tsx
import React from 'react';
import OrderInvoice from '@/components/OrderInvoice';
import type { Metadata } from 'next';

interface OrderInvoicePageProps {
	params: {
		id: string;
	};
}

export const metadata: Metadata = {
	title: 'Invoice - Selectura',
	description: 'View and print your order invoice',
};

export default function OrderInvoicePage({ params }: OrderInvoicePageProps) {
	const orderId = parseInt(params.id, 10);

	return <OrderInvoice orderId={orderId} />;
}
