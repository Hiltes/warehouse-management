<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'; // API nawigacji

    let isLoggedIn: boolean | null = null; // Stan logowania (null = sprawdzanie)

    onMount(async () => {
        try {
            // Sprawdzenie, czy użytkownik jest zalogowany
            const response = await fetch('/auth/login', { method: 'GET' });

            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
                if (isLoggedIn) {
                
                    goto('/main/admin_panel');
                }
            } else {
                isLoggedIn = false; // Traktuj jako niezalogowanego
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false; // Traktuj jako niezalogowanego w przypadku błędu
        }
    });
</script>

<!-- Wyświetlanie treści w zależności od stanu logowania -->
{#if isLoggedIn === false}
    <div>
    <h1>Welcome to Warehouse Management</h1>
    <p>Please <a href="/auth/login">log in</a> to access the system.</p>
    </div>
{:else if isLoggedIn === null}
    <p>Checking authentication status...</p>
{/if}
