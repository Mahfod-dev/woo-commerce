// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/woo';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const categories = await getCategories();

		return NextResponse.json(categories, {
			headers: {
				'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
			},
		});
	} catch (error) {
		console.error('Error fetching categories:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch categories' },
			{ status: 500 }
		);
	}
}
