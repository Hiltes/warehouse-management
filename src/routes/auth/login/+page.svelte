<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let email = '';
    let password = '';
    let message = '';
    let isLoggedIn = false;
    let username = '';

    // Funkcja logowania
    async function handleLogin(event: Event) {
        event.preventDefault();

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'same-origin'
            });

            const data = await response.json();
            if (data.success) {
                message = 'Login successful!';
                await checkLoginStatus();

                // Przekierowanie do user panelu po zalogowaniu
                goto('/main/admin_panel');
            } else {
                message = 'Invalid credentials.';
            }
        } catch (error) {
            console.error('Error during login:', error);
            message = 'An error occurred. Please try again later.';
        }
    }

    // Funkcja sprawdzająca stan zalogowania
    async function checkLoginStatus() {
        try {
            const response = await fetch('/auth/login', {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
                username = data.user?.email || ''; // Upewnij się, że user i username istnieją
            } else {
                isLoggedIn = false;
                username = ''; // Wyczyszczenie nazwy użytkownika, jeśli sesja wygasła
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false;
            username = ''; // Wyczyszczenie nazwy użytkownika w przypadku błędu
        }
    }

    // Sprawdzenie stanu logowania przy załadowaniu strony
    onMount(() => {
        checkLoginStatus();
    });
</script>

{#if isLoggedIn}
    <div>
        <h2>Welcome, {username}!</h2>
        <p>{message}</p>
        <p>You are already logged in. Click <a href="/main/admin_panel">redirect</a>.</p>
    </div>
{:else}
    <div>
        <form on:submit={handleLogin}>
            <label>
                Admin Email:
                <input type="email" bind:value={email} required />
            </label>
            <label>
               Admin Password:
                <input type="password" bind:value={password} required />
            </label>
            <button type="submit">Login</button>
            <a href='/auth/register'>Register</a>
            <a href='/auth/login_client'>Switch to client panel</a>
        </form>

        <p>{message}</p>
    </div>
{/if}
