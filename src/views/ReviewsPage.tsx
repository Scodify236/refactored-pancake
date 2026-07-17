import * as React from "react"
import { Quote, CheckCircle, Image as ImageIcon, X, ArrowLeft, ChevronLeft, ChevronRight, Calendar, TrendingUp } from "lucide-react"
import { Link } from "../components/router"
import Navbar from "../components/Navbar"

interface Proof {
  id: number | string
  name: string
  role: string
  quote: string
  rating: number
  trade_type: string
  proof_image_url: string
  region?: string | null
  gc_received_date?: string | null
  payment_sent_date?: string | null
  amount?: number
  amount_label?: string
  created_at?: string
}

type AmountFilter = "All" | "₹5k+" | "₹10k+" | "₹25k+" | "₹50k+"
type ViewMode = "grid" | "timeline"

const AMOUNT_FILTERS: AmountFilter[] = ["All", "₹5k+", "₹10k+", "₹25k+", "₹50k+"]

const AMOUNT_RANGES: Record<AmountFilter, { min: number; max: number }> = {
  "All": { min: 0, max: Infinity },
  "₹5k+": { min: 5000, max: 9999 },
  "₹10k+": { min: 10000, max: 24999 },
  "₹25k+": { min: 25000, max: 49999 },
  "₹50k+": { min: 50000, max: Infinity },
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return ""
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ""
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch { return "" }
}

function groupByDate(proofs: Proof[]): Map<string, Proof[]> {
  const map = new Map<string, Proof[]>()
  const sorted = [...proofs].sort((a, b) => {
    const dateA = new Date(a.payment_sent_date || a.created_at || 0).getTime()
    const dateB = new Date(b.payment_sent_date || b.created_at || 0).getTime()
    return dateB - dateA
  })
  for (const p of sorted) {
    const rawDate = p.payment_sent_date || p.created_at || ""
    let key = "Unknown Date"
    if (rawDate) {
      try {
        const d = new Date(rawDate)
        key = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
      } catch { /* */ }
    }
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(p)
  }
  return map
}

