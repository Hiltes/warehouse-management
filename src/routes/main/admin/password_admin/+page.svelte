<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IWarehouse } from '$db/models/warehouse';


    // Password change variables
    let email = '';
    let oldPassword = '';
    let newPassword = '';
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
    async function handleChangePassword(event: Event) {
        event.preventDefault();
        try {
            const response = await fetch('/auth/password_admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, oldPassword, newPassword }),
                credentials: 'same-origin'
            });

            const data = await response.json();
            message = data.success ? 'Password changed successfully!' : data.error;
        } catch (error) {
            console.error('Error during password change:', error);
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
        <button on:click={() => goto('/main/admin/orders')}>Wyszukaj Zamówienie</button>
        <button on:click={() => goto('/main/admin/delete_admin')}>Usunięcie konta</button>
		<button on:click={() => goto('/main/admin/password_admin')}>Zmiana hasła</button>
        <button on:click={logout}>Wyloguj</button>
    </div>
    <form on:submit={handleChangePassword}>
        <label>
            Email:
            <input type="email" bind:value={email} required />
        </label>
        <label>
            Stare hasło:
            <input type="password" bind:value={oldPassword} required />
        </label>
        <label>
            Nowe hasło:
            <input type="password" bind:value={newPassword} required />
        </label>
        <button type="submit" class="default" style="margin-top: 30px;">Zmień</button>
    </form>
    {#if message}
        <p>{message}</p>
    {/if}
{:else if isLoggedIn === null}
    <p>Checking authentication status...</p>
{:else}
    <p>You are not logged in. Redirecting...</p>
{/if}