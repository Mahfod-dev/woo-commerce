import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request) {
    // Le middleware NextAuth gère automatiquement l'authentification
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Pages qui nécessitent une authentification
        const protectedRoutes = ['/account', '/checkout'];
        
        // Si la route est protégée, vérifier le token
        if (protectedRoutes.some((route) => pathname.startsWith(route))) {
          return !!token;
        }
        
        // Pour toutes les autres routes, autoriser l'accès
        return true;
      },
    },
    pages: {
      signIn: '/login', // Page de connexion personnalisée
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/auth (NextAuth API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};