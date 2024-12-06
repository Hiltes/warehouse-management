import mongoose from 'mongoose';
import { MONGO_URL } from "$env/static/private";

// Połączenie z bazą danych MongoDB
export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB with Mongoose");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Zakończenie aplikacji, jeśli połączenie nie powiedzie się
    }
}

