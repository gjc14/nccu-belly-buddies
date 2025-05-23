
import { AppShell } from "../components/app-shell"
import { RoomList } from "../components/room-list"

export async function loader() {
	return null
}

export default function Index() {
	return (
<AppShell>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Available Rooms</h1>
        <RoomList />
      </div>
    </AppShell>
	)
}
