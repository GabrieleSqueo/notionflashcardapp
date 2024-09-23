import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(request) {
    const { code } = await request.json();

    if (!code) {
        return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // Exchange the authorization code for a token
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${process.env.OAUTH_CLIENT_ID}:${process.env.INTERNAL_NOTION_KEY}`).toString('base64')}`
        },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.OAUTH_REDIRECT_URI
        })
    });

    if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        return NextResponse.json({ error: errorData.error || 'Failed to exchange token' }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const notionKey = tokenData.access_token;

    // Get the user from the session or cookie
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Update the user's notion_key in the database
    const { error: dbError } = await supabase.from('user_data').update({ notion_key: notionKey }).eq('user_id', user.id);

    if (dbError) {
        return NextResponse.json({ error: dbError.message || 'Failed to update notion_key' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Notion key updated successfully' });
}
