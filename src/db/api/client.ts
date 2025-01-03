import Client from '$db/models/client'; // Zakładamy, że model User jest w pliku models/User
import type { IClient } from '$db/models/client';
import bcrypt from 'bcrypt';

// Dodanie nowego użytkownika
export async function addClient(username: string, email: string, password: string, role: string): Promise<boolean> {
    try {
        // Sprawdzenie, czy użytkownik już istnieje
        const doesClientExist = await checkClientV2(email);

        if (doesClientExist) {
            console.log("User already exists");
            return false; // Nie dodajemy użytkownika, jeśli już istnieje
        }

        // Tworzenie nowego użytkownika
        
        const hashedPassword = await bcrypt.hash(password, 10); // Haszowanie hasła
        const newClient = new Client({
            username,
            email,
            password: hashedPassword,
            role
        });

        
        // Zapisanie nowego użytkownika w bazie
        await newClient.save();
        console.log("Client added successfully");
        return true;
    } catch (error) {
        console.error("Error adding client:", error);
        return false;
    }

    
}

// Znalezienie wszystkich użytkowników
export async function getClients() {
    try {
        const clients = await Client.find(); // Pobierz wszystkich użytkowników
        console.log("Clients:", clients);
    } catch (error) {
        console.error("Error retrieving clients:", error);
    }
}

// Usunięcie użytkownika po ID
export async function deleteClientById(clientId: string) {
    try {
        await Client.findByIdAndDelete(clientId); // Usuwanie użytkownika po ID
        console.log("Client deleted successfully");
    } catch (error) {
        console.error("Error deleting client:", error);
    }
}

// Sprawdzenie, czy użytkownik istnieje
export async function checkClient(email: string, password: string): Promise<IClient | null> {
    try {
        const client = await Client.findOne({ email });
        if (client) {
            console.log("User found:", client);
            return client; // Zwracaj obiekt użytkownika
        } else {
            console.log("Client not found");
            return null; // Brak użytkownika
        }
    } catch (error) {
        console.error("Error checking client:", error);
        return null;
    }
}



export async function checkClientV2(email: string): Promise<boolean> {
    try {
        // Znalezienie użytkownika w bazie
        const client = await Client.findOne({ email });
        if (client) {
            // Opcjonalnie: porównanie hasła (np. jeśli hasła są haszowane)
            console.log("Client found:", client);
            return true;
        } else {
            console.log("Client not found");
            return false;
        }
    } catch (error) {
        console.error("Error checking client:", error);
        return false;
    }

    
}

export async function changePassword(email: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
        const client = await Client.findOne({ email });
        if (!client) {
            console.log("Client not found");
            return false; // Użytkownik nie został znaleziony
        }

           //Pokaż dane użytkownika
           console.log("Client found:", { username: client.username, email: client.email, role: client.role });
         

        // Sprawdzenie starego hasła
        const isMatch = await bcrypt.compare(oldPassword.trim(), client.password);
        console.log("Comparing:", oldPassword.trim(), client.password, "Match:", isMatch);
        if (!isMatch) {
            console.log("Old password is incorrect");
            return false; // Stare hasło jest niepoprawne
        }


        // Haszowanie nowego hasła
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        client.password = hashedNewPassword;

        // Zapisz zmiany
        await client.save();
        console.log("Password changed successfully");
        return true;
    } catch (error) {
        console.error("Error changing password:", error);
        return false;
    }
}