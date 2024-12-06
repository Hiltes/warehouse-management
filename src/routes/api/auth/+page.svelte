<script lang="ts">
    import { onMount } from 'svelte';

    let email = '';
    let password = '';
    let message = '';

    async function handleLogin(event: Event) {
        event.preventDefault();

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.success) {
                console.log('User authenticated successfully');
                message = 'Login successful!';
            } else {
                console.log('Authentication failed');
                message = 'Invalid credentials.';
            }
        } catch (error) {
            console.error('Error during login:', error);
            message = 'An error occurred. Please try again later.';
        }
    }
</script>

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
