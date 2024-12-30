import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '$env/static/private';
import { addUser } from '$db/api/user';
import bcrypt from 'bcrypt';
import { TOKEN_EXPIRY_TIME } from '$env/static/private';


export async function POST({ request }: { request: Request }) {
    try {
        const { username, email, password } = await request.json();


        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        const Useradd = await addUser(username, email, hashedPassword);
        

        if (Useradd) {
            const token = jwt.sign({ email }, SECRET_JWT_KEY, { expiresIn: TOKEN_EXPIRY_TIME });

            const headers = new Headers();
            headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

            return new Response(
                JSON.stringify({ success: true, message: 'Register successful' }),
                { status: 200, headers }
            );
        } else {
            return json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error('Error in register endpoint:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

