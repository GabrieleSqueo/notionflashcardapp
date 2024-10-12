import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function POST(request) {
    const supabase = createClient();

    try {
        const requestBody = await request.json();
        const { action, pageId, selectedPageName, embedMode } = requestBody; // Extract embedMode

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
            const formattedPages = pages.results
                .map(page => {
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
                })
                .filter(page => page.title !== 'Untitled'); // Filter out pages with the title "Untitled"

            return NextResponse.json({ success: true, pages: formattedPages });
        } else if (action === 'createPage' && pageId) {
            const pageTitle = `${selectedPageName} flashcards`;

            // First, create a new entry in the flashcard_sets table
            const { data: flashcardSet, error: flashcardSetError } = await supabase
                .from('flashcard_sets')
                .insert([
                    {
                        set_name: pageTitle,
                        user_id: userId,
                        set_link: null  // Explicitly set to null
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

            const set_id = flashcardSet[0].set_id;

            // Array of random background URLs
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
                    'Notion-Version': '2022-06-28',
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
                        title: {
                            title: [
                                {
                                    text: {
                                        content: pageTitle,
                                    },
                                },
                            ],
                        },
                    },
                    children: [
                        {
                            object: 'block',
                            type: 'callout',
                            callout: {
                                rich_text: [{
                                    type: 'text',
                                    text: {
                                        content: 'This is your study hub, here you can find everything about the subject you\'re studying, from learning tools to statistics about your progress',
                                    },
                                }],
                                icon: {
                                    emoji: '💡'
                                },
                                color: 'gray_background',
                            },
                        },
                        {
                            object: 'block',
                            type: 'heading_2',
                            heading_2: {
                                rich_text: [{ type: 'text', text: { content: 'Your progress insights:' } }]
                            }
                        },
                        {
                            object: 'block',
                            type: 'embed',
                            embed: {
                                url: `https://notionflashcard.com/embed/${set_id}?insight=true&mode=${embedMode}`,
                            },
                        },
                        {
                            object: 'block',
                            type: 'heading_2',
                            heading_2: {
                                rich_text: [{ type: 'text', text: { content: 'Time to test yourself!' } }]
                            }
                        },
                        {
                            object: 'block',
                            type: 'embed',
                            embed: {
                                url: `https://notionflashcard.com/embed/${set_id}?mode=${embedMode}`,
                            },
                        },
                        {
                            object: 'block',
                            type: 'heading_2',
                            heading_2: {
                                rich_text: [{ type: 'text', text: { content: 'Write your flashcards here' } }]
                            }
                        },
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: {
                                rich_text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'To add a flashcard, use the format "Question == Answer" and press enter after each flashcard.',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: {
                                rich_text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'Write the flashcards all above this line',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: {
                                rich_text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'When you write a phrase like "Einstein is a [scientist]", the flashcards will hide the word in the brackets.',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            object: 'block',
                            type: 'quote',
                            quote: {
                                rich_text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'If you want to update the flashcard embed, please hit CTRL+R and refresh',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            object: 'block',
                            type: 'divider',
                            divider: {}
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error creating Notion page: ${errorText}`);
            }

            const newPage = await response.json();

            // Update the flashcard set with the Notion page URL
            const { error: updateError } = await supabase
                .from('flashcard_sets')
                .update({ set_link: newPage.url })
                .eq('set_id', set_id);

            if (updateError) {
                console.error('Error updating flashcard set with Notion URL:', updateError);
                throw new Error(`Error updating flashcard set: ${JSON.stringify(updateError)}`);
            }

            // Fetch the updated flashcard set
            const { data: updatedFlashcardSet, error: fetchError } = await supabase
                .from('flashcard_sets')
                .select('*')
                .eq('set_id', set_id)
                .single();

            if (fetchError) {
                console.error('Error fetching updated flashcard set:', fetchError);
                throw new Error(`Error fetching updated flashcard set: ${JSON.stringify(fetchError)}`);
            }

            return NextResponse.json({ 
                success: true, 
                message: 'Notion page and flashcard set created successfully!',
                flashcardSet: updatedFlashcardSet,
                pageId: pageId
            });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid action or missing pageId' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}
