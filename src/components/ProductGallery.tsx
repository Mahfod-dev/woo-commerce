'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImprovedProductGalleryProps {
	images: { src: string; alt: string }[];
	productName: string;
}

export default function ImprovedProductGallery({
	images,
	productName,
}: ImprovedProductGalleryProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
	const [showLightbox, setShowLightbox] = useState(false);
	const mainImageRef = useRef<HTMLDivElement>(null);

	// Si pas d'images, afficher un placeholder
	if (!images || images.length === 0) {
		return (
			<div className='aspect-square bg-gray-100 rounded-xl flex items-center justify-center'>
				<svg
					className='h-20 w-20 text-gray-300'
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

	// Zoomer sur l'image
	const handleZoom = useCallback((e: React.MouseEvent) => {
		if (!mainImageRef.current) return;

		const { left, top, width, height } =
			mainImageRef.current.getBoundingClientRect();
		const x = (e.clientX - left) / width;
		const y = (e.clientY - top) / height;

		setZoomPos({ x, y });
	}, []);

	// Image suivante
	const nextImage = () => {
		setSelectedImageIndex((prev) => (prev + 1) % images.length);
	};

	// Image précédente
	const prevImage = () => {
		setSelectedImageIndex(
			(prev) => (prev - 1 + images.length) % images.length
		);
	};

	// Animation variants
	const thumbnailVariants = {
		inactive: { opacity: 0.6, scale: 0.9 },
		active: { opacity: 1, scale: 1 },
		hover: { opacity: 1, y: -5 },
	};

	return (
		<>
			{/* Image principale */}
			<div
				ref={mainImageRef}
				className='aspect-square bg-gray-50 rounded-xl overflow-hidden relative mb-4 cursor-zoom-in'
				onMouseMove={isZoomed ? handleZoom : undefined}
				onMouseEnter={() => setIsZoomed(true)}
				onMouseLeave={() => setIsZoomed(false)}
				onClick={() => setShowLightbox(true)}>
				<Image
					src={images[selectedImageIndex].src}
					alt={images[selectedImageIndex].alt || productName}
					fill
					sizes='(max-width: 768px) 100vw, 50vw'
					className='object-cover transition-transform duration-200'
					style={{
						transformOrigin: `${zoomPos.x * 100}% ${
							zoomPos.y * 100
						}%`,
						transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
					}}
					priority
				/>

				{/* Indicateur de zoom */}
				<div
					className={`absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full transition-opacity ${
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

				{/* Boutons de navigation */}
				{images.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.stopPropagation();
								prevImage();
							}}
							className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white transition-all'>
							<svg
								className='h-5 w-5'
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
						<button
							onClick={(e) => {
								e.stopPropagation();
								nextImage();
							}}
							className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white transition-all'>
							<svg
								className='h-5 w-5'
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
					</>
				)}
			</div>

			{/* Miniatures */}
			{images.length > 1 && (
				<div className='flex space-x-2 overflow-x-auto pt-1 scrollbar-hide'>
					{images.map((image, index) => (
						<motion.button
							key={`thumbnail-${index}`}
							variants={thumbnailVariants}
							initial='inactive'
							animate={
								selectedImageIndex === index
									? 'active'
									: 'inactive'
							}
							whileHover='hover'
							onClick={() => setSelectedImageIndex(index)}
							className={`relative overflow-hidden rounded-lg flex-shrink-0 w-20 h-20 border-2 transition-all ${
								selectedImageIndex === index
									? 'border-indigo-600 shadow-md'
									: 'border-transparent'
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
			)}

			{/* Lightbox */}
			<AnimatePresence>
				{showLightbox && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'
						onClick={() => setShowLightbox(false)}>
						<button
							className='absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20'
							onClick={(e) => {
								e.stopPropagation();
								setShowLightbox(false);
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
							className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/20'
							onClick={(e) => {
								e.stopPropagation();
								prevImage();
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
							className='relative max-h-[80vh] max-w-[80vw] flex items-center justify-center'
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
							className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/20'
							onClick={(e) => {
								e.stopPropagation();
								nextImage();
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
									key={`lightbox-indicator-${index}`}
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
		</>
	);
}
