<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { cart, removeFromCart, clearCart } from '$stores/cart';

    // Zmienna dla zamówień
    let orders: { _id: string; items: any[]; total: number; createdAt: string }[] = [];
    let loading: boolean = true;
    let error: string | null = null;

    let isLoggedIn: boolean | null = null;
    let isSidebarOpen = false;

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

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

    async function fetchOrders() {
    try {
        const response = await fetch('/api/orders', { credentials: 'same-origin' });
        const data = await response.json();

        if (data.success) {
            orders = data.orders;
        } else {
            throw new Error(data.message || 'Nie udało się pobrać zamówień.');
        }
    } catch (err) {
        if (err instanceof Error) {
            error = err.message;
        } else {
            error = 'Wystąpił nieoczekiwany błąd.';
        }
    } finally {
        loading = false;
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

        fetchOrders();
    });
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
    <button on:click={() => goto('/main/client/delete_client')}>Usunięcie konta</button>
    <button on:click={() => goto('/main/client/password_client')}>Zmiana hasła</button>
    <button on:click={logout}>Wyloguj</button>
</div>

    <!-- Główna sekcja -->
    <div class="content">
        {#if loading}
            <p>Ładowanie zamówień...</p>
        {:else if error}
            <p class="error">{error}</p>
        {:else if orders.length === 0}
            <p>Nie znaleziono żadnych zamówień.</p>
        {:else}
            <div class="orders">
                <h2>Twoje zamówienia</h2>
                <ul>
                    {#each orders as order}
                        <li class="order">
                            <h3>Zamówienie ID: {order._id}</h3>
                            <p><strong>Data utworzenia:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Łączna ilość produktów:</strong> {order.total}</p>
                            <ul class="items">
                                {#each order.items as item}
                                    <li>{item.name} - Ilość: {item.quantity}</li>
                                {/each}
                            </ul>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>

{:else if isLoggedIn === null}
<p>Sprawdzanie statusu uwierzytelniania...</p>
{:else}
<p>Nie jesteś zalogowany. Przekierowywanie...</p>
{/if}

<style>
    

    .orders {
        margin: 150px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .orders h2 {
        margin-bottom: 15px;
        color: #333;
    }

    .order {
        margin-bottom: 20px;
        padding: 15px;
        border-bottom: 1px solid #ddd;
    }

    .order:last-child {
        border-bottom: none;
    }

    .items {
        margin-top: 20px;
        padding-left: 20px;
        list-style-type: disc;
    }

    .error {
        color: red;
        font-weight: bold;
    }
</style>
