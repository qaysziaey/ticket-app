import { motion, AnimatePresence } from "framer-motion"
import { useAppContext } from "@/context/AppContext"
import { Link } from "react-router-dom"
import { ShoppingCart, Plus, Minus, ArrowRight, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const { cartItems, removeTicketFromCart, addTicketToCart, clearCart, cartTotal, cartCount } = useAppContext();

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 flex-1 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#bced09" }}>Your tickets</p>
          <h1 className="text-4xl font-black tracking-tight">Shopping Cart</h1>
        </div>
        {cartItems.length > 0 && (
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={clearCart}>
            Clear all
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-32 flex flex-col items-center gap-5 text-center"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(188,237,9,0.12)" }}
          >
            <ShoppingCart className="w-8 h-8" style={{ color: "#bced09" }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground">Browse events and add tickets to get started.</p>
          </div>
          <Link to="/events">
            <Button className="rounded-full px-8 gap-2" style={{ backgroundColor: "#bced09", color: "#100c08" }}>
              Browse Events <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items list */}
          <div className="flex-1 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, i) => {
                const eventDate = new Date(item.event.date);
                return (
                  <motion.div
                    key={item.cartItemId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex relative rounded-2xl bg-accent text-accent-foreground overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Main content (left) */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Thumbnail */}
                      <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-xl overflow-hidden shrink-0 shadow-sm border border-black/5">
                        <img
                          src={item.event.imageUrl}
                          alt={item.event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex gap-1.5 mb-2">
                          {item.event.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/10 text-black mix-blend-color-burn"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link to={`/events/${item.event.id}`}>
                          <h3 className="font-bold text-lg sm:text-xl leading-tight line-clamp-1 hover:underline text-black">{item.event.title}</h3>
                        </Link>
                        <p className="text-black/70 text-sm mt-1 font-medium">
                          {eventDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {item.event.location}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 opacity-60">
                          <Ticket className="w-3.5 h-3.5 text-black" />
                          <p className="text-black text-[11px] font-semibold uppercase tracking-wider">
                            Added {new Date(item.purchasedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stub (right) */}
                    <div className="w-28 sm:w-40 shrink-0 flex flex-col items-center justify-center p-4 relative bg-black/5">
                        {/* Perforation Line & Cutouts */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background z-10 shadow-inner" />
                            <div className="w-px h-full border-l-[2.5px] border-dashed border-black/20" />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background z-10 shadow-inner" />
                        </div>

                        <div className="font-black text-xl sm:text-2xl tracking-tighter mb-4 text-black text-center w-full">
                           ${(item.event.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3 bg-black/10 rounded-full px-2 py-1.5 mb-3 shadow-inner">
                          <button
                            onClick={() => removeTicketFromCart(item.cartItemId)}
                            className="w-6 h-6 flex items-center justify-center text-black/60 hover:text-black rounded-full hover:bg-black/10 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 font-bold" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center text-black">{item.quantity}</span>
                          <button
                            onClick={() => addTicketToCart(item.event, 1)}
                            className="w-6 h-6 flex items-center justify-center text-black/60 hover:text-black rounded-full hover:bg-black/10 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 font-bold" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeTicketFromCart(item.cartItemId)}
                          className="text-black/40 hover:text-red-700 transition-colors text-[9px] font-bold uppercase tracking-widest flex items-center justify-center w-full py-1"
                        >
                           Remove
                        </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-80 shrink-0"
          >
            <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>{cartCount} ticket{cartCount !== 1 ? "s" : ""}</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service fee</span>
                  <span>${(cartTotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>${(cartTotal * 1.05).toFixed(2)}</span>
                </div>
              </div>

              <button
                className="w-full py-3.5 rounded-full font-bold text-sm tracking-wide transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#bced09", color: "#100c08" }}
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-widest font-bold opacity-60">Accepted payments</p>
                <div className="grid grid-cols-4 gap-3 items-center justify-items-center opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 w-auto object-contain bg-white/10 p-0.5 rounded" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 w-auto object-contain bg-white/10 p-0.5 rounded" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 w-auto object-contain bg-white/10 p-0.5 rounded" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4 w-auto object-contain bg-white/10 p-0.5 rounded" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className="h-5 w-auto object-contain bg-white/10 p-0.5 rounded" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-5 w-auto object-contain bg-white/10 p-0.5 rounded" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-5 w-auto object-contain bg-white/10 p-0.5 rounded" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Revolut_logo.svg" alt="Revolut" className="h-3 w-auto object-contain bg-white/10 p-0.5 rounded" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
