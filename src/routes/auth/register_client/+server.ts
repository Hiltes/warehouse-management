import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '$env/static/private';
import { addClient } from '$db/api/client';
import bcrypt from 'bcrypt';
import { TOKEN_EXPIRY_TIME } from '$env/static/private';

export async function POST({ request }: { request: Request }) {
    try {
        // Ekstrahujemy dane z żądania
        const { username, email, password,role } = await request.json();

        const client_role = 'client';
        const validRoles = ['admin','client'];
        if (!validRoles.includes(role)) {
            return json({ success: false, error: 'Invalid role' }, { status: 400 });
        }
        // Weryfikacja poprawności danych może być dodana w przyszłości

        // Haszowanie hasła
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        // Dodanie użytkownika do bazy danych
        const clientAdded = await addClient(username, email, hashedPassword,client_role);

        if (clientAdded) {
            // Generowanie tokenu JWT
            const token = jwt.sign({ email,role }, SECRET_JWT_KEY, { expiresIn: TOKEN_EXPIRY_TIME });

            // Ustawienie ciasteczka z tokenem
            const headers = new Headers();
            headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

            // Zwracanie odpowiedzi
            return new Response(
                JSON.stringify({ success: true, message: 'Rejestracja zakończona sukcesem' }),
                { status: 200, headers }
            );
        } else {
            return json({ success: false, error: 'Nieudana rejestracja, spróbuj ponownie.' }, { status: 400 });
        }
    } catch (error) {
        console.error('Błąd w punkcie końcowym rejestracji:', error);
        return json({ success: false, error: 'Wewnętrzny błąd serwera' }, { status: 500 });
    }
}