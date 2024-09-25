import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function GET(request) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const set_id = searchParams.get('set_id');

    if (!set_id) {
        return NextResponse.json({ error: 'set_id is required' }, { status: 400 });
    }

    try {
        // Get the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        // Get the flashcard set
        const { data: flashcardSet, error: flashcardSetError } = await supabase
            .from('flashcard_sets')
            .select('*')
            .eq('set_id', set_id)
            .single();
        if (flashcardSetError) throw flashcardSetError;

        // Get the user's Notion key
        const { data: userData, error: userDataError } = await supabase
            .from('user_data')
            .select('notion_key')
            .eq('user_id', user.id)
            .single();
        if (userDataError) throw userDataError;

        const notionKey = userData.notion_key;

        // Extract page ID from the set_link
        const pageId = flashcardSet.set_link.split('-').pop();

        // Fetch the page content
        const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${notionKey}`,
                'Notion-Version': '2022-06-28',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching page content from Notion: ${errorText}`);
        }

        const pageContent = await response.json();

        // Extract and filter paragraph content
        const flashcards = pageContent.results
            .filter(block => block.type === 'paragraph')
            .map(block => block.paragraph.rich_text.map(text => text.plain_text).join(''))
            .filter(text => text.trim() !== '') // Remove empty paragraphs
            .filter(text => {
                const parts = text.split('==').map(part => part.trim());
                return parts.length === 2 && parts[0] !== '' && parts[1] !== '';
            })
            .map(text => {
                const [front, back] = text.split('==').map(part => part.trim());
                return { front, back };
            });

        return NextResponse.json({ content: flashcards });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}