import * as React from "react"

const items = ["ROBLOX", "OVERWATCH 2", "SEA OF THIEVES", "LEAGUE OF LEGENDS", "INR", "AMAZON", "FLIPKART", "USDT", "CRYPTO", "UPI", "INSTANT PAYOUT"]

export function Marquee() {
  const row = [...items, ...items, ...items, ...items]
  return (
    <section className="relative py-6 border-y border-border/40 overflow-hidden bg-background">
      <style>{`
        @keyframes marqueeAnimation {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-local {
          display: flex;
          width: max-content;
          animation: marqueeAnimation 24s linear infinite;
        }
        .marquee-item {
          text-shadow: 0 0 8px rgba(240, 203, 135, 0.15);
        }
      `}</style>
      <div className="animate-marquee-local gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <div key={i} className="marquee-item flex items-center gap-12 text-xs sm:text-sm font-bold font-display uppercase tracking-widest text-muted-foreground/50">
            <span>{t}</span>
            <span className="text-primary/75">✦</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Marquee
