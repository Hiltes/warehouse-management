<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let isLoggedIn: boolean | null = null;

    async function logout() {
        try {
            const response = await fetch('/main/user_panel', { method: 'POST', credentials: 'same-origin' });
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
    <div>
        <h1>Welcome to User Panel</h1>
        <button on:click={() => goto('/main/magazyn')}>Przejdź do Magazynu</button>
        <button on:click={logout}>Logout</button>
    </div>
{:else if isLoggedIn === null}
    <p>Checking authentication status...</p>
{:else}
    <p>You are not logged in. Redirecting...</p>
{/if}
