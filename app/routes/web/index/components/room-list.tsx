import { useFetcher, useNavigate } from 'react-router'

import { Clock, MapPin, Star, Users } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import type { group, groupMember, restaurant, user } from '~/lib/db/schema'

// Define the new Room type based on user's specification
export type Room = typeof group.$inferSelect & {
	restaurant: typeof restaurant.$inferSelect | null
	creator: typeof user.$inferSelect
	groupMembers: (typeof groupMember.$inferSelect)[]
}

export function RoomList({
	groups,
}: {
	groups: Room[] // Updated prop type to use the new Room interface
}) {
	const navigate = useNavigate()
	const fetcher = useFetcher()

	const handleJoinRoom = (room: Room) => {
		fetcher.submit(
			{},
			{
				method: 'post',
				action: '/api/membership/' + room.id, // Adjust the action URL as needed
			},
		)
	}

	const handleCardClick = (roomId: string, room: Room) => {
		navigate(`/restaurant/${roomId}`, {
			state: room,
		}) // Assuming roomId still maps to a restaurant detail page
	}

	const handleReviewsClick = (roomId: string) => {
		// TODO: Implement reviews feature
		toast('Reviews Restaurant reviews feature coming soon!')
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{groups.map(group => (
				<Card
					key={group.id}
					className="overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
					onClick={() => handleCardClick(group.id, group)}
				>
					<CardHeader className="pb-3">
						<div className="flex justify-between items-start">
							<div>
								<CardTitle>{group.name}</CardTitle>{' '}
								<CardDescription className="mt-1">
									{group.description ?? 'No description available.'}{' '}
									{/* Handle null description */}
								</CardDescription>
							</div>
							<div className="flex flex-col items-center">
								<Avatar>
									<AvatarImage
										src={'/placeholders/avatar.png'}
										alt={group.name}
									/>
									<AvatarFallback>
										{group.creator.name.charAt(0).toUpperCase()}
									</AvatarFallback>{' '}
								</Avatar>
								<span className="text-xs text-muted-foreground mt-1">Host</span>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-3 flex-1">
						<div className="flex items-center text-sm">
							<MapPin className="mr-2 h-4 w-4 opacity-70" />
							{/* Updated to use restaurant address */}
							<span>
								{group.restaurant?.address ?? 'Location not available'}
							</span>{' '}
						</div>
						<div className="flex items-center text-sm">
							<Clock className="mr-2 h-4 w-4 opacity-70" />
							{/* Format startTime (Date object) for display */}
							<span>
								{group.startTime
									? new Date(group.startTime).toLocaleTimeString('en-US', {
											weekday: 'short',
											hour: 'numeric',
											minute: '2-digit',
											hour12: true,
										})
									: 'Time TBD'}
							</span>
						</div>
						<div className="flex items-center text-sm">
							<Users className="mr-2 h-4 w-4 opacity-70" />
							<span>
								{group.groupMembers.length} / {group.numofPeople} people{' '}
							</span>
						</div>
					</CardContent>
					<CardFooter className="flex justify-between items-center pt-3 border-t">
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-foreground p-0"
							onClick={e => {
								e.stopPropagation()
								handleReviewsClick(group.id)
							}}
						>
							<Star className="mr-1 h-4 w-4" />
							Reviews
						</Button>
						<Button
							onClick={e => {
								e.stopPropagation()
								handleJoinRoom(group)
							}}
							disabled={group.groupMembers.length >= group.numofPeople} // Assuming currentPeople and numofPeople are in Room type
						>
							Join
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	)
}
