'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useNotification } from '@/context/notificationContext';
import { signOut, useSession } from 'next-auth/react';

// Types for user data
interface UserAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  billing: UserAddress;
  shipping: UserAddress;
}

// Types for order data
interface OrderItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  total: string;
}

interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  line_items: OrderItem[];
}

// Types for claims
interface Claim {
  id: number;
  orderId: number;
  type: string;
  description: string;
  status: 'pending' | 'in_review' | 'resolved';
  createdAt: string;
}

const AccountPage = () => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { data: session, status } = useSession();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
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

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      addNotification({
        type: 'warning',
        message: 'Veuillez vous connecter pour accéder à votre compte',
        duration: 5000,
      });
      router.push('/login');
      return;
    }
    
    if (status === 'loading') {
      return; // Attendre que le statut de la session soit déterminé
    }

    // Load user data
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Create mock user data based on NextAuth session
        if (session?.user) {
          const mockUserData: UserData = {
            id: session.user.id,
            email: session.user.email || '',
            first_name: session.user.firstName,
            last_name: session.user.lastName,
            avatar_url: session.user.avatar || session.user.image || '/profile-placeholder.jpg',
            billing: {
              first_name: session.user.firstName,
              last_name: session.user.lastName,
              company: 'Company Inc.',
              address_1: '123 Rue de Paris',
              address_2: 'Apt 4B',
              city: 'Paris',
              state: 'Île-de-France',
              postcode: '75001',
              country: 'France',
              email: session.user.email || '',
              phone: '0123456789',
            },
            shipping: {
              first_name: session.user.firstName,
              last_name: session.user.lastName,
              company: '',
              address_1: '123 Rue de Paris',
              address_2: 'Apt 4B',
              city: 'Paris',
              state: 'Île-de-France',
              postcode: '75001',
              country: 'France',
            },
          };
          
          setUserData(mockUserData);
          setFormData({
            first_name: mockUserData.first_name,
            last_name: mockUserData.last_name,
            email: mockUserData.email,
            phone: mockUserData.billing.phone || '',
            password: '',
            confirm_password: '',
          });
          
          // Simuler des commandes pour la démonstration
          // Dans un cas réel, vous appelleriez une API pour récupérer les commandes
          const mockOrders: Order[] = [
            {
              id: 1148,
              number: '1148',
              status: 'processing',
              date_created: '2025-02-15T14:30:45',
              total: '129.99',
              line_items: [
                {
                  id: 1,
                  name: 'Premium Product',
                  product_id: 123,
                  quantity: 1,
                  total: '129.99',
                },
              ],
            },
            {
              id: 1142,
              number: '1142',
              status: 'completed',
              date_created: '2025-01-20T10:15:30',
              total: '89.95',
              line_items: [
                {
                  id: 2,
                  name: 'Essential Product',
                  product_id: 456,
                  quantity: 1,
                  total: '79.95',
                },
                {
                  id: 3,
                  name: 'Accessory',
                  product_id: 789,
                  quantity: 1,
                  total: '10.00',
                },
              ],
            },
          ];
          
          setOrders(mockOrders);
          
          // Load claims
          fetchClaims();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        addNotification({
          type: 'error',
          message: "Impossible de charger les informations du compte",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [status, session, addNotification, router]);
  
  // Fetch claims data
  const fetchClaims = async () => {
    setLoadingClaims(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock claims data
      setClaims([
        {
          id: 1,
          orderId: 1148,
          type: 'product_issue',
          description: 'Le produit ne fonctionne pas comme prévu.',
          status: 'resolved',
          createdAt: '2025-02-20T10:45:00',
        },
        {
          id: 2,
          orderId: 1142,
          type: 'late_delivery',
          description: "Ma commande n'est pas arrivée dans les délais indiqués.",
          status: 'in_review',
          createdAt: '2025-02-25T14:30:00',
        },
      ]);
    } catch (error) {
      console.error('Error fetching claims:', error);
      addNotification({
        type: 'error',
        message: 'Impossible de charger vos réclamations',
        duration: 3000,
      });
    } finally {
      setLoadingClaims(false);
    }
  };

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
        message: 'Passwords do not match',
        duration: 5000,
      });
      return;
    }
    
    try {
      // This would be your actual API call to update user data
      // For demo purposes, we'll just update the local state
      if (userData) {
        const updatedUserData = {
          ...userData,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          billing: {
            ...userData.billing,
            phone: formData.phone,
          },
        };
        
        setUserData(updatedUserData);
        setIsEditing(false);
        
        addNotification({
          type: 'success',
          message: 'Profile updated successfully',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification({
        type: 'error',
        message: 'Failed to update profile',
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
    
    // Submit claim
    setLoadingClaims(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new claim to list
      const newClaim: Claim = {
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
      // Use NextAuth signOut function
      await signOut({ redirect: false });
      router.push('/');
    }, 100);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format price
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(parseFloat(price));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <p className="text-center text-gray-500">Loading account information...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Account Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
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
              Logout
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
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
                My Profile
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
                My Orders
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
                My Addresses
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
                Account Settings
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
                    My Profile
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
                      Edit Profile
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
                          First Name
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
                          Last Name
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
                          Email Address
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
                          Phone Number
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
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change your password</p>
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
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
                            Confirm New Password
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
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div variants={containerVariants}>
                    <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                          <dd className="mt-1 text-gray-900">{userData?.first_name} {userData?.last_name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                          <dd className="mt-1 text-gray-900">{userData?.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                          <dd className="mt-1 text-gray-900">{userData?.billing.phone || '-'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                          <dd className="mt-1 text-gray-900">January 2025</dd>
                        </div>
                      </dl>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-indigo-600">Total Orders</p>
                          <p className="text-2xl font-bold text-indigo-900 mt-1">{orders.length}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-purple-600">Active Subscriptions</p>
                          <p className="text-2xl font-bold text-purple-900 mt-1">0</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-green-600">Reviews</p>
                          <p className="text-2xl font-bold text-green-900 mt-1">2</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-600">Reward Points</p>
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
                  My Orders
                </motion.h2>

                {orders.length === 0 ? (
                  <motion.div variants={itemVariants} className="text-center py-16">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
                    <div className="mt-6">
                      <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Start Shopping
                        <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants} className="overflow-hidden rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">#{order.number}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500">{formatDate(order.date_created)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatPrice(order.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link href={`/my-account/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
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
                  My Addresses
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    
                    {userData?.billing && (
                      <div className="space-y-2">
                        <p className="text-gray-800">{userData.billing.first_name} {userData.billing.last_name}</p>
                        {userData.billing.company && <p className="text-gray-600">{userData.billing.company}</p>}
                        <p className="text-gray-600">{userData.billing.address_1}</p>
                        {userData.billing.address_2 && <p className="text-gray-600">{userData.billing.address_2}</p>}
                        <p className="text-gray-600">{userData.billing.postcode} {userData.billing.city}</p>
                        <p className="text-gray-600">{userData.billing.state ? `${userData.billing.state}, ` : ''}{userData.billing.country}</p>
                        {userData.billing.phone && <p className="text-gray-600">Phone: {userData.billing.phone}</p>}
                        {userData.billing.email && <p className="text-gray-600">Email: {userData.billing.email}</p>}
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    
                    {userData?.shipping && (
                      <div className="space-y-2">
                        <p className="text-gray-800">{userData.shipping.first_name} {userData.shipping.last_name}</p>
                        {userData.shipping.company && <p className="text-gray-600">{userData.shipping.company}</p>}
                        <p className="text-gray-600">{userData.shipping.address_1}</p>
                        {userData.shipping.address_2 && <p className="text-gray-600">{userData.shipping.address_2}</p>}
                        <p className="text-gray-600">{userData.shipping.postcode} {userData.shipping.city}</p>
                        <p className="text-gray-600">{userData.shipping.state ? `${userData.shipping.state}, ` : ''}{userData.shipping.country}</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-8">
                  Account Settings
                </motion.h2>

                <motion.div variants={itemVariants} className="space-y-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h3>
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
                          <p className="text-gray-500">Receive our newsletter with product updates and exclusive offers</p>
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
                          <label htmlFor="order_updates" className="font-medium text-gray-700">Order Updates</label>
                          <p className="text-gray-500">Receive notifications about your order status</p>
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
                          <p className="text-gray-500">Receive information about sales and special offers</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
                    <p className="text-gray-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                      Delete My Account
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