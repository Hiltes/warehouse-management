<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { IItem } from '$db/models/item';
	import type { IWarehouse } from '$db/models/warehouse'; // Zmień ścieżkę na właściwą

	let warehouse: IWarehouse[] = [];
	
	let isLoggedIn: boolean | null = null; 
	let items: IItem[] = [];
	let error = '';
	
   let selectedWarehouse = 'all';

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


	

	async function fetchWarehouse() {
            try{
                const res = await fetch('/main/admin/addItem');
            if (res.ok) {
                warehouse = await res.json() as IWarehouse[];
                console.log('Warehouse fetched:', warehouse); 
            } else {
                console.error('Error fetching warehouse' , res.statusText);

            }
            } catch (error) {
                console.error('Error:', error);
            }
   }

	async function fetchItems() {
		try {
			const query = selectedWarehouse === 'all' ? '' : `?warehouse=${selectedWarehouse}`;
			const response = await fetch(`/main/admin/warehouse${query}`);
			if (response.ok) {
				items = await response.json();
				console.log('Items fetched:', items); 
			} else {
				console.error('Failed to fetch items:', response.statusText);
			}
		} catch (err) {
			console.error('Error fetching items:', err);
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

        fetchWarehouse();
		  await fetchItems();
    });

	
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
        <button on:click={() => goto('/main/admin/admin_panel')}>Panel Główny</button>
        <button on:click={() => goto('/main/admin/warehouse')}>Magazyn</button>
        <button on:click={() => goto('/main/admin/addItem')}>Dodaj Produkt</button>
        <button on:click={() => goto('/main/admin/find_item')}>Wyszukaj Produkt</button>
        <button on:click={logout}>Wyloguj</button>
    </div>
	

	<div class="warehouse">
		<div>
			<label style="margin-top: 80px" for="warehouse">Wybierz magazyn:</label>
			<select id="warehouse" bind:value={selectedWarehouse} on:change={fetchItems}>
				 <option value="all">Wszystkie</option>
				 {#each warehouse as w}
			 <option value={w._id}>{w.warehouse_type}</option>
			{/each}
				</select>
		</div>
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
