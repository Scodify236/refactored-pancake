import * as React from "react"
import { Link } from "./router"
import { Smartphone, Shield, Gift, Upload, CheckCircle, Loader2 } from "lucide-react"

const PAYOUTS_DATA = [
  {
    num: "01",
    icon: Smartphone,
    iconClass: "text-primary h-6 w-6",
    title: "UPI Bank Transfer",
    desc: "Instant direct bank deposit routed via UPI. Cash out straight to PhonePe, Paytm, Google Pay, or BHIM instantly.",
  },
  {
    num: "02",
    icon: Shield,
    iconClass: "text-rose-400 h-6 w-6",
    title: "USDT Crypto Address",
    desc: "Receive stablecoins directly to your Web3 wallet address. Supports low-fee TRC-20, ERC-20, and Polygon networks.",
  },
  {
    num: "03",
    icon: Gift,
    iconClass: "text-amber-400 h-6 w-6",
    title: "Voucher Swap 1:1",
    desc: "Swap your card balance for another digital brand voucher of equivalent value like Steam, Apple, or PlayStation.",
  },
]

interface PayoutRun {
  id: string | number
  submission_date: string
  payout_date: string
  amount: string
  card_type: string
  method: string
  status: string
}

export function Payouts() {
  const [payouts, setPayouts] = React.useState<PayoutRun[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("https://api.gcx.co.in/api/payouts")
      .then(r => r.json())
      .then((data: PayoutRun[]) => {
        setPayouts(Array.isArray(data) ? data : [])
      })
      .catch(() => setPayouts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="payouts" className="relative py-10 sm:py-14 border-t border-border/40 overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
          <p className="text-[10px] font-bold font-sans uppercase tracking-wider text-primary mb-4">Payout options</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display mb-5 tracking-tight leading-tight text-foreground">
            Get paid your <span className="text-gradient">way</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-sans">
            Three automated channels to disburse your funds. Pick whichever route matches your financial setup.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 relative z-10 mb-12">
          {PAYOUTS_DATA.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.num}
                className="liquid-glass rounded-[2rem] p-7 flex flex-col justify-between border border-border/60 group hover:border-border/85 hover:bg-foreground/[0.015] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-11 w-11 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center shadow-lg">
                    <Icon className={item.iconClass} />
                  </div>
                  <span className="text-3xl sm:text-4xl font-bold font-sans text-muted-foreground/20 tracking-tight group-hover:text-primary transition-all duration-500">
                    {item.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Live Payout Tracker Section */}
        <div className="relative z-10 border-t border-border/40 pt-10">
          <div className="text-center mb-6 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-[9px] font-bold font-sans uppercase tracking-wider text-primary mb-4 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Payout Schedules
            </div>
            <h3 className="text-xl sm:text-3xl font-bold font-display mb-3 tracking-tight text-foreground">
              Payout <span className="text-gradient">Time Tracker</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans">
              We process card submissions on scheduled runs. Submission opening dates and payout timelines for all accepted cards are listed below.
            </p>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="animate-spin text-primary h-7 w-7" />
                <span className="text-xs text-muted-foreground font-mono">Loading schedule...</span>
              </div>
            ) : payouts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm font-mono">
                No payout runs scheduled yet.
              </div>
            ) : (
              <div className={`grid gap-6 ${
                payouts.length === 1
                  ? "grid-cols-1 max-w-sm mx-auto"
                  : payouts.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}>
                {payouts.map((p, idx) => {
                  const sub = new Date(p.submission_date)
                  const pay = new Date(p.payout_date)
                  const diffDays = Math.ceil(Math.abs(pay.getTime() - sub.getTime()) / (1000 * 60 * 60 * 24))
                  const isSettled = pay <= new Date()

                  return (
                    <div key={p.id} className="relative overflow-hidden liquid-glass rounded-[2rem] p-6 border border-border/50 hover:border-border/80 hover:bg-foreground/[0.01] transition-all duration-300 flex flex-col justify-between bg-background">
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-muted-foreground bg-foreground/[0.02] border border-border/60 rounded-full px-3 py-1">
                          Run #{idx + 1}
                        </span>
                        {isSettled ? (
                          <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm font-sans">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Settled &amp; Disbursed
                          </span>
                        ) : (
                          <span className="text-[9.5px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm font-sans">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Processing Run
                          </span>
                        )}
                      </div>

                      <div className="relative flex items-center justify-between my-5 px-1">
                        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1px] pointer-events-none z-0">
                          <div className={`h-full w-full ${isSettled ? "border-t border-emerald-500/30" : "border-t border-dashed border-border/80"}`} />
                        </div>

                        <div className="relative z-10 flex flex-col items-center select-none">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center border shadow-md transition duration-300 ${isSettled ? "bg-emerald-950/80 border-emerald-500 text-emerald-400" : "bg-secondary border-border text-muted-foreground"}`}>
                            <Upload size={13} className="stroke-[2.5]" />
                          </div>
                          <span className="text-[8px] font-sans font-bold text-muted-foreground mt-2 uppercase tracking-wider">Submitted</span>
                          <span className="text-[10px] font-bold text-foreground mt-0.5">
                            {sub.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        </div>

                        <div className="relative z-20 px-2.5 py-0.5 rounded-full bg-background border border-border/80 text-[7.5px] font-bold text-primary uppercase tracking-wider shadow-sm font-sans">
                          ⚡ {diffDays}d Run
                        </div>

                        <div className="relative z-10 flex flex-col items-center select-none">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center border shadow-md transition duration-300 ${isSettled ? "bg-emerald-950/80 border-emerald-500 text-emerald-400" : "bg-secondary border-border text-muted-foreground"}`}>
                            <CheckCircle size={13} className="stroke-[2.5]" />
                          </div>
                          <span className="text-[8px] font-sans font-bold text-muted-foreground mt-2 uppercase tracking-wider">Disbursed</span>
                          <span className="text-[10px] font-bold text-foreground mt-0.5">
                            {pay.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-border/30 pt-3 flex justify-between items-center text-[9px] text-muted-foreground font-sans">
                        <span>Timeline Cycle:</span>
                        <span className="font-semibold text-foreground">
                          {isSettled ? "100% Disbursed on Schedule" : "Settlement Pending"}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* WHATSAPP BANNER */}
            <div className="pt-8 text-center">
              <div className="liquid-glass rounded-[2rem] border border-border/60 p-6 sm:p-8 max-w-2xl mx-auto relative overflow-hidden shadow-xl hover:border-primary/30 transition-all duration-300">
                <p className="text-xs sm:text-sm font-bold text-foreground mb-4 leading-relaxed max-w-md mx-auto">
                  For real-time updates on payout settlements, schedule modifications, and current rate changes:
                </p>
                <a
                  href="https://whatsapp.com/channel/0029Vb5lJ3g35fLoqQl2QZ0K"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-block p-px rounded-full bg-slate-800 text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900 cursor-pointer text-center overflow-hidden"
                >
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(16,185,129,0.6)_0%,rgba(16,185,129,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <div className="relative flex items-center justify-center space-x-2 rounded-full bg-zinc-950 py-3.5 px-6 ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-zinc-900/80">
                    <svg className="h-4 w-4 fill-current shrink-0 text-emerald-400" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.484 2.016 14.1 1.01 11.69 1.01c-5.433 0-9.858 4.37-9.862 9.8-.001 1.76.476 3.483 1.383 4.985l-.998 3.642 3.834-.993zm11.233-5.288c-.288-.144-1.701-.84-1.964-.936-.263-.096-.454-.144-.645.144-.191.288-.741.936-.908 1.128-.167.192-.335.216-.623.072-1.359-.68-2.336-1.189-3.266-2.793-.245-.424.245-.394.7-.1.408-.266.454-.456.68-.84.228-.384.114-.72-.056-.864-.17-.144-1.454-3.51-1.996-4.814-.528-1.272-1.066-1.099-1.454-1.119-.377-.02-.81-.023-1.243-.023-.433 0-1.139.163-1.733.816-.595.653-2.268 2.219-2.268 5.412 0 3.193 2.315 6.273 2.637 6.708.322.434 4.558 6.963 11.047 9.77.712.308 1.267.491 1.7.63.715.228 1.366.196 1.881.119.574-.085 1.701-.696 1.94-.816.239-.12.397-.576.335-.816-.062-.24-.263-.384-.55-.528z" />
                    </svg>
                    <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100">
                      Follow GCX Channel on WhatsApp
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Appeal/Complaint Banner */}
            <div className="pt-8 text-center max-w-2xl mx-auto">
              <div className="liquid-glass rounded-[1.8rem] border border-red-500/20 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-lg hover:border-red-500/35 transition-all duration-300">
                <div className="text-center sm:text-left z-10">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold mb-1">Payment Delayed?</p>
                  <p className="text-xs sm:text-sm text-foreground font-semibold leading-normal">
                    Have you not received your payment even after the payout date?
                  </p>
                </div>
                <Link
                  to="/appeal"
                  className="group relative inline-block p-px rounded-full bg-red-950 text-xs font-semibold leading-6 text-white no-underline shadow-lg cursor-pointer text-center overflow-hidden shrink-0 z-10"
                >
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(239,68,68,0.6)_0%,rgba(239,68,68,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <div className="relative flex items-center justify-center space-x-2 rounded-full bg-zinc-950 py-3.5 px-6 ring-1 ring-red-500/20 transition-colors duration-300 group-hover:bg-red-950/20">
                    <span className="text-xs font-bold text-red-400 group-hover:text-red-300 transition-colors duration-300">
                      File an Appeal / Complaint →
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Payouts
