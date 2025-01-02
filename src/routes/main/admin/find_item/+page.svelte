<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IItem } from '$db/models/item';

    let isLoggedIn: boolean | null = null;
    let items: IItem[] = [];
    let displayedItems: IItem[] = []; // To hold the items to display based on search
    let error = '';
    let searchQuery = ''; // Holds the search query

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

    onMount(async () => {
        try {
            const response = await fetch('/auth/login', { method: 'GET', credentials: 'same-origin' });

            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
            } else {
                isLoggedIn = false;
                goto('/auth/login');
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false;
        }

        fetchItems(); // Fetch all items initially to have them available
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
                displayedItems = items; // Initially display all items
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

    // Function to search items based on the search query
    function searchItems() {
        if (searchQuery.trim() === '') {
            displayedItems = items; // Show all items if the search query is empty
        } else {
            displayedItems = items.filter(item => 
                item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) // Search by item name
            );
        }
    }
</script>

{#if error}
    <p class="error">{error}</p>
{:else if isLoggedIn === true}
    <div id="mySidenav" class="sidenav">
        <button on:click={() => goto('/main/admin/admin_panel')}>Panel Główny</button>
        <button on:click={() => goto('/main/admin/warehouse')}>Magazyn</button>
        <button on:click={() => goto('/main/admin/addItem')}>Dodaj Produkt</button>
        <button on:click={() => goto('/main/admin/find_item')}>Wyszukaj Produkt</button>
        <button on:click={logout}>Wyloguj</button>
    </div>
    <div class="main">
        <!-- Search Form -->
        <div class="search-form" >
            <h2>Nazwa Przedmiotu:</h2>
            <input type="text" bind:value={searchQuery} placeholder="Wyszukaj produkt..." on:input={searchItems} />
            <button on:click={searchItems}>Szukaj</button>
        </div>

        <!-- Search Results -->
        {#if displayedItems.length > 0}
            <div class="items">
                {#each displayedItems as item}
                    <div class="item">
                        <h3>{item.item_name}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <p>Arrival Date: {item.arrival_date}</p>
                        <p>Added By: {item.added_by}</p>
                        <p>Warehouse ID: {item.warehouse_id}</p>
                    </div>
                {/each}
            </div>
        {:else}
            <p>Brak wyników wyszukiwania.</p>
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
