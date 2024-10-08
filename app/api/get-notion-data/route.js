import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const flashcardSetId = searchParams.get('flashcardSetId');
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

    // Fetch the content of the parent page to find the "datas_" subpage
    const parentPageContentResponse = await fetch(`https://api.notion.com/v1/blocks/${parentPageId}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    const parentPageContent = await parentPageContentResponse.json();

    // Find the "datas_" subpage
    const datasPage = parentPageContent.results.find(block => 
      block.type === 'child_page' && block.child_page.title.toLowerCase() === 'datas_'
    );

    if (!datasPage) {
      return NextResponse.json({ scoresData: [] });
    }

    const datasPageId = datasPage.id;

    // Fetch the content of the datas_ page
    const pageContentResponse = await fetch(`https://api.notion.com/v1/blocks/${datasPageId}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    const pageContent = await pageContentResponse.json();

    // Process the page content to extract the scores data
    const scoresData = pageContent.results
      .filter(block => block.type === 'paragraph' && block.paragraph.rich_text.length > 0)
      .map(block => {
        const content = block.paragraph.rich_text[0].text.content;
        const [datePart, scoresPart] = content.split('\n');
        const date = datePart.split(': ')[1];
        const scores = JSON.parse(scoresPart.split(': ')[1]);
        return { date, scores };
      });

    return NextResponse.json({ scoresData });
  } catch (error) {
    console.error('Error fetching data from Notion:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}