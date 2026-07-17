/* Hallmark · component: Brands · genre: atmospheric · theme: luxury-gold
 * states: default · hover · active
 * contrast: pass (46-50)
 */
import * as React from "react"
import { ChevronDown, ChevronUp, X, TrendingUp, DollarSign, Wallet } from "lucide-react"

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANDS.map((b) => {
            const isExpanded = expandedCardId === b.id
            return (
              <div
                key={b.id}
                onClick={() => toggleExpand(b.id)}
                className="cursor-pointer group relative rounded-[2rem] border border-border/50 bg-card/40 hover:bg-card/75 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                style={{
                  boxShadow: isExpanded ? `0 0 0 2px rgb(${b.glowRaw}/0.4), 0 10px 40px rgb(${b.glowRaw}/0.1)` : undefined,
                }}
              >
                {/* Horizontal Top Shimmer Glow */}
                <div
                  className="absolute top-0 left-0 w-full h-[2px] opacity-20 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to right, transparent, ${b.glow}, transparent)` }}
                />

                <div className="p-6">
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-muted-foreground/80 bg-foreground/[0.04] rounded-lg px-3 py-1.5 border border-border/80">
                      {b.tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold font-mono">
                      <TrendingUp size={11} className="animate-pulse" />
                      Live Settlement
                    </div>
                  </div>

                  {/* Centered Graphic Container */}
                  <div className="h-32 w-full flex items-center justify-center mb-6 bg-gradient-to-b from-foreground/[0.01] to-foreground/[0.03] rounded-2xl border border-border/30 p-4">
                    <img
                      src={getCardImage(b.img)}
                      alt={`${b.name} gift card`}
                      loading="lazy"
                      className="max-h-full w-auto object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Text details */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors duration-200">{b.name}</h3>
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-foreground/[0.015] border border-border/40">
                      <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider">Settlement</span>
                      <span className="text-xs font-bold text-primary">{b.rate}</span>
                    </div>
                  </div>
                </div>

                {/* Card Toggle Footer */}
                <div className="flex items-center justify-between p-5 bg-foreground/[0.01] border-t border-border/30 text-xs text-muted-foreground font-sans rounded-b-[2rem]">
                  <span className="font-semibold text-foreground text-[10.5px]">Detailed Variants</span>
                  <span className="text-foreground/75">
                    {isExpanded ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} />}
                  </span>
                </div>

                {/* Interactive Variant Panel overlay */}
                {isExpanded && b.variants && b.variants.length > 0 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-0 bg-background/98 backdrop-blur-xl z-20 p-6 flex flex-col justify-between border border-primary/20 rounded-[2rem]"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-border/50 mb-4">
                        <h4 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          {b.name} Variants
                        </h4>
                        <button
                          type="button"
                          onClick={() => toggleExpand(b.id)}
                          className="text-muted-foreground hover:text-foreground transition p-2 rounded-full bg-foreground/[0.04] border border-border hover:bg-foreground/[0.08] cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Available Payouts</p>
                        {b.variants.map((v, idx) => (
                          <div key={idx} className="flex justify-between items-center text-muted-foreground hover:text-foreground transition py-2 border-b border-border/10 last:border-0">
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
                      className="group relative inline-block p-px rounded-full bg-slate-800 text-[11px] font-semibold leading-5 text-white no-underline shadow-lg cursor-pointer w-full text-center overflow-hidden mt-4"
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(240,203,135,0.4)_0%,rgba(240,203,135,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex items-center justify-center space-x-1.5 rounded-full bg-zinc-950 py-3 px-4 ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-zinc-900/80">
                        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100">
                          Redeem Now on WhatsApp ➔
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
