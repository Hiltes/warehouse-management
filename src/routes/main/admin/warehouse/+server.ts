import { getUserById } from '$db/api/user';

import { connectDB } from '$db/mongo';
import Item from '$db/models/item';
import Warehouse from '$db/models/warehouse';

await connectDB();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const warehouseId = url.searchParams.get('warehouse');

        const filter = warehouseId ? { warehouse_id: warehouseId } : {};
        
        const itemsWithUsernamesAndWarehouses = [];
        const items = await Item.find(filter);

        for (const item of items) {
            const user = item.added_by ? await getUserById(item.added_by.toString()) : null;
            const username = user ? user.username : 'Unknown';

            const warehouse = item.warehouse_id ? await Warehouse.findById(item.warehouse_id).exec() : null;
            const warehouseType = warehouse ? warehouse.warehouse_type : 'Unknown';

            itemsWithUsernamesAndWarehouses.push({ ...item.toObject(), added_by_name: username, warehouse_type: warehouseType });
        }

        return new Response(JSON.stringify(itemsWithUsernamesAndWarehouses), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
