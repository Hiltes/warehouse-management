import mongoose, { Schema, Document } from 'mongoose';

// Interfejs użytkownika z TypeScript
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

// Schemat użytkownika
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Model użytkownika
const User = mongoose.model<IUser>('User', userSchema);

export default User;
