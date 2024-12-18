import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY, TOKEN_EXPIRY_TIME } from '$env/static/private';
import { checkUser } from '$db/api/user'; // Upewnij się, że ta funkcja sprawdza hasło z bcrypt
import bcrypt from 'bcrypt';

export async function POST({ request }) {
    try {
        const { email, password } = await request.json();

        // Sprawdzenie czy użytkownik istnieje
        const userExists = await checkUser(email); // Funkcja powinna tylko sprawdzić, czy użytkownik istnieje w bazie danych

        // Jeśli użytkownik istnieje, porównaj hasło
        if (userExists && await bcrypt.compare(password, userExists.passwordHash)) {
            const token = jwt.sign({ id: userExists._id, email: userExists.email }, SECRET_JWT_KEY, { expiresIn: TOKEN_EXPIRY_TIME });

            const headers = new Headers();
            headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

            return new Response(
                JSON.stringify({ success: true, message: 'Login successful' }),
                { status: 200, headers }
            );
        } else {
            return json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error('Error in login endpoint:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET({ request }) {
    const cookie = request.headers.get('cookie');
    const token = cookie?.match(/token=([^;]+)/)?.[1];

    if (!token) {
        return json({ success: false }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET_JWT_KEY);
        return json({ success: true, user: decoded }, { status: 200 });
    } catch {
        return json({ success: false }, { status: 401 });
    }
}