function ProofCard({ proof, onZoom }: { proof: Proof; onZoom: (urls: string[], idx: number) => void }) {
  const urls = proof.proof_image_url ? proof.proof_image_url.split(",").map(u => u.trim()).filter(Boolean) : []
  const [activeIdx, setActiveIdx] = React.useState(0)

  return (
    <div className="relative rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-3.5 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group h-full">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* 1. Full Image (Viewport/card container controlled height) */}
      {urls.length > 0 && (
        <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-border bg-black/30">
          <button
            type="button"
            onClick={() => onZoom(urls, activeIdx)}
            className="w-full h-full cursor-zoom-in group/img focus:outline-none"
          >
            <img
              src={urls[activeIdx]}
              alt="Proof Active"
              className="h-full w-full object-contain group-hover/img:scale-[1.02] transition duration-300"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-bold text-white bg-black/75 px-3 py-1.5 rounded-full backdrop-blur-sm">Click to Zoom</span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Star Rating under active image */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-0.5 text-primary">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-sm">
              {i < (proof.rating || 5) ? "★" : "☆"}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[8.5px] font-bold rounded-full px-2.5 py-1 border text-primary bg-primary/10 border-primary/20 uppercase tracking-wider">
            {proof.trade_type}
          </span>
          {proof.amount_label && (
            <span className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
              {proof.amount_label}
            </span>
          )}
        </div>
      </div>

      {/* 3. Small thumbnail switches to change active image */}
      {urls.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {urls.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`relative h-11 w-11 rounded-lg overflow-hidden border transition shrink-0 ${
                activeIdx === i ? "border-primary ring-1 ring-primary/45" : "border-border hover:border-muted-foreground/50"
              }`}
            >
              <img src={url} alt="thumbnail" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* 4. Testimonial Quote & Admin Message below switcher */}
      <div className="flex flex-col gap-2 flex-1 pt-1">
        <div className="flex gap-2">
          <Quote size={12} className="text-primary/25 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
            {proof.quote}
          </p>
        </div>

        {/* Admin Complement Verification Note */}
        <div className="p-2.5 rounded-xl bg-foreground/[0.01] border border-border/80 text-left mt-2">
          <span className="text-[8px] font-extrabold text-primary uppercase tracking-wider block mb-0.5">Admin Verification Note</span>
          <p className="text-[10px] leading-relaxed text-muted-foreground italic font-medium">
            "Trade successfully completed. Digital voucher of {proof.trade_type} received and payout processed securely under verified transaction protocol."
          </p>
        </div>
      </div>

      {/* Footer / Meta details */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
        <div>
          <p className="text-[11px] font-bold text-foreground">{proof.name}</p>
          <p className="text-[9px] text-muted-foreground">{proof.role}</p>
        </div>
        <span className="text-[7.5px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
          <CheckCircle size={8} className="fill-emerald-400/20" /> Admin Verified
        </span>
      </div>
    </div>
  )
}

function TimelineCard({ proof, onZoom }: { proof: Proof; onZoom: (urls: string[], idx: number) => void }) {
  const urls = proof.proof_image_url ? proof.proof_image_url.split(",").map(u => u.trim()).filter(Boolean) : []
  const [activeIdx, setActiveIdx] = React.useState(0)

  return (
    <div className="relative rounded-[1.25rem] border border-border/50 bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-4 hover:border-primary/35 transition-all duration-300 group">
      {/* 1. Multiple Images Horizontally (Viewport / Container height controlled to h-[360px]) */}
      {urls.length > 0 && (
        <div className="flex gap-4 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-border">
          {urls.map((url, idx) => (
            <div key={idx} className="relative h-[360px] min-w-[280px] sm:min-w-[480px] rounded-xl overflow-hidden border border-border bg-black/30 shrink-0">
              <button
                type="button"
                onClick={() => onZoom(urls, idx)}
                className="w-full h-full cursor-zoom-in group/img focus:outline-none"
              >
                <img
                  src={url}
                  alt={`Proof Timeline ${idx + 1}`}
                  className="h-full w-full object-contain group-hover/img:scale-[1.02] transition duration-300"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white bg-black/75 px-3 py-1.5 rounded-full backdrop-blur-sm">Click to Zoom</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 2. Star Rating under active image */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-0.5 text-primary">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-sm">
              {i < (proof.rating || 5) ? "★" : "☆"}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {proof.amount_label && (
            <span className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 w-fit">
              {proof.amount_label}
            </span>
          )}
          <span className="text-[8.5px] font-bold rounded-full px-2.5 py-1 border text-primary bg-primary/10 border-primary/20 uppercase tracking-wider w-fit">
            {proof.trade_type}
          </span>
          {proof.payment_sent_date && (
            <div className="text-[10px] font-bold text-foreground bg-foreground/[0.03] border border-border px-2.5 py-1 rounded-full">
              Paid Out: {formatDate(proof.payment_sent_date)}
            </div>
          )}
        </div>
      </div>

      {/* 4. Testimonial & Admin Verification Note */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex gap-2">
          <Quote size={12} className="text-primary/20 shrink-0 mt-0.5" />
          <p className="text-[11.5px] leading-relaxed text-muted-foreground font-medium">
            {proof.quote}
          </p>
        </div>

        {/* Admin Complement note under image */}
        <div className="p-2.5 rounded-xl bg-foreground/[0.01] border border-border/80 text-left">
          <span className="text-[8px] font-extrabold text-primary uppercase tracking-wider block mb-0.5">Admin Verification Note</span>
          <p className="text-[10px] leading-relaxed text-muted-foreground italic font-medium">
            "Trade successfully completed. Digital voucher of {proof.trade_type} received and payout processed securely under verified transaction protocol."
          </p>
        </div>
      </div>

      {/* Footer / User Meta */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
        <div>
          <p className="text-[11px] font-bold text-foreground">{proof.name}</p>
          <p className="text-[9px] text-muted-foreground">{proof.role}</p>
        </div>
        <span className="text-[7.5px] font-bold text-emerald-400 flex items-center gap-1 uppercase">
          <CheckCircle size={8} className="fill-emerald-400/20" /> Admin Verified
        </span>
      </div>
    </div>
  )
}

export function ReviewsPage() {
  const [proofs, setProofs] = React.useState<Proof[]>([])
  const [loading, setLoading] = React.useState(true)
  const [zoomedImages, setZoomedImages] = React.useState<string[]>([])
  const [zoomedIndex, setZoomedIndex] = React.useState(0)
  const [amountFilter, setAmountFilter] = React.useState<AmountFilter>("All")
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")

  React.useEffect(() => {
    fetch("https://api.gcx.co.in/api/reviews")
      .then(r => r.json())
      .then(data => { setProofs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = React.useMemo(() => {
    if (amountFilter === "All") return proofs
    const { min, max } = AMOUNT_RANGES[amountFilter]
    return proofs.filter(p => (p.amount || 0) >= min && (p.amount || 0) <= max)
  }, [proofs, amountFilter])

  const dateGroups = React.useMemo(() => groupByDate(filtered), [filtered])

  const openZoom = (images: string[], index = 0) => { setZoomedImages(images); setZoomedIndex(index) }
  const closeZoom = () => { setZoomedImages([]); setZoomedIndex(0) }

  return (
    <div className="relative min-h-screen text-foreground font-sans antialiased">
      <Navbar />

      <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition mb-6 cursor-pointer">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[10px] font-bold font-sans uppercase tracking-wider text-primary mb-3">Verified Proofs</p>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground mb-4">
              Public Payment <span className="text-gradient">Ledger</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base font-sans">
              Admin-curated receipts only. Every proof verified before publishing.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Proofs", value: loading ? "—" : `${proofs.length}` },
            { label: "Success Rate", value: "100%" },
            { label: "Settlement", value: "< 2h avg" },
            { label: "Source", value: "Admin Only" },
          ].map(s => (
            <div key={s.label} className="bg-card/50 border border-border/30 rounded-2xl p-4 text-left backdrop-blur-sm">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">{s.label}</span>
              <span className="text-xl font-bold font-display text-foreground mt-1.5 block">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Controls: Amount filters + View toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Amount filters */}
          <div className="flex flex-wrap gap-2">
            {AMOUNT_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setAmountFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer ${
                  amountFilter === f
                    ? "bg-primary text-black border-primary shadow-lg"
                    : "bg-card/50 text-muted-foreground border-border/40 hover:text-foreground hover:border-border/80 backdrop-blur-sm"
                }`}
              >
                {f === "All" ? "All Amounts" : f}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-card/50 border border-border/40 rounded-xl p-1 backdrop-blur-sm shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${viewMode === "grid" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span className="grid grid-cols-2 gap-[2px] w-3 h-3">
                {[0,1,2,3].map(i => <span key={i} className="rounded-[1px] bg-current" />)}
              </span>
              Grid
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${viewMode === "timeline" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Calendar size={11} /> Timeline
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-[10px] text-muted-foreground font-mono mb-5">
          Showing <span className="text-foreground font-bold">{loading ? "..." : filtered.length}</span> proof{filtered.length !== 1 ? "s" : ""}
          {amountFilter !== "All" ? ` for ${amountFilter} range` : ""}
        </p>

        {/* Content */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[1.5rem] border border-border/40 bg-card/40 p-4 h-52 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground text-sm">
            No proofs found in this category yet.
          </div>
        ) : viewMode === "grid" ? (
          /* MASONRY/COLUMNS VIEW (Flows according to content height) */
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 [column-fill:_balance] [&>*]:break-inside-avoid">
            {filtered.map(p => (
              <div key={p.id} className="inline-block w-full">
                <ProofCard proof={p} onZoom={openZoom} />
              </div>
            ))}
          </div>
        ) : (
          /* TIMELINE VIEW — grouped by payment date */
          <div className="space-y-8">
            {Array.from(dateGroups.entries()).map(([date, dayProofs]) => (
              <div key={date} className="relative">
                {/* Date header */}
                <div className="flex items-center gap-3 mb-4 sticky top-24 z-10">
                  <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border/60 rounded-full px-4 py-2 shadow-sm">
                    <Calendar size={12} className="text-primary" />
                    <span className="text-[10px] font-bold text-foreground">{date}</span>
                    <span className="text-[9px] text-muted-foreground bg-foreground/[0.04] border border-border/40 rounded-full px-2 py-0.5 font-mono">
                      {dayProofs.length} proof{dayProofs.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-border/60 to-transparent" />
                </div>

                {/* Timeline line + cards */}
                <div className="relative pl-6 sm:pl-8 space-y-3">
                  {/* Vertical timeline line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border/40 to-transparent" />

                  {dayProofs.map((p, i) => (
                    <div key={p.id} className="relative">
                      {/* Dot on timeline */}
                      <div className="absolute -left-[1.625rem] sm:-left-[2.125rem] top-4 h-3 w-3 rounded-full bg-primary/20 border-2 border-primary/50 shadow-sm" />
                      <TimelineCard proof={p} onZoom={openZoom} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomedImages.length > 0 && (
        <div onClick={closeZoom} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out">
          <div onClick={e => e.stopPropagation()} className="relative max-w-4xl max-h-[85vh] rounded-[2rem] overflow-hidden border border-border/80 shadow-2xl bg-card p-3 flex flex-col items-center justify-center select-none">
            <div className="relative flex items-center justify-center max-w-full max-h-[75vh]">
              <img src={zoomedImages[zoomedIndex]} alt={`Receipt ${zoomedIndex + 1}`} className="max-w-full max-h-[70vh] object-contain rounded-xl bg-black/40 border border-border/40" />
              {zoomedImages.length > 1 && (
                <>
                  <button type="button" onClick={e => { e.stopPropagation(); setZoomedIndex(prev => prev > 0 ? prev - 1 : zoomedImages.length - 1) }} className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition border border-white/10 cursor-pointer">
                    <ChevronLeft size={20} className="stroke-[2.5]" />
                  </button>
                  <button type="button" onClick={e => { e.stopPropagation(); setZoomedIndex(prev => prev < zoomedImages.length - 1 ? prev + 1 : 0) }} className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition border border-white/10 cursor-pointer">
                    <ChevronRight size={20} className="stroke-[2.5]" />
                  </button>
                </>
              )}
            </div>
            <div className="w-full flex items-center justify-between mt-3 px-4 py-1 text-xs">
              <span className="text-[9px] font-bold font-sans text-primary flex items-center gap-1 uppercase">
                <CheckCircle size={10} className="fill-primary/15" /> Admin Verified Receipt
              </span>
              {zoomedImages.length > 1 && (
                <span className="text-[10px] font-sans font-bold text-foreground bg-foreground/[0.04] border border-border px-3 py-1 rounded-full">
                  {zoomedIndex + 1} / {zoomedImages.length}
                </span>
              )}
            </div>
            <button onClick={closeZoom} className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition border border-white/10 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewsPage
