<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IItem } from '$db/models/item';
    import { cart, addToCart, removeFromCart } from '$stores/cart'; // Importujemy logikę koszyka

    let isLoggedIn: boolean | null = null;
    let items: IItem[] = [];
    let error = '';

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
            } else {
                isLoggedIn = false;
                goto('/auth/login_client');
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false;
        }

        fetchItems();
    });

    async function fetchItems() {
        try {
            const res = await fetch('/main/admin/warehouse', {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (res.ok) {
                items = await res.json();
            } else if (res.status === 401) {
                error = 'Unauthorized. Redirecting to login page.';
                setTimeout(() => goto('/api/auth'), 3000);
            } else {
                error = 'Failed to fetch items.';
            }
        } catch (err) {
            console.error(err);
            error = 'Error fetching items.';
        }
    }

    let isSidebarOpen = false;
    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    const handleAddToCart = (item: IItem) => {
        const index = items.findIndex((i) => i._id === item._id);

        if (index !== -1 && items[index].quantity > 0) {
            items[index].quantity--; // Zmniejszamy ilość w magazynie
            addToCart({
                id: item._id.toString(),
                name: item.item_name,
                quantity: 1
            });
            alert(`Dodano ${item.item_name} do koszyka!`);
        } else {
            alert('Brak dostępnych sztuk w magazynie!');
        }
    };

    const handleRemoveFromCart = (itemId: string) => {
        const cartItem = $cart.find((c) => c.id === itemId);

        if (cartItem) {
            const index = items.findIndex((i) => i._id.toString() === itemId);

            if (index !== -1) {
                items[index].quantity += cartItem.quantity; // Zwiększamy ilość w magazynie
            }

            removeFromCart(itemId); // Usuwamy z koszyka
            alert(`Usunięto ${cartItem.name} z koszyka!`);
        }
    };

    function navigateToCart() {
        goto('/main/client/cart_client');
    }
</script>

{#if isLoggedIn === true}
<div class="header {isSidebarOpen ? 'open' : ''}">
    <button on:click={toggleSidebar}>
        {isSidebarOpen ? 'Zamknij' : 'Otwórz'} menu
    </button>
</div>

<div id="mySidenav" class="sidenav {isSidebarOpen ? 'open' : ''}">
    <button on:click={() => goto('/main/client/warehouse_client')}>Magazyn</button>
    <button on:click={() => goto('/main/client/about_client')}>O kliencie</button>
    <button on:click={() => goto('/main/client/opinions_client')}>Opinie</button>
    <button on:click={() => goto('/main/client/orders_client')}>Zamówienia</button>
    <button on:click={() => goto('/main/client/cart_client')}>Koszyk</button>
    <button on:click={logout}>Wyloguj</button>
</div>

<div class="warehouse">
    <h2>Magazyn - Dostępne przedmioty</h2>
    <div class="items">
        {#each items as item}
            <div class="item">
                <h3>{item.item_name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Arrival Date: {item.arrival_date}</p>
                <p>Added By: {item.added_by}</p>
                <p>Warehouse ID: {item.warehouse_id}</p>
                <button on:click={() => handleAddToCart(item)}>Dodaj do koszyka</button>
            </div>
        {/each}
    </div>
</div>

<div class="cart">
    <h2>Twój koszyk</h2>
    {#if $cart.length === 0}
        <p>Koszyk jest pusty.</p>
    {:else}
        <ul>
            {#each $cart as item}
                <li>
                    {item.name} - {item.quantity} szt.
                    <button class="delete" on:click={() => handleRemoveFromCart(item.id)}>Usuń</button>
                </li>
            {/each}
        </ul>
        <button class="go-to-cart" on:click={navigateToCart}>Przejdź do koszyka</button>
    {/if}
</div>
{:else if isLoggedIn === null}
<p>Checking authentication status...</p>
{:else}
<p>
    A problem occurred! The warehouse is empty, or you are not logged in. If you aren't logged in,
    you will be redirected.
</p>
{/if}

<style>
    .go-to-cart {
        background-color: #007BFF;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 1rem;
    }

    .go-to-cart:hover {
        background-color: #0056b3;
    }
    .cart{ background-color: #fff;
     padding: 5rem;
      border-radius: 15px;
       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 2rem;
         text-align: center;
          max-width: 600px;
           margin-left: auto;
            margin-right: auto;
             transition: transform 0.3s ease;
              } 
    
    .cart:hover{
         transform: scale(1.05);
     } 
     .delete { 
        background-color: #007BFF; /* Czerwony przycisk dla usuwania */
         color: white;
          border: none; 
          border-radius: 4px; 
          font-size: 1rem;
           cursor: pointer; 
           }
           .delete:hover {
            background-color: red;
           }
</style>
