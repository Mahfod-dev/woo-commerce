'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useNotification } from '@/context/notificationContext';
import { formatPrice } from '@/lib/wooClient';

// Types pour les données de commande
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

interface OrderInvoiceProps {
  orderId: number;
}

const OrderInvoice: React.FC<OrderInvoiceProps> = ({ orderId }) => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        // Vérifier l'authentification
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

        // Dans une vraie application, ce serait un appel à l'API
        // Pour la démo, nous utiliserons des données fictives
        const mockOrder: Order = {
          id: orderId,
          number: orderId.toString(),
          status: 'processing',
          date_created: '2025-04-15T10:30:00',
          date_modified: '2025-04-15T10:35:00',
          total: '129.99',
          currency: 'EUR',
          payment_method: 'stripe',
          payment_method_title: 'Carte de crédit (Stripe)',
          billing: {
            first_name: 'Jean',
            last_name: 'Dupont',
            company: 'Entreprise SAS',
            address_1: '123 Rue de Paris',
            address_2: 'Apt 4B',
            city: 'Paris',
            state: 'Île-de-France',
            postcode: '75001',
            country: 'France',
            email: 'client@exemple.fr',
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
              name: 'Produit Premium',
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
              method_title: 'Livraison gratuite',
              total: '0.00',
            },
          ],
        };
        
        setOrder(mockOrder);
      } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        addNotification({
          type: 'error',
          message: 'Échec du chargement des détails de la commande',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, addNotification, router]);

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Générer le numéro de facture
  const generateInvoiceNumber = (orderId: number) => {
    return `FACT-${new Date().getFullYear()}-${orderId.toString().padStart(5, '0')}`;
  };

  // Gérer l'impression de la facture
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  // Gérer le téléchargement de la facture au format PDF
  const handleDownload = () => {
    // Dans une vraie application, cela générerait et téléchargerait un PDF
    // Pour la démo, nous afficherons simplement une notification
    addNotification({
      type: 'info',
      message: 'Téléchargement du PDF de la facture...',
      duration: 3000,
    });
    
    setTimeout(() => {
      addNotification({
        type: 'success',
        message: 'Facture téléchargée avec succès',
        duration: 3000,
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <p className="text-center text-gray-500">Chargement des détails de la facture...</p>
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
              Retour à Mes Commandes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Variantes d'animation
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

  // Calculer les totaux
  const subtotal = order.line_items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const shipping = order.shipping_lines.reduce((sum, line) => sum + parseFloat(line.total), 0);
  const total = parseFloat(order.total);

  return (
    <div className="bg-gray-50 min-h-screen py-16 print:py-0 print:bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="print:animate-none"
        >
          {/* En-tête - Visible uniquement lorsqu'il n'y a pas d'impression */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 print:hidden">
            <div>
              <Link href={`/account/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-800 flex items-center mb-4">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à la commande
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Facture</h1>
              <p className="text-gray-500 mt-1">Commande #{order.number}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isPrinting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Impression en cours...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimer la facture
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger PDF
              </button>
            </div>
          </motion.div>

          {/* Contenu de la facture */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 p-8 print:shadow-none print:p-0">
            {/* En-tête de facture avec logo */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-10">
              <div className="mb-6 md:mb-0">
                <div className="h-10 w-auto relative mb-2">
                  <Image
                    src="/logo.svg"
                    alt="Selectura"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-gray-500 text-sm">Selectura Shop</p>
                <p className="text-gray-500 text-sm">123 Rue du Commerce</p>
                <p className="text-gray-500 text-sm">75001 Paris, France</p>
                <p className="text-gray-500 text-sm">support@selectura.shop</p>
              </div>
              
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900">FACTURE</h2>
                <p className="text-gray-700 font-medium">{generateInvoiceNumber(order.id)}</p>
                <p className="text-gray-500 text-sm mt-2">Date : {formatDate(order.date_created)}</p>
                <p className="text-gray-500 text-sm">Commande #: {order.number}</p>
                <div className="mt-2 inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                  {order.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Détails de facturation et livraison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-gray-900 font-medium mb-2">Facturer à :</h3>
                <p className="text-gray-700">{order.billing.first_name} {order.billing.last_name}</p>
                {order.billing.company && <p className="text-gray-700">{order.billing.company}</p>}
                <p className="text-gray-700">{order.billing.address_1}</p>
                {order.billing.address_2 && <p className="text-gray-700">{order.billing.address_2}</p>}
                <p className="text-gray-700">{order.billing.postcode} {order.billing.city}</p>
                {order.billing.state && <p className="text-gray-700">{order.billing.state}</p>}
                <p className="text-gray-700">{order.billing.country}</p>
                <p className="text-gray-700 mt-2">{order.billing.email}</p>
                <p className="text-gray-700">{order.billing.phone}</p>
              </div>
              
              <div>
                <h3 className="text-gray-900 font-medium mb-2">Livrer à :</h3>
                <p className="text-gray-700">{order.shipping.first_name} {order.shipping.last_name}</p>
                {order.shipping.company && <p className="text-gray-700">{order.shipping.company}</p>}
                <p className="text-gray-700">{order.shipping.address_1}</p>
                {order.shipping.address_2 && <p className="text-gray-700">{order.shipping.address_2}</p>}
                <p className="text-gray-700">{order.shipping.postcode} {order.shipping.city}</p>
                {order.shipping.state && <p className="text-gray-700">{order.shipping.state}</p>}
                <p className="text-gray-700">{order.shipping.country}</p>
              </div>
            </div>

            {/* Mode de paiement */}
            <div className="mb-8">
              <h3 className="text-gray-900 font-medium mb-2">Mode de paiement :</h3>
              <p className="text-gray-700">{order.payment_method_title}</p>
            </div>

            {/* Tableau des articles de la commande */}
            <table className="min-w-full border border-gray-200 mb-8">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.line_items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                      {formatPrice(parseFloat(item.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totaux */}
            <div className="ml-auto w-full md:w-1/2 lg:w-1/3">
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Sous-total</span>
                  <span className="text-sm text-gray-900 font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Livraison</span>
                  <span className="text-sm text-gray-900 font-medium">{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                </div>
                {/* Vous pouvez ajouter la TVA, les remises, etc. ici */}
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="text-base text-gray-900 font-bold">Total</span>
                  <span className="text-base text-indigo-600 font-bold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes et conditions */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-gray-900 font-medium mb-2">Notes :</h3>
                  <p className="text-gray-600 text-sm">
                    Nous vous remercions de votre commande ! Si vous avez des questions concernant cette facture, veuillez contacter notre service client.
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium mb-2">Conditions générales :</h3>
                  <p className="text-gray-600 text-sm">
                    Le paiement est dû dans les 30 jours. Tous les produits restent la propriété de Selectura jusqu'au paiement intégral.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pied de page */}
          <motion.div variants={itemVariants} className="text-center text-gray-500 text-sm mt-8 print:mt-12">
            <p>Selectura Shop • TVA : FR12345678900 • RCS Paris B 123 456 789</p>
            <p>123 Rue du Commerce, 75001 Paris, France</p>
            <p className="print:hidden">Cette facture a été générée le {new Date().toLocaleDateString('fr-FR')}</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderInvoice;