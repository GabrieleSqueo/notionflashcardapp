import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request, { params }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: 'set_id is required' }, { status: 400 });
    }

    try {
        // Get the flashcard set
        const { data: flashcardSet, error: flashcardSetError } = await supabase
            .from('flashcard_sets')
            .select('*')
            .eq('set_id', id)
            .single();

        if (flashcardSetError) throw flashcardSetError;

        // Get the user's Notion key
        const { data: userData, error: userDataError } = await supabase
            .from('user_data')
            .select('notion_key')
            .eq('user_id', flashcardSet.user_id)
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
                // Exclude the instruction text
                if (text.includes("To add a flashcard, use the format") && 
                    text.includes("Question == Answer")) {
                    return false;
                }
                const parts = text.split('==').map(part => part.trim());
                return parts.length === 2 && parts[0] !== '' && parts[1] !== '';
            })
            .map(text => {
                const [front, back] = text.split('==').map(part => part.trim());
                return { front, back };
            });

        // Combine flashcard set data with flashcards
        const result = {
            ...flashcardSet,
            flashcards: flashcards
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}