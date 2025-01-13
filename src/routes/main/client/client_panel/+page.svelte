<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isLoggedIn: boolean | null = null;

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
				console.log('User is logged in:', isLoggedIn);
			} else {
				isLoggedIn = false;
				console.log('User is not logged in, redirecting...');
				goto('/auth/login_client');
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
		<button on:click={() => goto('/main/client/warehouse_client')}>Magazyn</button>
        <button on:click={() => goto('/main/client/about_client')}>O kliencie</button>
        <button on:click={() => goto('/main/client/orders_client')}>Zamówienia</button>
		<button on:click={() => goto('/main/client/delete_client')}>Usunięcie konta</button>
		<button on:click={() => goto('/main/client/password_client')}>Zmiana hasła</button>
        <button on:click={logout}>Wyloguj</button>
    </div>

    <div class="centered">
	<h2>Witaj w Panelu użytkownia </h2>
	<p>Tutaj będą wyświetlały się dane o koncie</p>
    </div>
{:else if isLoggedIn === null}
	<p>Checking authentication status...</p>
{:else}
	<p>You are not logged in. Redirecting...</p>
{/if}
