import { connectDB } from '$db/mongo';
import Item from '$db/models/item';

await connectDB();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const warehouseId = url.searchParams.get('warehouse');

        const filter = warehouseId ? { warehouse_id: warehouseId } : {};
        const items = await Item.find(filter);

        return new Response(JSON.stringify(items), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
