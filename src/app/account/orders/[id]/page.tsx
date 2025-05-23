import OrderDetails from '@/components/OrderDetails';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Détails de la commande - Selectura',
  description: 'Consultez les détails et le statut de votre commande.',
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage(props: Props) {
  const params = await props.params;
  const orderId = parseInt(params.id, 10);
  
  return <OrderDetails orderId={orderId} />;
}