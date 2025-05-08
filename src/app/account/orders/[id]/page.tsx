import OrderDetails from '@/components/OrderDetails';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Détails de la commande - Selectura',
  description: 'Consultez les détails et le statut de votre commande.',
};

type Props = {
  params: {
    id: string;
  };
};

export default function OrderDetailsPage(props: Props) {
  const orderId = parseInt(props.params.id, 10);
  
  return <OrderDetails orderId={orderId} />;
}