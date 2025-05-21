// hello-world/pages/Home.tsx
import { NavBar } from "../components/NavBar"
import { Footer } from "../components/Footer"
import { RoomList } from "../components/RoomList"
import { theme } from "../lib/theme"

export function Home() {
  return (
    <>
      <NavBar />
      <main style={{ background: theme.colors.background }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <div className="text-4xl mr-3" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))" }}>
              🍽️
            </div>
            <h1
              className="text-3xl font-bold"
              style={{
                color: theme.colors.text,
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Available Rooms
            </h1>
          </div>
          <RoomList />
        </div>
      </main>
      <Footer />
    </>
  )
}