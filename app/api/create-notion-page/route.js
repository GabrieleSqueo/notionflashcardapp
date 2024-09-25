import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function POST(request) {
    const supabase = createClient();

    try {
        const requestBody = await request.json(); // Read the request body once
        const { action, pageId, selectedPageName } = requestBody; // Extract all needed data

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData || !userData.user) {
            console.error('User authentication error:', userError);
            return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
        }

        const userId = userData.user.id;

        // Fetch the user's Notion access token from the database
        const { data: notionData, error: notionDataError } = await supabase
            .from('user_data')
            .select('notion_key')
            .eq('user_id', userId)
            .single();

        if (notionDataError || !notionData?.notion_key) {
            throw new Error('Notion key not found');
        }

        const notionKey = notionData.notion_key;

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
                                url: 'https://notionflashcard.com/embed/3d3bf686-5de3-4028-924a-444b25c961a2',
                            },
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error creating Notion page: ${errorText}`);
            }

            const newPage = await response.json();

            // Create a new entry in the flashcard_sets table
            console.log('Attempting to insert flashcard set:', {
                set_name: pageTitle,
                set_link: newPage.url,
                user_id: userId
            });

            const { data: flashcardSet, error: flashcardSetError } = await supabase
                .from('flashcard_sets')  // Changed from 'flashcard_set' to 'flashcard_sets'
                .insert([
                    {
                        set_name: pageTitle,
                        set_link: newPage.url,
                        user_id: userId
                        // Note: created_at and updated_at will be automatically handled by Supabase
                    }
                ])
                .select();

            if (flashcardSetError) {
                console.error('Supabase error:', flashcardSetError);
                throw new Error(`Error creating flashcard set: ${JSON.stringify(flashcardSetError)}`);
            }

            if (!flashcardSet || flashcardSet.length === 0) {
                console.error('Flashcard set was not created. Supabase response:', { data: flashcardSet, error: flashcardSetError });
                throw new Error('Flashcard set was not created');
            }

            console.log('Flashcard set created successfully:', flashcardSet[0]);

            return NextResponse.json({ 
                success: true, 
                message: 'Notion page and flashcard set created successfully!',
                flashcardSet: flashcardSet[0]
            });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid action or missing pageId' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}