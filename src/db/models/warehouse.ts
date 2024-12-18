import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
   warehouse_type: string;
}

const warehouseSchema = new Schema<IWarehouse>({
   warehouse_type: { type: String, required: true }
});

const Warehouse = mongoose.models.Warehouse || mongoose.model<IWarehouse>('Warehouse', warehouseSchema);
export default Warehouse;
