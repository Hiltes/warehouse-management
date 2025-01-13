import { Order } from '$db/models/order';

export async function GET() {
    try {
        const orders = await Order.find(); // Pobiera zamówienia z bazy
        const formattedOrders = orders.map((order) => ({
            id: order._id, // Dodaj ID zamówienia
            name: order.items.map(item => item.name).join(', '), // Łącz nazwy itemów w jedną
            quantity: order.items.reduce((acc, item) => acc + item.quantity, 0), // Zsumuj ilości
        }));

        return new Response(
            JSON.stringify({ success: true, orders: formattedOrders }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ success: false, message: 'Błąd pobierania zamówień.' }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }
}
