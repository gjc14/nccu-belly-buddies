// hello-world/pages/RestaurantDetails.tsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { NavBar } from "../components/NavBar"
import { Footer } from "../components/Footer"
import { theme } from "../lib/theme"
import { mockRestaurants, mockRooms } from "../data/mockData"
import type { Room, Restaurant } from "../types"

export function RestaurantDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find the room
    const foundRoom = mockRooms.find((r) => r.id === id)

    if (foundRoom) {
      setRoom(foundRoom)

      // Find the restaurant
      const foundRestaurant = mockRestaurants[foundRoom.restaurantId]
      if (foundRestaurant) {
        setRestaurant(foundRestaurant)
      }
    }

    setLoading(false)
  }, [id])

  const handleJoinRoom = () => {
    if (room) {
      // Save to localStorage for My Rooms
      try {
        const existingRooms = JSON.parse(localStorage.getItem("myRooms") || "[]")
        if (!existingRooms.some((r: Room) => r.id === room.id)) {
          localStorage.setItem("myRooms", JSON.stringify([...existingRooms, { ...room, isHost: false }]))
        }
      } catch (error) {
        console.error("Error saving joined room:", error)
      }

      alert(`Joined ${room.restaurantName}!`)
    }
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <main style={{ background: theme.colors.background }}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-2xl animate-bounce" style={{ color: theme.colors.primary }}>
                Loading...
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!room || !restaurant) {
    return (
      <>
        <NavBar />
        <main style={{ background: theme.colors.background }}>
          <div className="container mx-auto px-4 py-8">
            <div
              className="p-8 rounded-lg text-center"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.secondary}20, ${theme.colors.primary}20)`,
                border: `2px dashed ${theme.colors.secondary}`,
              }}
            >
              <div className="text-6xl mb-4">😢</div>
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
                Restaurant not found
              </h2>
              <button
                className="px-4 py-2 rounded-full text-white font-medium"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onClick={() => navigate("/hello-world")}
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <NavBar />
      <main style={{ background: theme.colors.background }}>
        <div className="container mx-auto px-4 py-8">
          <button
            className="mb-6 flex items-center text-sm font-medium"
            style={{ color: theme.colors.primary }}
            onClick={() => navigate(-1)}
          >
            <span className="mr-1">←</span>
            Back
          </button>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Restaurant Details */}
            <div className="md:col-span-2">
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-200"
                style={{
                  background: `linear-gradient(135deg, white 85%, ${theme.colors.secondary} 100%)`,
                }}
              >
                <div className="p-6 border-b border-yellow-100 relative">
                  <div className="absolute top-4 right-4 text-6xl opacity-20">{restaurant.image}</div>
                  <h2 className="text-2xl font-bold mb-1" style={{ color: theme.colors.text }}>
                    {restaurant.name}
                  </h2>
                  <p className="text-sm" style={{ color: theme.colors.muted }}>
                    {restaurant.cuisine} • {restaurant.priceRange}
                  </p>
                </div>
                <div className="p-6 space-y-6" style={{ background: "rgba(255,255,255,0.7)" }}>
                  <div>
                    <h3 className="font-bold mb-2" style={{ color: theme.colors.primary }}>
                      Restaurant Information
                    </h3>
                    <p style={{ color: theme.colors.text }}>{restaurant.description}</p>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center text-sm">
                      <span className="mr-2 opacity-70">📍</span>
                      <span style={{ color: theme.colors.text }}>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2 opacity-70">🕒</span>
                      <span style={{ color: theme.colors.text }}>Open: {restaurant.openingHours}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2 opacity-70">📞</span>
                      <span style={{ color: theme.colors.text }}>{restaurant.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full text-sm font-medium inline-flex items-center"
                      style={{
                        background: `${theme.colors.secondary}30`,
                        color: theme.colors.primary,
                        border: `1px solid ${theme.colors.secondary}`,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Website
                      <span className="ml-1">↗️</span>
                    </a>
                    <a
                      href={restaurant.menuLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full text-sm font-medium inline-flex items-center"
                      style={{
                        background: `${theme.colors.secondary}30`,
                        color: theme.colors.primary,
                        border: `1px solid ${theme.colors.secondary}`,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Menu
                      <span className="ml-1">🍽️</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Meetup Details */}
            <div>
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-200 h-full"
                style={{
                  background: `linear-gradient(135deg, white 85%, ${theme.colors.secondary} 100%)`,
                }}
              >
                <div
                  className="p-4 border-b border-yellow-100"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}30)`,
                  }}
                >
                  <h3 className="font-bold text-lg" style={{ color: theme.colors.text }}>
                    Meetup Details
                  </h3>
                  <p className="text-sm" style={{ color: theme.colors.muted }}>
                    Organized by {room.host.name}
                  </p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-full mr-3 flex items-center justify-center text-white font-bold text-lg"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {room.host.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: theme.colors.text }}>
                        {room.host.name}
                      </p>
                      <p className="text-sm" style={{ color: theme.colors.muted }}>
                        Host
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1" style={{ color: theme.colors.primary }}>
                      Description
                    </h4>
                    <p className="text-sm" style={{ color: theme.colors.text }}>
                      {room.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="mr-2 opacity-70">🕒</span>
                      <span style={{ color: theme.colors.text }}>{room.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2 opacity-70">👥</span>
                      <span style={{ color: theme.colors.text }}>
                        {room.currentPeople} / {room.maxPeople} people
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      className="w-full py-2 rounded-full text-white font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                      onClick={handleJoinRoom}
                      disabled={room.currentPeople >= room.maxPeople}
                    >
                      {room.currentPeople >= room.maxPeople ? "Meetup Full" : "Join Meetup"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}