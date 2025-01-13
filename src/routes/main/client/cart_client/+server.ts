import { json } from '@sveltejs/kit';
import { Order } from '$db/models/order'; // Import modelu zamówienia

export async function POST({ request }: { request: Request }) {
    try {
        // Ekstrahujemy dane z żądania
        const { items } = await request.json();

        // Walidacja danych wejściowych
        if (!items || !Array.isArray(items) || items.length === 0) {
            return json({ success: false, error: 'Nieprawidłowe dane zamówienia' }, { status: 400 });
        }

        // Obliczenie sumy zamówienia
        const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

        if (total <= 0) {
            return json({ success: false, error: 'Nieprawidłowa suma zamówienia' }, { status: 400 });
        }

        // Tworzenie zamówienia w bazie danych
        const newOrder = await Order.create({
            items,
            total,
        });

        // Zwracanie odpowiedzi
        return json({ success: true, message: 'Zamówienie zostało dodane pomyślnie', order: newOrder }, { status: 201 });
    } catch (error) {
        console.error('Błąd podczas dodawania zamówienia:', error);
        return json({ success: false, error: 'Wewnętrzny błąd serwera' }, { status: 500 });
    }
}
