import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';
import crypto from 'crypto';

// Get encryption key from environment variable, or use a default key (not recommended for production)
const ENCRYPTION_KEY = process.env.ENC_KEY || '3e6f7e5b9b80484a9d8304c9d4a2e0cd2f3a8e6785f76dcbc8e4692e97f8a6ad';

// Function to decrypt data
function decryptData(encryptedData) {
  if (!ENCRYPTION_KEY) {
    console.error('Encryption key is not set. Please set the ENC_KEY environment variable.');
    throw new Error('Encryption key is not set');
  }

  // Convert the hexadecimal string to a Buffer and use only the first 32 bytes
  const key = Buffer.from(ENCRYPTION_KEY, 'hex').slice(0, 32);

  const [ivHex, encryptedHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
}

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


    // 1. Search for the page of the setLink
    const pageId = setLink.split('-').pop();
    const pageResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch page: ${await pageResponse.text()}`);
    }

    const pageData = await pageResponse.json();

    // 2. Find the parent of that page
    const parentId = pageData.parent.page_id;

    // 3. Find in the parent page a subpage called "datas_"
    const parentContentResponse = await fetch(`https://api.notion.com/v1/blocks/${parentId}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!parentContentResponse.ok) {
      throw new Error(`Failed to fetch parent content: ${await parentContentResponse.text()}`);
    }

    const parentContent = await parentContentResponse.json();

    const datasPage = parentContent.results.find(block => 
      block.type === 'child_page' && block.child_page.title.toLowerCase() === 'datas_'
    );

    if (!datasPage) {
      return NextResponse.json({ scoresData: [] });
    }

    const datasPageId = datasPage.id;

    // Fetch the content of the datas_ page
    const datasContentResponse = await fetch(`https://api.notion.com/v1/blocks/${datasPageId}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!datasContentResponse.ok) {
      throw new Error(`Failed to fetch datas_ content: ${await datasContentResponse.text()}`);
    }

    const datasContent = await datasContentResponse.json();

    // Process the page content to extract and decrypt the scores data
    const scoresData = datasContent.results
      .filter(block => block.type === 'paragraph' && block.paragraph.rich_text.length > 0)
      .map(block => {
        const content = block.paragraph.rich_text[0].text.content;
        const [datePart, scoresPart] = content.split('\n');
        const date = datePart.split(': ')[1];
        const encryptedScores = scoresPart.split(': ')[1];
        const scores = decryptData(encryptedScores);
        return { date, scores };
      });

    return NextResponse.json({ scoresData });
  } catch (error) {
    console.error('Error fetching data from Notion:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
