import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // `withAuth` augmente votre `Request` avec le token de l'utilisateur.
  function middleware(req) {
    // Laisser NextAuth gérer l'authentification automatiquement
    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  // Protéger toutes les routes qui nécessitent une authentification
  matcher: [
    '/account/:path*', 
    '/checkout/:path*',
    '/api/create-order',
    '/api/get-profile',
    '/api/update-profile',
    '/api/user-orders',
    '/api/update-billing-address',
    '/api/update-shipping-address'
  ]
};