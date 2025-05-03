'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { motion, useReducedMotion, Variant, Variants } from 'framer-motion';

// Types pour les animations
export interface AnimationVariants {
	hidden: Variant;
	visible: Variant;
	[key: string]: Variant; // Ajout d'un index signature pour rendre compatible avec Variants
}

export interface AnimationContextType {
	shouldReduceMotion: boolean;
	fadeUpVariants: AnimationVariants;
	fadeInVariants: AnimationVariants;
	staggerContainerVariants: AnimationVariants;
	staggerItemVariants: AnimationVariants;
	zoomInVariants: AnimationVariants;
	slideInRightVariants: AnimationVariants;
	slideInLeftVariants: AnimationVariants;
}

// Contexte pour les animations
const AnimationContext = createContext<AnimationContextType | undefined>(
	undefined
);

export function useAnimation() {
	const context = useContext(AnimationContext);
	if (!context) {
		throw new Error(
			'useAnimation must be used within an AnimationProvider'
		);
	}
	return context;
}

interface AnimationProviderProps {
	children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
	// Détection des préférences de réduction de mouvement
	const shouldReduceMotion = useReducedMotion() || false;

	// Variantes communes d'animation
	const fadeUpVariants: AnimationVariants = {
		hidden: {
			opacity: 0,
			y: shouldReduceMotion ? 0 : 20,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: 'easeOut',
			},
		},
	};

	const fadeInVariants: AnimationVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
	};

	const staggerContainerVariants: AnimationVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: shouldReduceMotion ? 0 : 0.1,
				delayChildren: 0.1,
			},
		},
	};

	const staggerItemVariants: AnimationVariants = {
		hidden: {
			opacity: 0,
			y: shouldReduceMotion ? 0 : 20,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	const zoomInVariants: AnimationVariants = {
		hidden: {
			opacity: 0,
			scale: shouldReduceMotion ? 1 : 0.8,
		},
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.5,
				ease: 'easeOut',
			},
		},
	};

	const slideInRightVariants: AnimationVariants = {
		hidden: {
			opacity: 0,
			x: shouldReduceMotion ? 0 : 50,
		},
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	const slideInLeftVariants: AnimationVariants = {
		hidden: {
			opacity: 0,
			x: shouldReduceMotion ? 0 : -50,
		},
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	const value: AnimationContextType = {
		shouldReduceMotion,
		fadeUpVariants,
		fadeInVariants,
		staggerContainerVariants,
		staggerItemVariants,
		zoomInVariants,
		slideInRightVariants,
		slideInLeftVariants,
	};

	return (
		<AnimationContext.Provider value={value}>
			{children}
		</AnimationContext.Provider>
	);
}

// Composants réutilisables avec animation
interface AnimatedComponentProps {
	children: ReactNode;
	className?: string;
	delay?: number;
	once?: boolean;
	threshold?: number;
}

export function FadeUpAnimation({
	children,
	className = '',
	delay = 0,
	once = true,
	threshold = 0.1,
}: AnimatedComponentProps) {
	const { fadeUpVariants } = useAnimation();

	return (
		<motion.div
			initial='hidden'
			whileInView='visible'
			viewport={{ once, amount: threshold }}
			variants={fadeUpVariants}
			transition={{ delay }}
			className={className}>
			{children}
		</motion.div>
	);
}

export function FadeInAnimation({
	children,
	className = '',
	delay = 0,
	once = true,
	threshold = 0.1,
}: AnimatedComponentProps) {
	const { fadeInVariants } = useAnimation();

	return (
		<motion.div
			initial='hidden'
			whileInView='visible'
			viewport={{ once, amount: threshold }}
			variants={fadeInVariants}
			transition={{ delay }}
			className={className}>
			{children}
		</motion.div>
	);
}

export function StaggerContainer({
	children,
	className = '',
	delay = 0,
	once = true,
	threshold = 0.1,
}: AnimatedComponentProps) {
	const { staggerContainerVariants } = useAnimation();

	return (
		<motion.div
			initial='hidden'
			whileInView='visible'
			viewport={{ once, amount: threshold }}
			variants={staggerContainerVariants}
			transition={{ delay }}
			className={className}>
			{children}
		</motion.div>
	);
}

export function StaggerItem({
	children,
	className = '',
}: {
	children: ReactNode;
	className?: string;
}) {
	const { staggerItemVariants } = useAnimation();

	return (
		<motion.div
			variants={staggerItemVariants}
			className={className}>
			{children}
		</motion.div>
	);
}

export function ZoomInAnimation({
	children,
	className = '',
	delay = 0,
	once = true,
	threshold = 0.1,
}: AnimatedComponentProps) {
	const { zoomInVariants } = useAnimation();

	return (
		<motion.div
			initial='hidden'
			whileInView='visible'
			viewport={{ once, amount: threshold }}
			variants={zoomInVariants}
			transition={{ delay }}
			className={className}>
			{children}
		</motion.div>
	);
}
