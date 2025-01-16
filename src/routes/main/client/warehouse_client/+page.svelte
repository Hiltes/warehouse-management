<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IItem } from '$db/models/item';
    import { cart, addToCart, removeFromCart } from '$stores/cart';

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
    <button on:click={() => goto('/main/client/client_panel')}>Panel Główny</button>
    <button on:click={() => goto('/main/client/about_client')}>O kliencie</button>
    <button on:click={() => goto('/main/client/warehouse_client')}>Magazyn</button>
    <button on:click={() => goto('/main/client/cart_client')}>Koszyk</button>
    <button on:click={() => goto('/main/client/orders_client')}>Zamówienia</button>
    <button on:click={() => goto('/main/client/delete_client')}>Usunięcie konta</button>
    <button on:click={() => goto('/main/client/password_client')}>Zmiana hasła</button>
    <button on:click={logout}>Wyloguj</button>
</div>

<div class="content-container">
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

    <div class="warehouse">
        <h2>Magazyn - Dostępne przedmioty</h2>
        <div class="items">
            {#each items as item}
                <div class="item">
                    <h3>{item.item_name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Arrival Date: {new Date(item.arrival_date).toLocaleDateString()}</p>
                    <p>Added By: {item.added_by_name || 'Unknown'}</p>
				    <p>Warehouse Name: {item.warehouse_type || 'Unknown'}</p>
                    <button on:click={() => handleAddToCart(item)}>Dodaj do koszyka</button>
                </div>
            {/each}
        </div>
    </div>
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

    .cart {
        background-color: #fff;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 100%;
        margin: 2rem auto;
        transition: transform 0.3s ease;
    }

    .cart:hover {
        transform: scale(1.05);
    }

    .delete {
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
    }

    .delete:hover {
        background-color: red;
    }

    .content-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 100px;
    }

    .warehouse {
        padding: 2rem;
        background-color: #a9a9a9;
        max-width: 1200px;
        margin: auto;
        text-align: center;
    }

    .warehouse h2 {
        font-size: 2rem;
        color: #333;
        margin-bottom: 2rem;
    }

    .items {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
    }

    .item {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        background-color: #fff;
        width: 300px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    .item:hover {
        transform: scale(1.05);
    }

    .item h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        color: #007BFF;
    }

    .item p {
        font-size: 0.9rem;
        color: #555;
    }
</style>
