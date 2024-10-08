import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function POST(req) {
  const { flashcardSetId, scores } = await req.json();
  const supabase = createClient();

  try {
    // Fetch user_id and set_link from flashcard_sets table
    const { data: setData, error: setError } = await supabase
      .from('flashcard_sets')
      .select('user_id, set_link')
      .eq('set_id', flashcardSetId)
      .single();

    if (setError) throw new Error('Failed to fetch flashcard set data');

    const userId = setData.user_id;
    const setLink = setData.set_link;

    // Fetch notion_key from user_data table
    const { data: userData, error: userError } = await supabase
      .from('user_data')
      .select('notion_key')
      .eq('user_id', userId)
      .single();

    if (userError) throw new Error('Failed to fetch notion_key');

    const notionApiKey = userData.notion_key;

    // Search for the Notion page with the set_link
    const searchResponse = await fetch(`https://api.notion.com/v1/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: setLink,
        filter: { property: 'object', value: 'page' }
      })
    });

    const searchData = await searchResponse.json();
    if (!searchData.results || searchData.results.length === 0) throw new Error('Notion page not found');

    const parentPageId = searchData.results[0].id;

    // Search for the "datas_" subpage
    const datasSearchResponse = await fetch(`https://api.notion.com/v1/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'datas_',
        filter: {
          property: 'object',
          value: 'page'
        },
        parent: {
          type: 'page_id',
          page_id: parentPageId
        }
      })
    });

    const datasSearchData = await datasSearchResponse.json();
    let datasPageId;

    if (!datasSearchData.results || datasSearchData.results.length === 0) {
      // Create "datas_" page if it doesn't exist
      const createPageResponse = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: { page_id: parentPageId },
          properties: {
            title: [
              {
                text: {
                  content: 'datas_'
                }
              }
            ]
          }
        })
      });

      if (!createPageResponse.ok) {
        throw new Error('Failed to create datas_ page');
      }

      const createPageData = await createPageResponse.json();
      datasPageId = createPageData.id;
    } else {
      datasPageId = datasSearchData.results[0].id;
    }

    // Add the new score data to the datas_ page
    const now = new Date().toISOString();
    const appendBlockResponse = await fetch(`https://api.notion.com/v1/blocks/${datasPageId}/children`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `Date: ${now}\nScores: ${JSON.stringify(scores)}`
                  }
                }
              ]
            }
          }
        ]
      })
    });

    if (!appendBlockResponse.ok) {
      throw new Error('Failed to append block to Notion page');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving scores to Notion:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}