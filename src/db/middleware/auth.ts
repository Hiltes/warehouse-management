import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { SECRET_JWT_KEY } from '$env/static/private';

const SECRET_KEY = SECRET_JWT_KEY;

export function getUserFromCookie(request: Request): { valid: boolean; payload?: any } {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return { valid: false };

    const cookies = parse(cookieHeader); // Parsowanie ciasteczek

    const token = cookies.token;
    if (!token) return { valid: false };

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        return { valid: true, payload };
    } catch (error) {
        console.error('Invalid or expired token:', error);
        return { valid: false };
    }
}


