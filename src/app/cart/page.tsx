import { Metadata } from 'next';
import CartPageContent from '@/components/CartPageContent';
import '@/app/styles/cart.css';

export const metadata: Metadata = {
  title: 'Panier | Selectura',
  description: 'Consultez les articles dans votre panier et passez à la caisse.',
};

export default function CartPage() {
  return <CartPageContent />;
}