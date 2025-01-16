import mongoose, { Schema, Document } from 'mongoose';


// Interfejs użytkownika z TypeScript
export interface IClient extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
}

// Schemat użytkownika
const clientSchema = new Schema<IClient>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['client']}
},
{
    versionKey: false
}
);

// Model użytkownika - (Dodane: mongoose.models.User - Sprawdza, czy model User został już utworzony. Jeśli tak, korzysta z istniejącego modelu, zamiast tworzyć nowy.)
const Client = mongoose.models.Client || mongoose.model<IClient>('Client', clientSchema);

export default Client;
