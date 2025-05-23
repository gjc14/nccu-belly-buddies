import type React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Menu, PlusCircle, Utensils } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'

import { CreateRoomForm } from '../components/create-room-form'

interface AppShellProps {
	children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
	const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Desktop Sidebar - Reduced width */}
			<aside className="hidden md:flex w-52 flex-col border-r bg-muted/40 p-4">
				<div className="flex items-center gap-2 mb-6">
					<Utensils className="h-5 w-5" />
					<h1 className="text-lg font-bold">Belly Buddies</h1>
				</div>

				<nav className="space-y-2 mb-6">
					<Link
						to="/"
						className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-muted"
					>
						Find Rooms
					</Link>
					<Link
						to="/my-rooms"
						className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-muted"
					>
						My Rooms
					</Link>
				</nav>

				<div className="mt-auto">
					<Button
						onClick={() => setIsCreateRoomOpen(true)}
						className="w-full text-sm py-1 px-2 h-auto"
					>
						<PlusCircle className="h-3.5 w-3.5 mr-1.5" />
						Create Room
					</Button>
				</div>
			</aside>

			{/* Mobile Sidebar */}
			<Sheet>
				<div className="md:hidden flex items-center p-4 border-b">
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="mr-2">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<div className="flex items-center gap-2">
						<Utensils className="h-5 w-5" />
						<h1 className="font-bold">Belly Buddies</h1>
					</div>
				</div>
				<SheetContent side="left" className="w-52 p-0">
					<div className="flex flex-col h-full p-4">
						<div className="flex items-center gap-2 mb-6">
							<Utensils className="h-5 w-5" />
							<h1 className="text-lg font-bold">Belly Buddies</h1>
						</div>

						<nav className="space-y-2 mb-6">
							<Link
								to="/"
								className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-muted"
							>
								Find Rooms
							</Link>
							<Link
								to="/my-rooms"
								className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-muted"
							>
								My Rooms
							</Link>
						</nav>

						<div className="mt-auto">
							<Button
								onClick={() => setIsCreateRoomOpen(true)}
								className="w-full text-sm py-1 px-2 h-auto"
							>
								<PlusCircle className="h-3.5 w-3.5 mr-1.5" />
								Create Room
							</Button>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Main Content */}
			<main className="flex-1 overflow-y-auto h-screen">{children}</main>

			{/* Create Room Dialog */}
			{isCreateRoomOpen && (
				<CreateRoomForm
					isOpen={isCreateRoomOpen}
					onClose={() => setIsCreateRoomOpen(false)}
				/>
			)}
		</div>
	)
}
