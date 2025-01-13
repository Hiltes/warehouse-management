import mongoose, { Schema, Document, Model } from 'mongoose';

// Interfejs reprezentujący obiekt Item w TypeScript
export interface IItem extends Document {
  _id: mongoose.Types.ObjectId;
  warehouse_id: mongoose.Types.ObjectId | string; // ObjectId lub string
  item_name: string;
  quantity: number;
  arrival_date: Date;
  added_by: mongoose.Types.ObjectId | string; // ObjectId lub string
  
}

// Schemat Mongoose
const productSchema = new Schema<IItem>({
  warehouse_id: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  item_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  arrival_date: { type: Date, required: true },
  added_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Eksportowanie modelu Mongoose
const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', productSchema);

export default Item;
