import { ReactNode } from 'react';
import { CartProvider } from './CartProvider';

const CartContext = ({ children }: { children: ReactNode }) => {
	return <CartProvider>{children}</CartProvider>;
};

export default CartContext;
