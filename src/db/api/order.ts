import { Order } from '$db/models/order';

export async function FindOrders(query: string) {
    const regex = new RegExp(query, 'i'); // Używamy regex do wyszukiwania (case-insensitive)
    return await Order.find({ name: regex });
}
