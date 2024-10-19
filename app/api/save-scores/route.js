import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';
import crypto from 'crypto';

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.ENC_KEY;

// Function to encrypt data
function encryptData(data) {
  if (!ENCRYPTION_KEY) {
    console.error('Encryption key is not set. Please set the ENC_KEY environment variable.');
    throw new Error('Encryption key is not set');
  }

  // Convert the hexadecimal string to a Buffer and use only the first 32 bytes
  const key = Buffer.from(ENCRYPTION_KEY, 'hex').slice(0, 32);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export async function POST(req) {
  const { flashcardSetId, scores } = await req.json();
  console.log(`Received scores:`, scores);
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

    // Encrypt the scores data
    const encryptedScores = encryptData(scores);

    // Fetch notion_key from user_data table
    const { data: userData, error: userError } = await supabase
      .from('user_data')
      .select('notion_key')
      .eq('user_id', userId)
      .single();

    if (userError) throw new Error('Failed to fetch notion_key');

    const notionApiKey = userData.notion_key;

    // Get the page ID from the set_link
    const pageId = setLink.split('-').pop();

    // Fetch the page to get its parent
    const pageResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
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
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });
    if (!parentResponse.ok) {
      const errorText = await parentResponse.text();
      throw new Error(`Error fetching parent page content from Notion: ${errorText}`);
    }
    const parentContent = await parentResponse.json();

    // Extract all flashcards from quote blocks
    let allFlashcards = [];
    for (const block of parentContent.results) {
      if (block.type === 'quote') {
        const quoteText = block.quote.rich_text[0].plain_text;
        const flashcardsInQuote = quoteText.split('\n').filter(line => line.trim() !== '');
        allFlashcards = allFlashcards.concat(flashcardsInQuote);
      }
    }

    // Match scores to flashcards
    const flashcardsWithScores = allFlashcards.map((flashcard, index) => ({
      flashcard,
      score: scores[index] || 0
    }));

    // Update the quote blocks with color based on scores
    let flashcardIndex = 0;
    for (const block of parentContent.results) {
      if (block.type === 'quote') {
        const quoteText = block.quote.rich_text[0].plain_text;
        const flashcardsInQuote = quoteText.split('\n');
        
        const updatedRichText = flashcardsInQuote.map(flashcard => {
          const trimmedFlashcard = flashcard.trim();
          if (trimmedFlashcard !== '') {
            const score = scores[flashcardIndex] || 0;
            flashcardIndex++;

            let color = 'default';
            if (score === 1) color = 'red_background';
            else if (score === 2) color = 'orange_background';
            else if (score === 3) color = 'yellow_background';
            else if (score === 4) color = 'green_background';

            return {
              type: 'text',
              text: { content: flashcard },
              annotations: { color: color }
            };
          } else {
            // Preserve empty lines
            return {
              type: 'text',
              text: { content: '\n' },
              annotations: { color: 'default' }
            };
          }
        });

        // Update the block
        const updateResponse = await fetch(`https://api.notion.com/v1/blocks/${block.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${notionApiKey}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quote: {
              rich_text: updatedRichText
            }
          })
        });

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error(`Error updating block in Notion: ${errorText}`);
        } else {
          console.log(`Successfully updated block`);
        }
      }
    }

    // Find the "datas_" subpage
    let datasPage = parentContent.results.find(block => 
      block.type === 'child_page' && block.child_page.title.toLowerCase() === 'datas_'
    );

    let datasPageId;

    if (!datasPage) {
      // Create "datas_" page if it doesn't exist
      const createPageResponse = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: { page_id: parentId },
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
      datasPageId = datasPage.id;
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
                    content: `Date: ${now}\nScores: ${encryptedScores}`
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
