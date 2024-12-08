<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let email = '';
    let password = '';
    let message = '';
    let isLoggedIn = false;
    let userEmail = '';

    // Funkcja logowania
    async function handleLogin(event: Event) {
        event.preventDefault();

        try {
            const response = await fetch('/api/auth', {
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
                goto('/main/user_panel');
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
            const response = await fetch('/api/auth', {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                isLoggedIn = data.success;
                userEmail = data.user?.email || '';
            } else {
                isLoggedIn = false;
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false;
        }
    }

    // Sprawdzenie stanu logowania przy załadowaniu strony
    onMount(() => {
        checkLoginStatus();
    });
</script>

{#if isLoggedIn}
    <h2>Welcome, {userEmail}!</h2>
    <p>{message}</p>
    <p>You are already logged in. Redirecting to your dashboard...</p>
{:else}
    <form on:submit={handleLogin}>
        <label>
            Email:
            <input type="email" bind:value={email} required />
        </label>
        <label>
            Password:
            <input type="password" bind:value={password} required />
        </label>
        <button type="submit">Login</button>
    </form>
    <p>{message}</p>
{/if}
