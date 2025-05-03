'use client';
import { useNotification, NotificationInput } from './notificationContext';

// Type pour les options de notification
type NotificationOptions = Omit<NotificationInput, 'message' | 'type'>;

// Hooks d'utilité pour les différents types de notifications
export const useSuccessNotification = () => {
	const { addNotification } = useNotification();
	return (message: string, options: NotificationOptions = {}) => {
		return addNotification({
			message,
			type: 'success',
			...options,
		});
	};
};

export const useErrorNotification = () => {
	const { addNotification } = useNotification();
	return (message: string, options: NotificationOptions = {}) => {
		return addNotification({
			message,
			type: 'error',
			...options,
		});
	};
};

export const useWarningNotification = () => {
	const { addNotification } = useNotification();
	return (message: string, options: NotificationOptions = {}) => {
		return addNotification({
			message,
			type: 'warning',
			...options,
		});
	};
};

export const useInfoNotification = () => {
	const { addNotification } = useNotification();
	return (message: string, options: NotificationOptions = {}) => {
		return addNotification({
			message,
			type: 'info',
			...options,
		});
	};
};
