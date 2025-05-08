// src/app/login/page.tsx
import React from 'react';
import LoginPage from '@/components/LoginPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion - Selectura',
  description: 'Connectez-vous à votre compte ou créez un nouveau compte',
};

export default function LoginRoute() {
  return <LoginPage />;
}