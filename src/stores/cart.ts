import { writable } from "svelte/store";

export interface CartItem {
  id: string; // ID produktu
  name: string; // Nazwa produktu
  quantity: number; // Ilość w koszyku
}

export const cart = writable<CartItem[]>([]);

// Funkcja dodawania produktu do koszyka
export const addToCart = (item: { id: string; name: string; quantity: number }) => {
  cart.update((currentCart) => {
      const existingItem = currentCart.find((i) => i.id === item.id);
      if (existingItem) {
          existingItem.quantity += item.quantity;
      } else {
          currentCart.push(item);
      }
      return currentCart;
  });
};


// Funkcja usuwania produktu z koszyka
export const removeFromCart = (id: string) => {
  cart.update((currentCart) => currentCart.filter((item) => item.id !== id));
};

// Funkcja czyszczenia koszyka
export const clearCart = () => {
  cart.set([]);
};
