import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function POST(req) {
    const supabase = createClient();
    
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('Auth error:', authError);
            return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
        }

        const { error } = await supabase
            .from('user_data')
            .update({ notion_key: null })
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error unlinking Notion account:', error);
        return NextResponse.json({ error: 'Failed to unlink Notion account' }, { status: 500 });
    }
}