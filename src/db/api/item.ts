import Item from '$db/models/item';
import type { IItem } from '$db/models/item';

export async function FindItems(item_name: string): Promise<IItem[]> {
    try {
        // Używamy $regex, aby znaleźć przedmioty, których nazwa zawiera wpisany fragment
        const regex = new RegExp(item_name, 'i'); // 'i' oznacza ignorowanie wielkości liter
        const items = await Item.find({ item_name: { $regex: regex } });
        return items;
    } catch (error) {
        console.error("Error retrieving items:", error);
        return [];
    }
}


export async function GetItems() {
    try {
        const users = await Item.find(); // Pobierz wszystkie itemy
        console.log("Items:", users);
    } catch (error) {
        console.error("Error retrieving items:", error);
    }
}

