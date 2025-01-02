import User from '$db/models/user'; // Zakładamy, że model User jest w pliku models/User
import type { IUser } from '$db/models/user';
import bcrypt from 'bcrypt';

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
        
        const hashedPassword = await bcrypt.hash(password, 10); // Haszowanie hasła
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        
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

// Usunięcie użytkownika po ID
export async function deleteUserById(userId: string) {
    try {
        await User.findByIdAndDelete(userId); // Usuwanie użytkownika po ID
        console.log("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

// Sprawdzenie, czy użytkownik istnieje
export async function checkUser(email: string, password: string): Promise<IUser | null> {
    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log("User found:", user);
            return user; // Zwracaj obiekt użytkownika
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
         

        // Sprawdzenie starego hasła
        const isMatch = await bcrypt.compare(oldPassword.trim(), user.password);
        console.log("Comparing:", oldPassword.trim(), user.password, "Match:", isMatch);
        if (!isMatch) {
            console.log("Old password is incorrect");
            return false; // Stare hasło jest niepoprawne
        }


        // Haszowanie nowego hasła
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
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