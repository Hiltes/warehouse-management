import Client from '$db/models/client'; // Zakładamy, że model User jest w pliku models/User
import type { IClient } from '$db/models/client';
import { json } from '@sveltejs/kit';
import bcryptjs from 'bcryptjs';

// Dodanie nowego użytkownika
export async function addClient(username: string, email: string, password: string, role: string): Promise<boolean> {
    try {
        // Sprawdzenie, czy użytkownik już istnieje
        const doesClientExist = await checkClientV2(email);

        if (doesClientExist) {
            console.log("Client already exists");
            return false; // Nie dodajemy użytkownika, jeśli już istnieje
        }

        // Tworzenie nowego użytkownika
        
        const client = new Client({ username, email, password,role });
        const newClient = new Client({
            username,
            email,
            password,
            role
        });
        client.password=bcryptjs.hashSync(password,10);
        
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



export async function getClientById(userId: string) {
    try {
        // Fetch the user document by user ID
        const client = await Client.findById(userId).exec();
        return client; // Mongoose will return null if not found
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Database query failed'); // Handle error appropriately
    }
}

export async function getClientByEmail(email: string): Promise<IClient | null> {
    try {
        // Fetch the user document by email
        const client = await Client.findOne({ email }).exec();
        if (client) {
            console.log("Client found:", client);
            return client; // Zwróć obiekt użytkownika, jeśli został znaleziony
        } else {
            console.log("Client not found");
            return null; // Brak użytkownika
        }
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Database query failed'); // Handle error appropriately
    }
}

// Usunięcie użytkownika po ID
export async function deleteClientById(clientId: string) {
    try {
        const result = await Client.findByIdAndDelete(clientId); // Usuwanie użytkownika po ID
        if (!result) {
            console.log("Client not found for deletion");
            return false;
        }
        console.log("Client deleted successfully");
        return true;
    } catch (error) {
        console.error("Error deleting client:", error);
    }
}

export async function deleteClientByEmail(email: string): Promise<boolean> {
    try {
        // Znajdź użytkownika na podstawie emaila
        const user = await Client.findOne({ email });
        if (!user) {
            console.log("Client not found for deletion");
            return false; // Użytkownik nie został znaleziony
        }

        // Usunięcie użytkownika
        await Client.findByIdAndDelete(user._id);
        console.log("Client deleted successfully");
        return true;
    } catch (error) {
        console.error("Error deleting client:", error);
        return false;
    }
}


// Sprawdzenie, czy użytkownik istnieje
export async function checkClient(email: string, password: string): Promise<IClient | null> {
    try {
        const client = await Client.findOne({ email });
        if (client) {
            console.log("Client found:", client);
            const isMatch = await bcryptjs.compare(password.trim(), client.password.trim());
                        if (isMatch) {
                            return client; // Zwracaj obiekt użytkownika
                        }else {
                            console.log("Incorrect password");
                            console.log("Password comparison result:", isMatch);
                            return null; // Password is incorrect
                        }

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
        const hashPass = /^\$2y\$/.test(client.password) ? '$2a$' + client.password.slice(4) : client.password;
        const isMatch = await bcryptjs.compare(oldPassword, hashPass);
        if (!isMatch) {
            console.log("Old password is incorrect");
            return false; // Stare hasło jest niepoprawne
        }


        // Haszowanie nowego hasła
        const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
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

export async function deleteClient( username: string, email:string ) {
    try {
        // Find the client
        const client = await Client.findOne({ email, username });

        if (!client) {
            return json({ success: false, error: 'Client not found' }, { status: 404 });
        }

        // Delete the client
        await Client.findByIdAndDelete(client._id);

        return json({ success: true, message: 'Client deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting client:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}