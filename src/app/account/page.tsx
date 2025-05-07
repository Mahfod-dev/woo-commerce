// src/app/account/page.tsx
import React from 'react';
import AccountPage from '@/components/AccountPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account - Selectura',
  description: 'Manage your account, view orders and update your preferences',
};

export default function AccountPageRoute() {
  return <AccountPage />;
}