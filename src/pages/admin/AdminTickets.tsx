import { useAppContext } from "@/context/AppContext"
import { DollarSign, Ticket, Activity, TrendingUp } from "lucide-react"

export default function AdminTickets() {
  const { events } = useAppContext()

  // Calculate global metrics
  let totalRevenue = 0
  let totalSold = 0
  let totalCapacity = 0

  const eventsWithTickets = events.map(event => {
    let eventRevenue = 0
    let eventSold = 0
    let eventCapacity = 0

    if (event.ticketTiers) {
      event.ticketTiers.forEach(tier => {
        eventRevenue += tier.price * tier.soldQuantity
        eventSold += tier.soldQuantity
        eventCapacity += tier.totalQuantity
      })
    }

    totalRevenue += eventRevenue
    totalSold += eventSold
    totalCapacity += eventCapacity

    return {
      ...event,
      metrics: { eventRevenue, eventSold, eventCapacity },
      fillRate: eventCapacity > 0 ? (eventSold / eventCapacity) * 100 : 0
    }
  })

  // Sort events by revenue
  eventsWithTickets.sort((a, b) => b.metrics.eventRevenue - a.metrics.eventRevenue)

  const overallFillRate = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0

  return (
    <div className="flex-1 overflow-auto bg-background p-8 lg:p-12">
      <div className="mb-12">
        <p className="text-xs font-black tracking-widest uppercase mb-2 text-accent">Ticketing Hub</p>
        <h1 className="text-3xl font-medium tracking-tight">Ticket Sales Insight</h1>
        <p className="text-muted-foreground mt-2 font-medium">Real-time overview of seating capacity and revenue.</p>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +14.5%
            </span>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Gross Revenue</p>
            <p className="text-4xl font-black tracking-tighter">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <Ticket className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Tickets Sold</p>
            <p className="text-4xl font-black tracking-tighter">{totalSold.toLocaleString()} <span className="text-xl text-muted-foreground font-medium">/ {totalCapacity.toLocaleString()}</span></p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <div>
             <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Avg Fill Rate</p>
             <p className="text-4xl font-black tracking-tighter">{overallFillRate.toFixed(1)}%</p>
             <div className="w-full bg-secondary h-2 rounded-full mt-4 overflow-hidden">
               <div className="bg-accent h-full rounded-full" style={{ width: `${overallFillRate}%` }} />
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-12">
        {/* Left Col: Event Tiers */}
        <div className="xl:w-2/3">
           <h2 className="text-xl font-bold mb-6">Event Performance</h2>
           <div className="space-y-6">
             {eventsWithTickets.map(event => (
                <div key={event.id} className="bg-card border border-border rounded-2xl p-6">
                   <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm">
                           <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-lg leading-tight mb-1">{event.title}</p>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Generated</p>
                        <p className="text-2xl font-black tracking-tight">${event.metrics.eventRevenue.toLocaleString()}</p>
                     </div>
                   </div>

                   <div className="space-y-5">
                     {event.ticketTiers && event.ticketTiers.length > 0 ? event.ticketTiers.map(tier => {
                       const tierFill = tier.totalQuantity > 0 ? (tier.soldQuantity / tier.totalQuantity) * 100 : 0;
                       return (
                         <div key={tier.id}>
                           <div className="flex justify-between items-end mb-2 text-sm font-medium">
                              <p>{tier.name} <span className="opacity-50 ml-1">(${tier.price})</span></p>
                              <p className="font-bold">{tier.soldQuantity} <span className="text-muted-foreground text-xs font-normal">/ {tier.totalQuantity}</span></p>
                           </div>
                           <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${tierFill >= 100 ? 'bg-emerald-500' : 'bg-foreground'}`} 
                                style={{ width: `${tierFill}%` }} 
                              />
                           </div>
                         </div>
                       )
                     }) : (
                        <p className="text-sm text-muted-foreground italic">No ticket tiers configured for this event.</p>
                     )}
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* Right Col: Recent Sales */}
        <div className="xl:w-1/3">
           <div className="sticky top-12">
             <h2 className="text-xl font-bold mb-6">Recent Sales</h2>
             <div className="bg-card border border-border rounded-2xl p-6">
                <div className="space-y-6">
                  {[
                    { id: 1, name: "Alexander K.", amount: 240, time: "2 mins ago", tier: "VIP Floor" },
                    { id: 2, name: "Sarah M.", amount: 65, time: "18 mins ago", tier: "General Admission" },
                    { id: 3, name: "Michael T.", amount: 150, time: "1 hour ago", tier: "Grand Circle" },
                    { id: 4, name: "Emma H.", amount: 130, time: "3 hours ago", tier: "Premium" },
                    { id: 5, name: "David L.", amount: 250, time: "5 hours ago", tier: "Backstage Pass" },
                  ].map((sale) => (
                    <div key={sale.id} className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                         <span className="text-xs font-black">{sale.name.charAt(0)}</span>
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold truncate">{sale.name} <span className="font-medium text-muted-foreground ml-1">bought tickets</span></p>
                         <p className="text-xs text-muted-foreground truncate">{sale.tier}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-sm font-black">+${sale.amount}</p>
                         <p className="text-[10px] text-muted-foreground font-medium">{sale.time}</p>
                       </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 rounded-xl border border-border text-sm font-bold hover:bg-secondary transition-colors">
                  View All Transactions
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
