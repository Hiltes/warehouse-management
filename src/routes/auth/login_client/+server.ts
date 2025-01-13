import { json } from '@sveltejs/kit';
import jwt, {type JwtPayload} from 'jsonwebtoken';
import { SECRET_JWT_KEY, TOKEN_EXPIRY_TIME } from '$env/static/private';
import { checkClient } from '$db/api/client'; // Upewnij się, że ta funkcja sprawdza hasło z bcrypt


export async function POST({ request }: { request: Request }) {
    try {
        const { email, password } = await request.json();

        // Sprawdzenie czy użytkownik istnieje
        const clientExists = await checkClient(email, password); // Funkcja powinna tylko sprawdzić, czy użytkownik istnieje w bazie danych

        
        // Jeśli użytkownik istnieje, porównaj hasło
        if (clientExists) {
            const token = jwt.sign({ id: clientExists._id, username: clientExists.username, email: clientExists.email, role: clientExists.role }, SECRET_JWT_KEY, { expiresIn: TOKEN_EXPIRY_TIME });

            const headers = new Headers();
            headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

            return new Response(
                JSON.stringify({ success: true, message: 'Login successful' }),
                { status: 200, headers }
            );
        } else {
            const headers = new Headers();
            headers.append('Set-Cookie', `token=0; HttpOnly; Path=/; Max-Age=0`);
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
        const decoded = jwt.verify(token, SECRET_JWT_KEY) as JwtPayload;
        if (decoded.role !== 'client') {
            return json({ success: false, error: 'Unauthorized access' }, { status: 403 });
        }
        return json({ success: true, client: decoded }, { status: 200 });
    } catch {
        return json({ success: false }, { status: 401 });
    }
}