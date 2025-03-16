'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import MiniCart from './MiniCart';

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [scrolled, setScrolled] = useState(false);
	const [cartCount, setCartCount] = useState(0);
	const pathname = usePathname();

	// Détection du scroll pour changer l'arrière-plan du header
	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 10;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [scrolled]);

	// Fermer le menu et la barre de recherche lors du changement de page
	useEffect(() => {
		setIsMenuOpen(false);
		setIsSearchOpen(false);
	}, [pathname]);

	// Simulation de la récupération du nombre d'articles dans le panier
	useEffect(() => {
		// Remplacez ceci par votre appel à l'API réelle du panier
		setCartCount(3);
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(
				searchQuery
			)}`;
		}
	};

	const navigationItems = [
		{ name: 'Accueil', href: '/' },
		{ name: 'Produits', href: '/products' },
		{ name: 'Catégories', href: '/categories' },
		{ name: 'Nouveautés', href: '/new-arrivals' },
		{ name: 'Promotions', href: '/promotions' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'À propos', href: '/about' },
		{ name: 'Contact', href: '/contact' },
	];

	return (
		<header
			className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
				scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
			}`}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16'>
				{/* Logo */}
				<div className='flex-shrink-0'>
					<Link
						href='/'
						className='text-2xl font-bold text-indigo-600 cursor-pointer'>
						VotreLogo
					</Link>
				</div>
				{/* Desktop Navigation */}
				<nav className='hidden md:flex space-x-6 items-center'>
					{navigationItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className='cursor-pointer text-gray-800 hover:text-indigo-600 transition-colors'>
							{item.name}
						</Link>
					))}
					{/* Bouton Recherche */}
					<button
						onClick={() => setIsSearchOpen(!isSearchOpen)}
						className='text-gray-800 hover:text-indigo-600 transition-colors'>
						<FaSearch size={18} />
					</button>
					{/* Icône Panier */}
					<div className='relative'>
						<MiniCart />
					</div>
					{/* Icône Compte */}
					<Link
						href='/account'
						className='cursor-pointer text-gray-800 hover:text-indigo-600 transition-colors'>
						<FaUser size={18} />
					</Link>
				</nav>
				{/* Mobile Menu et Recherche */}
				<div className='md:hidden flex items-center'>
					<button
						onClick={() => setIsSearchOpen(!isSearchOpen)}
						className='mr-4 text-gray-800 hover:text-indigo-600 transition-colors'>
						<FaSearch size={18} />
					</button>
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className='text-gray-800 hover:text-indigo-600 transition-colors'>
						{isMenuOpen ? (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						) : (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 8h16M4 16h16'
								/>
							</svg>
						)}
					</button>
				</div>
			</div>
			{/* Barre de recherche animée */}
			<AnimatePresence>
				{isSearchOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className='bg-white shadow-md'>
						<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
							<form
								onSubmit={handleSearch}
								className='flex items-center py-2'>
								<input
									type='text'
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									placeholder='Recherche...'
									className='w-full border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:border-indigo-600'
								/>
								<button
									type='submit'
									className='bg-indigo-600 text-white rounded-r-md py-2 px-4 hover:bg-indigo-500 transition-colors'>
									Rechercher
								</button>
							</form>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			{/* Menu mobile animé */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.nav
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className='md:hidden bg-white shadow-md'>
						<div className='px-4 py-2 space-y-2'>
							{navigationItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									onClick={() => setIsMenuOpen(false)}
									className='block cursor-pointer text-gray-800 hover:bg-indigo-100 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors'>
									{item.name}
								</Link>
							))}
							<Link
								href='/cart'
								onClick={() => setIsMenuOpen(false)}
								className='flex items-center cursor-pointer text-gray-800 hover:bg-indigo-100 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors'>
								<FaShoppingCart
									size={18}
									className='mr-2'
								/>
								Panier
							</Link>
							<Link
								href='/account'
								onClick={() => setIsMenuOpen(false)}
								className='flex items-center cursor-pointer text-gray-800 hover:bg-indigo-100 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors'>
								<FaUser
									size={18}
									className='mr-2'
								/>
								Compte
							</Link>
							<Link
								href='/blog'
								onClick={() => setIsMenuOpen(false)}
								className='flex items-center cursor-pointer text-gray-800 hover:bg-indigo-100 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors'>
								<FaSearch
									size={18}
									className='mr-2'
								/>
								Blog
							</Link>
						</div>
					</motion.nav>
				)}
			</AnimatePresence>
		</header>
	);
}
