<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IWarehouse } from '$db/models/warehouse';
    import { type IClient } from '$db/models/client';


    let isSidebarOpen = false;
    let warehouse: IWarehouse[] = [];
    let isLoggedIn: boolean | null = null;
    let clientData: IClient | null = null;

   
        
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

        async function checkLoginStatus() {
        try {
            const response = await fetch('/auth/login_client', { method: 'GET', credentials: 'same-origin' });
            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
                if (isLoggedIn) {
                    clientData = data.client; // Assuming your JWT returns user data directly
                    console.log(`User data fetched:`, clientData);
                }
            } else {
                isLoggedIn = false;
                goto('/auth/login_client');
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false;
        }
    }
    onMount(async () => {		
        await checkLoginStatus();
        await fetchWarehouse();
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


  

    
  // Funkcja do pobrania danych klienta
async function getClientById(userId: string) {
    try {
        console.log(`Fetching client by ID: ${userId}`);
        const response = await fetch(`/db/api/client?id=${userId}`); // Użyj nowego endpointu
        if (response.ok) {
            clientData = await response.json();
        } else {
            console.error('Error fetching client data', response.statusText);
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

                if (isLoggedIn && data.userId) { // Użyj userId z odpowiedzi
                    await getClientById(data.userId); // Pobierz dane klienta
                    console.log(`User ID fetched: ${data.userId}`);
                }
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
        <button on:click={() => goto('/main/client/cart_client')}>Koszyk</button>

        <button on:click={logout}>Wyloguj</button>
    </div>

    <h1>Dane Klienta</h1>
    {#if clientData}
        <p>Username:<br> {clientData.username}<br></p>
        <p>Email:<br> {clientData.email}<br></p>
        <p>Role:<br> {clientData.role}</p>
        {:else}
        <p>Nie znaleziono danych klienta.</p>
    {/if}
    {/if}