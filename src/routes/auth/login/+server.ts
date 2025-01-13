import { json } from '@sveltejs/kit';
import jwt, {type JwtPayload} from 'jsonwebtoken';
import { SECRET_JWT_KEY, TOKEN_EXPIRY_TIME } from '$env/static/private';
import { checkUser } from '$db/api/user';
import bcrypt from 'bcrypt';

export async function POST({ request }: { request: Request }) {
    try {
        const { email, password } = await request.json();

        // Check if user exists and compare password
        const userExists = await checkUser(email, password);

        if (userExists) {
            // Generate JWT token with user information (including role)
            const token = jwt.sign(
                { id: userExists._id, username: userExists.username, email: userExists.email, role: userExists.role },
                SECRET_JWT_KEY,
                { expiresIn: TOKEN_EXPIRY_TIME } // Token expiry time (e.g., 1 hour)
            );

            const headers = new Headers();
<<<<<<< HEAD
            headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
=======
            headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${TOKEN_EXPIRY_TIME}`);
>>>>>>> main

            // Respond with success and user details (including role)
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Login successful',
                    user: { email: userExists.email, role: userExists.role }
                }),
                { status: 200, headers }
            );
        } else {
            const headers = new Headers();
            headers.append('Set-Cookie', `token=0; HttpOnly; Path=/; Max-Age=0`);

            return json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (err) {
        console.error('Error in login endpoint:', (err as Error).message);
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
        const decoded = jwt.verify(token, SECRET_JWT_KEY) as JwtPayload;

        // Check if user role is admin
        if (decoded.role !== 'admin') {
            return json({ success: false, error: 'Unauthorized access' }, { status: 403 });
        }

        // Return decoded user information (email and role)
        return json({ success: true, user: decoded }, { status: 200 });
    } catch (err) {
        if (err instanceof Error) {
            console.error('JWT verification error:', err.message);
        } else {
            console.error('Unknown error:', err);
        }
        return json({ success: false }, { status: 401 });
    }
}
