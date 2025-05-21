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
  // Protéger seulement les routes qui ont besoin d'authentification
  matcher: ['/account/:path*', '/checkout/:path*']
};