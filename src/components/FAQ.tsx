import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

const FAQ_DATA = [
  {
    q: "How long does a typical card cashout take?",
    a: "Trades typically complete within 5 days. Once your gift card details are verified, our payout ledger routes your bank UPI or USDT stablecoin transfer securely."
  },
  {
    q: "What types of gift cards can I sell here?",
    a: "Currently, GCX supports Amazon Retail Cards, Flipkart Cards, Roblox (Robux Value Cards), and League of Legends (RP Cards). We are expanding our integrations and will soon support Steam, PlayStation Network, and Apple Store cards."
  },
  {
    q: "Is UPI and Crypto payment route secure?",
    a: "Absolutely. We use end-to-end TLS 1.3 encryption and automated smart routers. For UPI, transactions go through secured banking gateways. For USDT, funds are disbursed directly via decentralized liquidity smart contracts on the TRON/Ethereum blockchain, leaving zero room for escrow leaks."
  },
  {
    q: "How are exchange rates determined?",
    a: "Exchange rates represent card demand and global market liquidity. Amazon has the highest rate (92%) due to retail demand, while gaming cards (Roblox, League of Legends) trade at 86% to 88%. Payout rates are locked the moment you start a trade."
  }
]

export function FAQ() {
  return (
    <section id="faq" className="relative py-10 sm:py-14 border-t border-border/40 overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="relative mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-3">FAQ</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-foreground leading-tight">Frequently asked <span className="text-gradient">questions</span></h2>
        </div>

        <div className="flex flex-col gap-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQ_DATA.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`} 
                className="liquid-glass rounded-2xl overflow-hidden border border-border/40 px-6 py-1 bg-card hover:bg-foreground/[0.005] transition-colors"
              >
                <AccordionTrigger className="hover:no-underline text-foreground font-semibold text-sm sm:text-base md:text-lg flex justify-between items-center py-4">
                  <div className="flex items-center gap-3 text-left">
                    <HelpCircle size={18} className="text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-xs sm:text-sm leading-relaxed pb-4 pl-8">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default FAQ
