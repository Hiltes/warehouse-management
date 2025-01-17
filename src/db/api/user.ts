import User from '$db/models/user'; // Zakładamy, że model User jest w pliku models/User
import type { IUser } from '$db/models/user';
import { json } from '@sveltejs/kit';
import bcryptjs from 'bcryptjs';

// Dodanie nowego użytkownika
export async function addUser(username: string, email: string, password: string, role: string): Promise<boolean> {
    try {
        // Sprawdzenie, czy użytkownik już istnieje
        const doesUserExist = await checkUserV2(email);

        if (doesUserExist) {
            console.log("User already exists");
            return false; // Nie dodajemy użytkownika, jeśli już istnieje
        }

        // Tworzenie nowego użytkownika
        const user = new User({ username, email, password,role });
         // Haszowanie hasła
        const newUser = new User({
            username,
            email,
            password,
            role
        });
        user.password=bcryptjs.hashSync(password,10);

        
        // Zapisanie nowego użytkownika w bazie
        await newUser.save();
        console.log("User added successfully");
        return true;
    } catch (error) {
        console.error("Error adding user:", error);
        return false;
    }

    
}

// Znalezienie wszystkich użytkowników
export async function getUsers() {
    try {
        const users = await User.find(); // Pobierz wszystkich użytkowników
        console.log("Users:", users);
    } catch (error) {
        console.error("Error retrieving users:", error);
    }
}

export async function getUserById(userId: string) {
    try {
        // Fetch the user document by user ID
        const user = await User.findById(userId).exec();
        return user; // Mongoose will return null if not found
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Database query failed'); // Handle error appropriately
    }
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
    try {
        // Fetch the user document by email
        const user = await User.findOne({ email }).exec();
        if (user) {
            console.log("User found:", user);
            return user; // Zwróć obiekt użytkownika, jeśli został znaleziony
        } else {
            console.log("User not found");
            return null; // Brak użytkownika
        }
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Database query failed'); // Handle error appropriately
    }
}

// Usunięcie użytkownika po ID
export async function deleteUserById(userId: string) {
    try {
        const result = await User.findByIdAndDelete(userId); // Usuwanie użytkownika po ID
        if (!result) {
            console.log("Client not found for deletion");
            return false;
        }
        console.log("Client deleted successfully");
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

export async function deleteUserByEmail(email: string): Promise<boolean> {
    try {
        // Znajdź użytkownika na podstawie emaila
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for deletion");
            return false; // Użytkownik nie został znaleziony
        }

        // Usunięcie użytkownika
        await User.findByIdAndDelete(user._id);
        console.log("User deleted successfully");
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
}

// Sprawdzenie, czy użytkownik istnieje
export async function checkUser(email: string, password: string): Promise<IUser | null> {
    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log("User found:", user);
            const isMatch = await bcryptjs.compare(password.trim(), user.password.trim());
            if (isMatch) {
                return user; // Zwróć obiekt użytkownika, jeśli hasła się zgadzają
            } else {
                console.log("Invalid password");
                return null; // Hasło nieprawidłowe
            }
        } else {
            console.log("User not found");
            return null; // Brak użytkownika
        }
    } catch (error) {
        console.error("Error checking user:", error);
        return null;
    }
}



export async function checkUserV2(email: string): Promise<boolean> {
    try {
        // Znalezienie użytkownika w bazie
        const user = await User.findOne({ email });
        if (user) {
            // Opcjonalnie: porównanie hasła (np. jeśli hasła są haszowane)
            console.log("User found:", user);
            return true;
        } else {
            console.log("User not found");
            return false;
        }
    } catch (error) {
        console.error("Error checking user:", error);
        return false;
    }

    
}

export async function changePassword(email: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return false; // Użytkownik nie został znaleziony
        }

           //Pokaż dane użytkownika
           console.log("User found:", { username: user.username, email: user.email, role: user.role });

           
        // Check if the current password is correct
        const hashPass = /^\$2y\$/.test(user.password) ? '$2a$' + user.password.slice(4) : user.password;
        const isMatch = await bcryptjs.compare(oldPassword, hashPass);
        if (!isMatch) {
            console.log("Incorrect email or current password");
            return false; // Current password is incorrect
        }
         
   // Haszowanie nowego hasła
   const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

 
     // Aktualizacja hasła w bazie
     user.password = hashedNewPassword;

        // Zapisz zmiany
        await user.save();
        console.log("Password changed successfully");
        return true;
    } catch (error) {
        console.error("Error changing password:", error);
        return false;
    }
}

export async function deleteUser(email:string,username:string){
    try {

        // Find the client
        const user = await User.findOne({ email, username });

        if (!user) {
            return json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Delete the client
        await User.findByIdAndDelete(user._id);

        return json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.log('Error deleting client');
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}