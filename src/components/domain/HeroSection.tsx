import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Calendar } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { AppEvent } from "@/data/mockData"

import { useNavigate, Link } from "react-router-dom"
import { cn } from "@/lib/utils"

/* ── Custom Date Picker ─────────────────────────────────── */
function CustomDatePicker({ date, setDate }: { date: string; setDate: (d: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formatDate = (d: string) => {
    if (!d) return "Select Date";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full h-full px-8 py-5 text-left transition-colors hover:bg-gray-50/50"
      >
        <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
        <span className={cn("text-sm font-medium", date ? "text-gray-900" : "text-gray-400")}>
          {formatDate(date)}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 bg-white rounded-3xl border border-gray-100 p-6 z-[100] min-w-[320px]"
          >
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                   <h4 className="text-sm font-medium uppercase tracking-widest text-gray-400">Select Date</h4>
                   <button onClick={() => setDate("")} className="text-xs font-medium text-accent hover:underline">Clear</button>
                </div>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => { setDate(e.target.value); setIsOpen(false); }}
                  className="w-full bg-secondary rounded-xl px-4 py-3 text-sm focus:outline-none [color-scheme:light]"
                />
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Choose a specific date to find events happening at that time. Leave empty to see all upcoming dates.
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Hero Search Bar ───────────────────────────────────── */
export function HeroSearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    navigate(`/events?${params.toString()}`);
  };

  const Divider = () => <div className="hidden md:block h-6 w-[1.5px] bg-gray-100/80 self-center opacity-50" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.55, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto mt-10 px-4"
    >
      <div className="rounded-[50px] flex flex-col md:flex-row overflow-hidden border border-gray-100 bg-white">
        
        {/* Location */}
        <div className="flex items-center gap-3 flex-1 px-8 py-5 transition-colors hover:bg-gray-50/50">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Country or Zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-transparent w-full text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none font-medium"
          />
        </div>

        <Divider />

        {/* Date */}
        <CustomDatePicker date={date} setDate={setDate} />

        <Divider />

        {/* Search */}
        <div className="flex items-center gap-3 flex-[1.2] px-8 py-5 transition-colors hover:bg-gray-50/50">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search events, venues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-transparent w-full text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none font-medium"
          />
        </div>

        {/* Search button */}
        <div className="p-2 flex shrink-0">
          <button
            onClick={handleSearch}
            className="px-10 rounded-full font-medium text-sm tracking-widest uppercase transition-all hover:brightness-110 active:scale-95 flex items-center justify-center min-h-[56px]"
            style={{ backgroundColor: "#bced09", color: "#100c08" }}
          >
            Search
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Custom card for the dense grid without borders
function HeroEventCard({ event }: { event: AppEvent }) {
  return (
    <Link to={`/events/${event.id}`} className="block relative group overflow-hidden w-[240px] sm:w-[320px] h-[160px] sm:h-[200px] shrink-0 border-0 rounded-none bg-muted">
      <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6 text-center">
        <h3 className="text-white font-medium text-[16px] tracking-tight mb-2 leading-tight">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-white/70 text-xs sm:text-sm line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function HeroSection() {
  const { events } = useAppContext();
  
  // Create continuous loop arrays
  const scrollEvents1 = events.slice(0, 8);
  const scrollEvents2 = events.slice(8, 16).length > 0 ? events.slice(8, 16) : events.slice(0, 8).reverse();
  const marqueeEvents1 = [...scrollEvents1, ...scrollEvents1, ...scrollEvents1];
  const marqueeEvents2 = [...scrollEvents2, ...scrollEvents2, ...scrollEvents2];

  return (
    <section className="relative w-full overflow-hidden bg-background pt-20 pb-0">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes marqueeReverse {
          0% { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0%); }
        }
        .marquee-track {
          display: flex;
          gap: 0;
          width: max-content;
          animation: marquee 50s linear infinite;
        }
        .marquee-track.reverse {
          animation: marqueeReverse 50s linear infinite;
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="marquee-container flex flex-col gap-0">
        <div className="marquee-track">
          {marqueeEvents1.map((event, i) => (
            <HeroEventCard key={`row1-${event.id}-${i}`} event={event} />
          ))}
        </div>
        <div className="marquee-track reverse">
          {marqueeEvents2.map((event, i) => (
            <HeroEventCard key={`row2-${event.id}-${i}`} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
