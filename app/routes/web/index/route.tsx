import {
	useLoaderData,
	type ClientLoaderFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
} from 'react-router'

import { MainWrapper } from '~/components/wrappers'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'

import { Footer } from '../components/footer'
import { Nav } from '../components/nav'
import { CategoryFilter } from './components/category-filter'
import { FoodGrid } from './components/food-grid'
import { Hero } from './hero'

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
	if (!data || !data.meta) {
		return []
	}

	return data.meta.metaTags
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { seo } = await getSEO(new URL(request.url).pathname)
	const meta = seo ? createMeta(seo, new URL(request.url)) : null

	try {
		return { meta }
	} catch (error) {
		console.error(error)
		return { meta }
	}
}

let cache: Awaited<ReturnType<typeof loader>>
export const clientLoader = async ({
	serverLoader,
}: ClientLoaderFunctionArgs) => {
	if (cache) {
		return cache
	}

	cache = await serverLoader()
	return cache
}

clientLoader.hydrate = true

export default function Index() {
	const { meta } = useLoaderData<typeof loader>()

	return (
		<div className="flex-1 flex overflow-hidden">
			<main className="flex-1 overflow-auto p-4">
				<CategoryFilter />
				<FoodGrid />
			</main>
		</div>
	)
}
