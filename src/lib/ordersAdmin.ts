import { createAdminClient } from './supabase/admin';
import { Order, OrderItem } from './orders';

/**
 * Version administrative des fonctions de commande qui utilisent le client admin Supabase
 * pour contourner les politiques RLS
 */

/**
 * Enregistre une nouvelle commande dans Supabase en contournant RLS
 */
export async function createOrderAdmin(
	orderData: Omit<Order, 'id' | 'created_at'>
) {
	console.log(
		'ordersAdmin.createOrderAdmin - Début de la création avec user_id:',
		orderData.user_id
	);

	// Créer le client admin à la demande (uniquement côté serveur)
	const supabaseAdmin = createAdminClient();

	const { data, error } = await supabaseAdmin
		.from('orders')
		.insert({
			...orderData,
			created_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (error) {
		console.error('ordersAdmin.createOrderAdmin - Erreur:', error);
		console.error(
			'ordersAdmin.createOrderAdmin - Données qui ont échoué:',
			{
				user_id: orderData.user_id,
				user_id_type: typeof orderData.user_id,
				user_id_length: orderData.user_id?.length || 0,
			}
		);
		throw new Error(
			`Impossible de créer la commande dans Supabase: ${error.message}`
		);
	}

	console.log(
		'ordersAdmin.createOrderAdmin - Commande créée avec ID:',
		data.id
	);
	return data;
}

/**
 * Récupère toutes les commandes d'un utilisateur en contournant RLS
 */
export async function getUserOrdersAdmin(userId: string) {
	console.log(
		'ordersAdmin.getUserOrdersAdmin - Recherche pour userId:',
		userId
	);

	// Créer le client admin à la demande (uniquement côté serveur)
	const supabaseAdmin = createAdminClient();

	const { data, error } = await supabaseAdmin
		.from('orders')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('ordersAdmin.getUserOrdersAdmin - Erreur:', error);
		return [];
	}

	console.log('ordersAdmin.getUserOrdersAdmin - Données récupérées:', data);
	console.log(
		`ordersAdmin.getUserOrdersAdmin - ${
			data?.length || 0
		} commandes trouvées`
	);
	return data || [];
}

/**
 * Récupère une commande spécifique par son ID en contournant RLS
 */
export async function getOrderByIdAdmin(orderId: number) {
	// Créer le client admin à la demande (uniquement côté serveur)
	const supabaseAdmin = createAdminClient();

	const { data, error } = await supabaseAdmin
		.from('orders')
		.select('*')
		.eq('id', orderId)
		.single();

	if (error) {
		console.error('ordersAdmin.getOrderByIdAdmin - Erreur:', error);
		return null;
	}

	return data;
}

/**
 * Met à jour le statut d'une commande en contournant RLS
 */
export async function updateOrderStatusAdmin(
	orderId: number,
	status: Order['status']
) {
	// Créer le client admin à la demande (uniquement côté serveur)
	const supabaseAdmin = createAdminClient();

	const { data, error } = await supabaseAdmin
		.from('orders')
		.update({
			status: status,
			updated_at: new Date().toISOString(),
		})
		.eq('id', orderId)
		.select()
		.single();

	if (error) {
		console.error('ordersAdmin.updateOrderStatusAdmin - Erreur:', error);
		throw new Error(
			`Impossible de mettre à jour le statut: ${error.message}`
		);
	}

	return data;
}
