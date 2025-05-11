import { createServerClient } from '@supabase/ssr';
// Using cookies from next/cookies instead of next/headers
import { Database } from './types';
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// Type for cookie store that works with both getServerSideProps and Server Components
type CookieStore =
	| RequestCookies
	| ReadonlyRequestCookies
	| {
			get: (name: string) => { name: string; value: string } | undefined;
	  };

// Create client that works with explicit cookie store
export function createClient(cookieStore: CookieStore) {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: Record<string, any>) {
					// This is intentionally left unimplemented
					// Cookies are set in middleware.ts, not here
					console.warn('Cookie setting is handled in middleware.ts');
				},
				remove(name: string, options: Record<string, any>) {
					// This is intentionally left unimplemented
					// Cookies are removed in middleware.ts, not here
					console.warn('Cookie removal is handled in middleware.ts');
				},
			},
		}
	);
}

// Create client using getServerSideProps or API route cookies
export function createClientFromRequest(req: any, res?: any) {
	let cookieStore: CookieStore;

	if (req.cookies) {
		// Standard pages/API route
		cookieStore = {
			get: (name: string) => {
				const value = req.cookies[name];
				return value ? { name, value } : undefined;
			},
		};
	} else if (req.headers?.get('cookie')) {
		// Edge API route
		const parsedCookies: Record<string, string> = {};
		const cookieHeader = req.headers.get('cookie') || '';

		cookieHeader.split(';').forEach((cookie: string) => {
			const [name, value] = cookie.split('=').map((c) => c.trim());
			if (name) parsedCookies[name] = value;
		});

		cookieStore = {
			get: (name: string) => {
				const value = parsedCookies[name];
				return value ? { name, value } : undefined;
			},
		};
	} else {
		// Fallback cookie store
		cookieStore = {
			get: () => undefined,
		};
	}

	return createClient(cookieStore);
}
