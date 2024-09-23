import { NextResponse } from 'next/server';
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectUri = process.env.OAUTH_REDIRECT_URI;


export async function POST(request) {
    const { code } = await request.json();

    if (!code) {
        return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    const tokenUrl = 'https://api.notion.com/v1/oauth/token';
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
    });

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            body,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || 'Failed to exchange token' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error exchanging token:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
