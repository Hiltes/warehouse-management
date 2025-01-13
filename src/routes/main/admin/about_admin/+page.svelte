<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IWarehouse } from '$db/models/warehouse';
    import type { IUser } from '$db/models/user';


    let isSidebarOpen = false;
    let warehouse: IWarehouse[] = [];
    let isLoggedIn: boolean | null = null;
    let userData: IUser;

   
        
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
            const response = await fetch('/auth/login', { method: 'GET', credentials: 'same-origin' });
            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
                if (isLoggedIn) {
                    userData = data.user; // Assuming your JWT returns user data directly
                    console.log(`User data fetched:`, userData);
                }
            } else {
                isLoggedIn = false;
                goto('/auth/login');
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


  

    
  // Funkcja do pobrania danych klienta
async function getUserById(userId: string) {
    try {
        console.log(`Fetching client by ID: ${userId}`);
        const response = await fetch(`/db/api/user?id=${userId}`); // Użyj nowego endpointu
        if (response.ok) {
            const user = await response.json();
            userData = user;
        } else {
            console.error('Error fetching client data', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

        onMount(async () => {
        try {
            const response = await fetch('/auth/login', { method: 'GET', credentials: 'same-origin' });
            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;

                if (isLoggedIn && data.userId) { // Użyj userId z odpowiedzi
                    await getUserById(data.userId); // Pobierz dane klienta
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
        <button on:click={() => goto('/main/admin/admin_panel')}>Panel Główny</button>
        <button on:click={() => goto('/main/admin/about_admin')}>O użytkowniku</button>
        <button on:click={() => goto('/main/admin/warehouse')}>Magazyn</button>
        <button on:click={() => goto('/main/admin/addItem')}>Dodaj Produkt</button>
        <button on:click={() => goto('/main/admin/find_item')}>Wyszukaj Produkt</button>
        <button on:click={() => goto('/main/admin/delete_admin')}>Usunięcie konta</button>
		<button on:click={() => goto('/main/admin/password_admin')}>Zmiana hasła</button>
        <button on:click={logout}>Wyloguj</button>
    </div>

   
    {#if userData}
    <form on:submit={checkLoginStatus}>
        <div>
    <h1>Dane Klienta</h1>
        <p>Username: {userData.username}</p>
        <p>Email: {userData.email}</p>
        <p>Role: {userData.role}</p>
    </div>
    </form>
        {:else}
        <p>Nie znaleziono danych klienta.</p>
    {/if}
    {/if}