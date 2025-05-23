import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { ArrowLeft, Clock, ExternalLink, MapPin, Users } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'

import { AppShell } from '../../components/app-shell'

// Combined mock data (this would come from an API in a real app)
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
			cuisine: 'Japanese',
			priceRange: '$$',
			openingHours: '11:00 AM - 10:00 PM',
			phoneNumber: '(555) 123-4567',
			website: 'https://example.com/sushi-palace',
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
			cuisine: 'American',
			priceRange: '$$',
			openingHours: '11:00 AM - 11:00 PM',
			phoneNumber: '(555) 234-5678',
			website: 'https://example.com/burger-joint',
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
			cuisine: 'Italian',
			priceRange: '$$$',
			openingHours: '5:00 PM - 10:00 PM',
			phoneNumber: '(555) 345-6789',
			website: 'https://example.com/pasta-paradise',
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
			cuisine: 'Mexican',
			priceRange: '$',
			openingHours: '10:00 AM - 9:00 PM',
			phoneNumber: '(555) 456-7890',
			website: 'https://example.com/taco-tuesday',
		},
	},
	{
		id: '5',
		restaurantName: 'Pizza Place',
		description: 'Friday night pizza and games!',
		location: '555 Maple Dr, Southside',
		time: 'Friday, 8:00 PM',
		maxPeople: 6,
		currentPeople: 2,
		host: {
			name: 'Jordan',
			avatar: '/placeholder.svg?height=40&width=40',
		},
		restaurantInfo: {
			description:
				'Artisanal pizza with wood-fired oven and craft beer selection.',
			menuLink: 'https://example.com/pizza-place-menu',
			cuisine: 'Italian',
			priceRange: '$$',
			openingHours: '4:00 PM - 11:00 PM',
			phoneNumber: '(555) 567-8901',
			website: 'https://example.com/pizza-place',
		},
	},
]

// Save joined room to localStorage
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

export default function RestaurantDetails() {
	const params = useParams()
	const [room, setRoom] = useState<any>()

	useEffect(() => {
		// In a real app, this would be an API call
		const foundRoom = mockRooms.find(r => r.id === params.id)
		if (foundRoom) {
			setRoom(foundRoom)
		} else {
			window.open('/')
		}
	}, [params.id])

	const handleJoinRoom = () => {
		if (room) {
			// Save to "My Rooms"
			saveJoinedRoom(room)

			toast(
				"Joined room! You've successfully joined the room. Check 'My Rooms' to see it.",
			)
		}
	}

	if (!room) {
		return (
			<AppShell>
				<div className="container py-6">
					<p>Loading...</p>
				</div>
			</AppShell>
		)
	}

	return (
		<AppShell>
			<div className="container py-6">
				<Button
					variant="ghost"
					className="mb-4 pl-0"
					onClick={() => window.open()}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>

				<div className="grid gap-6 md:grid-cols-3">
					{/* Restaurant Details */}
					<div className="md:col-span-2">
						<Card>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle className="text-2xl">
											{room.restaurantName}
										</CardTitle>
										<CardDescription className="text-base mt-1">
											{room.restaurantInfo.cuisine} •{' '}
											{room.restaurantInfo.priceRange}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<div>
									<h3 className="font-medium mb-2">Restaurant Information</h3>
									<p className="text-muted-foreground">
										{room.restaurantInfo.description}
									</p>
								</div>

								<div className="grid gap-3">
									<div className="flex items-center text-sm">
										<MapPin className="mr-2 h-4 w-4 opacity-70" />
										<span>{room.location}</span>
									</div>
									<div className="flex items-center text-sm">
										<Clock className="mr-2 h-4 w-4 opacity-70" />
										<span>Open: {room.restaurantInfo.openingHours}</span>
									</div>
									<div className="flex items-center text-sm">
										<span className="mr-2 opacity-70">📞</span>
										<span>{room.restaurantInfo.phoneNumber}</span>
									</div>
								</div>

								<div className="flex flex-wrap gap-3">
									<Button variant="outline" size="sm" asChild>
										<a
											href={room.restaurantInfo.website}
											target="_blank"
											rel="noopener noreferrer"
										>
											Visit Website
											<ExternalLink className="ml-1 h-3 w-3" />
										</a>
									</Button>
									<Button variant="outline" size="sm" asChild>
										<a
											href={room.restaurantInfo.menuLink}
											target="_blank"
											rel="noopener noreferrer"
										>
											View Menu
											<ExternalLink className="ml-1 h-3 w-3" />
										</a>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Meetup Details */}
					<div>
						<Card>
							<CardHeader>
								<CardTitle>Meetup Details</CardTitle>
								<CardDescription>Organized by {room.host.name}</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center">
									<Avatar className="h-10 w-10 mr-3">
										<AvatarImage
											src={room.host.avatar || '/placeholder.svg'}
											alt={room.host.name}
										/>
										<AvatarFallback>{room.host.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">{room.host.name}</p>
										<p className="text-sm text-muted-foreground">Host</p>
									</div>
								</div>

								<div>
									<h3 className="font-medium mb-1">Description</h3>
									<p className="text-sm text-muted-foreground">
										{room.description}
									</p>
								</div>

								<div className="space-y-2">
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
								</div>

								<div className="pt-2">
									<Button
										className="w-full"
										onClick={handleJoinRoom}
										disabled={room.currentPeople >= room.maxPeople}
									>
										Join Meetup
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AppShell>
	)
}
