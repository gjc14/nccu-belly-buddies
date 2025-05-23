import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { Clock, Edit, MapPin, MessageSquare, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '~/components/ui/alert-dialog'
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

// Mock data for my rooms (host rooms)
const mockHostRooms = [
	{
		id: '5',
		restaurantName: 'Pizza Place',
		description: 'Friday night pizza and games!',
		location: '555 Maple Dr, Southside',
		time: 'Friday, 8:00 PM',
		maxPeople: 6,
		currentPeople: 2,
		isHost: true,
		restaurantInfo: {
			description:
				'Artisanal pizza with wood-fired oven and craft beer selection.',
			menuLink: 'https://example.com/pizza-place-menu',
		},
	},
]

// Load joined rooms from localStorage
const loadJoinedRooms = () => {
	try {
		return JSON.parse(localStorage.getItem('myRooms') || '[]')
	} catch (error) {
		console.error('Error loading joined rooms:', error)
		return []
	}
}

export function MyRoomsList() {
	const navigate = useNavigate()
	const [myRooms, setMyRooms] = useState<any[]>([])
	const [roomToDelete, setRoomToDelete] = useState<string | null>(null)

	// Load rooms on component mount
	useEffect(() => {
		const joinedRooms = loadJoinedRooms()
		setMyRooms([...mockHostRooms, ...joinedRooms])
	}, [])

	const handleLeaveRoom = (e: any, roomId: string) => {
		e.stopPropagation() // Prevent card click

		// Remove from state
		const updatedRooms = myRooms.filter(room => room.id !== roomId)
		setMyRooms(updatedRooms)

		// Update localStorage (only for joined rooms, not host rooms)
		try {
			const joinedRooms = loadJoinedRooms().filter(
				(room: any) => room.id !== roomId,
			)
			localStorage.setItem('myRooms', JSON.stringify(joinedRooms))
		} catch (error) {
			console.error('Error updating localStorage:', error)
		}

		toast("Left room! You've successfully left the room.")
	}

	const handleDeleteRoom = () => {
		if (roomToDelete) {
			setMyRooms(myRooms.filter(room => room.id !== roomToDelete))
			setRoomToDelete(null)
			toast('Room deleted Your room has been deleted successfully.')
		}
	}

	const handleCardClick = (roomId: string) => {
		navigate(`/restaurant/${roomId}`)
	}

	const handleCommentClick = (e: any) => {
		e.stopPropagation() // Prevent card click
		toast('Comment Restaurant review feature coming soon!')
	}

	const handleEditClick = (e: any) => {
		e.stopPropagation() // Prevent card click
		toast('Edit Edit room feature coming soon!')
	}

	if (myRooms.length === 0) {
		return (
			<div className="text-center py-12">
				<h3 className="text-lg font-medium mb-2">
					You haven't joined any rooms yet
				</h3>
				<p className="text-muted-foreground mb-6">
					Join a room or create your own to get started
				</p>
				<Button onClick={() => navigate('/')}>Browse Rooms</Button>
			</div>
		)
	}

	return (
		<>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{myRooms.map(room => (
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
									{room.host ? (
										<Avatar>
											<AvatarImage
												src={room.host.avatar || '/placeholder.svg'}
												alt={room.host.name}
											/>
											<AvatarFallback>
												{room.host.name?.charAt(0) || 'U'}
											</AvatarFallback>
										</Avatar>
									) : (
										<Avatar>
											<AvatarFallback>U</AvatarFallback>
										</Avatar>
									)}
									<span className="text-xs text-muted-foreground mt-1">
										{room.isHost ? 'You' : 'Host'}
									</span>
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
								onClick={handleCommentClick}
							>
								<MessageSquare className="mr-1 h-4 w-4" />
								Comment
							</Button>

							{room.isHost ? (
								<div className="flex gap-2" onClick={e => e.stopPropagation()}>
									<Button variant="outline" size="sm" onClick={handleEditClick}>
										<Edit className="h-4 w-4 mr-1" />
										Edit
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={e => {
											e.stopPropagation()
											setRoomToDelete(room.id)
										}}
									>
										<Trash2 className="h-4 w-4 mr-1" />
										Delete
									</Button>
								</div>
							) : (
								<Button
									variant="destructive"
									onClick={e => handleLeaveRoom(e, room.id)}
								>
									Leave Room
								</Button>
							)}
						</CardFooter>
					</Card>
				))}
			</div>

			<AlertDialog
				open={!!roomToDelete}
				onOpenChange={() => setRoomToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete this room and remove all
							participants. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteRoom}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
