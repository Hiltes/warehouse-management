import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '$env/static/private';
import { checkUser } from '$db/api/user';

export async function POST({ request }: { request: Request }) {
    try {
        const { email, password } = await request.json();

        // Weryfikacja użytkownika (przyjmujemy, że masz funkcję checkUser)
        const userExists = await checkUser(email, password);

        if (userExists) {
            const token = jwt.sign({ email }, SECRET_JWT_KEY, { expiresIn: '1h' });

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

export async function GET({ request }: { request: Request }) {
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
