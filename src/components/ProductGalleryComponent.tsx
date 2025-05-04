'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
	src: string;
	alt: string;
}

interface ProductGalleryProps {
	images: GalleryImage[];
	productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
	images,
	productName,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showFullscreen, setShowFullscreen] = useState(false);
	const [isZoomed, setIsZoomed] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const nextImage = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + images.length) % images.length
		);
	};

	const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isZoomed) return;

		const element = e.currentTarget;
		const { width, height, left, top } = element.getBoundingClientRect();

		// Calculate mouse position as percentage of container
		const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
		const y = Math.max(0, Math.min(1, (e.clientY - top) / height));

		setMousePosition({ x, y });
	};

	const renderPlaceholder = () => {
		return (
			<div className='bg-gray-100 rounded-2xl aspect-square flex items-center justify-center'>
				<svg
					className='h-24 w-24 text-gray-300'
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
	};

	// Auto slideshow with pause on hover
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (showFullscreen) return;

		const interval = setInterval(() => {
			nextImage();
		}, 5000);

		return () => clearInterval(interval);
	}, [showFullscreen]);

	// Si pas d'images, afficher un placeholder
	if (!images || images.length === 0) {
		return renderPlaceholder();
	}

	return (
		<div className='space-y-4'>
			{/* Main image display */}
			<div
				className='relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer bg-gray-50'
				onClick={() => setShowFullscreen(true)}
				onMouseMove={handleZoom}
				onMouseEnter={() => setIsZoomed(true)}
				onMouseLeave={() => setIsZoomed(false)}>
				<motion.div
					className='h-full w-full'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					style={{
						transformOrigin: `${mousePosition.x * 100}% ${
							mousePosition.y * 100
						}%`,
						scale: isZoomed ? 1.5 : 1,
					}}>
					<Image
						src={images[currentIndex].src}
						alt={images[currentIndex].alt || productName}
						fill
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						className='object-contain'
						priority
					/>
				</motion.div>

				{/* Zoom indicator */}
				<div
					className={`absolute bottom-4 right-4 bg-black/60 rounded-full p-2 transition-opacity ${
						isZoomed ? 'opacity-100' : 'opacity-0'
					}`}>
					<svg
						className='h-5 w-5 text-white'
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

				{/* Navigation arrows */}
				{images.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.stopPropagation();
								prevImage();
							}}
							className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-md opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white transition-all z-10'>
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
							className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-md opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white transition-all z-10'>
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

				{/* Indicator dots */}
				{images.length > 1 && (
					<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10'>
						{images.map((_, index) => (
							<button
								key={index}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentIndex(index);
								}}
								className={`w-2 h-2 rounded-full transition-all ${
									currentIndex === index
										? 'bg-indigo-600 w-6'
										: 'bg-gray-300 hover:bg-gray-400'
								}`}
								aria-label={`Image ${index + 1}`}
							/>
						))}
					</div>
				)}

				{/* Fullscreen button */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						setShowFullscreen(true);
					}}
					className='absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white transition-all z-10'>
					<svg
						className='h-5 w-5'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5'
						/>
					</svg>
				</button>
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className='grid grid-cols-6 gap-2'>
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
								currentIndex === index
									? 'ring-2 ring-indigo-600 ring-offset-2'
									: 'opacity-70 hover:opacity-100'
							}`}>
							<Image
								src={image.src}
								alt={
									image.alt ||
									`${productName} - image ${index + 1}`
								}
								fill
								sizes='150px'
								className='object-cover'
							/>
						</button>
					))}
				</div>
			)}

			{/* Fullscreen Modal */}
			<AnimatePresence>
				{showFullscreen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 bg-black/95 z-50 flex items-center justify-center'
						onClick={() => setShowFullscreen(false)}>
						<button
							className='absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors'
							onClick={() => setShowFullscreen(false)}>
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
							className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-colors'
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

						<div
							className='relative max-h-[90vh] max-w-[90vw] flex items-center justify-center'
							onClick={(e) => e.stopPropagation()}>
							<Image
								src={images[currentIndex].src}
								alt={images[currentIndex].alt || productName}
								width={1200}
								height={800}
								className='object-contain max-h-[90vh]'
							/>
						</div>

						<button
							className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-colors'
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

						{/* Thumbnails in fullscreen */}
						<div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto max-w-[80vw] p-2'>
							{images.map((image, index) => (
								<button
									key={index}
									onClick={(e) => {
										e.stopPropagation();
										setCurrentIndex(index);
									}}
									className={`relative w-16 h-16 rounded overflow-hidden flex-shrink-0 transition-all ${
										currentIndex === index
											? 'ring-2 ring-white'
											: 'opacity-50 hover:opacity-75'
									}`}>
									<Image
										src={image.src}
										alt={
											image.alt ||
											`${productName} - thumbnail ${
												index + 1
											}`
										}
										fill
										sizes='64px'
										className='object-cover'
									/>
								</button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProductGallery;
