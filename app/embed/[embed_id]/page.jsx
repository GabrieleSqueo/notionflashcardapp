import EmbeddedComponent from './embeddedComponent'
import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function EmbedPage({ params }) {
	const supabase = createClient()
	const { data, error: supabaseError } = await supabase.auth.getUser()
	if (supabaseError || !data?.user) {
		redirect(`/latest/login?from_embed=${params.embed_id}`)
	}

	return <EmbeddedComponent embed_id={params.embed_id} />
}