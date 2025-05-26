import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Form, useFetcher } from 'react-router'

import { Loader } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { restaurant } from '~/lib/db/schema'

import type { loader } from '../../api/restaurant'

interface CreateRoomFormProps {
	isOpen: boolean
	onClose: () => void
}

export function CreateRoomForm({ isOpen, onClose }: CreateRoomFormProps) {
	const fetcher = useFetcher()
	const loadFetcher = useFetcher<typeof loader>()
	const [formData, setFormData] = useState({
		groupName: '', // Changed from restaurantName
		groupDescription: '', // Changed from description
		restaurantID: '', // New field
		status: 'active', // New field, default 'active'
		proposedBudget: '', // New field
		foodPreference: '', // New field
		numofPeople: 4, // Changed from maxPeople
		date: '',
		time: '',
		spokenLanguage: '', // New field
	})
	const [restaurants, setRestaurants] = useState<
		(typeof restaurant.$inferSelect)[]
	>([]) // New state for restaurants
	const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
		null,
	) // id
	const restaurantFetchedRef = useRef(false)

	const isSubmitting = fetcher.state === 'submitting'
	const isLoading = loadFetcher.state === 'loading'

	useEffect(() => {
		console.log('Loaded restaurants:', loadFetcher.data)
		if (loadFetcher.data) {
			setRestaurants(loadFetcher.data?.restaurants || [])
		}
	}, [loadFetcher.data])

	const fetchRestaurants = () => {
		if (restaurantFetchedRef.current) return // Prevent multiple fetches
		restaurantFetchedRef.current = true
		loadFetcher.load('/api/restaurant/all') // Load restaurants from the API
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const submitData = {
			groupName: formData.groupName,
			groupDescription: formData.groupDescription,
			restaurantID: selectedRestaurant,
			status: formData.status,
			proposedBudget: formData.proposedBudget,
			foodPreference: formData.foodPreference,
			numofPeople: formData.numofPeople, // Will be sent as string
			startTime: `${formData.date}T${formData.time}`, // Combined date and time
			spokenLanguage: formData.spokenLanguage,
		}

		fetcher.submit(submitData, {
			method: 'post',
			action: '/api/group/create', // Kept existing action, use `create` as id
		})
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Create a new room</DialogTitle>
					<DialogDescription>
						Set up a restaurant meetup for others to join.
					</DialogDescription>
				</DialogHeader>
				<Form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="groupName">Group Name</Label>{' '}
							{/* Changed from restaurantName */}
							<Input
								id="groupName"
								name="groupName" // Changed from restaurantName
								value={formData.groupName}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="groupDescription">Description</Label>{' '}
							{/* Changed from description */}
							<Textarea
								id="groupDescription"
								name="groupDescription" // Changed from description
								value={formData.groupDescription}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="restaurantID">
								Restaurant {!!selectedRestaurant && ': '}
								{!!selectedRestaurant &&
									(restaurants.find(
										restaurant => restaurant.id === selectedRestaurant,
									)?.name ||
										'查無餐廳')}
							</Label>{' '}
							<Dialog>
								<DialogTrigger asChild>
									<Button onClick={fetchRestaurants}>選擇餐廳</Button>
								</DialogTrigger>
								<DialogContent className="max-h-[80vh] overflow-y-auto">
									<DialogHeader>
										<DialogTitle>點擊選擇餐廳</DialogTitle>
										<DialogDescription></DialogDescription>
										<div className="flex flex-col space-y-2">
											{isLoading ? (
												<Loader className="animate-spin" />
											) : restaurants.length > 0 ? (
												<ul className="space-y-2">
													{restaurants.map(restaurant => (
														<DialogClose key={restaurant.id} asChild>
															<li>
																<Card
																	onClick={() => {
																		setSelectedRestaurant(restaurant.id)
																	}}
																	className="cursor-pointer hover:shadow-lg"
																>
																	<CardHeader>
																		<CardTitle>{restaurant.name}</CardTitle>
																		{restaurant.description && (
																			<CardDescription>
																				{restaurant.description}
																			</CardDescription>
																		)}
																	</CardHeader>
																	<CardContent>
																		<p>{restaurant.address}</p>
																	</CardContent>
																	{restaurant.phone && (
																		<CardFooter>
																			<p>{restaurant.phone}</p>
																		</CardFooter>
																	)}
																</Card>
															</li>
														</DialogClose>
													))}
												</ul>
											) : (
												<p>No restaurants available</p>
											)}
										</div>
									</DialogHeader>
								</DialogContent>
							</Dialog>
						</div>
						{/* Removed Location field, API uses restaurantID */}
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="date">Date</Label>
								<Input
									id="date"
									name="date"
									type="date"
									value={formData.date}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="time">Time</Label>
								<Input
									id="time"
									name="time"
									type="time"
									value={formData.time}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="numofPeople">Maximum People</Label>{' '}
							{/* Changed from maxPeople */}
							<Input
								id="numofPeople"
								name="numofPeople" // Changed from maxPeople
								type="number"
								min="2"
								max="20" // Max can be adjusted based on requirements
								value={formData.numofPeople}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="proposedBudget">Proposed Budget</Label>{' '}
							{/* New Field */}
							<Input
								id="proposedBudget"
								name="proposedBudget"
								value={formData.proposedBudget}
								onChange={handleChange}
								// required based on API - assuming not strictly required for now
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="foodPreference">Food Preference</Label>{' '}
							{/* New Field */}
							<Input
								id="foodPreference"
								name="foodPreference"
								value={formData.foodPreference}
								onChange={handleChange}
								// required based on API - assuming not strictly required for now
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="spokenLanguage">Spoken Language</Label>{' '}
							{/* New Field */}
							<Input
								id="spokenLanguage"
								name="spokenLanguage"
								value={formData.spokenLanguage}
								onChange={handleChange}
								// required based on API - assuming not strictly required for now
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Creating...' : 'Create Room'}
						</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
