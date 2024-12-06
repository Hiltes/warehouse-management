import User from '$db/models/user'; // Zakładamy, że model User jest w pliku models/User

// Dodanie nowego użytkownika
export async function addUser(name: string, email: string, password: string) {
    const newUser = new User({
        name,
        email,
        password
    });

    try {
        await newUser.save(); // Zapisz nowego użytkownika w bazie
        console.log("User added successfully");
    } catch (error) {
        console.error("Error adding user:", error);
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
export async function checkUser(email: string, password: string): Promise<boolean> {
    try {
        const user = await User.findOne({ email, password });
        if (user) {
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
