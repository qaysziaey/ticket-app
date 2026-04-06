import { useNavigate } from "react-router-dom"
import { useAppContext } from "@/context/AppContext"
import {
  Plus, Trash2, Edit2, Calendar,
  MapPin, Copy
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { events, removeEvent } = useAppContext();
  const navigate = useNavigate();

  const handleCreate = () => navigate("/admin/events/new");
  const handleEdit = (id: string) => navigate(`/admin/events/edit/${id}`);
  const handleDuplicate = (id: string) => navigate(`/admin/events/new?duplicateFrom=${id}`);

  const handleDelete = (id: string) => {
    if (confirm("Delete this event? This cannot be undone.")) {
      removeEvent(id);
    }
  };

  return (
    <div className="flex-1 relative bg-background py-8 lg:py-12">
        {/* ── Header ── */}
        <div className="flex flex-wrap justify-between items-end gap-6 mb-12 px-8 lg:px-12">
          <div>
            <p className="text-xs font-black tracking-widest uppercase mb-2 text-accent">
              Management Portal
            </p>
            <h1 className="text-3xl font-medium tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2 font-medium">Monitoring {events.length} active events across the platform</p>
          </div>
          <Button
            onClick={handleCreate}
            className="flex items-center gap-2 px-8 h-14 rounded-full font-black text-sm bg-accent text-accent-foreground hover:brightness-110 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add New Event
          </Button>
        </div>

        {/* ── Events Table ── */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-transparent border-b border-border/30">
                  <th className="text-left px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground/60">Event Info</th>
                  <th className="text-left px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground/60 hidden md:table-cell">Category</th>
                  <th className="text-left px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground/60 hidden lg:table-cell">Date</th>
                  <th className="text-left px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground/60 hidden lg:table-cell">Location</th>
                  <th className="text-right px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-accent/[0.02] transition-colors group">
                    {/* Event name + image */}
                    <td className="px-8 py-6 relative">
                      <div 
                        className="absolute inset-y-0 left-0 w-56 z-0 pointer-events-none" 
                        style={{ WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent 90%)', maskImage: 'linear-gradient(to right, black 20%, transparent 90%)' }}
                      >
                         <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                      </div>
                      <div className="relative z-10 pl-24">
                        <p className="font-black text-base tracking-tight leading-tight mb-1">{event.title}</p>
                        {event.organizerName && (
                          <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-tight">{event.organizerName}</p>
                        )}
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-8 py-6 hidden md:table-cell">
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent text-accent-foreground">
                        {event.category || event.type}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-8 py-6 text-muted-foreground font-bold hidden lg:table-cell">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    {/* Location */}
                    <td className="px-8 py-6 text-muted-foreground font-medium hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent opacity-60" />
                        <span>{event.location}</span>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-accent/10 hover:text-accent transition-all"
                          onClick={() => handleEdit(event.id)}
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-accent/10 hover:text-accent transition-all"
                          onClick={() => handleDuplicate(event.id)}
                          title="Duplicate Event"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                          onClick={() => handleDelete(event.id)}
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                       <div className="flex flex-col items-center gap-4 opacity-40">
                          <Calendar className="w-16 h-16" />
                          <p className="font-bold uppercase tracking-widest text-xs">No events found on the platform</p>
                          <Button onClick={handleCreate} variant="outline" className="rounded-full px-8">Create your first event</Button>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
