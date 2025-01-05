import { json } from '@sveltejs/kit';
import Item from '$db/models/item';
import {connectDB } from '$db/mongo';
import { getUserFromCookie } from '$db/middleware/auth';
import type { RequestEvent } from './$types';
import Warehouse from '$db/models/warehouse';

await connectDB;

export async function GET() {
   try {
       const warehouses = await Warehouse.find({});
       return json(warehouses);
   } catch (error) {
       console.error('Error fetching warehouses:', error);
       return json({ error: 'Failed to fetch warehouses' }, { status: 500 });
   }
}

export async function POST({ request }: RequestEvent){
   try {
      const {item_name, quantity, arrival_date, warehouse_id } = await request.json();

      const user = await getUserFromCookie(request);
      console.log('User data:', user);
      if(!user.valid || !user.payload || !user.payload.id){
         return json({ error: 'Unauthorized - user not logged in' }, { status: 401 });
      }

      const newItem = new Item({
         warehouse_id,
         item_name,
         quantity,
         arrival_date: new Date(arrival_date),
         added_by: user.payload.id,
      });
      await newItem.save();
      return json({ success: true, message: 'Item added successfully'});

   } catch (error) {
      console.error("Error adding item: ", error);
      return json({ error: error.message || 'Unknown server error' }, { status: 500 });
   }

}

