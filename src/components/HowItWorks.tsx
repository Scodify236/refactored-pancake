import * as React from "react"
import { TiltCard } from "./TiltCard"
import { CreditCard, Users, Coins } from "lucide-react"

const STEPS = [
  {
    num: "01",
    icon: CreditCard,
    iconClass: "text-primary h-6 w-6",
    title: "Submit Your Card",
    desc: "Provide your unused Amazon, Flipkart, or gaming gift cards. Our secure system processes the card credentials in seconds.",
  },
  {
    num: "02",
    icon: Users,
    iconClass: "text-rose-400 h-6 w-6",
    title: "We Match & Sell",
    desc: "We securely list and sell the cards to verified buyers who need them, operating as a trusted, high-volume brokerage.",
  },
  {
    num: "03",
    icon: Coins,
    iconClass: "text-amber-400 h-6 w-6",
    title: "Get Paid minus Brokerage",
    desc: "Once the card is redeemed by the buyer, we take a minor brokerage fee and instantly transfer the remaining funds to your UPI or USDT wallet.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative py-10 sm:py-14 border-t border-border/40 overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-4">The Process</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-5 tracking-tight leading-tight text-foreground">
            How it works
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-sans">
            We act as a secure bridge between cardholders and buyers, taking care of the escrow and payout logistics.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.num} className="h-full">
                <TiltCard
                  className="liquid-glass rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden transition-all duration-300 border border-border/60 group hover:border-border/85 hover:bg-foreground/[0.015]"
                  intensity={10}
                >
                  <div className="relative flex flex-col h-full" style={{ transformStyle: "preserve-3d" }}>
                    {/* Top Segment: Step number + Icon */}
                    <div className="flex items-center justify-between mb-8" style={{ transform: "translateZ(30px)" }}>
                      <div className="h-12 w-12 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center shadow-lg">
                        <Icon className={step.iconClass} />
                      </div>
                      <span className="text-3xl sm:text-4xl font-bold font-mono text-muted-foreground/30 tracking-tight group-hover:text-primary transition-all duration-500">
                        {step.num}
                      </span>
                    </div>

                    {/* Body Segment: Title + Description */}
                    <div className="mt-4" style={{ transform: "translateZ(20px)" }}>
                      <h3 className="text-lg sm:text-xl font-bold font-display mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
