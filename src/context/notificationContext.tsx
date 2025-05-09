'use client';
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { NotificationContainer } from './NotificationContainer';

// Types (à placer éventuellement dans un fichier séparé)
export interface NotificationAction {
	label: string;
	onClick: () => void;
	closeOnClick?: boolean;
}

export interface Notification {
	id: number;
	title?: string;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	duration: number;
	action?: NotificationAction;
}

export interface NotificationInput {
	title?: string;
	message: string;
	type?: 'success' | 'error' | 'warning' | 'info';
	duration?: number;
	action?: NotificationAction;
}

interface NotificationContextType {
	notifications: Notification[];
	addNotification: (notification: NotificationInput) => number;
	removeNotification: (id: number) => void;
	clearAllNotifications: () => void;
}

// Création du contexte
export const NotificationContext = createContext<
	NotificationContextType | undefined
>(undefined);

// Hook pour utiliser le contexte
export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			'useNotification must be used within a NotificationProvider'
		);
	}
	return context;
};

// Provider qui encapsule les fonctionnalités
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	// Flag to track component mount state
	const isMounted = useRef(true);
	const idCounter = useRef(0);

	// Ajouter une nouvelle notification
	const addNotification = (notification: NotificationInput) => {
		const id = idCounter.current++;
		const newNotification = {
			id,
			title: notification.title || '',
			message: notification.message,
			type: notification.type || 'info',
			duration: notification.duration || 5000,
			action: notification.action,
		};

		// Use a more stable way to update notifications
		setNotifications((prev) => {
			// Check if this is a duplicate notification (same message and type)
			const isDuplicate = prev.some(
				(n) => 
					n.message === newNotification.message && 
					n.type === newNotification.type
			);
			
			if (isDuplicate) {
				return prev; // Don't add duplicate notifications
			}
			
			return [...prev, newNotification];
		});

		// Auto-suppression après la durée spécifiée
		if (newNotification.duration !== Infinity) {
			setTimeout(() => {
				// Only update if component is still mounted
				if (isMounted.current) {
					setNotifications((prev) => 
						prev.filter((n) => n.id !== id)
					);
				}
			}, newNotification.duration);
		}

		return id;
	};

	// Supprimer une notification par son ID
	const removeNotification = (id: number) => {
		// Only update if component is still mounted
		if (isMounted.current) {
			setNotifications((prev) =>
				prev.filter((notification) => notification.id !== id)
			);
		}
	};

	// Supprimer toutes les notifications
	const clearAllNotifications = () => {
		setNotifications([]);
	};

	// Valeur du contexte
	const contextValue = {
		notifications,
		addNotification,
		removeNotification,
		clearAllNotifications,
	};

	// Add effect to track mount state
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	return (
		<NotificationContext.Provider value={contextValue}>
			{children}
			<NotificationContainer />
		</NotificationContext.Provider>
	);
};
