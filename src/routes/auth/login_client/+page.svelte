<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let email = '';
    let password = '';
    let message = '';
    let isLoggedIn = false;
    let username = '';
    let userRole= '';

    // Funkcja logowania
    async function handleLogin(event: Event) {
        event.preventDefault();

        try {
            const response = await fetch('/auth/login_client', {
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
                if(userRole==='client'){
                goto('/main/client_panel');
            } else {
                message = 'Invalid user role';
            }
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
            const response = await fetch('/auth/login_client', {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
                username = data.user?.email || ''; // Upewnij się, że user i username istnieją
                userRole = data.user?.role || ''; // Upewnij się, że rola użytkownika istnieje
            } else {
                isLoggedIn = false;
                username = ''; // Wyczyszczenie nazwy użytkownika, jeśli sesja wygasła
                userRole = ''; // Wyczyszczenie roli użytkownika
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false;
            username = ''; // Wyczyszczenie nazwy użytkownika w przypadku błędu
            userRole = ''; // Wyczyszczenie roli użytkownika
        }
    }

    // Sprawdzenie stanu logowania przy załadowaniu strony
    onMount(() => {
        checkLoginStatus();
    });
</script>

{#if isLoggedIn && userRole === 'client'}
    <div>
        <h2>Welcome, {username}!</h2>
        <p>{message}</p>
        <p>You are already logged in. Click <a href="/main/client_panel">redirect</a>.</p>
    </div>
{:else if isLoggedIn && userRole !== 'client'}
<div>
    <p>You are logged in as {username}, but you do not have permission to access the client panel.</p>
    <p>{message}</p>
</div>
{:else}
    <div>
        <form on:submit={handleLogin}>
            <label>
                Client Email:
                <input type="email" bind:value={email} required />
            </label>
            <label>
                Client Password:
                <input type="password" bind:value={password} required />
            </label>
            <button type="submit">Login</button>
            <a href='/auth/register_client'>Register</a>
            <a href='/auth/login'>Switch to admin panel</a>
        </form>

        <p>{message}</p>
    </div>
{/if}
