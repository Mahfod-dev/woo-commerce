'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGallery = ({ images, productName }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const mainImageRef = useRef(null);

	// Gère le zoom sur l'image principale
	const handleMouseMove = (e) => {
		if (!mainImageRef.current || !isZoomed) return;

		const { left, top, width, height } =
			mainImageRef.current.getBoundingClientRect();
		const x = (e.clientX - left) / width;
		const y = (e.clientY - top) / height;

		setZoomPosition({ x, y });
	};

	// Gestion des touches clavier pour la navigation du lightbox
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!lightboxOpen) return;

			if (e.key === 'ArrowRight') {
				setSelectedImageIndex((prev) => (prev + 1) % images.length);
			} else if (e.key === 'ArrowLeft') {
				setSelectedImageIndex(
					(prev) => (prev - 1 + images.length) % images.length
				);
			} else if (e.key === 'Escape') {
				setLightboxOpen(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [lightboxOpen, images.length]);

	if (!images || images.length === 0) {
		return (
			<div className='bg-gray-100 rounded-lg aspect-square flex items-center justify-center'>
				<svg
					className='h-16 w-16 text-gray-400'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
					/>
				</svg>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{/* Image principale avec zoom */}
			<div
				className='relative overflow-hidden bg-gray-50 rounded-xl aspect-square cursor-zoom-in'
				onMouseEnter={() => setIsZoomed(true)}
				onMouseLeave={() => setIsZoomed(false)}
				onMouseMove={handleMouseMove}
				onClick={() => setLightboxOpen(true)}
				ref={mainImageRef}>
				<Image
					src={images[selectedImageIndex].src}
					alt={images[selectedImageIndex].alt || productName}
					fill
					sizes='(max-width: 768px) 100vw, 50vw'
					className='object-cover transition-transform duration-200'
					style={{
						transformOrigin: `${zoomPosition.x * 100}% ${
							zoomPosition.y * 100
						}%`,
						transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
					}}
					priority
				/>

				{/* Indicateur de zoom */}
				<div
					className={`absolute bottom-4 right-4 bg-black bg-opacity-60 text-white p-2 rounded-full transition-opacity ${
						isZoomed ? 'opacity-100' : 'opacity-0'
					}`}>
					<svg
						className='h-5 w-5'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7'
						/>
					</svg>
				</div>
			</div>

			{/* Miniatures */}
			<div className='flex space-x-2 overflow-x-auto py-1 scrollbar-hide'>
				{images.map((image, index) => (
					<motion.button
						key={image.id || index}
						whileHover={{ y: -5 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setSelectedImageIndex(index)}
						className={`relative rounded-lg overflow-hidden flex-shrink-0 w-20 h-20 border-2 transition-all duration-200 ${
							selectedImageIndex === index
								? 'border-indigo-600 shadow-md'
								: 'border-transparent opacity-70'
						}`}>
						<Image
							src={image.src}
							alt={
								image.alt ||
								`${productName} - image ${index + 1}`
							}
							fill
							sizes='80px'
							className='object-cover'
						/>
					</motion.button>
				))}
			</div>

			{/* Lightbox */}
			<AnimatePresence>
				{lightboxOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4'
						onClick={() => setLightboxOpen(false)}>
						<button
							className='absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20'
							onClick={(e) => {
								e.stopPropagation();
								setLightboxOpen(false);
							}}>
							<svg
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
						</button>

						<button
							className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20'
							onClick={(e) => {
								e.stopPropagation();
								setSelectedImageIndex(
									(prev) =>
										(prev - 1 + images.length) %
										images.length
								);
							}}>
							<svg
								className='h-8 w-8'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M15 19l-7-7 7-7'
								/>
							</svg>
						</button>

						<motion.div
							className='relative h-full max-h-[80vh] max-w-[80vw] flex items-center justify-center'
							onClick={(e) => e.stopPropagation()}
							key={selectedImageIndex}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.3 }}>
							<Image
								src={images[selectedImageIndex].src}
								alt={
									images[selectedImageIndex].alt ||
									productName
								}
								className='object-contain max-h-[80vh]'
								width={1200}
								height={1200}
							/>
						</motion.div>

						<button
							className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20'
							onClick={(e) => {
								e.stopPropagation();
								setSelectedImageIndex(
									(prev) => (prev + 1) % images.length
								);
							}}>
							<svg
								className='h-8 w-8'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5l7 7-7 7'
								/>
							</svg>
						</button>

						<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2'>
							{images.map((_, index) => (
								<button
									key={index}
									onClick={(e) => {
										e.stopPropagation();
										setSelectedImageIndex(index);
									}}
									className={`w-3 h-3 rounded-full ${
										selectedImageIndex === index
											? 'bg-white'
											: 'bg-gray-500'
									}`}
								/>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProductGallery;
