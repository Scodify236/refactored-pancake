import * as React from "react"
import { ChevronDown, ChevronUp, X, TrendingUp } from "lucide-react"

const imgMap: Record<string, string> = {
  amazon: "/card-amazon-pkV6XfjL.png",
  flipkart: "/card-flipkart-SeEfOOvb.png",
  roblox: "/card-roblox-Cn_R-R5S.png",
  lol: "/card-lol-eD770gql.png",
  overwatch: "/overwatch2.png",
  sot: "/sot.png",
}

const getCardImage = (imgSrc: string) => imgMap[imgSrc] || imgSrc

interface Variant {
  name: string
  inr_rate: string | null
  usdt_rate: string | null
}

interface Brand {
  id: string
  name: string
  img: string
  tag: string
  rate: string
  glow: string
  glowRaw: string
  variants: Variant[]
}

const BRANDS: Brand[] = [
  {
    id: "amazon",
    name: "Amazon",
    img: "amazon",
    tag: "Shopping",
    rate: "100 INR / 0.91 USDT",
    glow: "rgba(255, 153, 0, 0.4)",
    glowRaw: "255 153 0",
    variants: [{ name: "arena100", inr_rate: "100 INR", usdt_rate: "0.91 USDT" }],
  },
  {
    id: "flipkart",
    name: "Flipkart",
    img: "flipkart",
    tag: "Shopping",
    rate: "90 INR",
    glow: "rgba(40, 116, 240, 0.4)",
    glowRaw: "40 116 240",
    variants: [{ name: "e-Gift Voucher", inr_rate: "90 INR", usdt_rate: null }],
  },
  {
    id: "roblox",
    name: "Roblox",
    img: "roblox",
    tag: "Gaming",
    rate: "88 USDT",
    glow: "rgba(239, 68, 68, 0.4)",
    glowRaw: "239 68 68",
    variants: [{ name: "Gift Card", inr_rate: null, usdt_rate: "88 USDT" }],
  },
  {
    id: "lol",
    name: "League of Legends",
    img: "lol",
    tag: "Gaming",
    rate: "86 USDT",
    glow: "rgba(197, 168, 128, 0.35)",
    glowRaw: "197 168 128",
    variants: [{ name: "RP Gift Card", inr_rate: null, usdt_rate: "86 USDT" }],
  },
  {
    id: "overwatch",
    name: "Overwatch 2",
    img: "overwatch",
    tag: "Gaming",
    rate: "84 USDT",
    glow: "rgba(240, 100, 20, 0.4)",
    glowRaw: "240 100 20",
    variants: [{ name: "Coins Gift Card", inr_rate: null, usdt_rate: "84 USDT" }],
  },
  {
    id: "sot",
    name: "Sea of Thieves",
    img: "sot",
    tag: "Gaming",
    rate: "82 USDT",
    glow: "rgba(16, 185, 129, 0.4)",
    glowRaw: "16 185 129",
    variants: [{ name: "Ancient Coins Pack", inr_rate: null, usdt_rate: "82 USDT" }],
  },
]

export function Brands() {
  const [expandedCardId, setExpandedCardId] = React.useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id)
  }

  return (
    <section id="brands" className="relative py-10 sm:py-14 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4">

        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[10px] font-bold font-sans uppercase tracking-wider text-primary mb-3">Accepted cards</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-foreground leading-tight">
            We take the cards <span className="text-gradient">you actually own</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-3 font-sans">Click any card to view detailed payout rates</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BRANDS.map((b) => {
            const isExpanded = expandedCardId === b.id
            return (
              <div
                key={b.id}
                onClick={() => toggleExpand(b.id)}
                className="cursor-pointer group relative rounded-[1.75rem] border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-border/90 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  boxShadow: isExpanded ? `0 0 0 1.5px rgb(${b.glowRaw}/0.5), 0 8px 32px rgb(${b.glowRaw}/0.15)` : undefined,
                }}
              >
                {/* Glow accent at top */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to right, transparent, ${b.glow}, transparent)` }}
                />

                <div className="p-5">
                  {/* Card image + tag row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-28 w-36 grid place-items-center shrink-0">
                      <img
                        src={getCardImage(b.img)}
                        alt={`${b.name} gift card`}
                        loading="lazy"
                        className="max-h-full w-auto object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-col items-end gap-2 pt-1">
                      <span className="text-[8px] font-bold font-sans uppercase tracking-wider text-muted-foreground/80 bg-foreground/[0.04] rounded-full px-2.5 py-1 border border-border">
                        {b.tag}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold font-mono">
                        <TrendingUp size={9} />
                        Live Rate
                      </div>
                    </div>
                  </div>

                  {/* Name + base rate */}
                  <div className="space-y-2.5">
                    <h3 className="text-base font-bold font-display text-foreground group-hover:text-primary transition-colors duration-200">{b.name}</h3>
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-foreground/[0.025] border border-border/40">
                      <span className="text-[9px] font-sans font-semibold text-muted-foreground uppercase tracking-wider">Base Rate</span>
                      <span className="text-xs font-bold text-primary">{b.rate}</span>
                    </div>
                  </div>

                  {/* Toggle footer */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/40 text-xs text-muted-foreground font-sans">
                    <span className="font-semibold text-foreground text-[11px]">Variant Rates</span>
                    <span className="text-foreground/70">
                      {isExpanded ? <ChevronUp size={15} className="text-primary" /> : <ChevronDown size={15} />}
                    </span>
                  </div>
                </div>

                {/* Rates overlay */}
                {isExpanded && b.variants && b.variants.length > 0 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-0 bg-background/97 backdrop-blur-xl z-20 p-5 flex flex-col justify-between border border-primary/30 rounded-[1.75rem]"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                        <h4 className="text-sm font-bold font-display text-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          {b.name} Rates
                        </h4>
                        <button
                          type="button"
                          onClick={() => toggleExpand(b.id)}
                          className="text-muted-foreground hover:text-foreground transition p-1.5 rounded-full bg-foreground/[0.04] border border-border hover:bg-foreground/[0.08] cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Variant Payout Breakdown</p>
                        {b.variants.map((v, idx) => (
                          <div key={idx} className="flex justify-between items-center text-muted-foreground hover:text-foreground transition py-2 border-b border-border/10 last:border-0">
                            <span className="font-semibold text-foreground truncate max-w-[45%]">{v.name}</span>
                            <div className="flex items-center justify-end gap-1.5">
                              {v.inr_rate && (
                                <span className="font-sans text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 flex items-center gap-1 text-[10px]">
                                  <span className="text-[7.5px] opacity-75 font-semibold text-emerald-500/90 uppercase">INR</span> {v.inr_rate}
                                </span>
                              )}
                              {v.usdt_rate && (
                                <span className="font-sans text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/20 flex items-center gap-1 text-[10px]">
                                  <span className="text-[7.5px] opacity-75 font-semibold text-cyan-500/90 uppercase">USDT</span> {v.usdt_rate}
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
                      className="group relative inline-block p-px rounded-full bg-slate-800 text-[10.5px] font-semibold leading-5 text-white no-underline shadow-lg cursor-pointer w-full text-center overflow-hidden mt-4"
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(16,185,129,0.6)_0%,rgba(16,185,129,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex items-center justify-center space-x-1.5 rounded-full bg-zinc-950 py-2.5 px-4 ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-zinc-900/80">
                        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100">
                          Start Trade on WhatsApp ➔
                        </span>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Brands
