<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IWarehouse } from '$db/models/warehouse';


    let email = '';
    let username = '';
    let message = '';
    let isLoggedIn: boolean | null = null; // Initialize as null
    let isSidebarOpen = false;
    let loading = true; // Used for loading state
    let warehouse: IWarehouse[] = []; // Declare warehouse variable

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
    // Check if the user is logged in
    async function checkLoginStatus() {
        try {
            const response = await fetch('/auth/login', {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
                username = data.user?.username || ''; // Upewnij się, że user i username istnieją
                email = data.user?.email || ''; // Upewnij się, że rola użytkownika istnieje
            } else {
                isLoggedIn = false;
                username = ''; // Wyczyszczenie nazwy użytkownika, jeśli sesja wygasła
                email = ''; // Wyczyszczenie roli użytkownika
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false;
            username = ''; // Wyczyszczenie nazwy użytkownika w przypadku błędu
            email = ''; // Wyczyszczenie roli użytkownika
        }
    }

    // Function to handle account deletion
    async function handleDelete(event: Event) {
        event.preventDefault();

        try {
            const response = await fetch('/auth/delete_admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username} ),
                credentials: 'same-origin'
            });

            const data = await response.json();
            if (data.success) {
                message = 'Your account has been deleted successfully.';
                // Optionally redirect the user or log them out
            } else {
                message = data.error || 'Failed to delete your account.';
            }
        } catch (error) {
            console.error('Error during account deletion:', error);
            message = 'An error occurred. Please try again later.';
        }
    }

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
        <form on:submit={handleDelete}>
            <label>
                Email:
                <input type="email" bind:value={email} required />
            </label>
            <label>
                Nazwa użytkownika:
                <input type="text" bind:value={username} required />
            </label>
            <button type="submit" class="default" style="margin-top: 30px;">Usuń konto</button>
        </form>
        {#if message}
        <p>{message}</p>
    {/if}
    {:else if isLoggedIn === null}
    <p>Checking authentication status...</p>
{:else}
    <p>You are not logged in. Redirecting...</p>
{/if}
