import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function POST(request) {
    const supabase = createClient();

    try {
        const { action, pageId } = await request.json();

        const { data, error: supabaseError } = await supabase.auth.getUser();

        if (supabaseError) {
            return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
        }

        // Fetch the user's Notion access token from the database
        const { data: userData, error: userDataError } = await supabase
            .from('user_data')
            .select('notion_key')
            .eq('user_id', data.user.id)
            .single();

        if (userDataError || !userData?.notion_key) {
            throw new Error('Notion key not found');
        }

        const notionKey = userData.notion_key;

        if (action === 'fetchPages') {
            // Fetch the list of pages from Notion
            const response = await fetch('https://api.notion.com/v1/search', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${notionKey}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2021-05-13',
                },
                body: JSON.stringify({
                    query: '',
                    sort: {
                        direction: 'ascending',
                        timestamp: 'last_edited_time',
                    },
                    filter: {
                        property: 'object',
                        value: 'page',
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error fetching pages from Notion: ${errorText}`);
            }

            const pages = await response.json();
            console.log("PAGES", JSON.stringify(pages, null, 2));
            return NextResponse.json({ success: true, pages });
        } else if (action === 'createPage' && pageId) {
            // Create a new page inside the selected page
            const response = await fetch('https://api.notion.com/v1/pages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${notionKey}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2021-05-13',
                },
                body: JSON.stringify({
                    parent: { page_id: pageId },
                    properties: {
                        title: [
                            {
                                text: {
                                    content: 'New Project',
                                },
                            },
                        ],
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error creating Notion page: ${errorText}`);
            }

            return NextResponse.json({ success: true, message: 'Notion page created successfully!' });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid action or missing pageId' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}