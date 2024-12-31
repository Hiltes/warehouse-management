import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY, TOKEN_EXPIRY_TIME } from '$env/static/private';
import { checkUser } from '$db/api/user';
import bcrypt from 'bcrypt';

export async function POST({ request }: { request: Request }) {
    try {
        const { email, password } = await request.json();

        // Sprawdzenie czy użytkownik istnieje i porównanie hasła
        const userExists = await checkUser(email, password);
    

        if (userExists) {
            const token = jwt.sign({ id: userExists._id, email: userExists.email, role: userExists.role }, SECRET_JWT_KEY, { expiresIn: TOKEN_EXPIRY_TIME });

            const headers = new Headers();
            headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

            return new Response(
                JSON.stringify({ success: true, message: 'Login successful' }),
                { status: 200, headers }
            );
        } 
        else {
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
        if (decoded.role !== 'admin') {
            return json({ success: false, error: 'Unauthorized access' }, { status: 403 });
        }
        return json({ success: true, user: decoded }, { status: 200 });
    } catch {
        return json({ success: false }, { status: 401 });
    }
}
