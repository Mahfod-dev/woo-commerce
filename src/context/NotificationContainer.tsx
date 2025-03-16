'use client';
import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationContext } from './notificationContext';

// Composant qui affiche les notifications
export const NotificationContainer: React.FC = () => {
	const { notifications, removeNotification } =
		useContext(NotificationContext);

	// Variantes pour les animations
	const notificationVariants = {
		hidden: { opacity: 0, y: 50, scale: 0.8 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { type: 'spring', stiffness: 300, damping: 24 },
		},
		exit: {
			opacity: 0,
			x: '100%',
			transition: { duration: 0.2, ease: 'easeOut' },
		},
	};

	// Récupérer l'icône en fonction du type de notification
	const getNotificationIcon = (type) => {
		switch (type) {
			case 'success':
				return (
					<div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
						<svg
							className='h-5 w-5 text-green-500'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
					</div>
				);
			case 'error':
				return (
					<div className='h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0'>
						<svg
							className='h-5 w-5 text-red-500'
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
					</div>
				);
			case 'warning':
				return (
					<div className='h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0'>
						<svg
							className='h-5 w-5 text-yellow-500'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
							/>
						</svg>
					</div>
				);
			case 'info':
			default:
				return (
					<div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
						<svg
							className='h-5 w-5 text-blue-500'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</div>
				);
		}
	};

	// Récupérer la couleur de progression en fonction du type
	const getProgressColor = (type) => {
		switch (type) {
			case 'success':
				return 'bg-green-500';
			case 'error':
				return 'bg-red-500';
			case 'warning':
				return 'bg-yellow-500';
			case 'info':
			default:
				return 'bg-blue-500';
		}
	};

	return (
		<div className='fixed top-4 right-4 z-50 space-y-4 max-w-sm w-full'>
			<AnimatePresence>
				{notifications.map((notification) => (
					<motion.div
						key={notification.id}
						variants={notificationVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
						className='bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200'>
						<div className='p-4 flex'>
							{getNotificationIcon(notification.type)}

							<div className='ml-3 flex-1'>
								{notification.title && (
									<p className='text-sm font-medium text-gray-900'>
										{notification.title}
									</p>
								)}
								<p className='text-sm text-gray-600'>
									{notification.message}
								</p>

								{notification.action && (
									<button
										onClick={() => {
											notification.action.onClick();
											if (
												notification.action
													.closeOnClick !== false
											) {
												removeNotification(
													notification.id
												);
											}
										}}
										className='mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-500'>
										{notification.action.label}
									</button>
								)}
							</div>

							<button
								onClick={() =>
									removeNotification(notification.id)
								}
								className='ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500'>
								<svg
									className='h-5 w-5'
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
						</div>

						{/* Barre de progression */}
						{notification.duration !== Infinity && (
							<div className='h-1 w-full bg-gray-200'>
								<motion.div
									className={`h-full ${getProgressColor(
										notification.type
									)}`}
									initial={{ width: '100%' }}
									animate={{ width: '0%' }}
									transition={{
										duration: notification.duration / 1000,
										ease: 'linear',
									}}
								/>
							</div>
						)}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};
