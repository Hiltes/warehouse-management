<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isLoggedIn: boolean | null = null;

	async function logout() {
		try {
			const response = await fetch('/main/admin_panel', {
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
	});


</script>

{#if isLoggedIn === true}
	<div id="mySidenav" class="sidenav">
		<button on:click={() => goto('/main/warehouse')}>Magazyn</button>
		<button on:click={() => goto('/main/addItem')}>Dodaj Produkt</button>
		<button on:click={logout}>Wyloguj</button>
	</div>

    ****************************************************************

    TUTAJ DODAJESZ TO CO CHCESZ
    dzięki temu będzię autoryzowany użytkownik za każdą aktualizacją strony
    będzie też dodany sidebar

    ****************************************************************

{:else if isLoggedIn === null}
	<p>Checking authentication status...</p>
{:else}
	<p>You are not logged in. Redirecting...</p>
{/if}
