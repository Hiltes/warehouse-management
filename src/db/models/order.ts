import mongoose, { Schema, Document, Types } from 'mongoose';

interface IOrderProduct {
  productId: Types.ObjectId;
  quantity: number;
}

interface IOrder extends Document {
  userId: Types.ObjectId;
  products: IOrderProduct[];
  totalPrice: number;
}

const orderProductSchema = new Schema<IOrderProduct>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
}, { _id: false }); // _id: false, by nie tworzyć osobnych _id dla elementów tablicy

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: { type: [orderProductSchema], required: true },
  totalPrice: { type: Number, required: true },
}, {
  timestamps: true, // automatycznie dodaje createdAt, updatedAt
});

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
