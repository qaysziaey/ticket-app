import React from "react"
import { useParams, Link } from "react-router-dom"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EventDetails() {
  const { id } = useParams<{ id: string }>()
  const { events, addTicketToCart } = useAppContext()
  const event = events.find(e => e.id === id)
  const [isAdded, setIsAdded] = React.useState(false)

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Link to="/events"><Button>Back to Events</Button></Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addTicketToCart(event)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const eventDate = new Date(event.date)
  const isPast = eventDate.getTime() < new Date().getTime()

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 flex-1">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Left Col - Image */}
        <div className="lg:w-2/3">
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8 border border-border/10">
             <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                 {event.tags.map(tag => (
                   <Badge key={tag} className="bg-background/80 backdrop-blur text-foreground hover:bg-background/90 text-sm">
                     {tag}
                   </Badge>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
             <div>
               <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{event.title}</h1>
             </div>

             <div>
               <h3 className="text-2xl font-semibold mb-4">About this Event</h3>
               <p className="text-lg text-muted-foreground whitespace-pre-wrap leading-relaxed">Join us for an unforgettable experience at the {event.title}. Don't miss out on this amazing opportunity with the best artists in the world.</p>
             </div>

             <div>
               <h3 className="text-2xl font-semibold mb-6">Lineup</h3>
               <div className="flex gap-6 flex-wrap">
                  {event.artists.map(artist => (
                    <div key={artist.id} className="flex items-center gap-4 group">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <span className="font-medium text-lg">{artist.name}</span>
                    </div>
                  ))}
               </div>
             </div>
           </div>
        </div>

        {/* Right Col - Info & CTA */}
        <div className="lg:w-1/3">
          <div className="sticky top-28">
             {/* THE TICKET */}
             <div className="relative flex flex-col rounded-[24px] overflow-hidden shadow-2xl shadow-black/10">
               {/* TOP SECTION */}
               <div className="bg-accent text-black p-8 pb-10">
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">AuraTickets presents</p>
                 <h2 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight mb-8">
                   {event.title}
                 </h2>
                 <div className="space-y-5">
                   <div>
                     <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-0.5">Timing</p>
                     <p className="text-lg font-bold">
                       {eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric'})}, {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                     </p>
                   </div>
                   <div>
                     <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-0.5">Venue</p>
                     <p className="text-lg font-bold leading-tight">{event.location}, {event.country}</p>
                   </div>
                 </div>
               </div>

               {/* SEPARATOR */}
               <div className="relative h-8 bg-accent">
                  <div className="absolute inset-0 bg-black/[0.04]" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 border-t-[2px] border-dashed border-black/20" />
                  <div className="absolute left-[-16px] top-0 w-8 h-8 rounded-full bg-background" />
                  <div className="absolute right-[-16px] top-0 w-8 h-8 rounded-full bg-background" />
               </div>

               {/* MIDDLE SECTION */}
               <div className="relative bg-accent text-black p-8 pt-4">
                 <div className="absolute inset-0 bg-black/[0.04]" />
                 <div className="relative z-10">
                   <div className="flex justify-between items-end mb-6">
                     <div>
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-0.5">Attendee</p>
                       <p className="text-xl font-bold tracking-tight">General Admission</p>
                     </div>
                     <p className="text-xl font-black opacity-20">VIP</p>
                   </div>
                   
                   <div className="flex justify-between items-center text-center">
                     <div className="text-left">
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1">Section</p>
                       <p className="text-lg font-bold">GEN</p>
                     </div>
                     <div className="text-center">
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1">Row</p>
                       <p className="text-lg font-bold">ADM</p>
                     </div>
                     <div className="text-center">
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1">Seat</p>
                       <p className="text-lg font-bold">--</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1">Price</p>
                       <p className="text-lg font-bold tracking-tight">${event.price}</p>
                     </div>
                   </div>
                 </div>
               </div>

               {/* BOTTOM SECTION (QR CODE) */}
               <div className="bg-[#f4f4f4] text-black py-8 px-6 flex flex-col items-center justify-center border-t border-black/5">
                 <div className="bg-white p-3 rounded-xl shadow-sm border border-black/5 mb-4">
                   <QrCode className="w-20 h-20 text-black/80" strokeWidth={1.5} />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">Scan at Entrance</p>
               </div>
             </div>

             {/* CTA Buttons */}
             <div className="mt-8 flex flex-col gap-3">
                <Button 
                  size="lg" 
                  className={cn(
                    "w-full h-14 font-bold text-base rounded-full transition-all duration-300",
                    isAdded ? "bg-emerald-500 hover:bg-emerald-600 text-white" : 
                    event.isSoldOut ? "bg-muted text-muted-foreground" :
                    "bg-accent text-accent-foreground hover:brightness-110 shadow-lg shadow-accent/20"
                  )} 
                  disabled={isPast || isAdded || event.isSoldOut}
                  onClick={handleAddToCart}
                >
                  {isPast ? "Event Ended" : event.isSoldOut ? "Tickets Sold Out" : isAdded ? "Added to Cart ✓" : "Buy Tickets"}
                </Button>
                <Button variant="outline" size="lg" className="w-full h-14 rounded-full gap-2 border-border/50 font-bold bg-card">
                  <Share className="w-4 h-4" /> Share Event
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
