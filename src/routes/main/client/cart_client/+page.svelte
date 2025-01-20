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
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: $cart }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Zamówienie zostało dodane!');
            clearCart();
        } else {
            alert(`Błąd: ${data.error}`);
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
        <ul class="cart-list">
            {#each $cart as item}
                <li class="cart-item">
                    <span>{item.name} - {item.quantity} szt.</span>
                    <button class="delete" on:click={() => removeFromCart(item.id)}>Usuń</button>
                </li>
            {/each}
        </ul>
        <div class="cart-actions">
            <button class="clear-cart" on:click={clearCart}>Wyczyść koszyk</button>
            <button class="place-order" on:click={placeOrder}>Dodaj zamówienie</button>
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
    padding: 1.5rem;
    background-color: #f8f9fa; /* Jasne tło pasujące do kart */
    max-width: 600px;
    margin: 2rem auto;
    text-align: center;
    border-radius: 12px; /* Zaokrąglone rogi */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtelny cień */
    border: 1px solid #e9ecef;
}

.cart h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #212529;
    margin-bottom: 1.5rem;
}

.empty-cart {
    font-size: 1.2rem;
    color: #6c757d; /* Neutralny szary kolor */
    margin-top: 1rem;
}

.cart-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin: 0.5rem 0;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Delikatny cień */
    border: 1px solid #e9ecef;
    font-size: 1rem;
    color: #212529;
}

.cart-item span {
    font-weight: 500;
}

.cart-item .delete {
    background-color: #007bff; /* Niebieski przycisk */
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 0.4rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
}

.cart-item .delete:hover {
    background-color: #0056b3; /* Ciemniejszy niebieski */
}

.cart-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    gap: 1rem;
}

.cart-actions .clear-cart {
    flex: 1;
    background-color: #dc3545; /* Czerwony przycisk */
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 0.8rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

.cart-actions .clear-cart:hover {
    background-color: #c82333; /* Ciemniejszy czerwony */
}

.cart-actions .place-order {
    flex: 1;
    background-color: #28a745; /* Zielony przycisk */
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 0.8rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

.cart-actions .place-order:hover {
    background-color: #218838; /* Ciemniejszy zielony */
}


</style>


    
    