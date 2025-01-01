import mongoose, { Schema, Document } from 'mongoose';


// Interfejs użytkownika z TypeScript
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
}

// Schemat użytkownika
const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'client']}
},
{
    versionKey: false
}
);

// Model użytkownika - (Dodane: mongoose.models.User - Sprawdza, czy model User został już utworzony. Jeśli tak, korzysta z istniejącego modelu, zamiast tworzyć nowy.)
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
