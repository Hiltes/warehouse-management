<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IWarehouse } from '$db/models/warehouse';


    let itemName = '';
    let quantity = 0;
    let arrivalDate = '';
    let warehouseId = '';
    let warehouse: IWarehouse[] = [];
    let isLoggedIn: boolean | null = null;


    async function addItem() {
            const response = await fetch('/main/admin/addItem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    item_name: itemName,
                    quantity,
                    arrival_date: arrivalDate,
                    warehouse_id: warehouseId
                })
            });

            if (response.ok) {
                alert('Item added successfully!');
            } else {
                alert('Error adding item');
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

        fetchWarehouse();
    });


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
        <button on:click={() => goto('/main/client/opinions_client')}>Opinie</button>
        <button on:click={() => goto('/main/client/orders_client')}>Zamówienia</button>
        <button on:click={logout}>Wyloguj</button>
    </div>

    <form on:submit|preventDefault={addItem}>
        <h1>Dodaj Produkt do Magazynu</h1>
        <label for="name">Nazwa Przedmiotu:</label>
        <input id="name" bind:value={itemName} type="text" required />
     
        <label for="quantity">Ilość:</label>
        <input id="quantity" bind:value={quantity} type="number" required />
     
        <label for="date">Data Przyjęcia:</label>
        <input id="date" bind:value={arrivalDate} type="date" required />
     
        <label for="warehouse">Magazyn:</label>
        <select id="warehouse" bind:value={warehouseId} required>
            <option value=""  selected>Wybierz magazyn</option>
            {#each warehouse as w}
                <option value={w._id}>{w.warehouse_type}</option>
            {/each}
        </select>
     
        <button type="submit" class="default" style="margin-top: 30px;">Dodaj Przedmiot</button>
     
     </form>
{:else if isLoggedIn === null}
	<p>Checking authentication status...</p>
{:else}
	<p>You are not logged in. Redirecting...</p>
{/if}
