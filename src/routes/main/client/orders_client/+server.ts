import { json } from '@sveltejs/kit';
import { Order } from '$db/models/order';

export const GET = async () => {
    try {
        const orders = await Order.find(); // Pobiera wszystkie zamówienia z MongoDB
        return json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return json({ success: false, message: 'Error fetching orders' }, { status: 500 });
    }
};
