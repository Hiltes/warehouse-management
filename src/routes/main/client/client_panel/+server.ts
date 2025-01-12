export async function POST() {
    const headers = new Headers();
    headers.append('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');

    return new Response(JSON.stringify({ success: true, message: 'Logged out' }), { status: 200, headers });
}
