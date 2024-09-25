import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import EmbeddedComponent from './embeddedComponent'

export default async function EmbedPage({ params }) {
	const supabase = createClient()

	const { data, error: supabaseError } = await supabase.auth.getUser()
	if (supabaseError || !data?.user) {
		redirect('/latest/login')
	}

	return <EmbeddedComponent embed_id={params.embed_id} />
}