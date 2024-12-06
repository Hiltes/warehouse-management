import { json } from '@sveltejs/kit';
import { checkUser } from '$db/api/user';

export async function POST({ request }: { request: Request }) {
    try {
        const { email, password } = await request.json();

        const userExists = await checkUser(email, password);

        return json({ success: userExists });
    } catch (error) {
        console.error("Error in login endpoint:", error);
        return json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
