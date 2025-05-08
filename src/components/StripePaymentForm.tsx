// src/components/StripePaymentForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  PaymentElement, 
  Elements, 
  useStripe, 
  useElements, 
  AddressElement 
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

// Initialisation de Stripe - remplacez par votre clé publiable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentFormProps {
  orderId: number;
  orderTotal: string;
  paymentMethod: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<PaymentFormProps> = ({ orderId, orderTotal, paymentMethod, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [appearance, setAppearance] = useState({ theme: 'stripe' as const });
  const router = useRouter();

  // Récupérer l'intention de paiement au montage du composant
  useEffect(() => {
    createPaymentIntent();
  }, [orderId, orderTotal]);

  // Créer une intention de paiement sur le serveur
  const createPaymentIntent = async () => {
    try {
      setProcessing(true);
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount: parseFloat(orderTotal) * 100, // Conversion en centimes
        }),
      });

      if (!response.ok) {
        throw new Error('Échec de création de l\'intention de paiement');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setProcessing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
      setError(errorMessage);
      onError(errorMessage);
      setProcessing(false);
    }
  };

  // Gérer la soumission du paiement
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    try {
      // Confirmer le paiement
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/order-confirmation',
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Échec du paiement');
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Appeler onSuccess avec l'ID de l'intention de paiement
        onSuccess(paymentIntent.id || paymentIntentId || '');
      } else if (paymentIntent && paymentIntent.status === 'processing') {
        // Le paiement est en cours de traitement, nous mettrons à jour via webhook plus tard
        onSuccess(paymentIntent.id || paymentIntentId || '');
      } else {
        throw new Error(`Statut du paiement: ${paymentIntent?.status || 'inconnu'}. Veuillez vérifier l'état de votre commande.`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  // Afficher le formulaire de paiement Stripe avec plusieurs méthodes de paiement
  if (!clientSecret) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-20 bg-gray-200 rounded mt-4"></div>
        </div>
        <p className="text-gray-500">Préparation des options de paiement...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="mb-4">
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400"
      >
        {processing ? 'Traitement en cours...' : `Payer ${orderTotal}€`}
      </button>
    </form>
  );
};

export default function StripePaymentForm({ orderId, orderTotal, paymentMethod = 'card-direct', onSuccess, onError }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer le secret client pour initialiser Elements
  useEffect(() => {
    const getInitialPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            amount: parseFloat(orderTotal) * 100,
          }),
        });

        if (!response.ok) {
          throw new Error('Échec de création de l\'intention de paiement');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Erreur lors de la création de l\'intention de paiement initiale:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialPaymentIntent();
  }, [orderId, orderTotal]);

  if (loading || !clientSecret) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse mb-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-16 bg-gray-200 rounded mt-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-4"></div>
        </div>
        <p className="text-gray-500">Chargement des options de paiement...</p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#4f46e5',
        colorBackground: '#ffffff',
        colorText: '#424770',
        colorDanger: '#df1b41',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm 
        orderId={orderId}
        orderTotal={orderTotal}
        paymentMethod={paymentMethod}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}