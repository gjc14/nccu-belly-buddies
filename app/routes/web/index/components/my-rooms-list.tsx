import { useEffect, useState } from 'react'
import { useNavigate, useSubmit } from 'react-router'

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
import { authClient } from '~/lib/auth/auth-client'

import type { Room } from './room-list'

export function MyRoomsList({ rooms }: { rooms: Room[] }) {
	const navigate = useNavigate()
	const submit = useSubmit()
	const { data } = authClient.useSession()
	const [roomToDelete, setRoomToDelete] = useState<string | null>(null)

	const handleLeaveRoom = (roomId: string) => {
		submit(
			{},
			{
				action: `/api/membership/${roomId}`,
				method: 'delete',
				navigate: false,
			},
		)
	}

	const handleDeleteRoom = () => {
		submit(
			{ action: 'delete' },
			{
				action: `/api/group/${roomToDelete}`,
				method: 'delete',
				navigate: false,
			},
		)
	}

	const handleCardClick = (room: Room) => {
		navigate(`/restaurant/${room.id}`, {
			state: room,
		})
	}

	const handleCommentClick = (e: any) => {
		e.stopPropagation() // Prevent card click
		toast('Comment Restaurant review feature coming soon!')
	}

	const handleEditClick = (e: any) => {
		e.stopPropagation() // Prevent card click
		toast('Edit Edit room feature coming soon!')
	}

	if (rooms.length === 0) {
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
				{rooms.map(room => (
					<Card
						key={room.id}
						className="overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
						onClick={() => handleCardClick(room)}
					>
						<CardHeader className="pb-3">
							<div className="flex justify-between items-start">
								<div>
									<CardTitle>{room.name}</CardTitle>
									<CardDescription className="mt-1">
										{room.description}
									</CardDescription>
								</div>
								<div className="flex flex-col items-center">
									{room.creator ? (
										<Avatar>
											<AvatarImage
												src={room.creator.image || '/placeholders/avatar.png'}
												alt={room.creator.name}
											/>
											<AvatarFallback>
												{room.creator.name?.charAt(0) || 'U'}
											</AvatarFallback>
										</Avatar>
									) : (
										<Avatar>
											<AvatarFallback>U</AvatarFallback>
										</Avatar>
									)}
									<span className="text-xs text-muted-foreground mt-1">
										{room.creatorId === data?.user.id ? 'You' : 'Host'}
									</span>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-3 flex-1">
							<div className="flex items-center text-sm">
								<MapPin className="mr-2 h-4 w-4 opacity-70" />
								<span>{room.restaurant?.address}</span>
							</div>
							<div className="flex items-center text-sm">
								<Clock className="mr-2 h-4 w-4 opacity-70" />
								<span>{room.startTime?.toDateString()}</span>
							</div>
							<div className="flex items-center text-sm">
								<Users className="mr-2 h-4 w-4 opacity-70" />
								<span>
									{room.groupMembers.length} / {room.numofPeople} people
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

							{room.creatorId === data?.user.id ? (
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
									onClick={e => {
										e.stopPropagation()
										handleLeaveRoom(room.id)
									}}
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
