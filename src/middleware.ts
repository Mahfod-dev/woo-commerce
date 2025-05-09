import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
	const response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	// Create a cookie store that works with our middleware
	const cookieStore = {
		get(name: string) {
			return request.cookies.get(name);
		},
		set(name: string, value: string, options: Record<string, any>) {
			response.cookies.set({
				name,
				value,
				...options,
			});
		},
		remove(name: string, options: Record<string, any>) {
			response.cookies.set({
				name,
				value: '',
				...options,
			});
		},
	};

	// Create a Supabase client using the middleware cookie store
	const supabase = createClient(cookieStore);

	// Refresh session if expired - required for Server Components
	await supabase.auth.getUser();

	// If accessing a protected route and not authenticated, redirect to login
	const { pathname } = request.nextUrl;
	const protectedRoutes = ['/account', '/checkout'];

	if (protectedRoutes.some((route) => pathname.startsWith(route))) {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			const redirectUrl = new URL('/login', request.url);
			redirectUrl.searchParams.set('callbackUrl', pathname);
			return NextResponse.redirect(redirectUrl);
		}
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public (public files)
		 * - api (API routes that handle their own auth)
		 */
		'/((?!_next/static|_next/image|favicon.ico|public|api).*)',
	],
};
