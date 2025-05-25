import type React from 'react'
import { useState } from 'react'
import { useFetcher } from 'react-router'

import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

interface CreateRoomFormProps {
	isOpen: boolean
	onClose: () => void
}

export function CreateRoomForm({ isOpen, onClose }: CreateRoomFormProps) {
	const fetcher = useFetcher()
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
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		const submitData = {
			groupName: formData.groupName,
			groupDescription: formData.groupDescription,
			restaurantID: formData.restaurantID,
			status: formData.status,
			proposedBudget: formData.proposedBudget,
			foodPreference: formData.foodPreference,
			numofPeople: formData.numofPeople, // Will be sent as string
			startTime: `${formData.date}T${formData.time}`, // Combined date and time
			spokenLanguage: formData.spokenLanguage,
		}

		fetcher.submit(submitData, {
			method: 'post',
			action: '/api/group/create', // Kept existing action
		})

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false)
			toast('Room created! Your room has been created successfully.')
			onClose()
		}, 1000)
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
				<form onSubmit={handleSubmit}>
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
							{/* TODO: 從後端取得餐廳 */}
							<Label htmlFor="restaurantID">Restaurant ID</Label>{' '}
							{/* New Field */}
							<Input
								id="restaurantID"
								name="restaurantID"
								value={formData.restaurantID}
								onChange={handleChange}
								required // Assuming this is required by API
							/>
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
				</form>
			</DialogContent>
		</Dialog>
	)
}
