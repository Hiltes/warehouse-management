import { json } from '@sveltejs/kit';
import { FindItems } from '$db/api/item';

export async function POST({ request }: { request: Request }) {
    try {
        const { item_name } = await request.json();

        // Wyszukiwanie przedmiotów z użyciem regex
        const items = await FindItems(item_name);

        if (items.length > 0) {
            return json({ success: true, items });
        } else {
            return json({ success: false, message: 'Nie znaleziono przedmiotów' });
        }
    } catch (err) {
        console.error('Error in itemsearch endpoint:', (err as Error).message);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
