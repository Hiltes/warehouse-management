<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IItem } from '$db/models/item';


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
        <button on:click={() => goto('/main/client/orders_client')}>Zamówienia</button>
		<button on:click={() => goto('/main/client/delete_client')}>Usunięcie konta</button>
		<button on:click={() => goto('/main/client/password_client')}>Zmiana hasła</button>
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
				</div>
			{/each}
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
