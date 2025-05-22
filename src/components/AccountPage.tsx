'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useNotification } from '@/context/notificationContext';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { Database } from '@/lib/supabase/types';
import '@/app/styles/account.css';

// Types
type ProfileType = Database['public']['Tables']['profiles']['Row'];
type OrderType = Database['public']['Tables']['orders']['Row'];

type AddressInfo = {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

const AccountPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addNotification } = useNotification();
  const { data: session, status } = useSession();
  
  // Vérifier le paramètre tab dans l'URL
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');
  const [userData, setUserData] = useState<ProfileType | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [claims, setClaims] = useState<any[]>([]); // For demo purposes
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingClaims, setLoadingClaims] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [claimForm, setClaimForm] = useState({
    orderId: '',
    type: 'product_issue',
    description: '',
  });

  const [editingAddress, setEditingAddress] = useState<{
    type: 'shipping' | 'billing';
    data: AddressInfo;
  } | null>(null);

  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimErrors, setClaimErrors] = useState<{
    orderId?: string;
    description?: string;
  }>({});

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

  // Fonction pour obtenir la dernière adresse d'une commande
  const getLatestAddress = (orders: OrderType[], addressType: 'shipping' | 'billing'): AddressInfo | null => {
    if (!orders || orders.length === 0) return null;

    // Trier les commandes par date décroissante
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    // Récupérer la première commande qui a une adresse valide
    for (const order of sortedOrders) {
      const address = addressType === 'shipping' ? order.shipping_address : order.billing_address;
      if (address && address.address_1) {
        return address as AddressInfo;
      }
    }

    return null;
  };

  // Load user data
  useEffect(() => {
    async function loadUserData() {
      if (status === 'loading') return; // Attendre que le status soit déterminé
      
      setIsLoading(true);

      try {
        // Check NextAuth session
        if (!session?.user) {
          // User not authenticated, redirect to login
          addNotification({
            type: 'warning',
            message: 'Veuillez vous connecter pour accéder à votre compte',
            duration: 5000,
          });
          router.push('/login');
          return;
        }

        const user = session.user;
        console.log('Session utilisateur NextAuth:', user);

        // Récupérer le profil complet depuis Supabase via notre API
        const response = await fetch('/api/get-profile');
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Erreur lors de la récupération du profil:', errorData);
          
          // Si échec, utiliser les données de base de NextAuth
          const basicUserData = {
            id: user.id,
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            email: user.email || '',
            created_at: new Date().toISOString(),
            // Autres champs avec des valeurs par défaut si nécessaire
          };
          
          setUserData(basicUserData as ProfileType);
          setFormData({
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            email: user.email || '',
            phone: '',
            password: '',
            confirm_password: '',
          });
          console.log('FormData mis à jour avec données NextAuth basiques');
        } else {
          // Utiliser le profil complet de Supabase
          const { profile } = await response.json();
          console.log('Profil Supabase récupéré:', profile);
          
          setUserData(profile);
          setFormData({
            first_name: profile.first_name || user.firstName || '',
            last_name: profile.last_name || user.lastName || '',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
            password: '',
            confirm_password: '',
          });
          console.log('FormData mis à jour avec profil Supabase complet');
        }

        // Get user orders using improved fetching with retries
        const fetchOrders = async (retries = 3) => {
          try {
            console.log('Tentative de récupération des commandes...');

            // D'abord essayer l'API admin avec l'ID utilisateur standardisé
            console.log('Récupération des commandes pour utilisateur:', user.id);
            const response = await fetch(`/api/admin-get-orders?userId=${user.id}`);

            if (response.ok) {
              const data = await response.json();
              console.log('Commandes récupérées via API admin:', data.orders?.length || 0);
              if (data.orders?.length > 0) {
                console.log('Structure des commandes:', JSON.stringify(data.orders).substring(0, 200) + '...');
                setOrders(data.orders);

                // Vérifier si le profil utilisateur a des adresses, sinon utiliser celles des commandes
                if (userData) {
                  // Si l'utilisateur n'a pas d'adresse de facturation, utiliser celle de la dernière commande
                  if (!userData.billing_address) {
                    const lastBillingAddress = getLatestAddress(data.orders, 'billing');
                    if (lastBillingAddress) {
                      // Mise à jour locale du state
                      setUserData(prev => ({
                        ...prev,
                        billing_address: lastBillingAddress
                      }));
                      console.log('Adresse de facturation mise à jour localement depuis la dernière commande');
                    }
                  }

                  // Si l'utilisateur n'a pas d'adresse de livraison, utiliser celle de la dernière commande
                  if (!userData.shipping_address) {
                    const lastShippingAddress = getLatestAddress(data.orders, 'shipping');
                    if (lastShippingAddress) {
                      // Mise à jour locale du state
                      setUserData(prev => ({
                        ...prev,
                        shipping_address: lastShippingAddress
                      }));
                      console.log('Adresse de livraison mise à jour localement depuis la dernière commande');
                    }
                  }
                }

                return;
              } else {
                console.log('Aucune commande récupérée via API admin, essai de l\'API standard');
              }
            } else {
              const errorText = await response.text();
              console.error('Échec API admin:', errorText);
              console.log('Tentative avec l\'API standard après échec admin...');
            }

            // Fallback: essayer l'API standard avec standardization
            try {
              const stdResponse = await fetch('/api/user-orders');
              if (stdResponse.ok) {
                const stdData = await stdResponse.json();
                console.log('Commandes récupérées via API standard:', stdData.orders?.length || 0);
                setOrders(stdData.orders || []);

                // Même logique de récupération d'adresses avec l'API standard
                if (stdData.orders && stdData.orders.length > 0 && userData) {
                  if (!userData.billing_address) {
                    const lastBillingAddress = getLatestAddress(stdData.orders, 'billing');
                    if (lastBillingAddress) {
                      // Mise à jour locale du state
                      setUserData(prev => ({
                        ...prev,
                        billing_address: lastBillingAddress
                      }));
                      console.log('Adresse de facturation mise à jour localement depuis la dernière commande');
                    }
                  }

                  if (!userData.shipping_address) {
                    const lastShippingAddress = getLatestAddress(stdData.orders, 'shipping');
                    if (lastShippingAddress) {
                      // Mise à jour locale du state
                      setUserData(prev => ({
                        ...prev,
                        shipping_address: lastShippingAddress
                      }));
                      console.log('Adresse de livraison mise à jour localement depuis la dernière commande');
                    }
                  }
                }
              } else {
                const errorText = await stdResponse.text();
                console.error('Échec API standard:', errorText);

                // Tenter à nouveau si des tentatives restent
                if (retries > 0) {
                  console.log(`Nouvelle tentative de récupération (${retries} tentatives restantes)...`);
                  // Pas de retry automatique pour éviter les boucles
                } else {
                  setOrders([]);
                  addNotification({
                    type: 'warning',
                    message: 'Impossible de récupérer votre historique de commandes.',
                    duration: 5000,
                  });
                }
              }
            } catch (fallbackError) {
              console.error('Erreur fallback:', fallbackError);

              // Tenter à nouveau si des tentatives restent
              if (retries > 0) {
                console.log(`Nouvelle tentative de récupération (${retries} tentatives restantes)...`);
                // Pas de retry automatique pour éviter les boucles
              } else {
                setOrders([]);
              }
            }
          } catch (orderError) {
            console.error('Erreur récupération commandes:', orderError);

            // Tenter à nouveau si des tentatives restent
            if (retries > 0) {
              console.log(`Nouvelle tentative de récupération (${retries} tentatives restantes)...`);
              // Pas de retry automatique pour éviter les boucles
            } else {
              setOrders([]);
            }
          }
        };

        // Appeler la fonction avec les tentatives
        fetchOrders();

        // For demo purposes, add mock claims
        const mockClaims = [
          {
            id: 1,
            orderId: orders.length > 0 ? orders[0].id : 1148,
            type: 'product_issue',
            description: 'Le produit ne fonctionne pas comme prévu.',
            status: 'resolved',
            createdAt: '2025-02-20T10:45:00',
          },
          {
            id: 2,
            orderId: orders.length > 1 ? orders[1].id : 1142,
            type: 'late_delivery',
            description: "Ma commande n'est pas arrivée dans les délais indiqués.",
            status: 'in_review',
            createdAt: '2025-02-25T14:30:00',
          },
        ];
        setClaims(mockClaims);
      } catch (error) {
        console.error('Error loading user data:', error);
        addNotification({
          type: 'error',
          message: "Impossible de charger les informations du compte",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
        console.log('AccountPage chargé, formData final:', formData);
      }
    }

    loadUserData();
  }, [session, status]);

  // Mettre à jour l'onglet actif quand l'URL change
  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab) {
      setActiveTab(newTab);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirm_password) {
      addNotification({
        type: 'error',
        message: 'Les mots de passe ne correspondent pas',
        duration: 5000,
      });
      return;
    }
    
    if (!userData) return;
    
    try {
      // Préparation des données à envoyer à l'API
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
      };
      
      // Appel à notre nouvelle API route qui utilise NextAuth pour l'authentication
      // et Supabase service_role pour mettre à jour le profil
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du profil');
      }
      
      const result = await response.json();
      
      // Mise à jour de l'état local avec les données actualisées
      setUserData(result.profile);
      setIsEditing(false);
      
      addNotification({
        type: 'success',
        message: 'Profil mis à jour avec succès',
        duration: 3000,
      });
      
      console.log('Profil mis à jour:', result.profile);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Impossible de mettre à jour le profil',
        duration: 5000,
      });
    }
  };

  // Handle claim submission
  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors: typeof claimErrors = {};
    
    if (!claimForm.orderId) {
      errors.orderId = 'Veuillez sélectionner une commande';
    }
    
    if (!claimForm.description) {
      errors.description = 'Veuillez décrire votre problème';
    } else if (claimForm.description.length < 10) {
      errors.description = 'La description doit contenir au moins 10 caractères';
    }
    
    setClaimErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    // Submit claim (mock implementation)
    setLoadingClaims(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new claim to list
      const newClaim = {
        id: claims.length + 1,
        orderId: parseInt(claimForm.orderId),
        type: claimForm.type,
        description: claimForm.description,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      setClaims([...claims, newClaim]);
      
      // Reset form
      setClaimForm({
        orderId: '',
        type: 'product_issue',
        description: '',
      });
      
      setShowClaimForm(false);
      
      addNotification({
        type: 'success',
        message: 'Votre réclamation a été soumise avec succès',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error submitting claim:', error);
      addNotification({
        type: 'error',
        message: 'Impossible de soumettre votre réclamation',
        duration: 3000,
      });
    } finally {
      setLoadingClaims(false);
    }
  };

  const handleLogout = async () => {
    // Show notification before logout to prevent state updates during unmount
    addNotification({
      type: 'info',
      message: 'Vous avez été déconnecté',
      duration: 3000,
    });
    
    // Short delay to allow notification to be processed
    setTimeout(async () => {
      try {
        await nextAuthSignOut({ callbackUrl: '/' });
        router.push('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }, 100);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date inconnue';

      // Log pour diagnostiquer le format de la date
      console.log('Formattage de la date:', dateString);

      const date = new Date(dateString);

      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        console.error('Date invalide:', dateString);
        return 'Date invalide';
      }

      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return 'Erreur de date';
    }
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format price
  const formatPrice = (price: number | string) => {
    try {
      // Log pour diagnostiquer le format du prix
      console.log('Formattage du prix:', price, typeof price);

      // Convertir en nombre si c'est une chaîne
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;

      // Vérifier si le prix est un nombre valide
      if (isNaN(numPrice)) {
        console.error('Prix invalide:', price);
        return '0,00 €';
      }

      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(numPrice);
    } catch (error) {
      console.error('Erreur lors du formatage du prix:', error);
      return '0,00 €';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <p className="text-center text-gray-500">Chargement des informations du compte...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16 account-container">
      {/* Account Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white account-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left md:flex md:items-center md:justify-between"
          >
            <div className="md:flex md:items-center">
              <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white mx-auto md:mx-0 mb-4 md:mb-0">
                <Image
                  src={userData?.avatar_url || '/profile-placeholder.jpg'}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:ml-6">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {userData?.first_name} {userData?.last_name}
                </h1>
                <p className="text-indigo-100">{userData?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 md:mt-0 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors inline-flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Déconnexion
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden account-content"
        >
          {/* Tabs */}
          <div className="px-4 sm:px-0 border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto py-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`mr-8 py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mon Profil
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`mr-8 py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Mes Commandes
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`mr-8 py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === 'addresses'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Mes Adresses
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres du compte
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6 md:p-8">
            {activeTab === 'profile' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900">
                    Mon Profil
                  </motion.h2>
                  {!isEditing && (
                    <motion.button
                      variants={itemVariants}
                      onClick={() => setIsEditing(true)}
                      className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Modifier le profil
                    </motion.button>
                  )}
                </div>

                {isEditing ? (
                  <motion.form
                    variants={containerVariants}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <motion.div variants={itemVariants}>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div variants={itemVariants} className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Changer de mot de passe</h3>
                      <p className="text-sm text-gray-500 mb-4">Laissez vide si vous ne souhaitez pas modifier votre mot de passe</p>
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmer le nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex space-x-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                      >
                        Enregistrer les modifications
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                      >
                        Annuler
                      </button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div variants={containerVariants}>
                    <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                          <dd className="mt-1 text-gray-900">{userData?.first_name} {userData?.last_name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-gray-900">{userData?.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                          <dd className="mt-1 text-gray-900">{userData?.phone || '-'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Membre depuis</dt>
                          <dd className="mt-1 text-gray-900">
                            {userData?.created_at ? formatDate(userData.created_at) : 'Janvier 2025'}
                          </dd>
                        </div>
                      </dl>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques du compte</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-indigo-600">Total des commandes</p>
                          <p className="text-2xl font-bold text-indigo-900 mt-1">{orders.length}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-purple-600">Abonnements actifs</p>
                          <p className="text-2xl font-bold text-purple-900 mt-1">0</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-green-600">Avis</p>
                          <p className="text-2xl font-bold text-green-900 mt-1">2</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-600">Points fidélité</p>
                          <p className="text-2xl font-bold text-blue-900 mt-1">120</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-8">
                  Mes Commandes
                </motion.h2>

                {orders && orders.length > 0 ? (
                  <div className="space-y-8">
                    {orders.map((order, index) => (
                      <div key={`order-${order.id}`} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Commande #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.created_at)} ·
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status === 'processing' ? 'En traitement' :
                                 order.status === 'completed' ? 'Terminée' :
                                 order.status === 'on-hold' ? 'En attente' :
                                 order.status === 'cancelled' ? 'Annulée' : 'Statut inconnu'}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">{formatPrice(order.total)}</p>
                            <Link href={`/account/orders/${order.id}`} className="text-sm text-indigo-600 hover:text-indigo-800">
                              Voir les détails
                            </Link>
                          </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Articles ({order.items?.length || 0})</h4>
                              <ul className="space-y-3">
                                {order.items && order.items.map((item, idx) => (
                                  <li key={`item-${idx}`} className="flex items-start">
                                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-3">
                                      <img src={item.image_url || '/images/placeholder.jpg'} alt={item.product_name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                                      <p className="text-xs text-gray-500">
                                        {formatPrice(item.price)} × {item.quantity}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0 ml-2">
                                      <p className="text-sm font-medium text-gray-900">{formatPrice(item.subtotal)}</p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Adresse de livraison</h4>
                                {order.shipping_address ? (
                                  <div className="text-sm text-gray-600">
                                    <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                                    <p>{order.shipping_address.address_1}</p>
                                    {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                                    <p>{order.shipping_address.postcode}, {order.shipping_address.city}</p>
                                    <p>{order.shipping_address.country}</p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">Non disponible</p>
                                )}
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Adresse de facturation</h4>
                                {order.billing_address ? (
                                  <div className="text-sm text-gray-600">
                                    <p>{order.billing_address.first_name} {order.billing_address.last_name}</p>
                                    <p>{order.billing_address.address_1}</p>
                                    {order.billing_address.address_2 && <p>{order.billing_address.address_2}</p>}
                                    <p>{order.billing_address.postcode}, {order.billing_address.city}</p>
                                    <p>{order.billing_address.country}</p>
                                    {order.billing_address.phone && <p>Tél: {order.billing_address.phone}</p>}
                                    {order.billing_address.email && <p>Email: {order.billing_address.email}</p>}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">Non disponible</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end space-x-3">
                          <button
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => window.print()}
                          >
                            Imprimer
                          </button>
                          <Link
                            href={`/account/orders/invoice?orderId=${order.id}`}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Voir la facture
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="mx-auto h-24 w-24 text-gray-400">
                      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune commande trouvée</h3>
                    <p className="mt-2 text-gray-500">Vous n'avez pas encore passé de commande.</p>
                    <div className="mt-6">
                      <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Découvrir nos produits
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-8">
                  Mes Adresses
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Adresse de facturation */}
                  <motion.div variants={itemVariants} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Adresse de facturation</h3>

                        {userData?.billing_address ? (
                          <button
                            onClick={() => {
                              const billingAddress = userData.billing_address as AddressInfo;
                              setEditingAddress({
                                type: 'billing',
                                data: {
                                  first_name: billingAddress.first_name || userData.first_name || '',
                                  last_name: billingAddress.last_name || userData.last_name || '',
                                  address_1: billingAddress.address_1 || '',
                                  address_2: billingAddress.address_2 || '',
                                  city: billingAddress.city || '',
                                  state: billingAddress.state || '',
                                  postcode: billingAddress.postcode || '',
                                  country: billingAddress.country || 'France',
                                  email: billingAddress.email || userData.email || '',
                                  phone: billingAddress.phone || userData.phone || '',
                                  company: billingAddress.company || '',
                                },
                              });
                            }}
                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Modifier
                          </button>
                        ) : null}
                      </div>

                      {userData?.billing_address ? (
                        <div className="space-y-2">
                          <p className="text-gray-800">
                            {(userData.billing_address as AddressInfo).first_name} {(userData.billing_address as AddressInfo).last_name}
                          </p>
                          {(userData.billing_address as AddressInfo).company &&
                            <p className="text-gray-600">{(userData.billing_address as AddressInfo).company}</p>
                          }
                          <p className="text-gray-600">{(userData.billing_address as AddressInfo).address_1}</p>
                          {(userData.billing_address as AddressInfo).address_2 &&
                            <p className="text-gray-600">{(userData.billing_address as AddressInfo).address_2}</p>
                          }
                          <p className="text-gray-600">
                            {(userData.billing_address as AddressInfo).postcode} {(userData.billing_address as AddressInfo).city}
                          </p>
                          <p className="text-gray-600">
                            {(userData.billing_address as AddressInfo).state ?
                              `${(userData.billing_address as AddressInfo).state}, ` :
                              ''
                            }
                            {(userData.billing_address as AddressInfo).country}
                          </p>
                          {(userData.billing_address as AddressInfo).phone &&
                            <p className="text-gray-600">Téléphone: {(userData.billing_address as AddressInfo).phone}</p>
                          }
                          {(userData.billing_address as AddressInfo).email &&
                            <p className="text-gray-600">Email: {(userData.billing_address as AddressInfo).email}</p>
                          }
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="text-center">
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <p className="mt-1 text-sm text-gray-500">Vous n'avez pas encore ajouté d'adresse de facturation</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              // Utiliser les informations de l'utilisateur pour les champs par défaut
                              setEditingAddress({
                                type: 'billing',
                                data: {
                                  first_name: userData?.first_name || '',
                                  last_name: userData?.last_name || '',
                                  address_1: '',
                                  address_2: '',
                                  city: '',
                                  state: '',
                                  postcode: '',
                                  country: 'France',
                                  email: userData?.email || '',
                                  phone: userData?.phone || '',
                                  company: '',
                                },
                              });
                            }}
                            className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Ajouter une adresse
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Adresse de livraison */}
                  <motion.div variants={itemVariants} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Adresse de livraison</h3>

                        {userData?.shipping_address ? (
                          <button
                            onClick={() => {
                              const shippingAddress = userData.shipping_address as AddressInfo;
                              setEditingAddress({
                                type: 'shipping',
                                data: {
                                  first_name: shippingAddress.first_name || userData.first_name || '',
                                  last_name: shippingAddress.last_name || userData.last_name || '',
                                  address_1: shippingAddress.address_1 || '',
                                  address_2: shippingAddress.address_2 || '',
                                  city: shippingAddress.city || '',
                                  state: shippingAddress.state || '',
                                  postcode: shippingAddress.postcode || '',
                                  country: shippingAddress.country || 'France',
                                  company: shippingAddress.company || '',
                                },
                              });
                            }}
                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Modifier
                          </button>
                        ) : null}
                      </div>

                      {userData?.shipping_address ? (
                        <div className="space-y-2">
                          <p className="text-gray-800">
                            {(userData.shipping_address as AddressInfo).first_name} {(userData.shipping_address as AddressInfo).last_name}
                          </p>
                          {(userData.shipping_address as AddressInfo).company &&
                            <p className="text-gray-600">{(userData.shipping_address as AddressInfo).company}</p>
                          }
                          <p className="text-gray-600">{(userData.shipping_address as AddressInfo).address_1}</p>
                          {(userData.shipping_address as AddressInfo).address_2 &&
                            <p className="text-gray-600">{(userData.shipping_address as AddressInfo).address_2}</p>
                          }
                          <p className="text-gray-600">
                            {(userData.shipping_address as AddressInfo).postcode} {(userData.shipping_address as AddressInfo).city}
                          </p>
                          <p className="text-gray-600">
                            {(userData.shipping_address as AddressInfo).state ?
                              `${(userData.shipping_address as AddressInfo).state}, ` :
                              ''
                            }
                            {(userData.shipping_address as AddressInfo).country}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="text-center">
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <p className="mt-1 text-sm text-gray-500">Vous n'avez pas encore ajouté d'adresse de livraison</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              // Utiliser les informations de l'utilisateur pour les champs par défaut
                              setEditingAddress({
                                type: 'shipping',
                                data: {
                                  first_name: userData?.first_name || '',
                                  last_name: userData?.last_name || '',
                                  address_1: '',
                                  address_2: '',
                                  city: '',
                                  state: '',
                                  postcode: '',
                                  country: 'France',
                                  company: '',
                                },
                              });
                            }}
                            className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Ajouter une adresse
                          </button>
                        </div>
                      )}
                    </div>

                    {userData?.shipping_address && userData?.billing_address && (
                      <div className="border-t border-gray-200 px-4 py-3 flex justify-end">
                        <button
                          onClick={() => {
                            if (userData?.billing_address) {
                              setEditingAddress({
                                type: 'shipping',
                                data: userData.billing_address as AddressInfo
                              });
                            }
                          }}
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Utiliser l'adresse de facturation
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Modal d'édition d'adresse */}
                {editingAddress && (
                  <div className="fixed inset-0 overflow-y-auto z-50 pt-20" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-start justify-center min-h-screen px-4 pb-20 text-center sm:p-0">
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setEditingAddress(null)}></div>

                      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                      <div className="inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full sm:p-6 relative top-20">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {editingAddress.type === 'shipping' ? 'Adresse de livraison' : 'Adresse de facturation'}
                          </h3>
                          <form className="mt-5 space-y-4" onSubmit={async (e) => {
                            e.preventDefault();
                            if (!userData) return;

                            // Déterminer l'endpoint à appeler en fonction du type d'adresse
                            const endpoint = editingAddress.type === 'shipping' 
                              ? '/api/update-shipping-address' 
                              : '/api/update-billing-address';
                            
                            try {
                              // Appel à l'API pour la mise à jour de l'adresse
                              const response = await fetch(endpoint, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(editingAddress.data),
                              });
                              
                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.error || `Erreur lors de la mise à jour de l'adresse`);
                              }
                              
                              const result = await response.json();
                              
                              // Mise à jour de l'état local avec les données actualisées
                              setUserData(result.profile);
                              setEditingAddress(null);
                              
                              addNotification({
                                type: 'success',
                                message: `Adresse ${editingAddress.type === 'shipping' ? 'de livraison' : 'de facturation'} mise à jour avec succès`,
                                duration: 3000,
                              });
                              
                              console.log(`Mise à jour de l'adresse ${editingAddress.type}:`, editingAddress.data);
                            } catch (error: any) {
                              console.error(`Erreur de mise à jour d'adresse:`, error);
                              addNotification({
                                type: 'error',
                                message: error.message || `Impossible de mettre à jour l'adresse`,
                                duration: 5000,
                              });
                            }
                          }}>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Prénom</label>
                                <input
                                  type="text"
                                  id="first_name"
                                  value={editingAddress.data.first_name}
                                  onChange={(e) => setEditingAddress({
                                    ...editingAddress,
                                    data: { ...editingAddress.data, first_name: e.target.value }
                                  })}
                                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                  type="text"
                                  id="last_name"
                                  value={editingAddress.data.last_name}
                                  onChange={(e) => setEditingAddress({
                                    ...editingAddress,
                                    data: { ...editingAddress.data, last_name: e.target.value }
                                  })}
                                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Entreprise (optionnel)</label>
                              <input
                                type="text"
                                id="company"
                                value={editingAddress.data.company || ''}
                                onChange={(e) => setEditingAddress({
                                  ...editingAddress,
                                  data: { ...editingAddress.data, company: e.target.value }
                                })}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>

                            <div>
                              <label htmlFor="address_1" className="block text-sm font-medium text-gray-700">Adresse</label>
                              <input
                                type="text"
                                id="address_1"
                                value={editingAddress.data.address_1}
                                onChange={(e) => setEditingAddress({
                                  ...editingAddress,
                                  data: { ...editingAddress.data, address_1: e.target.value }
                                })}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="address_2" className="block text-sm font-medium text-gray-700">Complément d'adresse (optionnel)</label>
                              <input
                                type="text"
                                id="address_2"
                                value={editingAddress.data.address_2 || ''}
                                onChange={(e) => setEditingAddress({
                                  ...editingAddress,
                                  data: { ...editingAddress.data, address_2: e.target.value }
                                })}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Code postal</label>
                                <input
                                  type="text"
                                  id="postal_code"
                                  value={editingAddress.data.postcode}
                                  onChange={(e) => setEditingAddress({
                                    ...editingAddress,
                                    data: { ...editingAddress.data, postcode: e.target.value }
                                  })}
                                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
                                <input
                                  type="text"
                                  id="city"
                                  value={editingAddress.data.city}
                                  onChange={(e) => setEditingAddress({
                                    ...editingAddress,
                                    data: { ...editingAddress.data, city: e.target.value }
                                  })}
                                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">Région/État (optionnel)</label>
                                <input
                                  type="text"
                                  id="state"
                                  value={editingAddress.data.state || ''}
                                  onChange={(e) => setEditingAddress({
                                    ...editingAddress,
                                    data: { ...editingAddress.data, state: e.target.value }
                                  })}
                                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
                                <input
                                  type="text"
                                  id="country"
                                  value={editingAddress.data.country}
                                  onChange={(e) => setEditingAddress({
                                    ...editingAddress,
                                    data: { ...editingAddress.data, country: e.target.value }
                                  })}
                                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  required
                                />
                              </div>
                            </div>

                            {editingAddress.type === 'billing' && (
                              <>
                                <div>
                                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                                  <input
                                    type="tel"
                                    id="phone"
                                    value={editingAddress.data.phone || ''}
                                    onChange={(e) => setEditingAddress({
                                      ...editingAddress,
                                      data: { ...editingAddress.data, phone: e.target.value }
                                    })}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                  <input
                                    type="email"
                                    id="email"
                                    value={editingAddress.data.email || ''}
                                    onChange={(e) => setEditingAddress({
                                      ...editingAddress,
                                      data: { ...editingAddress.data, email: e.target.value }
                                    })}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </>
                            )}

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                              <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:col-start-2 sm:text-sm"
                              >
                                Enregistrer
                              </button>
                              <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                                onClick={() => setEditingAddress(null)}
                              >
                                Annuler
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-8">
                  Paramètres du compte
                </motion.h2>

                <motion.div variants={itemVariants} className="space-y-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences de communication</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="newsletter"
                            name="newsletter"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="newsletter" className="font-medium text-gray-700">Newsletter</label>
                          <p className="text-gray-500">Recevoir notre newsletter avec les mises à jour et offres exclusives</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="order_updates"
                            name="order_updates"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="order_updates" className="font-medium text-gray-700">Mises à jour des commandes</label>
                          <p className="text-gray-500">Recevoir des notifications sur l'état de vos commandes</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="promotions"
                            name="promotions"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="promotions" className="font-medium text-gray-700">Promotions</label>
                          <p className="text-gray-500">Recevoir des informations sur les ventes et offres spéciales</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                        Enregistrer les préférences
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Supprimer le compte</h3>
                    <p className="text-gray-600 mb-4">
                      Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Merci d'être certain de votre décision.
                    </p>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                      Supprimer mon compte
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPage;