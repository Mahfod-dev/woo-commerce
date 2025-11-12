'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/wooClient';
import { motion } from 'framer-motion';
import CartSchema from '@/components/CartSchema';

export default function CartPageContent() {
  const { items, updateQuantity, removeFromCart, itemCount, subtotal, isLoading } = useCart();
  const [couponCode, setCouponCode] = useState('');
  
  // Livraison gratuite
  const shippingCost = 0;
  
  // Total avec les frais de livraison
  const total = subtotal + shippingCost;

  // Animation pour les éléments du panier
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
        duration: 0.4,
      },
    },
  };

  // Fonction pour augmenter la quantité
  const incrementQuantity = (key: string, currentQty: number) => {
    updateQuantity(key, currentQty + 1);
  };

  // Fonction pour diminuer la quantité
  const decrementQuantity = (key: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(key, currentQty - 1);
    }
  };

  return (
    <div className="container cart-content mx-auto px-4 py-12 max-w-7xl">
      <CartSchema />
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Votre Panier</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Votre panier est vide</h2>
          <p className="text-gray-500 mb-8">Ajoutez des produits à votre panier pour commencer vos achats.</p>
          <Link
            href="/products"
            className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* En-tête du tableau */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-500">
                <div className="col-span-6">Produit</div>
                <div className="col-span-2 text-center">Prix</div>
                <div className="col-span-2 text-center">Quantité</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Liste des produits */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-gray-100"
              >
                {items.map((item) => (
                  <motion.div
                    key={item.key}
                    variants={itemVariants}
                    className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                  >
                    {/* Produit et image */}
                    <div className="col-span-6 flex items-center space-x-4">
                      <div className="relative h-24 w-24 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                        {item.variation_attributes && item.variation_attributes.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {item.variation_attributes.map((attr, index) => (
                              <p key={index} className="text-sm text-gray-500">
                                {attr.name}: <span className="font-medium">{attr.value}</span>
                              </p>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => removeFromCart(item.key)}
                          disabled={isLoading}
                          className="mt-2 text-sm text-red-500 flex items-center hover:text-red-700 transition-colors"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </div>

                    {/* Prix unitaire */}
                    <div className="col-span-2 text-center">
                      {item.regular_price && parseFloat(item.regular_price) > parseFloat(item.price) ? (
                        <>
                          <span className="text-xs line-through text-gray-500 block">
                            {formatPrice(parseFloat(item.regular_price))}
                          </span>
                          <span className="text-sm font-medium text-red-600">
                            {formatPrice(parseFloat(item.price))}
                          </span>
                          <span className="text-xs text-red-600 font-medium mt-1 block">
                            Promotion
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(parseFloat(item.price))}
                        </span>
                      )}
                    </div>

                    {/* Sélecteur de quantité */}
                    <div className="col-span-2 flex justify-center">
                      <div className="flex border border-gray-300 rounded-md w-32">
                        <button
                          onClick={() => decrementQuantity(item.key, item.quantity)}
                          disabled={isLoading || item.quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <div className="flex-1 h-10 flex items-center justify-center font-medium text-gray-700">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => incrementQuantity(item.key, item.quantity)}
                          disabled={isLoading}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Prix total */}
                    <div className="col-span-2 text-right">
                      {item.regular_price && parseFloat(item.regular_price) > parseFloat(item.price) ? (
                        <>
                          <span className="text-xs line-through text-gray-500 block">
                            {formatPrice(parseFloat(item.regular_price) * item.quantity)}
                          </span>
                          <span className="font-medium text-red-600">
                            {formatPrice(parseFloat(item.price) * item.quantity)}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium text-gray-900">
                          {formatPrice(parseFloat(item.price) * item.quantity)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Bouton continuer les achats */}
              <div className="p-6 border-t border-gray-100 flex">
                <Link 
                  href="/products" 
                  className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>

          {/* Récapitulatif de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h2>
              
              {/* Entrée du code promo */}
              <div className="mb-6">
                <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                  Code promo
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 block w-full border border-gray-300 rounded-l-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Entrez votre code"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
              
              {/* Détails des coûts */}
              <div className="space-y-3 text-sm border-t border-gray-200 py-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total ({itemCount} {itemCount > 1 ? 'articles' : 'article'})</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium bg-green-100 text-green-700 py-1 px-2 rounded-md text-xs">
                    GRATUITE
                  </span>
                </div>
                {/* Espace pour afficher la réduction si un code promo est appliqué */}
              </div>
              
              {/* Total */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
                <span className="text-base font-medium text-gray-900">Total</span>
                <motion.span 
                  className="text-xl font-bold text-gray-900"
                  key={total}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {formatPrice(total)}
                </motion.span>
              </div>
              
              {/* Bouton commander */}
              <Link
                href="/checkout"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Procéder au paiement
              </Link>
              
              {/* Méthodes de paiement et sécurité */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 mb-2">Paiement 100% sécurisé</p>
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}