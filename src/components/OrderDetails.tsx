'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/notificationContext';
import { formatPrice } from '@/lib/wooClient';

// Types for order data
interface OrderItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  subtotal: string;
  total: string;
  price: number;
  sku: string;
  image?: string;
}

interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  date_modified: string;
  total: string;
  currency: string;
  payment_method: string;
  payment_method_title: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: OrderItem[];
  shipping_lines: {
    id: number;
    method_title: string;
    total: string;
  }[];
}

interface OrderDetailsProps {
  orderId: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState<{
    placed: boolean;
    paid: boolean;
    processing: boolean;
    shipped: boolean;
    delivered: boolean;
  }>({
    placed: false,
    paid: false,
    processing: false,
    shipped: false,
    delivered: false,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        // Check for authentication
        const isLoggedIn = localStorage.getItem('userToken');
        if (!isLoggedIn) {
          addNotification({
            type: 'warning',
            message: 'Veuillez vous connecter pour voir les détails de votre commande',
            duration: 5000,
          });
          router.push('/login');
          return;
        }

        // In a real app, this would be an API call to your backend
        // For demo, we'll use mock data
        const mockOrder: Order = {
          id: orderId,
          number: orderId.toString(),
          status: 'processing',
          date_created: '2025-04-15T10:30:00',
          date_modified: '2025-04-15T10:35:00',
          total: '129.99',
          currency: 'EUR',
          payment_method: 'stripe',
          payment_method_title: 'Credit Card (Stripe)',
          billing: {
            first_name: 'Jean',
            last_name: 'Dupont',
            company: 'Company Inc.',
            address_1: '123 Rue de Paris',
            address_2: 'Apt 4B',
            city: 'Paris',
            state: 'Île-de-France',
            postcode: '75001',
            country: 'France',
            email: 'customer@example.com',
            phone: '0123456789',
          },
          shipping: {
            first_name: 'Jean',
            last_name: 'Dupont',
            company: '',
            address_1: '123 Rue de Paris',
            address_2: 'Apt 4B',
            city: 'Paris',
            state: 'Île-de-France',
            postcode: '75001',
            country: 'France',
          },
          line_items: [
            {
              id: 1,
              name: 'Premium Product',
              product_id: 123,
              variation_id: 0,
              quantity: 1,
              subtotal: '129.99',
              total: '129.99',
              price: 129.99,
              sku: 'PP-001',
              image: '/images/placeholder.jpg',
            },
          ],
          shipping_lines: [
            {
              id: 1,
              method_title: 'Free shipping',
              total: '0.00',
            },
          ],
        };
        
        setOrder(mockOrder);
        
        // Update order status based on the status from backend
        updateOrderStatus(mockOrder.status);
      } catch (error) {
        console.error('Error fetching order:', error);
        addNotification({
          type: 'error',
          message: 'Impossible de charger les détails de la commande',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, addNotification, router]);

  // Update order status based on status string
  const updateOrderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        setOrderStatus({
          placed: true,
          paid: false,
          processing: false,
          shipped: false,
          delivered: false,
        });
        break;
      case 'processing':
        setOrderStatus({
          placed: true,
          paid: true,
          processing: true,
          shipped: false,
          delivered: false,
        });
        break;
      case 'on-hold':
        setOrderStatus({
          placed: true,
          paid: true,
          processing: false,
          shipped: false,
          delivered: false,
        });
        break;
      case 'completed':
        setOrderStatus({
          placed: true,
          paid: true,
          processing: true,
          shipped: true,
          delivered: true,
        });
        break;
      case 'cancelled':
        setOrderStatus({
          placed: true,
          paid: false,
          processing: false,
          shipped: false,
          delivered: false,
        });
        break;
      case 'refunded':
        setOrderStatus({
          placed: true,
          paid: true,
          processing: true,
          shipped: false,
          delivered: false,
        });
        break;
      case 'failed':
        setOrderStatus({
          placed: true,
          paid: false,
          processing: false,
          shipped: false,
          delivered: false,
        });
        break;
      default:
        setOrderStatus({
          placed: true,
          paid: false,
          processing: false,
          shipped: false,
          delivered: false,
        });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get expected delivery date (5-7 days from order date)
  const getExpectedDeliveryDate = (orderDate: string) => {
    const date = new Date(orderDate);
    // Add 5-7 days
    date.setDate(date.getDate() + 5 + Math.floor(Math.random() * 3));
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get a readable status name in French
  const getStatusName = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En traitement';
      case 'on-hold':
        return 'En suspens';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      case 'refunded':
        return 'Remboursée';
      case 'failed':
        return 'Échouée';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');
    }
  };

  // Handle reorder action
  const handleReorder = async () => {
    try {
      if (!order) return;
      
      addNotification({
        type: 'info',
        message: 'Commande des articles de votre commande précédente...',
        duration: 3000,
      });
      
      // This would be an API call to add items to cart
      // For demo, we'll just simulate this with a notification
      
      setTimeout(() => {
        addNotification({
          type: 'success',
          message: 'Articles ajoutés à votre panier !',
          duration: 3000,
        });
        
        router.push('/cart');
      }, 1500);
    } catch (error) {
      console.error('Error reordering items:', error);
      addNotification({
        type: 'error',
        message: 'Impossible de commander à nouveau ces articles',
        duration: 5000,
      });
    }
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    try {
      if (!order) return;
      
      if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ? Cette action ne peut pas être annulée.')) {
        addNotification({
          type: 'info',
          message: 'Traitement de l\'annulation de la commande...',
          duration: 3000,
        });
        
        // This would be an API call to cancel the order
        // For demo, we'll just simulate this with a notification
        
        setTimeout(() => {
          setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
          updateOrderStatus('cancelled');
          
          addNotification({
            type: 'success',
            message: 'Commande annulée avec succès',
            duration: 3000,
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      addNotification({
        type: 'error',
        message: 'Échec de l\'annulation de la commande',
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <p className="text-center text-gray-500">Chargement des détails de la commande...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Commande introuvable</h3>
          <p className="mt-1 text-sm text-gray-500">Nous n'avons pas pu trouver la commande que vous recherchez.</p>
          <div className="mt-6">
            <Link href="/account?tab=orders" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Retour à mes commandes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Calculate order summary
  const subtotal = order.line_items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const shipping = order.shipping_lines.reduce((sum, line) => sum + parseFloat(line.total), 0);
  const total = parseFloat(order.total);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <Link href="/account?tab=orders" className="text-indigo-600 hover:text-indigo-800 flex items-center mb-4">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour aux commandes
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Commande #{order.number}</h1>
              <div className="flex items-center mt-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusName(order.status)}
                </span>
                <span className="ml-4 text-sm text-gray-500">
                  Passée le {formatDate(order.date_created)}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
              {/* Show different action buttons based on order status */}
              {order.status === 'processing' && (
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                >
                  Annuler la commande
                </button>
              )}
              
              {order.status === 'completed' && (
                <button
                  onClick={handleReorder}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                >
                  Commander à nouveau
                </button>
              )}
              
              <Link
                href={`/account/orders/invoice?id=${order.id}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-center"
              >
                Voir la facture
              </Link>
            </div>
          </motion.div>

          {/* Order tracking - show for processing orders */}
          {(order.status === 'processing' || order.status === 'on-hold') && (
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Suivi de commande</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Livraison prévue</span>
                    <span className="text-sm font-medium text-indigo-600">{getExpectedDeliveryDate(order.date_created)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p>Votre commande est en cours de traitement. Vous recevrez une confirmation d'expédition et un numéro de suivi lorsque votre commande sera expédiée.</p>
                </div>
                
                <Link href={`/tracking?order=${order.id}`} className="text-indigo-600 font-medium flex items-center hover:text-indigo-800">
                  Voir le suivi détaillé
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Order Items */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Articles commandés</h2>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.line_items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16 relative">
                            <Image 
                              src={item.image || '/images/placeholder.jpg'} 
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatPrice(parseFloat(item.total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Order Summary and Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order Summary */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Récapitulatif de la commande</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Sous-total</span>
                    <span className="text-sm text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Livraison</span>
                    <span className="text-sm text-gray-900">{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                  </div>
                  {/* You can add tax, discounts, etc. here */}
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
                    <span className="text-base text-gray-900">Total</span>
                    <span className="text-base text-indigo-600">{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-6">
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">Méthode de paiement</p>
                    <p className="mt-1">{order.payment_method_title}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping and Billing */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Informations de livraison</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Adresse de livraison</h3>
                      <address className="text-sm text-gray-600 not-italic">
                        {order.shipping.first_name} {order.shipping.last_name}<br />
                        {order.shipping.company && <>{order.shipping.company}<br /></>}
                        {order.shipping.address_1}<br />
                        {order.shipping.address_2 && <>{order.shipping.address_2}<br /></>}
                        {order.shipping.postcode} {order.shipping.city}<br />
                        {order.shipping.state && <>{order.shipping.state}<br /></>}
                        {order.shipping.country}
                      </address>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Adresse de facturation</h3>
                      <address className="text-sm text-gray-600 not-italic">
                        {order.billing.first_name} {order.billing.last_name}<br />
                        {order.billing.company && <>{order.billing.company}<br /></>}
                        {order.billing.address_1}<br />
                        {order.billing.address_2 && <>{order.billing.address_2}<br /></>}
                        {order.billing.postcode} {order.billing.city}<br />
                        {order.billing.state && <>{order.billing.state}<br /></>}
                        {order.billing.country}<br />
                        <div className="mt-2">
                          <div>{order.billing.email}</div>
                          <div>{order.billing.phone}</div>
                        </div>
                      </address>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6">
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">Méthode de livraison</p>
                    <p className="mt-1">
                      {order.shipping_lines.length > 0 
                        ? order.shipping_lines[0].method_title 
                        : 'Livraison standard'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Timeline */}
          <motion.div variants={itemVariants} className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Historique de la commande</h2>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {/* Order Placed */}
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Commande passée</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {formatDate(order.date_created)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  {/* Payment Confirmed */}
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          {orderStatus.paid ? (
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center ring-8 ring-white">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Paiement {orderStatus.paid ? 'confirmé' : 'en attente'}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {orderStatus.paid ? formatDate(order.date_modified) : 'En attente'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  {/* Processing Order */}
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          {orderStatus.processing ? (
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center ring-8 ring-white">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4V5l8 4 8-4v2z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Traitement de la commande</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {orderStatus.processing ? 'En cours' : 'En attente'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  {/* Order Shipped */}
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          {orderStatus.shipped ? (
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center ring-8 ring-white">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Commande expédiée</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {orderStatus.shipped ? formatDate(new Date().toISOString()) : 'En attente'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  {/* Order Delivered */}
                  <li>
                    <div className="relative">
                      <div className="relative flex space-x-3">
                        <div>
                          {orderStatus.delivered ? (
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center ring-8 ring-white">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Commande livrée</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {orderStatus.delivered ? formatDate(new Date().toISOString()) : 'En attente'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Help and Support */}
          <motion.div variants={itemVariants} className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Aide et support</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Besoin d'aide avec votre commande ? Notre équipe de support client est là pour vous aider.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:support@selectura.shop"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Support par email
                  </a>
                  <a
                    href="tel:+33123456789"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Support téléphonique
                  </a>
                  <Link
                    href={`/contact?reason=order&id=${order.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Formulaire de contact
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;