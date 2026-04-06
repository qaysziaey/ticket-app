import { useState } from "react"
import { useAppContext } from "@/context/AppContext"
import EventCard from "@/components/domain/EventCard"
import { Search } from "lucide-react"

export default function AllEvents() {
  const { events } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 flex-1">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">All Events</h1>
          <p className="text-muted-foreground text-lg">Explore all upcoming events globally.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border border-border/50 rounded-full bg-secondary/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm transition-all"
            placeholder="Search events, locations, or types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-24 text-muted-foreground">
          No events found for "{searchQuery}".
        </div>
      )}
    </div>
  )
}
