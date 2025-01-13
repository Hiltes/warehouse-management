<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    // Typ dla zamówienia
    type Order = {
        id: string;
        name: string;
        quantity: number;
    };

    let isLoggedIn: boolean | null = null; // Status zalogowania
    let orders: Order[] = []; // Lista zamówień
    let filteredOrders: Order[] = []; // Lista przefiltrowanych zamówień
    let searchQuery = ''; // Wpisany tekst w polu wyszukiwania
    let error = ''; // Informacja o błędach (jeśli wystąpią)
    let isSidebarOpen = false; // Status menu bocznego

    // Funkcja pobierająca zamówienia z bazy danych
    async function fetchOrders() {
        try {
            const response = await fetch('/main/admin/orders', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.orders)) {
                orders = data.orders.map((order: Partial<Order>) => ({
                    id: order.id || 'Brak ID',
                    name: order.name || 'Brak nazwy',
                    quantity: order.quantity || 0,
                }));
                filteredOrders = [...orders];
                error = '';
            } else {
                throw new Error(data.message || 'Nie udało się pobrać zamówień.');
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error('Błąd podczas pobierania zamówień:', err.message);
                error = err.message;
            } else {
                console.error('Nieznany błąd:', err);
                error = 'Nieznany błąd podczas pobierania zamówień.';
            }
        }
    }

    // Obsługa wyszukiwania
    function handleSearch() {
        if (searchQuery.trim() === '') {
            filteredOrders = [...orders]; // Pokaż wszystkie zamówienia, jeśli pole jest puste
        } else {
            const query = searchQuery.toLowerCase();

            // Filtrowanie zamówień na podstawie ID zamówienia
            filteredOrders = orders.filter(order =>
                order.id.toLowerCase().includes(query)
            );
        }
    }

    // Obsługa menu bocznego
    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    // Wylogowanie
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

    // Sprawdzenie, czy użytkownik jest zalogowany i pobranie zamówień
    onMount(async () => {
        try {
            const response = await fetch('/auth/login', { method: 'GET', credentials: 'same-origin' });
            const data = await response.json();

            if (data.success) {
                isLoggedIn = true;
                await fetchOrders(); // Pobierz zamówienia, jeśli użytkownik jest zalogowany
            } else {
                isLoggedIn = false;
            }
        } catch (error) {
            console.error('Error during authentication check:', error);
            isLoggedIn = false;
        }
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
    <!-- Pole wyszukiwania -->
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

    {#if filteredOrders.length > 0}
        <div class="orders">
            {#each filteredOrders as order}
                <div class="order">
                    <h3>{order.name}</h3>
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Ilość:</strong> {order.quantity}</p>
                </div>
            {/each}
        </div>
    {:else}
        <p>Brak zamówień pasujących do wyszukiwania.</p>
    {/if}

    {#if error}
        <p class="error">{error}</p>
    {/if}
</div>
{:else if isLoggedIn === null}
<p>Sprawdzanie autoryzacji...</p>
{:else}
<p>Brak dostępu. Zaloguj się, aby kontynuować.</p>
{/if}

<style>
    .search-bar {
        background-color: #fff;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 0 auto;
        margin-bottom: 2rem;
        text-align: center;
        align-items: center;
    }

    .search-bar input {
        width: calc(100% - 20px); /* Pełna szerokość z marginesem */
        padding: 0.6rem;
        margin-bottom: 1rem;
        border-radius: 4px;
        font-size: 1.2rem;
        box-sizing: border-box;
    }

    .orders {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    }

    .order {
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 15px;
        width: 250px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        text-align: center;
    }

    .order:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .order h3 {
        font-size: 18px;
        color: #007bff;
        margin-bottom: 10px;
    }

    .order p {
        font-size: 14px;
        color: #333;
        margin: 5px 0;
    }

    .order p strong {
        color: #555;
    }

    .error {
        color: red;
        font-weight: bold;
        text-align: center;
    }
</style>
