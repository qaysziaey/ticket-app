import { AppEvent } from "@/data/mockData"
import { Heart, Ticket } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAppContext } from "@/context/AppContext"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: AppEvent;
  index?: number;
  variant?: "default" | "featured";
}

export default function EventCard({ event, index = 0, variant = "default" }: EventCardProps) {
  const { toggleFavorite, isFavorite } = useAppContext()
  const eventDate = new Date(event.date)
  
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  
  const isFav = isFavorite(event.id)

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ transition: { duration: 0.3 } }}
      >
        <div className="group relative overflow-hidden rounded-[16px] aspect-[4/5] border border-border/10 bg-card">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-1000"
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
            <div className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Featured Event
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); toggleFavorite(event.id); }}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-95",
                isFav ? "bg-accent text-accent-foreground" : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <Heart className={cn("w-4.5 h-4.5", isFav && "fill-current")} />
            </button>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <h3 className="text-white font-bold text-2xl sm:text-3xl leading-tight tracking-tight mb-2 uppercase">{event.title}</h3>
              <p className="text-white/60 text-xs sm:text-sm line-clamp-2 max-w-[95%]">
                {event.description || "Join us for an unforgettable experience featuring world-class performance and energy."}
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
             <div className="flex gap-4 sm:gap-6 flex-wrap opacity-80">
                <div className="flex items-center gap-2">
                  <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Date</p>
                  <p className="text-accent font-bold text-sm sm:text-base">{formattedDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Venue</p>
                  <p className="text-accent font-bold text-sm sm:text-base">{event.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Type</p>
                  <p className="text-accent font-bold text-sm sm:text-base">{event.type}</p>
                </div>
              </div>

              <Link to={`/events/${event.id}`} className="w-full sm:w-auto shrink-0">
                <button className="w-full sm:px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white text-black hover:bg-accent hover:text-accent-foreground transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2">
                  <Ticket className="w-3.5 h-3.5" /> Book Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ transition: { duration: 0.3 } }}
    >
      <div
        className="group relative flex flex-col h-full bg-transparent hover:bg-white dark:hover:bg-white/5 rounded-[16px] overflow-hidden transition-all duration-500 p-[6px]"
      >
        {/* Image portion */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[10px]">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-1000"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
             {event.isSoldOut ? (
                <div className="bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                   Sold Out
                </div>
             ) : (
                <div className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-[10px] font-bold">
                   ${event.price}
                </div>
             )}
          </div>
        </div>

        {/* Text portion */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
             <div className="flex justify-between items-start gap-4 mb-2.5">
                <h3 className="font-bold text-lg sm:text-xl tracking-tight leading-tight uppercase group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(event.id); }}
                  className={cn(
                    "w-8.5 h-8.5 shrink-0 rounded-full flex items-center justify-center transition-all active:scale-95",
                    isFav ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isFav && "fill-current")} />
                </button>
             </div>
             
             <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-6 opacity-80">
                {event.description || "Join us for an unforgettable experience featuring world-class performance and energy."}
             </p>
          </div>

          {/* Footer Actions / Metadata */}
          <div className="flex flex-col gap-5 mt-auto">
             <div className="flex flex-wrap gap-x-6 gap-y-3 opacity-90">
                <div>
                  <p className="font-bold text-xs sm:text-sm text-accent">{formattedDate}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">Date</p>
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-accent truncate max-w-[80px] sm:max-w-none">{event.location}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">Venue</p>
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-accent">{event.type}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">Type</p>
                </div>
             </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/events/${event.id}`} className="flex-1 sm:flex-initial">
                  <button className="w-full px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest bg-secondary text-secondary-foreground hover:bg-accent/10 hover:text-accent transition-all duration-300 whitespace-nowrap">
                    Details
                  </button>
                </Link>
                <Link to={`/events/${event.id}`} className="flex-1 sm:flex-initial">
                  <button 
                    disabled={event.isSoldOut}
                    className={cn(
                      "w-full px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5",
                      event.isSoldOut 
                        ? "bg-muted text-muted-foreground cursor-not-allowed" 
                        : "bg-black text-white dark:bg-accent dark:text-accent-foreground hover:bg-accent/90"
                    )}
                  >
                     <Ticket className="w-3 h-3" /> Book Now
                  </button>
                </Link>
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
