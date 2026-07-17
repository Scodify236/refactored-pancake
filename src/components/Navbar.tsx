import * as React from "react"
import { Link, useRouter } from "./router"
import { Menu, X, Sun, Moon, Monitor } from "lucide-react"
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

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4 flex flex-col gap-2">
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
              <DropdownMenuContent align="end" className="liquid-glass border border-border/80 p-1 rounded-2xl w-32 shadow-xl bg-card">
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                    theme === "light" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  <Sun size={14} /> Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition mt-0.5 ${
                    theme === "dark" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  <Moon size={14} /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition mt-0.5 ${
                    theme === "system" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
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
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        <div
          className={`md:hidden liquid-glass rounded-[2rem] p-5 flex flex-col gap-4 border border-border/60 shadow-2xl overflow-hidden transition-all duration-200 transform origin-top ${
            isOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible absolute"
          }`}
        >
          <div className="flex flex-col gap-3.5 text-xs font-semibold text-muted-foreground">
            <a 
              href={getNavLink("#brands")} 
              onClick={() => setIsOpen(false)}
              className="hover:text-foreground transition py-1.5 border-b border-border/10"
            >
              Cards
            </a>
            <a 
              href={getNavLink("#how")} 
              onClick={() => setIsOpen(false)}
              className="hover:text-foreground transition py-1.5 border-b border-border/10"
            >
              How it works
            </a>
            <a 
              href={getNavLink("#payouts")} 
              onClick={() => setIsOpen(false)}
              className="hover:text-foreground transition py-1.5 border-b border-border/10"
            >
              Payouts
            </a>
            <Link 
              to="/proofs" 
              onClick={() => setIsOpen(false)}
              className="hover:text-foreground transition py-1.5 border-b border-border/10"
            >
              Proofs
            </Link>
            <a 
              href={getNavLink("#faq")} 
              onClick={() => setIsOpen(false)}
              className="hover:text-foreground transition py-1.5 border-b border-border/10"
            >
              FAQ
            </a>
            
            {/* Mobile Theme Switcher (Segmented Control) */}
            <div className="flex flex-col gap-1.5 py-1.5 border-b border-border/10">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold font-sans">Theme</span>
              <div className="flex items-center bg-foreground/[0.03] border border-border/50 rounded-xl p-1 w-full">
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
          </div>
          <a
            href={getNavLink("#brands")}
            onClick={() => setIsOpen(false)}
            className="w-full text-center rounded-full bg-primary text-black hover:bg-accent py-2.5 text-xs font-bold transition block"
          >
            Sell Card
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar
