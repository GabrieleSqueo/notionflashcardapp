import EmbeddedComponent from './embeddedComponent'
import InsightComponent from './insightComponent'

export default async function EmbedPage({ params, searchParams }) {
	const { embed_id } = params;
	const { insight } = searchParams;

	if (insight === 'true') {
		return <InsightComponent embed_id={embed_id} />
	} else {
		return <EmbeddedComponent embed_id={embed_id} />
	}
}