<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let isLoggedIn: boolean | null = null;


    async function logout() {
        try {
            const response = await fetch('/main/admin/admin_panel', {
                method: 'POST',
                credentials: 'same-origin',
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
            const response = await fetch('/auth/login', { 
                method: 'GET', 
                credentials: 'same-origin' 
            });

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
    <button on:click={() => goto('/main/admin/about_admin')}>O użytkowniku</button>
    <button on:click={() => goto('/main/admin/warehouse')}>Magazyn</button>
    <button on:click={() => goto('/main/admin/addItem')}>Dodaj Produkt</button>
    <button on:click={() => goto('/main/admin/find_item')}>Wyszukaj Produkt</button>
    <button on:click={() => goto('/main/admin/orders')}>Wyszukaj Zamówienie</button>
    <button on:click={() => goto('/main/admin/delete_admin')}>Usunięcie konta</button>
    <button on:click={() => goto('/main/admin/password_admin')}>Zmiana hasła</button>
    <button on:click={logout}>Wyloguj</button>
</div>

    <div class="centered">
        <h2>Witaj w Panelu użytkownia!</h2>
        <p>Znajdujesz się na koncie administratora.</p>
    </div>
{:else if isLoggedIn === null}
    <p>Checking authentication status...</p>
{:else}
    <p>You are not logged in. Redirecting...</p>
{/if}
