<script lang="ts">
	import { onMount } from "svelte";



    let username = '';
    let email = '';
    let password = '';
    let message = '';
    let isLoggedIn = false;

    // Funkcja logowania
    async function handReg(event: Event) {
        event.preventDefault();

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, email, password }),
                credentials: 'same-origin'
            });

            const data = await response.json();
            if (data.success) {
                message = 'Utworzono konto, możesz się zalogować!';
            } else {
                message = 'Nie udało się utworzyć konta, konto z tymi danymi już istnieje!';
            }
        } catch (error) {
            console.error('Error during register:', error);
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
                username = data.user?.username || '';
            } else {
                isLoggedIn = false;
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            isLoggedIn = false;
        }
    }

    onMount(() => {
        checkLoginStatus();
    });

</script>

{#if isLoggedIn}
    <div>
    <h2>Welcome, {username}!</h2>
    <p>{message}</p>
    <p>You are already logged in. Click <a href="/main/user_panel">redirect</a>.</p>
    </div>
{:else}
    <form on:submit={handReg}>
        <label>
            Username:
            <input type="username" bind:value={username} required />
        </label>
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
