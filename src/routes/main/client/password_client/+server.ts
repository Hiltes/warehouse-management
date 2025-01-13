import { changePassword } from '$db/api/client';
import { json } from '@sveltejs/kit';

export async function POST({ request }: { request: Request }) {
    try {
        const { email, oldPassword, newPassword } = await request.json();

        const result = await changePassword(email, oldPassword, newPassword);
        if (result) {
            return json({ success: true, message: 'Password changed successfully' }, { status: 200 });
        } else {
            return json({ success: false, error: 'Failed to change password' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error changing password endpoint:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}