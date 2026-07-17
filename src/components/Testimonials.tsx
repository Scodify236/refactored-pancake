import * as React from "react"
import { Quote, CheckCircle, Image as ImageIcon, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Calendar } from "lucide-react"

interface Proof {
  id: number | string
  name: string
  role: string
  quote: string
  trade_type: string
  proof_image_url: string
  region?: string | null
  gc_received_date?: string | null
  payment_sent_date?: string | null
  amount?: number
  amount_label?: string
  created_at?: string
}

const STATIC_DAILY_PAYOUTS: any[] = []

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return ""
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ""
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch { return "" }
}

function ProofCard({ proof, onZoom }: { proof: Proof; onZoom: (urls: string[], idx: number) => void }) {
  const urls = proof.proof_image_url ? proof.proof_image_url.split(",").map(u => u.trim()).filter(Boolean) : []

  return (
    <div className="relative rounded-[1.5rem] border border-border/50 bg-card/60 backdrop-blur-sm p-4 flex flex-col gap-3 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
      {/* top glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Trade type badge */}
      <div className="flex items-center justify-between">
        <span className="text-[8.5px] font-bold rounded-full px-2.5 py-1 border text-primary bg-primary/10 border-primary/20 uppercase tracking-wider">
          {proof.trade_type}
        </span>
        {proof.amount_label && (
          <span className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
            {proof.amount_label}
          </span>
        )}
      </div>

      {/* Quote */}
      <div className="flex gap-2.5 flex-1">
        <Quote size={13} className="text-primary/25 shrink-0 mt-0.5" />
        <p className="text-[11.5px] leading-relaxed text-muted-foreground font-medium line-clamp-4">
          {proof.quote}
        </p>
      </div>

      {/* Dates */}
      {(proof.gc_received_date || proof.payment_sent_date) && (
        <div className="flex items-center justify-between text-[9px] px-3 py-2 rounded-xl bg-foreground/[0.015] border border-border/40">
          <div>
            <span className="text-amber-400/90 font-bold uppercase block tracking-wide">GC Received</span>
            <span className="font-bold text-foreground">{formatDate(proof.gc_received_date)}</span>
          </div>
          <div className="h-4 w-px bg-border/60" />
          <div className="text-right">
            <span className="text-emerald-400/90 font-bold uppercase block tracking-wide">Paid Out</span>
            <span className="font-bold text-foreground">{formatDate(proof.payment_sent_date)}</span>
          </div>
        </div>
      )}

      {/* Proof images */}
      {urls.length > 0 && (
        <button
          type="button"
          onClick={() => onZoom(urls, 0)}
          className="w-full flex items-center gap-3 p-2 rounded-xl border transition-all duration-300 group/btn cursor-pointer text-left focus:outline-none bg-foreground/[0.01] border-border/60 hover:border-primary/40 hover:bg-primary/[0.03]"
        >
          <div className="flex gap-1 shrink-0">
            {urls.slice(0, 3).map((url, i) => (
              <div key={i} className="relative h-9 w-9 rounded-lg overflow-hidden border border-border bg-black/30 shadow-sm">
                <img src={url} alt="Proof receipt" className="h-full w-full object-cover group-hover/btn:scale-105 transition duration-300" />
              </div>
            ))}
            {urls.length > 3 && (
              <div className="h-9 w-9 rounded-lg border border-border/60 bg-foreground/[0.04] flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                +{urls.length - 3}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <CheckCircle size={8} className="text-primary" />
              <span className="text-[8px] font-bold text-primary uppercase tracking-wide">Verified Receipt</span>
            </div>
            <span className="text-[9px] font-bold text-foreground">
              {urls.length} image{urls.length > 1 ? "s" : ""} — click to view
            </span>
          </div>
        </button>
      )}

      {/* Footer — name only, no avatar, no stars */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
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

export function Testimonials() {
  const [proofs, setProofs] = React.useState<Proof[]>([])
  const [loading, setLoading] = React.useState(true)
  const [zoomedImages, setZoomedImages] = React.useState<string[]>([])
  const [zoomedIndex, setZoomedIndex] = React.useState(0)
  const [showDailyPayments, setShowDailyPayments] = React.useState(false)

  React.useEffect(() => {
    fetch("https://api.gcx.co.in/api/reviews")
      .then(r => r.json())
      .then(data => { setProofs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const openZoom = (images: string[], index = 0) => { setZoomedImages(images); setZoomedIndex(index) }
  const closeZoom = () => { setZoomedImages([]); setZoomedIndex(0) }

  return (
    <section id="testimonials" className="relative py-10 sm:py-14 border-t border-border/40 overflow-hidden">
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-modal-fade { animation: modalFadeIn 0.2s ease-out forwards; }
        .animate-modal-scale { animation: modalScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-[10px] font-bold font-sans uppercase tracking-wider text-primary mb-4">Verified Proofs</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display mb-4 tracking-tight leading-tight text-foreground">
            Real payouts, <span className="text-gradient">verified receipts</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto font-sans">
            Every proof is reviewed and published by admin only. No user submissions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Admin Verified", value: proofs.length > 0 ? `${proofs.length} Proofs` : "—" },
            { label: "Payout Success", value: "100%" },
            { label: "Settlement", value: "< 2h avg" },
            { label: "Proof Type", value: "Receipt Only" },
          ].map(s => (
            <div key={s.label} className="bg-card/50 border border-border/30 rounded-2xl p-4 text-left backdrop-blur-sm">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">{s.label}</span>
              <span className="text-sm font-bold font-display text-foreground mt-1.5 block">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Proofs grid — ALL proofs, no filter, no grouping */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[1.5rem] border border-border/40 bg-card/40 p-4 h-52 animate-pulse" />
            ))}
          </div>
        ) : proofs.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">No proofs published yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proofs.map(p => (
              <ProofCard key={p.id} proof={p} onZoom={openZoom} />
            ))}
          </div>
        )}

        {/* View All + Daily Payments */}
        <div className="mt-10 max-w-4xl mx-auto space-y-4">
          {/* Daily basis payments toggle */}
          <button
            type="button"
            onClick={() => setShowDailyPayments(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-card/60 border border-primary/20 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Calendar size={14} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">Daily Basis Payments</p>
                <p className="text-[10px] text-muted-foreground">View all daily payout settlements</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
                {STATIC_DAILY_PAYOUTS.length} records
              </span>
              {showDailyPayments
                ? <ChevronUp size={16} className="text-primary" />
                : <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />}
            </div>
          </button>

          {showDailyPayments && (
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
              <div className="grid grid-cols-5 gap-2 px-5 py-3 border-b border-border/40 bg-foreground/[0.02]">
                {["Date", "Amount", "Card Type", "Method", "Status"].map(h => (
                  <span key={h} className="text-[9px] font-bold font-mono uppercase tracking-wider text-muted-foreground">{h}</span>
                ))}
              </div>
              {STATIC_DAILY_PAYOUTS.map((row, idx) => (
                <div key={row.id} className={`grid grid-cols-5 gap-2 px-5 py-3 text-xs border-b border-border/20 last:border-0 hover:bg-foreground/[0.015] transition-colors ${idx % 2 === 0 ? "" : "bg-foreground/[0.006]"}`}>
                  <span className="font-mono text-[10px] text-muted-foreground">{new Date(row.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                  <span className="font-bold text-emerald-400 text-[11px]">{row.amount}</span>
                  <span className="text-foreground font-semibold text-[10px]">{row.cardType}</span>
                  <span className="text-muted-foreground text-[10px]">{row.method}</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 w-fit flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />{row.status}
                  </span>
                </div>
              ))}
              <div className="px-5 py-3 text-[9px] text-muted-foreground font-sans border-t border-border/40 bg-foreground/[0.01]">
                Showing {STATIC_DAILY_PAYOUTS.length} most recent daily settlement records.
              </div>
            </div>
          )}

          {/* View all CTA */}
          <div className="text-center pt-2">
            <a
              href="/proofs"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground/[0.03] border border-border/50 text-foreground hover:border-primary/50 hover:text-primary px-6 py-3.5 text-xs font-bold transition-all duration-300 cursor-pointer shadow-md"
            >
              View All Verified Proofs & Receipts →
            </a>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImages.length > 0 && (
        <div onClick={closeZoom} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-modal-fade">
          <div onClick={e => e.stopPropagation()} className="relative max-w-4xl max-h-[85vh] rounded-[2rem] overflow-hidden border border-border/80 shadow-2xl bg-card p-3 flex flex-col items-center justify-center select-none animate-modal-scale">
            <div className="relative flex items-center justify-center max-w-full max-h-[75vh]">
              <img src={zoomedImages[zoomedIndex]} alt={`Receipt ${zoomedIndex + 1}`} className="max-w-full max-h-[70vh] object-contain rounded-xl bg-black/40 border border-border/40" />
              {zoomedImages.length > 1 && (
                <>
                  <button type="button" onClick={e => { e.stopPropagation(); setZoomedIndex(prev => prev > 0 ? prev - 1 : zoomedImages.length - 1) }} className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition shadow-lg border border-white/10 cursor-pointer">
                    <ChevronLeft size={20} className="stroke-[2.5]" />
                  </button>
                  <button type="button" onClick={e => { e.stopPropagation(); setZoomedIndex(prev => prev < zoomedImages.length - 1 ? prev + 1 : 0) }} className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition shadow-lg border border-white/10 cursor-pointer">
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
    </section>
  )
}

export default Testimonials
