import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  warehouse_id: mongoose.Types.ObjectId;
  item_name: string;
  quantity: number;
  arrival_date: Date;
  added_by: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IItem>({
  warehouse_id: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  item_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  arrival_date: { type: Date, required: true },
  added_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Item = mongoose.models.Item || mongoose.model<IItem>('Item', productSchema);
export default Item;
