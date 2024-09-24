import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function POST(request) {
    const supabase = createClient();

    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ success: false, message: 'Authorization code is required' }, { status: 400 });
        }

        const { data, error: supabaseError } = await supabase.auth.getUser();
        if (supabaseError || !data?.user) {
            console.error('Auth error:', supabaseError);
            return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
        }

        const user = data.user;

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

        // Update the user's notion_key in the database
        const { error: dbError } = await supabase
            .from('user_data')
            .update({ notion_key: notionKey })
            .eq('user_id', user.id);

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json({ success: false, message: 'Failed to update notion_key' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Notion key updated successfully' });
    } catch (error) {
        console.error('Error adding notion token:', error);
        return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}
