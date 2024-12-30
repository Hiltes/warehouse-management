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
                body: JSON.stringify({username, email: email.toLowerCase(), password }),
                credentials: 'same-origin'
            });

            const data = await response.json();
            if (data.success) {
                message = 'Utworzono konto, możesz się zalogować!';
                isLoggedIn = true;
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

</script>

{#if isLoggedIn}
    <div>
    <h2>Hi, {username}!</h2>
    <p>You are already registered in. Click <a href="/main/user_panel">redirect</a>.</p>
    </div>
{:else}
    <div>
    <form on:submit={handReg}>
        <label>
            Admin Username:
            <input type="username" bind:value={username} required />
        </label>
        <label>
            Admin Email:
            <input type="email" bind:value={email} required />
        </label>
        <label>
            Admin Password:
            <input type="password" bind:value={password} required />
        </label>
        <button type="submit">Register</button>
    </form>
    <p>{message}</p>
    </div>
{/if}
