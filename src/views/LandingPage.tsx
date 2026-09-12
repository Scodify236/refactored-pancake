import * as React from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Marquee from "../components/Marquee"
import Brands from "../components/Brands"
import HowItWorks from "../components/HowItWorks"
import Payouts from "../components/Payouts"
import Testimonials from "../components/Testimonials"
import FAQ from "../components/FAQ"
import CTA from "../components/CTA"
import Footer from "../components/Footer"

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/30 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Feature Marquee */}
      <Marquee />

      {/* Brands Cards */}
      <div className="content-auto">
        <Brands />
      </div>

      {/* How It Works Section */}
      <div className="content-auto">
        <HowItWorks />
      </div>

      {/* Payout Options */}
      <div className="content-auto">
        <Payouts />
      </div>

      {/* Testimonials Reviews Section */}
      <div className="content-auto">
        <Testimonials />
      </div>

      {/* FAQ Accordion Section */}
      <div className="content-auto">
        <FAQ />
      </div>

      {/* CTA Section */}
      <div className="content-auto">
        <CTA />
      </div>

      {/* Page Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
