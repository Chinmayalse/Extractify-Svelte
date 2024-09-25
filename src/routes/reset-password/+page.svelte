<script lang="ts">
    let email = '';
    async function handleResetPassword() {
        const response = await fetch('/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            alert('Error resetting password');
        } else {
            alert('Password reset link sent to your email');
        }
    }
</script>

<div class="reset-password">
    <h1>Reset Password</h1>
    <form on:submit|preventDefault={handleResetPassword}>
        <label for="email">Enter your email:</label>
        <input type="email" id="email" bind:value={email} required />
        <button type="submit">Reset Password</button>
    </form>
</div>

<style>
    .reset-password {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
</style>


