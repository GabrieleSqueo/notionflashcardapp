import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function GET() {
	const supabase = createClient();

	try {
		// Get the authenticated user
		const { data: userData, error: userError } = await supabase.auth.getUser();

		if (userError || !userData || !userData.user) {
			console.error('User authentication error:', userError);
			return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
		}

		const userId = userData.user.id;

		// Fetch the user's flashcard sets from the database
		const { data: flashcardSets, error: flashcardSetsError } = await supabase
			.from('flashcard_sets')
			.select('*')
			.eq('user_id', userId);

		if (flashcardSetsError) {
			console.error('Error fetching flashcard sets:', flashcardSetsError);
			return NextResponse.json({ error: 'Error fetching flashcard sets' }, { status: 500 });
		}

		// Format the flashcard sets to match the expected structure
		const formattedSets = flashcardSets.map(set => ({
			id: set.id,
			title: set.set_name,
			cardCount: set.card_count || 0, // Assuming there's a card_count column, otherwise default to 0
			createdAt: set.created_at
		}));

		return NextResponse.json(formattedSets);
	} catch (error) {
		console.error('Error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}