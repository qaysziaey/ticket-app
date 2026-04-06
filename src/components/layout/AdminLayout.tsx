import { Outlet, NavLink, Link } from "react-router-dom"
import { Calendar, Ticket, BarChart3, HelpCircle, ArrowLeft, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"

const topLinks = [
  { name: "My Events", to: "/admin", icon: Calendar, end: true },
  { name: "Tickets", to: "/admin/tickets", icon: Ticket },
  { name: "Insights", to: "/admin/insights", icon: BarChart3 },
];

export default function AdminLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card shrink-0 flex-col hidden md:flex h-full z-20 shadow-sm relative">
        <div className="p-6 pb-2">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <span className={cn(
              "text-2xl font-black tracking-tighter",
              theme === "light" ? "text-foreground" : "text-white"
            )}>
              AURA<span className="text-accent">.</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-auto opacity-50">Admin</span>
          </Link>

          <Link to="/" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to App
          </Link>
          
          <nav className="flex flex-col gap-1.5 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 px-1">Menu</p>
            {topLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )
                }
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 flex flex-col gap-4 bg-secondary/10 border-t border-border/50">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all text-left w-full group">
              <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              Help and Support
            </button>
            <div className="px-4 flex items-center justify-between mt-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Admin Portal v1.0.0
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full border border-border bg-card shadow-sm hover:bg-secondary"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </Button>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-auto bg-background relative">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card z-10 sticky top-0">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-black tracking-tighter">
              AURA<span className="text-accent">.</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
        
        <Outlet />
      </main>
    </div>
  )
}
