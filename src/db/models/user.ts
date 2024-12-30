import mongoose, { Schema, Document } from 'mongoose';
import type { IUser } from '$db/models/user';

// Interfejs użytkownika z TypeScript
export interface IUser extends Document {
    [x: string]: string;
    username: string;
    email: string;
    password: string;
}

// Schemat użytkownika
const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Model użytkownika - (Dodane: mongoose.models.User - Sprawdza, czy model User został już utworzony. Jeśli tak, korzysta z istniejącego modelu, zamiast tworzyć nowy.)
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
