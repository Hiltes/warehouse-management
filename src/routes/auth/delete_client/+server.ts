import { json } from '@sveltejs/kit';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '$env/static/private' // Assuming you have a function to delete user from your database
import { getClientById } from '$db/api/client';
import { getClientByEmail } from '$db/api/client';
import { deleteClientByEmail } from '$db/api/client';
import { TOKEN_EXPIRY_TIME } from '$env/static/private';

export async function POST({ request }: { request: Request }) {
     const { id,email, username } = await request.json();
      
        const token = jwt.sign({ email, username }, SECRET_JWT_KEY, { expiresIn: TOKEN_EXPIRY_TIME });
        const headers = new Headers();
        headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
        
        console.log(headers);
        const cookie = request.headers.get('cookie');
            console.log("Cookie:", cookie);
        console.log("Token:", token);
        console.log("Token:", id);
    if (!token) {
        return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET_JWT_KEY) as JwtPayload;
        const email = decoded.email; // Assumes you store user ID in the token

        // Get the user details from the request body


         const clientDetails = await getClientByEmail(email);
        
                
                if (!clientDetails) {
                    return json({ success: false, error: 'Client not found' }, { status: 404 });
                }
        
                if (clientDetails.email !== email || clientDetails.username !== username) {
                    return json({ success: false, error: 'Invalid credentials' }, { status: 403 });
                }

        // Here you should perform additional checks to ensure the user is allowed to delete their account.
        // For example, you could check if the email and username match the logged-in user.

        // Delete the user from the database
        const deletionResult = await deleteClientByEmail(email); // Implement this function in your user API

        if (deletionResult) {
            // Optionally, you can also clear the cookie
            return json({ success: true, message: 'Account deleted successfully' }, { status: 200 });
        } else {
            return json({ success: false, error: 'Failed to delete account' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in delete client endpoint:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET({ request }: { request: Request }) {
    const cookie = request.headers.get('cookie');
    const token = cookie?.match(/token=([^;]+)/)?.[1];

    if (!token) {
        return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET_JWT_KEY) as JwtPayload;
        const userId = decoded.userId; // Assumes you store user ID in the token

        // Fetch user details from the database
        const userDetails = await getClientById(userId); // Implement this function in your user API

        if (userDetails) {
            return json({ success: true, user: userDetails }, { status: 200 });
        } else {
            return json({ success: false, error: 'User not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error in get client endpoint:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
