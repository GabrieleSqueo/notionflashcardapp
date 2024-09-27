import EmbeddedComponent from './embeddedComponent'

export default async function EmbedPage({ params }) {
	return <EmbeddedComponent embed_id={params.embed_id} />
}