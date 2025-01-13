import mongoose, { Schema, model, Document } from 'mongoose';

// Interfejs dla dokumentu zamówienia
export interface IOrder extends Document {
	quantity: any;
	name: any;
    items: {
        id: string;
        name: string;
        quantity: number;
    }[];
    total: number;
    createdAt: Date;
}

// Definicja schematu zamówienia
const orderSchema = new Schema<IOrder>(
    {
        items: [
            {
                id: { type: String, required: true }, // ID produktu
                name: { type: String, required: true }, // Nazwa produktu
                quantity: { type: Number, required: true, min: 1 }, // Ilość (minimum 1)
            },
        ],
        total: {
            type: Number,
            required: true,
            min: 0, // Suma nie może być ujemna
        },
        createdAt: {
            type: Date,
            default: Date.now, // Automatyczne ustawienie daty utworzenia
        },
    },
    {
        timestamps: true, // Automatyczne dodanie pól `createdAt` i `updatedAt`
    }
);

// Dodanie walidacji pre-save (opcjonalne)
orderSchema.pre('save', function (next) {
    if (this.items.length === 0) {
        const err = new Error('Order must have at least one item.');
        return next(err);
    }
    next();
});

// Eksport modelu zamówienia
export const Order = model<IOrder>('Order', orderSchema);
