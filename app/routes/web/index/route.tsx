import { db } from '~/lib/db/db.server'

import type { Route } from './+types/route'
import { AppShell } from './components/app-shell'
import { RoomList } from './components/room-list'

export async function loader() {
	const activeGroups = await db.query.group.findMany({
		where: (group, { eq }) => eq(group.status, 'active'),
	})

	return { activeGroups }
}

export default function Index({ loaderData }: Route.ComponentProps) {
	const { activeGroups } = loaderData

	return (
		<AppShell>
			<div className="container py-6">
				<h1 className="text-3xl font-bold mb-6">Available Rooms</h1>
				{/* <RoomList groups={activeGroups} /> */}
				<RoomList />
			</div>
		</AppShell>
	)
}
