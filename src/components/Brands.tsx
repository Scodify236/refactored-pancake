/* Hallmark · component: Brands · genre: atmospheric · theme: luxury-gold
 * states: default · hover · active
 * contrast: pass (46-50)
 */
import * as React from "react"
import { ChevronDown, ChevronUp, X, TrendingUp, DollarSign, Wallet, Loader2 } from "lucide-react"

interface Variant {
  id?: string | number
  name: string
  inr_rate: string | null
  usdt_rate: string | null
}

interface Card {
  id: string | number
  name: string
  img: string
  tag: string
  glow: string
  variants: Variant[]
}

function deriveGlowRaw(glow: string): string {
  // Try to extract RGB from rgba(...) or rgb(...)
  const m = glow.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (m) return `${m[1]} ${m[2]} ${m[3]}`
  return "180 130 60"
}

function deriveRate(variants: Variant[]): string {
  const rates: string[] = []
  for (const v of variants) {
    if (v.inr_rate) rates.push(v.inr_rate)
    else if (v.usdt_rate) rates.push(v.usdt_rate)
  }
  return rates.slice(0, 2).join(" / ") || "—"
}

export function Brands() {
  const [cards, setCards] = React.useState<Card[]>([])
  const [loading, setLoading] = React.useState(true)
  const [expandedCardId, setExpandedCardId] = React.useState<string | number | null>(null)

  React.useEffect(() => {
    fetch("https://api.gcx.co.in/api/cards")
      .then(r => r.json())
      .then((data: Card[]) => {
        setCards(Array.isArray(data) ? data : [])
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false))
  }, [])

  const toggleExpand = (id: string | number) => {
    setExpandedCardId(expandedCardId === id ? null : id)
  }

  return (
    <section id="brands" className="relative py-14 sm:py-20 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4">

        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] font-bold font-sans uppercase tracking-widest text-primary mb-3">Rate Ledger</p>
          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground leading-tight">
            Supported Card <span className="text-gradient">Redemption Rates</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-3 font-sans max-w-md mx-auto">
            Choose a card brand to view exact variant-based payouts. We continuously update settlement coefficients.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
            <span className="text-xs text-muted-foreground font-mono">Loading rates...</span>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm font-mono">
            No cards configured yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((b) => {
              const isExpanded = expandedCardId === b.id
              const glowRaw = deriveGlowRaw(b.glow)
              const rate = deriveRate(b.variants)
              return (
                <div
                  key={b.id}
                  onClick={() => toggleExpand(b.id)}
                  className="cursor-pointer group relative rounded-[2rem] border border-border bg-card hover:bg-secondary overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                  style={{
                    boxShadow: isExpanded ? `0 0 0 2px rgb(${glowRaw}/0.4), 0 10px 40px rgb(${glowRaw}/0.1)` : undefined,
                  }}
                >
                  <div className="p-6">
                    {/* Top Header Row */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-muted-foreground bg-secondary rounded-lg px-3 py-1.5 border border-border">
                        {b.tag}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold font-mono">
                        <TrendingUp size={11} className="animate-pulse" />
                        Live Settlement
                      </div>
                    </div>

                    {/* Centered Graphic Container */}
                    <div className="h-56 w-full flex items-center justify-center mb-6 bg-secondary/50 rounded-2xl border border-border/50 p-4">
                      <img
                        src={b.img}
                        alt={`${b.name} gift card`}
                        loading="lazy"
                        className="max-h-full w-auto object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>

                    {/* Text details */}
                    <div className="space-y-3 text-center">
                      <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors duration-200">{b.name}</h3>
                    </div>
                  </div>

                  {/* Card Toggle Footer */}
                  <div className="flex items-center justify-between p-5 bg-secondary border-t border-border text-xs text-muted-foreground font-sans rounded-b-[2rem]">
                    <span className="font-semibold text-foreground text-[10.5px]">Detailed Variants</span>
                    <span className="text-foreground">
                      {isExpanded ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} />}
                    </span>
                  </div>

                  {/* Interactive Variant Panel overlay */}
                  {isExpanded && b.variants && b.variants.length > 0 && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-0 bg-card z-20 p-6 flex flex-col justify-between border border-primary/30 rounded-[2rem]"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                          <h4 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            {b.name} Variants
                          </h4>
                          <button
                            type="button"
                            onClick={() => toggleExpand(b.id)}
                            className="text-muted-foreground hover:text-foreground transition p-2 rounded-full bg-secondary border border-border hover:bg-secondary/80 cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Available Payouts</p>
                          {b.variants.map((v, idx) => (
                            <div key={idx} className="flex justify-between items-center text-muted-foreground hover:text-foreground transition py-2 border-b border-border/20 last:border-0">
                              <span className="font-semibold text-foreground truncate max-w-[45%] text-xs">{v.name}</span>
                              <div className="flex items-center justify-end gap-1.5">
                                {v.inr_rate && (
                                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1 text-[10px]">
                                    <Wallet size={10} /> {v.inr_rate}
                                  </span>
                                )}
                                {v.usdt_rate && (
                                  <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 flex items-center gap-1 text-[10px]">
                                    <DollarSign size={10} /> {v.usdt_rate}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/919120138828?text=${encodeURIComponent(`Hi GCX! I want to sell my ${b.name} gift card. Please share the current rate and process.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="relative block rounded-xl bg-primary text-black text-center py-3 text-xs font-bold transition duration-200 hover:bg-accent mt-4 shadow-md cursor-pointer"
                      >
                        Redeem Now on WhatsApp ➔
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Brands
