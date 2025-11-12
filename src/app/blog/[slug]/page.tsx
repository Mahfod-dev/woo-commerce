// app/blog/[slug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';
import BlogArticleContent from '@/components/BlogArticleContent';

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Composant de chargement
function ArticleLoading() {
	return (
		<div className='max-w-4xl mx-auto px-4 sm:px-6 py-12'>
			<div className='animate-pulse space-y-8'>
				<div className='h-8 bg-gray-200 max-w-lg rounded'></div>
				<div className='flex gap-4'>
					<div className='h-6 w-24 bg-gray-200 rounded'></div>
					<div className='h-6 w-32 bg-gray-200 rounded'></div>
				</div>
				<div className='h-96 bg-gray-200 rounded-lg'></div>
				<div className='space-y-4'>
					<div className='h-4 bg-gray-200 rounded w-full'></div>
					<div className='h-4 bg-gray-200 rounded w-full'></div>
					<div className='h-4 bg-gray-200 rounded w-3/4'></div>
				</div>
			</div>
		</div>
	);
}

// Génération des métadonnées dynamiques pour SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = getBlogPostBySlug(slug);

	if (!post) {
		return {
			title: 'Article non trouvé | Selectura',
			description: "L'article que vous recherchez n'existe pas.",
		};
	}

	return {
		title: `${post.title} | Blog Selectura`,
		description: post.excerpt,
		keywords: post.tags?.join(', '),
		openGraph: {
			title: post.title,
			description: post.excerpt,
			type: 'article',
			locale: 'fr_FR',
			url: `https://selectura.co/blog/${slug}`,
			siteName: 'Selectura',
			images: [
				{
					url: post.image,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
			publishedTime: post.date,
			authors: [post.author],
		},
		twitter: {
			card: 'summary_large_image',
			title: post.title,
			description: post.excerpt,
			images: [post.image],
		},
		alternates: {
			canonical: `https://selectura.co/blog/${slug}`,
		},
	};
}

// Génération des chemins statiques
export async function generateStaticParams() {
	const posts = getAllBlogPosts();
	return posts.map((post) => ({
		slug: post.slug,
	}));
}

export default async function ArticlePage({ params }: PageProps) {
	try {
		const { slug } = await params;
		const post = getBlogPostBySlug(slug);

		if (!post) {
			notFound();
		}

		// Transform BlogPost to match Article type with Author object
		const article = {
			...post,
			author: {
				name: post.author,
				avatar: '/images/author-avatar.jpg',
				bio: 'Expert en curation de produits premium',
			},
			content: post.content || '',
		};

		return (
			<Suspense fallback={<ArticleLoading />}>
				<BlogArticleContent article={article} />
			</Suspense>
		);
	} catch (error) {
		console.error("Erreur lors du chargement de l'article:", error);
		notFound();
	}
}
