// src/app/account/page.tsx
import React, { Suspense } from 'react';
import AccountPage from '@/components/AccountPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account - Selectura',
  description: 'Manage your account, view orders and update your preferences',
};

export default function AccountPageRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chargement de votre compte...
          </h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    }>
      <AccountPage />
    </Suspense>
  );
}