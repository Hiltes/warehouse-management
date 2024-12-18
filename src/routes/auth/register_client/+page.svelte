<script lang="ts">
	import { onMount } from "svelte";

	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';
	let message = '';
	let isLoggedIn = false;
	let acceptTerms = false;

	// Funkcja rejestracji
	async function handReg(event: Event) {
		event.preventDefault();

		if (!acceptTerms) {
			message = 'Musisz zaakceptować regulamin, aby się zarejestrować.';
			return;
		}

		try {
			const response = await fetch('/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName,
					lastName,
					email: email.toLowerCase(),
					password
				}),
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
			message = 'Wystąpił błąd. Proszę spróbować ponownie później.';
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
				firstName = data.user?.firstName || '';
			} else {
				isLoggedIn = false;
			}
		} catch (error) {
			console.error('Error checking login status:', error);
			isLoggedIn = false;
		}
	}

	// Sprawdzanie stanu zalogowania po zamontowaniu komponentu
	onMount(() => {
		checkLoginStatus();
	});
</script>

{#if isLoggedIn}
	<div>
		<h2>Witaj, {firstName}!</h2>
		<p>Jesteś już zarejestrowany. Kliknij <a href="/main/user_panel">tutaj</a>, aby przejść do panelu użytkownika.</p>
	</div>
{:else}
	<div>
		<form on:submit={handReg}>
			<label>
				Imię:
				<input type="text" bind:value={firstName} required />
			</label>
			<label>
				Nazwisko:
				<input type="text" bind:value={lastName} required />
			</label>
			<label>
				Email:
				<input type="email" bind:value={email} required />
			</label>
			<label>
				Hasło:
				<input type="password" bind:value={password} required />
			</label>
			<label>
				<input type="checkbox" bind:checked={acceptTerms} required />
				Zgadzam się na regulamin
			</label>
			<button type="submit">Zarejestruj się</button>
		</form>
		<p>{message}</p>
	</div>
{/if}