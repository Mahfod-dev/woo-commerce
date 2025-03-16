'use client';
import React, { createContext, useContext, useState, useRef } from 'react';
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

		setNotifications((prev) => [...prev, newNotification]);

		// Auto-suppression après la durée spécifiée
		if (newNotification.duration !== Infinity) {
			setTimeout(() => {
				removeNotification(id);
			}, newNotification.duration);
		}

		return id;
	};

	// Supprimer une notification par son ID
	const removeNotification = (id: number) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		);
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

	return (
		<NotificationContext.Provider value={contextValue}>
			{children}
			<NotificationContainer />
		</NotificationContext.Provider>
	);
};
