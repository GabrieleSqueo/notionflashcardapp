import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function POST(request) {
    const supabase = createClient();

    try {
        const requestBody = await request.json(); // Read the request body once
        const { action, pageId, selectedPageName } = requestBody; // Extract all needed data

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
                    query: '', // Empty query to fetch all pages
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
            console.log("----PAGES: ", JSON.stringify(pages, null, 2));
            const formattedPages = pages.results.map(page => {
                // Check for title under both "title" and "Name"
                const titleProperty = page.properties.title || page.properties.Name;
                const title = titleProperty && titleProperty.title && titleProperty.title.length > 0 
                    ? titleProperty.title[0].text.content // Correct path to the title
                    : 'Untitled'; // Safely access the title

                return {
                    id: page.id,
                    title: title,
                    icon: page.icon?.type === 'emoji' ? page.icon.emoji : null, // Get the emoji if available
                };
            });

            return NextResponse.json({ success: true, pages: formattedPages });
        } else if (action === 'createPage' && pageId) {
            const pageTitle = `${selectedPageName} flashcards`; // Use the selected page name and append "flashcards"

            // Array of random background URLs (you can replace these with actual Notion-compatible image URLs)
            const backgroundUrls = [
                "https://www.notion.so/images/page-cover/solid_blue.png",
                "https://www.notion.so/images/page-cover/gradients_10.jpg",
                "https://www.notion.so/images/page-cover/met_william_morris_1877_willow.jpg",
                "https://www.notion.so/images/page-cover/woodcuts_3.jpg"
            ];
            const randomBackground = backgroundUrls[Math.floor(Math.random() * backgroundUrls.length)];

            const response = await fetch('https://api.notion.com/v1/pages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${notionKey}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2021-05-13',
                },
                body: JSON.stringify({
                    parent: { page_id: pageId },
                    icon: {
                        type: "emoji",
                        emoji: "🦄"
                    },
                    cover: {
                        type: "external",
                        external: {
                            url: randomBackground
                        }
                    },
                    properties: {
                        title: [
                            {
                                text: {
                                    content: pageTitle,
                                },
                            },
                        ],
                    },
                    children: [ // Add children to the page
                        {
                            object: 'block',
                            type: 'heading_2',
                            heading_2: {
                                text: [{ type: 'text', text: { content: 'Here you can write your flashcards' } }]
                            }
                        },
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: {
                                text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            object: 'block',
                            type: 'embed',
                            embed: {
                                url: 'https://notionflashcard.com',
                            },
                        },
                    ],
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