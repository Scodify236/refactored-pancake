import * as React from "react"
import { ArrowLeft } from "lucide-react"
import { Link } from "../components/router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export function TermsPage() {
  return (
    <div className="relative min-h-screen pt-32 pb-12 overflow-hidden flex flex-col justify-between bg-background">
      <Navbar />

      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-4xl px-4 z-10 w-full flex-grow">
        {/* Back Link */}
        <div className="mb-6 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition font-sans font-semibold">
            <ArrowLeft size={13} /> Back to Home
          </Link>
        </div>

        {/* Title */}
        <div className="mb-10 text-left border-b border-border/40 pb-6">
          <p className="text-[10px] font-bold font-sans uppercase tracking-wider text-primary mb-2">Legal Docs</p>
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-xs text-muted-foreground mt-3 font-sans">
            Last Updated: June 11, 2026
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans max-w-3xl">
          <p>
            Please read these Terms of Service ("Terms") carefully before using the GCX platform ("Service"). By accessing or using our Service, you agree to be bound by these Terms.
          </p>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">1. Gift Card Trade Eligibility</h2>
            <p>
              By submitting a gift card to GCX, you warrant and represent that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The gift card is legally acquired, authentic, and has a full valid balance matching your submission.</li>
              <li>You are the sole owner of the card and have the authority to transfer the balance.</li>
              <li>The card has not been, and will not be, redeemed on any other platform or by any other party after submission.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">2. Rates & Quote Lock</h2>
            <p>
              Exchange rates displayed on the platform represent market demand and liquidity. Rates are locked the moment a trade is initiated with support operators. GCX reserves the right to modify rates dynamically, but once a trade is validated and initialized, the specified payout amount will be honored.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">3. Submission Verification & Payout Runs</h2>
            <p>
              All card submissions undergo manual and automated balance validation runs:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Payout runs are processed on scheduled days. Estimated payout deadlines are visible on the Payout Time Tracker.</li>
              <li>Trades are non-refundable once the validation process begins. We cannot reverse submissions or restore codes.</li>
              <li>In the event of a validation failure (e.g. used/invalid codes), the transaction will be canceled.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">4. Zero-Tolerance Fraud Policy</h2>
            <p>
              GCX actively enforces compliance and anti-fraud protocols. Submitting pre-redeemed, locked, stolen, or fake gift cards constitutes fraud.
            </p>
            <p>
              We log IP addresses, names, and transaction records. Verified fraudulent attempts will result in an immediate ban, withholding of any pending payouts, and reporting to relevant cybercrime authorities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">5. Limitation of Liability</h2>
            <p>
              GCX will not be liable for losses resulting from user entry errors (e.g. incorrect UPI IDs, invalid crypto wallet addresses, or typing mistakes in submitted bank codes). It is the user's absolute responsibility to double-check disbursement credentials before completing submissions.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TermsPage
