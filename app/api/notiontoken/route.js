import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(request) {
    try {
        const { code } = await request.json();

        if (!code) {
            throw new Error('Authorization code is required');
        }

        // Parametri di configurazione per la richiesta di token OAuth di Notion
        const clientId = process.env.OAUTH_CLIENT_ID;
        const clientSecret = process.env.INTERNAL_NOTION_KEY;
        const redirectUri = process.env.OAUTH_REDIRECT_URI;
        const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

        // Richiesta per ottenere il token di accesso da Notion
        const response = await fetch("https://api.notion.com/v1/oauth/token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Basic ${encoded}`,
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching token from Notion: ${errorText}`);
        }

        const tokenData = await response.json();
        const notionKey = tokenData.access_token;

        // Get the user from the session
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
            throw new Error('User not authenticated');
        }

        // Update the user's notion_key in the database
        const { error: dbError } = await supabase
            .from('user_data')
            .update({ notion_key: notionKey })
            .eq('user_id', user.id);

        if (dbError) {
            throw new Error(dbError.message || 'Failed to update notion_key');
        }

        return NextResponse.json({ success: true, message: 'Notion key updated successfully' });
    } catch (error) {
        console.error('Error adding notion token:', error);
        return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}
