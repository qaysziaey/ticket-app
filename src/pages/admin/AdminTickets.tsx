import { useState, useMemo } from "react"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Search, Filter, Eye, Edit2, Trash2, X, Ticket } from "lucide-react"

type MockOrder = {
  id: string
  ticketNumber: string
  username: string
  eventId: string
  eventName: string
  tier: string
  date: string
  price: number
}

export default function AdminTickets() {
  const { events } = useAppContext()

  const mockOrders: MockOrder[] = useMemo(() => {
    const list: MockOrder[] = []
    const firstNames = ["James", "Sarah", "Michael", "Emma", "David", "Jessica", "Farhad", "Michale"]
    const lastNames = ["Smith", "Johnson", "Williams", "Fan", "Darya", "Brown", "Jones", "Miller"]

    events.forEach(event => {
      const numTickets = Math.floor(Math.random() * 10) + 5
      for (let i = 0; i < numTickets; i++) {
        const tier = event.ticketTiers?.[Math.floor(Math.random() * (event.ticketTiers?.length ?? 1))] ?? { name: "General Admission", price: event.price }
        list.push({
          id: `ord-${Math.random().toString(36).substr(2, 6)}`,
          ticketNumber: `#FR${Math.floor(10000 + Math.random() * 90000)}`,
          username: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
          eventId: event.id,
          eventName: event.title,
          tier: tier.name,
          price: tier.price,
          date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
        })
      }
    })

    return list.sort(() => 0.5 - Math.random())
  }, [events])

  const [orders, setOrders] = useState<MockOrder[]>(mockOrders)
  const [selectedEventId, setSelectedEventId] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewingOrder, setViewingOrder] = useState<MockOrder | null>(null)

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchEvent = selectedEventId === "all" || order.eventId === selectedEventId
      const q = searchQuery.toLowerCase()
      const matchSearch = order.username.toLowerCase().includes(q)
        || order.ticketNumber.toLowerCase().includes(q)
        || order.eventName.toLowerCase().includes(q)
      return matchEvent && matchSearch
    })
  }, [orders, selectedEventId, searchQuery])

  const handleDelete = (id: string) => {
    if (confirm("Delete this ticket order?")) {
      setOrders(prev => prev.filter(o => o.id !== id))
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-background py-8 lg:py-10 flex flex-col gap-8">

      {/* Header */}
      <div className="px-8 lg:px-12">
        <p className="text-xs font-black tracking-widest uppercase mb-1.5 text-accent">Ticket Manifest</p>
        <h1 className="text-3xl font-medium tracking-tight">Orders &amp; Sales</h1>
        <p className="text-muted-foreground text-sm mt-1">{filteredOrders.length} tickets displayed</p>
      </div>

      {/* Event Slider */}
      <div className="px-8 lg:px-12">
        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4">Filter by Event</p>
        <div className="flex gap-3 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden">

          <button
            onClick={() => setSelectedEventId("all")}
            className={`shrink-0 h-28 w-28 rounded-2xl flex flex-col items-center justify-center gap-2.5 border-2 font-bold text-xs transition-all duration-200 ${
              selectedEventId === "all"
                ? "bg-accent text-black border-accent shadow-lg shadow-accent/30 scale-105"
                : "bg-card border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
            }`}
          >
            <Ticket className="w-7 h-7" />
            All Events
          </button>

          {events.map(event => (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={`shrink-0 w-44 h-28 rounded-2xl relative overflow-hidden border-2 transition-all duration-200 ${
                selectedEventId === event.id
                  ? "border-accent scale-105 shadow-lg"
                  : "border-transparent hover:border-border"
              }`}
            >
              <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <p className="absolute bottom-3 left-3 right-3 text-white font-bold text-xs text-left line-clamp-2 leading-snug">
                {event.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 px-8 lg:px-12">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, ticket number…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-border bg-card text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          />
        </div>

        <div className="relative sm:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="w-full h-11 pl-11 pr-10 rounded-xl border border-border bg-card text-foreground text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
          >
            <option value="all">All Events</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="border-b border-border">
            <tr>
              {["#", "Ticket No.", "Customer", "Event", "Date", "Actions"].map((h, i) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground ${i === 5 ? "text-right" : "text-left"} ${i === 0 ? "w-12" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? filteredOrders.map((order, i) => (
              <tr
                key={order.id}
                className="border-b border-border/40 last:border-0 transition-all duration-150 group relative hover:bg-accent/5 hover:border-accent/20"
              >
                <td className="px-6 py-4 text-xs text-muted-foreground font-bold">{i + 1}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-black group-hover:bg-accent group-hover:text-black transition-colors">
                    {order.ticketNumber}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">{order.username}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-foreground leading-tight line-clamp-1">{order.eventName}</p>
                  <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{order.tier}</p>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-accent hover:text-black" onClick={() => setViewingOrder(order)} title="View">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-500/10 hover:text-blue-500" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(order.id)} title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-24 text-center">
                  <Ticket className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground text-sm font-medium">No tickets found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          onClick={e => { if (e.target === e.currentTarget) setViewingOrder(null) }}
        >
          <div className="bg-card w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-border">

            {/* Accent Header */}
            <div className="bg-accent p-8 relative text-black">
              <button
                onClick={() => setViewingOrder(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Admit One</p>
              <p className="text-4xl font-black tracking-tighter">{viewingOrder.ticketNumber}</p>
            </div>

            {/* Perforation Line */}
            <div className="relative h-6 bg-accent">
              <div className="absolute top-1/2 left-6 right-6 border-t-2 border-dashed border-black/20 -translate-y-1/2" />
              <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-background" />
              <div className="absolute right-[-12px] top-0 w-6 h-6 rounded-full bg-background" />
            </div>

            {/* Body */}
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Customer</p>
                  <p className="font-bold text-sm">{viewingOrder.username}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Tier</p>
                  <p className="font-bold text-sm">{viewingOrder.tier}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Price Paid</p>
                  <p className="font-bold text-sm">${viewingOrder.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Date</p>
                  <p className="font-bold text-sm">{viewingOrder.date}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Event</p>
                <p className="font-bold text-base">{viewingOrder.eventName}</p>
              </div>
              <Button
                className="w-full h-12 rounded-xl font-bold bg-accent text-black hover:brightness-105"
                onClick={() => setViewingOrder(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
