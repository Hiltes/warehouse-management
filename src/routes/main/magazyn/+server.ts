import Item from '$db/models/item';
import { connectDB } from '$db/mongo';

await connectDB();

export async function GET() {
    try {
        const items = await Item.find({});
        return new Response(JSON.stringify(items), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
