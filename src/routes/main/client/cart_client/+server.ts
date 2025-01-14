import { json } from '@sveltejs/kit';
import { Order } from '$db/models/order';
import Item from '$db/models/item'; // Import modelu Item

export async function POST({ request }: { request: Request }) {
	try {
		const { items } = await request.json();

		if (!items || !Array.isArray(items) || items.length === 0) {
			return json({ success: false, error: 'Nieprawidłowe dane zamówienia' }, { status: 400 });
		}

		const session = await Order.startSession(); // Rozpocznij transakcję
		session.startTransaction();

		try {
			// Oblicz sumę zamówienia
			const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
			if (total <= 0) {
				await session.abortTransaction();
				return json({ success: false, error: 'Nieprawidłowa suma zamówienia' }, { status: 400 });
			}

			// Zmniejsz ilość przedmiotów w magazynie
			for (const item of items) {
				const dbItem = await Item.findById(item.id).session(session); // Znajdź przedmiot w bazie
				if (!dbItem) {
					throw new Error(`Przedmiot o ID ${item.id} nie został znaleziony w magazynie.`);
				}

				if (dbItem.quantity < item.quantity) {
					throw new Error(`Niewystarczająca ilość przedmiotu: ${dbItem.item_name}.`);
				}

				// Zmniejsz ilość i zapisz zmiany
				dbItem.quantity -= item.quantity;
				await dbItem.save({ session });
			}

			// Zapisz zamówienie w bazie danych
			const newOrder = await Order.create([{ items, total }], { session });

			await session.commitTransaction();
			return json(
				{ success: true, message: 'Zamówienie zostało dodane pomyślnie', order: newOrder },
				{ status: 201 }
			);
		} catch (error) {
			await session.abortTransaction();

			// Rzutowanie error na typ Error
			const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
			console.error('Błąd podczas przetwarzania zamówienia:', errorMessage);
			return json({ success: false, error: errorMessage }, { status: 500 });
		} finally {
			session.endSession();
		}
	} catch (error) {
		console.error('Błąd podczas dodawania zamówienia:', error);
		return json({ success: false, error: 'Wewnętrzny błąd serwera' }, { status: 500 });
	}
}
