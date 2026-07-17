import * as React from "react"
import { ArrowLeft } from "lucide-react"
import { Link } from "../components/router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground mt-3 font-sans">
            Last Updated: June 11, 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans max-w-3xl">
          <p>
            At GCX, we prioritize the protection of your personal and financial information. This Privacy Policy describes how we collect, use, process, and secure your data when you visit our website, use our services, or trade gift cards through our platform.
          </p>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">1. Information We Collect</h2>
            <p>
              We collect the minimum amount of information necessary to process gift card trades and disburse payouts securely. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Personal Identifiers:</strong> Name, email address, and mobile number.</li>
              <li><strong>Financial Information:</strong> UPI IDs, bank account details, and cryptocurrency wallet addresses (for processing disbursements).</li>
              <li><strong>Transaction Records:</strong> Gift card details, transaction receipts, verification screenshots, and dates of trade.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">2. How We Use Your Data</h2>
            <p>
              We process your personal information to fulfill contract obligations and run our platform. We use it to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Process and verify gift card submissions.</li>
              <li>Disburse payouts via UPI, bank transfer, or USDT.</li>
              <li>Authenticate client appeals, prevent double-spend fraud, and manage support tickets.</li>
              <li>Fulfill statutory reporting and legislative requirements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">3. Security Practices</h2>
            <p>
              We implement industry-standard administrative, physical, and technological security controls:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All database entries and logs are stored behind secure credential layers.</li>
              <li>Transaction screenshots and proof records are housed in secure, isolated storage bins.</li>
              <li>We never store or share raw gift card codes after validation is complete.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">4. Data Sharing & Retention</h2>
            <p>
              We do not sell, rent, or lease your personal data. We only share details with payment processors (like banks and cryptocurrency node providers) to complete payouts. We retain personal and transaction details only as long as necessary to resolve potential trade disputes or fulfill legal obligations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground font-display">5. Contact Information</h2>
            <p>
              If you have any questions, concerns, or requests regarding your data privacy, please reach out to our legal desk at <a href="mailto:support@gcx.co.in" className="text-primary hover:underline font-semibold">support@gcx.co.in</a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PrivacyPage
