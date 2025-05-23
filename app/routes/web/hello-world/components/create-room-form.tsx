import type React from 'react'
import { useState } from 'react'

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
	const [formData, setFormData] = useState({
		restaurantName: '',
		description: '',
		location: '',
		date: '',
		time: '',
		maxPeople: '4',
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

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false)
			toast('Room created! Your room has been created successfully.')
			onClose()
		}, 1000)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a new room</DialogTitle>
					<DialogDescription>
						Set up a restaurant meetup for others to join.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="restaurantName">Restaurant Name</Label>
							<Input
								id="restaurantName"
								name="restaurantName"
								value={formData.restaurantName}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								name="location"
								value={formData.location}
								onChange={handleChange}
								required
							/>
						</div>
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
							<Label htmlFor="maxPeople">Maximum People</Label>
							<Input
								id="maxPeople"
								name="maxPeople"
								type="number"
								min="2"
								max="20"
								value={formData.maxPeople}
								onChange={handleChange}
								required
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
