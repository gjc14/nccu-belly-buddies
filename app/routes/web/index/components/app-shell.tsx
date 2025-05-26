import type React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Menu, PlusCircle, Utensils } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'

import { CreateRoomForm } from './create-room-form'

interface AppShellProps {
	children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
	const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)

	return (
		<div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50">
			{/* Desktop Sidebar - Reduced width */}
			<aside className="hidden md:flex w-52 flex-col border-rborder-orange-200 bg-gradient-to-b from-orange-100 to-yellow-100 p-4 shadow-lg">
				<div className="flex items-center gap-2 mb-6 p-3 bg-white/70 rounded-xl shadow-sm">
					<Utensils className="h-5 w-5 text-black" />
					<h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">Belly Buddies</h1>
				</div>

				<nav className="space-y-3 mb-6">
					<Link
						to="/"
						className="flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-xl hover:bg-white/60 transition-all duration-200 text-orange-800 hover:shadow-sm"
					>
						Find Rooms
					</Link>
					<Link
						to="/my-rooms"
						className="flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-xl hover:bg-white/60 transition-all duration-200 text-orange-800 hover:shadow-sm"
					>
						My Rooms
					</Link>
				</nav>

				<div className="mt-auto">
					<Button
						onClick={() => setIsCreateRoomOpen(true)}
						className="w-full text-sm py-3 px-4 h-auto bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
					>
						
						<span className="text-lg mr-2">✨</span>
						Create Room
					</Button>
				</div>
			</aside>

			 {/* Mobile Sidebar - Enhanced */}
      <Sheet>
        <div className="md:hidden flex items-center p-4 border-b border-orange-200 bg-gradient-to-r from-orange-100 to-yellow-100">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 hover:bg-white/60">
              <Menu className="h-5 w-5 text-orange-700" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <div className="flex items-center gap-2">
            <div className="text-2xl">🍽️</div>
            <h1 className="font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Belly Buddies
            </h1>
          </div>
        </div>
        <SheetContent side="left" className="w-52 p-0 bg-gradient-to-b from-orange-100 to-yellow-100">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center gap-2 mb-6 p-3 bg-white/70 rounded-xl shadow-sm">
              <div className="text-2xl">🍽️</div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Belly Buddies
              </h1>
            </div>

            <nav className="space-y-3 mb-6">
              <Link
                to="/"
                className="flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-xl hover:bg-white/60 transition-all duration-200 text-orange-800"
              >
                <span className="text-lg">🔍</span>
                Find Rooms
              </Link>
              <Link
                to="/my-rooms"
                className="flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-xl hover:bg-white/60 transition-all duration-200 text-orange-800"
              >
                <span className="text-lg">🏠</span>
                My Rooms
              </Link>
            </nav>

            <div className="mt-auto">
              <Button
                onClick={() => setIsCreateRoomOpen(true)}
                className="w-full text-sm py-3 px-4 h-auto bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg"
              >
                <span className="text-lg mr-2">✨</span>
                Create Room
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content - Enhanced background */}
      <main className="flex-1 overflow-y-auto h-screen px-3 md:px-5 bg-gradient-to-br from-orange-50 to-yellow-50">
        {children}
      </main>

      {/* Create Room Dialog */}
      {isCreateRoomOpen && <CreateRoomForm isOpen={isCreateRoomOpen} onClose={() => setIsCreateRoomOpen(false)} />}
    </div>
  )
}

