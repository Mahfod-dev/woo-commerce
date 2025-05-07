// src/app/login/page.tsx
import React from 'react';
import LoginPage from '@/components/LoginPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Selectura',
  description: 'Sign in to your account or create a new account',
};

export default function LoginRoute() {
  return <LoginPage />;
}