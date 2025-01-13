import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY, TOKEN_EXPIRY_TIME } from '$env/static/private';
import { checkUser } from '$db/api/user'; // Upewnij się, że masz funkcję, która sprawdza użytkownika

export async function POST({ request }: { request: Request }) {
    try {
        const { email, password } = await request.json();

        // Sprawdzenie, czy użytkownik istnieje i czy hasło jest poprawne
        const user = await checkUser(email, password);

        if (user) {
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                SECRET_JWT_KEY,
                { expiresIn: TOKEN_EXPIRY_TIME }
            );

            const headers = new Headers();
            headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400`); // Ustawią cookie na 24 godziny

            return json({ success: true, message: 'Login successful' }, { headers });
        } else {
            return json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (err) {
        console.error('Error in login endpoint:', err);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET({ request }: { request: Request }) {
    const cookie = request.headers.get('cookie');
    const token = cookie?.match(/token=([^;]+)/)?.[1];

    if (!token) {
        return json({ success: false }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET_JWT_KEY);
        return json({ success: true, user: decoded }, { status: 200 });
    } catch (err) {
        console.error('JWT verification error:', err);
        return json({ success: false }, { status: 401 });
    }
}