import * as React from "react"
import { Link, useRouter } from "./router"
import { Menu, X, Sun, Moon, Monitor, CreditCard, HelpCircle, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react"
import { useTheme } from "./theme-provider"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const currentPath = useRouter()
  const { theme, setTheme } = useTheme()

  const getNavLink = (hash: string) => {
    return currentPath === "/" ? hash : `/${hash}`
  }

  // Prevent background scrolling when sidebar drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4 flex flex-col gap-2">
        {/* Rebranding Announcement Banner */}
        <div className="w-full bg-card border border-primary/30 rounded-full px-5 py-2 text-center text-[10.5px] sm:text-xs font-sans font-medium text-foreground shadow-md flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span>Rebranding Notice: <strong>GCX</strong> is renaming to <strong>GCVX</strong> over the next 2 months. All services remain fully active.</span>
        </div>

        <nav className="liquid-glass flex items-center justify-between rounded-full px-6 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="GCX Logo" className="h-8 w-auto object-contain" />
            <span className="text-lg font-bold tracking-wide font-display text-foreground">GCX</span>
          </Link>
          
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href={getNavLink("#brands")} className="hover:text-foreground transition">Cards</a>
            <a href={getNavLink("#how")} className="hover:text-foreground transition">How it works</a>
            <a href={getNavLink("#payouts")} className="hover:text-foreground transition">Payouts</a>
            <Link to="/proofs" className="hover:text-foreground transition">Proofs</Link>
            <Link to="/appeal" className="hover:text-foreground transition">Appeal</Link>
            <a href={getNavLink("#faq")} className="hover:text-foreground transition">FAQ</a>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden md:inline-flex p-2 text-muted-foreground hover:text-foreground focus:outline-none transition cursor-pointer mr-1.5"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Moon size={18} />
                  ) : theme === "light" ? (
                    <Sun size={18} />
                  ) : (
                    <Monitor size={18} />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border border-border p-1 rounded-2xl w-32 shadow-xl bg-card">
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                    theme === "light" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Sun size={14} /> Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition mt-0.5 ${
                    theme === "dark" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Moon size={14} /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition mt-0.5 ${
                    theme === "system" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Monitor size={14} /> Auto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Desktop CTA */}
            <a
              href={getNavLink("#brands")}
              className="hidden md:inline-flex rounded-full bg-primary text-black hover:bg-accent px-5 py-2 text-sm font-bold transition-all duration-300 cursor-pointer shadow-sm"
            >
              Sell card
            </a>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none transition cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      <div 
        className={`fixed inset-0 z-[100] md:hidden transition-visibility duration-300 ${
          isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
      >
        {/* Solid Backdrop */}
        <div 
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Sidebar Panel */}
        <aside 
          className={`absolute top-0 right-0 bottom-0 w-[290px] max-w-[85vw] bg-card border-l border-border flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-border">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
                <img src="/logo.png" alt="GCX Logo" className="h-7 w-auto object-contain" />
                <span className="text-lg font-bold font-display text-foreground">GCX</span>
              </Link>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 mt-6">
              <a 
                href={getNavLink("#brands")} 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-primary" />
                  <span>Cards</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </a>

              <a 
                href={getNavLink("#how")} 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={18} className="text-primary" />
                  <span>How it works</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </a>

              <a 
                href={getNavLink("#payouts")} 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold text-sm">₹</span>
                  <span>Payouts</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </a>

              <Link 
                to="/proofs" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span>Proofs</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </Link>

              <Link 
                to="/appeal" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert size={18} className="text-primary" />
                  <span>Appeal</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </Link>

              <a 
                href={getNavLink("#faq")} 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={18} className="text-primary" />
                  <span>FAQ</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </a>
            </nav>
          </div>

          {/* Footer Area */}
          <div className="flex flex-col gap-4 pt-4 border-t border-border">
            {/* Theme Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold font-sans">Appearance</span>
              <div className="flex items-center bg-secondary rounded-xl p-1 w-full border border-border">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    theme === "light"
                      ? "bg-primary text-black shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sun size={12} /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    theme === "dark"
                      ? "bg-primary text-black shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Moon size={12} /> Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    theme === "system"
                      ? "bg-primary text-black shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Monitor size={12} /> Auto
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <a
              href={getNavLink("#brands")}
              onClick={() => setIsOpen(false)}
              className="w-full text-center rounded-xl bg-primary text-black hover:bg-accent py-3 text-xs font-bold transition block shadow-md"
            >
              Sell Card Now
            </a>
          </div>
        </aside>
      </div>
    </header>
  )
}

export default Navbar
