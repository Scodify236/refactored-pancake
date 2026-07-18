import * as React from "react"
import { Link } from "./router"

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 py-6 mt-6 bg-card">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-sans">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="GCX Logo" className="h-6 w-auto object-contain" />
          <span className="font-bold font-display text-foreground">GCX</span>
          <span>· Gift card exchange</span>
        </div>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-foreground transition">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition">Terms</Link>
          <Link to="/support" className="hover:text-foreground transition">Support</Link>
        </div>
        <div className="flex flex-col sm:items-end gap-1 text-center sm:text-right">
          <p>© 2026 GCX. All rights reserved.</p>
          <p className="text-xs">
            Designed & Hosted by{" "}
            <a 
              href="https://coderbauer.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-red-500 hover:text-red-400 font-bold transition underline underline-offset-4"
            >
              CoderBauer
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
