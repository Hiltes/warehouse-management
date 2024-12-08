// Funkcja do wylogowania użytkownika
export async function POST() {
    const headers = new Headers();
    // Ustawiamy ciasteczko 'token' na pustą wartość, z Max-Age=0, co powoduje jego usunięcie
    headers.append('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');

    // Odpowiedź z sukcesem
    return new Response(JSON.stringify({ success: true, message: 'Logged out' }), { status: 200, headers });
}
