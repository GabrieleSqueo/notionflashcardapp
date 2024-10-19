import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are properly loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const set_id = searchParams.get('set_id');
    if (!set_id) {
        return NextResponse.json({ error: 'set_id is required' }, { status: 400 });
    }
    try {
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
            .eq('user_id', flashcardSet.user_id)
            .single();
        if (userDataError) throw userDataError;
        const notionKey = userData.notion_key;

        // Extract page ID from the set_link
        const pageId = flashcardSet.set_link.split('-').pop();

        // Fetch the page to get its parent
        const pageResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${notionKey}`,
                'Notion-Version': '2022-06-28',
            },
        });
        if (!pageResponse.ok) {
            const errorText = await pageResponse.text();
            throw new Error(`Error fetching page from Notion: ${errorText}`);
        }
        const pageData = await pageResponse.json();
        const parentId = pageData.parent.page_id;

        // Fetch the content of the parent page
        const parentResponse = await fetch(`https://api.notion.com/v1/blocks/${parentId}/children?page_size=100`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${notionKey}`,
                'Notion-Version': '2022-06-28',
            },
        });
        if (!parentResponse.ok) {
            const errorText = await parentResponse.text();
            throw new Error(`Error fetching parent page content from Notion: ${errorText}`);
        }
        const parentContent = await parentResponse.json();

        // Extract and filter quote content
        const flashcards = parentContent.results
            .filter(block => block.type === 'quote')
            .flatMap(block => {
                const quoteText = block.quote.rich_text.map(text => text.plain_text).join('');
                return quoteText.split('\n').map(line => line.trim()).filter(line => line !== '');
            })
            .map(text => {
                const parts = text.split('==').map(part => part.trim());
                if (parts.length === 2 && parts[0] !== '' && parts[1] !== '') {
                    return { type: 'flashcard', front: parts[0], back: parts[1] };
                } else {
                    const hiddenWordRegex = /\[([^\]]+)\]/g;
                    const matches = [...text.matchAll(hiddenWordRegex)];
                    if (matches.length > 0) {
                        return {
                            type: 'hiddenWord',
                            content: text.replace(hiddenWordRegex, '___'),
                            hiddenWords: matches.map(match => ({ word: match[1], index: match.index }))
                        };
                    } else {
                        return null; // Ignore text that doesn't match any format
                    }
                }
            })
            .filter(card => card !== null);

        return NextResponse.json({ content: flashcards });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
