<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { cart, removeFromCart, clearCart } from '$stores/cart';

    let isLoggedIn: boolean | null = null;

    async function logout() {
        try {
            const response = await fetch('/main/client/client_panel', {
                method: 'POST',
                credentials: 'same-origin'
            });
            const data = await response.json();

            if (data.success) {
                goto('/auth/login_client');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    onMount(async () => {
        try {
            const response = await fetch('/auth/login_client', { method: 'GET', credentials: 'same-origin' });

            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
                console.log('User is logged in:', isLoggedIn);
            } else {
                isLoggedIn = false;
                console.log('User is not logged in, redirecting...');
                goto('/auth/login_client');
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false;
        }
    });

    let isSidebarOpen = false;
    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    // Funkcja do tworzenia zamówienia
    async function placeOrder() {
        try {
            const response = await fetch('/main/client/cart_client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: $cart
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Zamówienie zostało dodane!');
                clearCart(); // Opcjonalnie wyczyszczenie koszyka
            } else {
                alert('Wystąpił błąd podczas dodawania zamówienia.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Wystąpił błąd podczas dodawania zamówienia.');
        }
    }
</script>

{#if isLoggedIn === true}
<div class="header {isSidebarOpen ? 'open' : ''}">
    <button on:click={toggleSidebar}>
        {isSidebarOpen ? 'Zamknij' : 'Otwórz'} menu
    </button>
</div>

<div id="mySidenav" class="sidenav {isSidebarOpen ? 'open' : ''}">
    <button on:click={() => goto('/main/client/client_panel')}>Panel Główny</button>
    <button on:click={() => goto('/main/client/about_client')}>O kliencie</button>
    <button on:click={() => goto('/main/client/warehouse_client')}>Magazyn</button>
    <button on:click={() => goto('/main/client/cart_client')}>Koszyk</button>
    <button on:click={() => goto('/main/client/orders_client')}>Zamówienia</button>
    <button on:click={() => goto('/main/client/delete_client')}>Usunięcie konta</button>
    <button on:click={() => goto('/main/client/password_client')}>Zmiana hasła</button>
    <button on:click={logout}>Wyloguj</button>
</div>

<div class="cart">
    <h2>Twój koszyk</h2>

    {#if $cart.length === 0}
    <p class="empty-cart">Koszyk jest pusty.</p>
    {:else}
    <div class="cart-items">
        {#each $cart as item}
        <div class="cart-item">
            <h3>{item.name}</h3>
            <p>Ilość: {item.quantity}</p>
            <button on:click={() => removeFromCart(item.id)}>Usuń</button>
        </div>
        {/each}
    </div>
    <div class="cart-summary">
        <h3>Podsumowanie</h3>
        <button on:click={clearCart}>Wyczyść koszyk</button>
        <button on:click={placeOrder}>Dodaj zamówienie</button>
    </div>
    {/if}
</div>
{:else if isLoggedIn === null}
<p>Sprawdzanie statusu uwierzytelniania...</p>
{:else}
<p>Nie jesteś zalogowany. Przekierowywanie...</p>
{/if}

  
  <style>
    /* Koszyk */
    .cart {
        padding: 2rem;
        background-color: #a9a9a9;
        max-width: 1200px;
        margin: auto;
        text-align: center;
    }
    
    .cart h2 {
        font-size: 2rem;
        color: #333;
        margin-bottom: 2rem;
    }
    
    .empty-cart {
        font-size: 1.5rem;
        color: #555;
        margin-top: 2rem;
    }
    
    .cart-items {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
    }
    
    .cart-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        background-color: #fff;
        width: 300px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        position: relative;
    }
    
    .cart-item:hover {
        transform: scale(1.05);
    }
    
    .cart-item h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        color: #007BFF;
    }
    
    .cart-item p {
        font-size: 0.9rem;
        color: #555;
    }
    
    .cart-item button {
        padding: 0.5rem 1rem;
        background-color: #FF4136; /* Czerwony przycisk dla usuwania */
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
    }
    
    .cart-item button:hover {
        background-color: #C0392B;
    }
    
    /* Podsumowanie */
    .cart-summary {
        background-color: #fff;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 2rem;
        text-align: center;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
        transition: transform 0.3s ease;
        
        
    }
    
    .cart-summary h3 {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 1rem;
    }
    
    .cart-summary button {
        padding: 0.8rem 2rem;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 1rem;
    }
    
    .cart-summary button:hover {
        background-color: #0056b3;
    }
    .cart-summary:hover{
        transform: scale(1.05);
    }
    </style>