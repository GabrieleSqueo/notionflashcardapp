import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function GET(req) {
    const supabase = createClient();
    
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('Auth error:', authError);
            return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
        }

        const { data: userData, error: dbError } = await supabase
            .from('user_data')
            .select('notion_key')
            .eq('user_id', user.id)
            .single();

        if (dbError) {
            if (dbError.code === 'PGRST116') {
                // No matching row found, which means the user doesn't have a linked Notion account
                return NextResponse.json({ isLinked: false });
            }
            throw dbError;
        }

        return NextResponse.json({ isLinked: !!userData?.notion_key });
    } catch (error) {
        console.error('Error checking Notion link:', error);
        return NextResponse.json({ error: 'Failed to check Notion link status' }, { status: 500 });
    }
}