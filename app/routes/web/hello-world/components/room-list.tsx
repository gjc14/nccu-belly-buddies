import { useState } from 'react'

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

// Mock data for rooms
const mockRooms = [
	{
		id: '1',
		restaurantName: 'Sushi Palace',
		description: "Let's enjoy some fresh sushi together!",
		location: '123 Main St, Downtown',
		time: 'Today, 7:00 PM',
		maxPeople: 6,
		currentPeople: 3,
		host: {
			name: 'Alex',
			avatar: '/placeholder.svg?height=40&width=40',
		},
		restaurantInfo: {
			description:
				'Authentic Japanese sushi restaurant with fresh fish delivered daily.',
			menuLink: 'https://example.com/sushi-palace-menu',
		},
	},
	{
		id: '2',
		restaurantName: 'Burger Joint',
		description: "Best burgers in town, who's in?",
		location: '456 Oak Ave, Westside',
		time: 'Tomorrow, 12:30 PM',
		maxPeople: 4,
		currentPeople: 2,
		host: {
			name: 'Sam',
			avatar: '/placeholder.svg?height=40&width=40',
		},
		restaurantInfo: {
			description:
				'Gourmet burgers made with locally sourced ingredients and house-made sauces.',
			menuLink: 'https://example.com/burger-joint-menu',
		},
	},
	{
		id: '3',
		restaurantName: 'Pasta Paradise',
		description: 'Authentic Italian pasta night!',
		location: '789 Pine Rd, Eastside',
		time: 'Friday, 6:30 PM',
		maxPeople: 8,
		currentPeople: 5,
		host: {
			name: 'Jamie',
			avatar: '/placeholder.svg?height=40&width=40',
		},
		restaurantInfo: {
			description:
				'Family-owned Italian restaurant specializing in handmade pasta and traditional recipes.',
			menuLink: 'https://example.com/pasta-paradise-menu',
		},
	},
	{
		id: '4',
		restaurantName: 'Taco Tuesday',
		description: 'Weekly taco meetup, all welcome!',
		location: '101 Elm St, Northside',
		time: 'Tuesday, 6:00 PM',
		maxPeople: 10,
		currentPeople: 7,
		host: {
			name: 'Taylor',
			avatar: '/placeholder.svg?height=40&width=40',
		},
		restaurantInfo: {
			description:
				'Authentic Mexican taqueria with handmade tortillas and traditional fillings.',
			menuLink: 'https://example.com/taco-tuesday-menu',
		},
	},
]

// In a real app, this would be a global state or context
// For simplicity, we're using localStorage
const saveJoinedRoom = (room: any) => {
	try {
		const existingRooms = JSON.parse(localStorage.getItem('myRooms') || '[]')
		// Check if room is already joined
		if (!existingRooms.some((r: any) => r.id === room.id)) {
			const newRoom = { ...room, isHost: false }
			localStorage.setItem(
				'myRooms',
				JSON.stringify([...existingRooms, newRoom]),
			)
		}
	} catch (error) {
		console.error('Error saving joined room:', error)
	}
}

export function RoomList() {
	const [rooms, setRooms] = useState(mockRooms)

	const handleJoinRoom = (e: any, room: any) => {
		// Stop propagation to prevent navigation when clicking the join button
		e.stopPropagation()

		// In a real app, this would make an API call
		setRooms(
			rooms.map(r =>
				r.id === room.id ? { ...r, currentPeople: r.currentPeople + 1 } : r,
			),
		)

		// Save to "My Rooms"
		saveJoinedRoom(room)

		toast(
			"Joined room! You've successfully joined the room. Check 'My Rooms' to see it.",
		)
	}

	const handleCardClick = (roomId: string) => {
		window.open(`/restaurant/${roomId}`)
	}

	const handleReviewsClick = (e: any, roomId: string) => {
		e.stopPropagation() // Prevent card click
		// In a real app, this would navigate to reviews page or open a modal
		toast('Reviews Restaurant reviews feature coming soon!')
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{rooms.map(room => (
				<Card
					key={room.id}
					className="overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
					onClick={() => handleCardClick(room.id)}
				>
					<CardHeader className="pb-3">
						<div className="flex justify-between items-start">
							<div>
								<CardTitle>{room.restaurantName}</CardTitle>
								<CardDescription className="mt-1">
									{room.description}
								</CardDescription>
							</div>
							<div className="flex flex-col items-center">
								<Avatar>
									<AvatarImage
										src={room.host.avatar || '/placeholder.svg'}
										alt={room.host.name}
									/>
									<AvatarFallback>{room.host.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<span className="text-xs text-muted-foreground mt-1">Host</span>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-3 flex-1">
						<div className="flex items-center text-sm">
							<MapPin className="mr-2 h-4 w-4 opacity-70" />
							<span>{room.location}</span>
						</div>
						<div className="flex items-center text-sm">
							<Clock className="mr-2 h-4 w-4 opacity-70" />
							<span>{room.time}</span>
						</div>
						<div className="flex items-center text-sm">
							<Users className="mr-2 h-4 w-4 opacity-70" />
							<span>
								{room.currentPeople} / {room.maxPeople} people
							</span>
						</div>
					</CardContent>
					<CardFooter className="flex justify-between items-center pt-3 border-t">
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-foreground p-0"
							onClick={e => handleReviewsClick(e, room.id)}
						>
							<Star className="mr-1 h-4 w-4" />
							Reviews
						</Button>
						<Button
							onClick={e => handleJoinRoom(e, room)}
							disabled={room.currentPeople >= room.maxPeople}
						>
							Join
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	)
}
