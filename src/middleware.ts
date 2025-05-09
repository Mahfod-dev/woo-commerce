import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes protégées qui nécessitent une authentification
const protectedRoutes = ['/account', '/checkout'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Vérifier si la route actuelle nécessite une authentification
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  if (isProtectedRoute) {
    // Obtenir le token de session depuis les cookies
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    if (!token) {
      // URL de redirection
      const url = new URL('/login', request.url);
      
      // Ajouter la page protégée comme paramètre callbackUrl
      url.searchParams.set('callbackUrl', path);
      
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Configurer sur quelles routes le middleware doit être exécuté
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};