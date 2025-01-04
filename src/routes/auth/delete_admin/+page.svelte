<script lang="ts">
    import { onMount } from "svelte";

    let email = '';
    let username = '';
    let message = '';
    let isLoggedIn = false;

    // Check if the user is logged in
    async function checkLoginStatus() {
        // Same as your existing implementation
    }

    // Function to handle account deletion
    async function handleDelete(event: Event) {
        event.preventDefault();

        try {
            const response = await fetch('/auth/delete_admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username }),
                credentials: 'same-origin'
            });

            const data = await response.json();
            if (data.success) {
                message = 'Your account has been deleted successfully.';
                // Optionally redirect the user or log them out
            } else {
                message = data.error || 'Failed to delete your account.';
            }
        } catch (error) {
            console.error('Error during account deletion:', error);
            message = 'An error occurred. Please try again later.';
        }
    }

    // Check login status on component mount
    onMount(() => {
        checkLoginStatus();
    });
</script>

    <div>
        <h2>Delete Your Account</h2>
        <form on:submit={handleDelete}>
            <label>
                Email:
                <input type="email" bind:value={email} required />
            </label>
            <label>
                Username:
                <input type="text" bind:value={username} required />
            </label>
            <button type="submit">Delete Account</button>
        </form>
        <p>{message}</p>
    </div>
