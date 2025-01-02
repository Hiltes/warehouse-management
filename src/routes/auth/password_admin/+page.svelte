<script lang="ts">
    let email = '';
    let oldPassword = '';
    let newPassword = '';
    let message = '';

    async function handleChangePassword(event: Event) {
        event.preventDefault();
        try {
            const response = await fetch('/auth/password_admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, oldPassword, newPassword }),
                credentials: 'same-origin'
            });

            const data = await response.json();
            message = data.success ? 'Password changed successfully!' : data.error;
        } catch (error) {
            console.error('Error during password change:', error);
            message = 'An error occurred. Please try again later.';
        }
    }
</script>
<div>
    <h2>Change Password</h2>
    <form on:submit={handleChangePassword}>
        <label>
            Email:
            <input type="email" bind:value={email} required />
        </label>
        <label>
            Old Password:
            <input type="password" bind:value={oldPassword} required />
        </label>
        <label>
            New Password:
            <input type="password" bind:value={newPassword} required />
        </label>
        <button type="submit">Change</button>
    </div>