import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Artist } from "@/data/mockData"

interface ArtistCardProps {
  artist: Artist;
  index?: number;
  variant?: "circle" | "card";
}

export default function ArtistCard({ artist, index = 0, variant = "circle" }: ArtistCardProps) {
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.07 }}
        whileHover={{ transition: { duration: 0.3 } }}
      >
        <Link to={`/artists/${artist.id}`} className="group block">
          <div className="relative overflow-hidden rounded-[16px] aspect-[4/5] border border-border/10 bg-card">
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4">
              <h3 className="text-white font-bold text-2xl leading-tight tracking-tight uppercase group-hover:text-accent transition-colors">
                {artist.name}
              </h3>
              
              <div className="flex gap-6 sm:gap-8 flex-wrap">
                <div>
                  <p className="text-white font-bold text-sm">{artist.genre}</p>
                  <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold mt-1">Genre</p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{artist.followers}</p>
                  <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold mt-1">Followers</p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{artist.country}</p>
                  <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold mt-1">Country</p>
                </div>
              </div>
            </div>
            
            {/* Top Tag */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/10 text-white">
                Artist
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link to={`/artists/${artist.id}`} className="group flex flex-col items-center text-center w-32 shrink-0">
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 transition-all duration-500 group-hover:scale-110 ring-2 ring-transparent group-hover:ring-accent group-hover:ring-offset-4 bg-secondary">
          <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>
        <h4 className="font-medium text-xs uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-accent transition-colors">{artist.name}</h4>
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">{artist.genre}</p>
      </Link>
    </motion.div>
  );
}
