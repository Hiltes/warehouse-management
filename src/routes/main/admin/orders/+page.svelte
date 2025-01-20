<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    type Order = {
        _id: string;
        items: any[];
        total: number;
        createdAt: string;
    };

    let isLoggedIn: boolean | null = null;
    let orders: Order[] = [];
    let filteredOrders: Order[] = [];
    let searchQuery = '';
    let loading: boolean = true;
    let error: string | null = null;
    let isSidebarOpen = false;

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    async function logout() {
        try {
            const response = await fetch('/main/admin/admin_panel', {
                method: 'POST',
                credentials: 'same-origin'
            });
            const data = await response.json();

            if (data.success) {
                goto('/auth/login');
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
                filteredOrders = [...orders];
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

    function handleSearch() {
        if (searchQuery.trim() === '') {
            filteredOrders = [...orders];
        } else {
            const query = searchQuery.toLowerCase();
            filteredOrders = orders.filter(order =>
                order._id.toLowerCase().includes(query)
            );
        }
    }

    function formatDate(date: string) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return 'Nieprawidłowa data';
        }
        return parsedDate.toLocaleString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    onMount(async () => {
        try {
            const response = await fetch('/auth/login', { method: 'GET', credentials: 'same-origin' });

            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
            } else {
                isLoggedIn = false;
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
    <button on:click={() => goto('/main/admin/admin_panel')}>Panel Główny</button>
    <button on:click={() => goto('/main/admin/about_admin')}>O użytkowniku</button>
    <button on:click={() => goto('/main/admin/warehouse')}>Magazyn</button>
    <button on:click={() => goto('/main/admin/addItem')}>Dodaj Produkt</button>
    <button on:click={() => goto('/main/admin/find_item')}>Wyszukaj Produkt</button>
    <button on:click={() => goto('/main/admin/orders')}>Wyszukaj Zamówienie</button>
    <button on:click={() => goto('/main/admin/delete_admin')}>Usunięcie konta</button>
    <button on:click={() => goto('/main/admin/password_admin')}>Zmiana hasła</button>
    <button on:click={logout}>Wyloguj</button>
</div>

<div class="main">
    <div class="search-bar">
        <label for="search">Wyszukaj zamówienie (ID):</label>
        <input
            type="text"
            id="search"
            placeholder="Wprowadź ID zamówienia..."
            bind:value={searchQuery}
            on:input={handleSearch}
        />
    </div>

    {#if loading}
        <p>Ładowanie zamówień...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if filteredOrders.length === 0}
        <p>Nie znaleziono żadnych zamówień.</p>
    {:else}
        <div class="orders">
            
            <ul>
                {#each filteredOrders as order}
                    <li class="order">
                        <h3>Zamówienie ID: {order._id}</h3>
                        <p><strong>Data utworzenia:</strong> {formatDate(order.createdAt)}</p>
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
<p>Brak dostępu. Zaloguj się, aby kontynuować.</p>
{/if}

<style>
    .orders {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
        background-color: #f0f0f0;
    }

    .order {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
    }

    .order:hover {
        transform: translateY(-5px);
    }

    .order h3 {
        text-align: center;
        font-size: 20px;
        color: #007bff;
        margin-bottom: 10px;
    }

    .order p {
        margin: 5px 0;
    }

    .items {
        list-style-type: none;
        padding: 0;
    }

    .items li {
        margin-bottom: 5px;
    }

    .error {
        color: red;
        text-align: center;
        margin-top: 20px;
    }
</style>

