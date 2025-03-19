'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import MiniCart from './MiniCart';
import MegaMenu from './MegaMenu';

export default function Header({ categories }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();
	const searchRef = useRef(null);
	const { itemCount } = useCart();

	// Détection du scroll pour changer l'apparence du header
	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 20;
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

	// Fermer la recherche quand on clique en dehors
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target)
			) {
				setIsSearchOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(
				searchQuery
			)}`;
			setIsSearchOpen(false);
		}
	};

	const navigationItems = [
		{ name: 'Accueil', href: '/' },
		{ name: 'Produits', href: '/products' },
		{ name: 'Nouveautés', href: '/new-arrivals' },
		{ name: 'Promotions', href: '/promotions' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'À propos', href: '/about' },
		{ name: 'Contact', href: '/contact' },
	];

	return (
		<header
			className={`fixed top-0 w-full z-50 transition-all duration-300 font-sans ${
				scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
			}`}>
			<div className='max-w-7xl font-mono font-bold mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between font-sans'>
					{/* Logo */}
					<Link
						href='/'
						className='flex-shrink-0'>
						<div className='flex items-center'>
							<h1
								className={`text-2xl font-bold transition-colors duration-300 ${
									scrolled || pathname !== '/'
										? 'text-indigo-600'
										: 'text-white'
								}`}>
								VotreLogo
							</h1>
						</div>
					</Link>

					{/* Navigation desktop */}
					<nav className='hidden md:flex items-center space-x-1 font-sans'>
						{/* Navigation principale */}
						{navigationItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
									pathname === item.href
										? 'text-indigo-600'
										: scrolled || pathname !== '/'
										? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
										: 'text-white hover:text-white hover:bg-white/20'
								}`}>
								{item.name}
							</Link>
						))}
					</nav>

					{/* Actions (recherche, panier, compte) */}
					<div className='flex items-center space-x-1'>
						{/* Bouton recherche */}
						<button
							onClick={() => setIsSearchOpen(!isSearchOpen)}
							className={`p-2 rounded-full transition-colors ${
								scrolled || pathname !== '/'
									? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
									: 'text-white hover:text-white hover:bg-white/20'
							}`}
							aria-label='Recherche'>
							<FaSearch size={18} />
						</button>

						{/* Mini-panier */}
						<div className='relative z-50'>
							<MiniCart
								isDarkBg={!scrolled && pathname === '/'}
							/>
						</div>

						{/* Compte utilisateur */}
						<Link
							href='/account'
							className={`p-2 rounded-full transition-colors ${
								scrolled || pathname !== '/'
									? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
									: 'text-white hover:text-white hover:bg-white/20'
							}`}
							aria-label='Mon compte'>
							<FaUser size={18} />
						</Link>

						{/* Bouton menu mobile */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className={`md:hidden p-2 rounded-full transition-colors ${
								scrolled || pathname !== '/'
									? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
									: 'text-white hover:text-white hover:bg-white/20'
							}`}
							aria-label={
								isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'
							}>
							{isMenuOpen ? (
								<FaTimes size={20} />
							) : (
								<FaBars size={20} />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Barre de recherche */}
			<AnimatePresence>
				{isSearchOpen && (
					<motion.div
						ref={searchRef}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className='absolute top-full left-0 right-0 p-4 bg-white shadow-lg border-t border-gray-200 z-40'>
						<form
							onSubmit={handleSearch}
							className='max-w-3xl mx-auto flex'>
							<input
								type='text'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder='Rechercher un produit...'
								className='flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
								autoFocus
							/>
							<button
								type='submit'
								className='bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
								<FaSearch size={18} />
							</button>
						</form>
						{/* Suggestions de recherche (à implémenter) */}
						{/* {searchQuery.length > 2 && (
							<div className='mt-4 max-w-3xl mx-auto bg-white rounded-md shadow-sm'>
								<div className='p-2 text-center text-sm text-gray-500'>
									Tapez pour rechercher...
								</div>
							</div>
						)} */}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Menu mobile */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className='md:hidden bg-white shadow-lg border-t border-gray-200 overflow-hidden'>
						<nav className='max-w-7xl mx-auto px-4 py-3 space-y-1'>
							{navigationItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									onClick={() => setIsMenuOpen(false)}
									className={`block px-3 py-2 rounded-md transition-colors ${
										pathname === item.href
											? 'bg-indigo-50 text-indigo-600 font-medium'
											: 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
									}`}>
									{item.name}
								</Link>
							))}

							{/* Catégories dans le menu mobile */}
							<div className='pt-2 pb-1'>
								<p className='px-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Catégories
								</p>
							</div>

							{categories?.slice(0, 5).map((category) => (
								<Link
									key={category.id}
									href={`/categories/${category.slug}`}
									onClick={() => setIsMenuOpen(false)}
									className='block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors'>
									{category.name}
								</Link>
							))}

							{categories?.length > 5 && (
								<Link
									href='/categories'
									onClick={() => setIsMenuOpen(false)}
									className='block px-3 py-2 rounded-md text-indigo-600 font-medium hover:bg-indigo-50 transition-colors'>
									Voir toutes les catégories
								</Link>
							)}

							{/* Actions du menu mobile */}
							<div className='pt-4 pb-3 border-t border-gray-200'>
								<div className='flex items-center px-3'>
									<div className='flex-shrink-0'>
										<div className='h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
											<FaUser size={20} />
										</div>
									</div>
									<div className='ml-3'>
										<div className='text-base font-medium text-gray-800'>
											Mon compte
										</div>
										<div className='text-sm font-medium text-gray-500'>
											Accédez à votre compte
										</div>
									</div>
								</div>
								<div className='mt-3 space-y-1'>
									<Link
										href='/account'
										onClick={() => setIsMenuOpen(false)}
										className='block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors'>
										Mon profil
									</Link>
									<Link
										href='/orders'
										onClick={() => setIsMenuOpen(false)}
										className='block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors'>
										Mes commandes
									</Link>
									<Link
										href='/cart'
										onClick={() => setIsMenuOpen(false)}
										className='block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors'>
										Mon panier ({itemCount})
									</Link>
								</div>
							</div>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
