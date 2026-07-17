import * as React from "react"

const items = ["ROBLOX", "OVERWATCH 2", "SEA OF THIEVES", "LEAGUE OF LEGENDS", "INR", "AMAZON", "FLIPKART", "USDT", "CRYPTO", "UPI", "INSTANT PAYOUT"]

export function Marquee() {
  const row = [...items, ...items]
  return (
    <section className="relative py-6 border-y border-border/40 overflow-hidden bg-background">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-12 text-xs sm:text-sm font-bold font-display uppercase tracking-widest text-muted-foreground/50">
            <span>{t}</span>
            <span className="text-primary/75">✦</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Marquee
