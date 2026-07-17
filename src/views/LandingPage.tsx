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
      <style>{`
        .liquid-glass {
          backdrop-filter: blur(24px) saturate(190%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(190%) !important;
        }
        .glass {
          backdrop-filter: blur(24px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
        }
      `}</style>
      
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Feature Marquee */}
      <Marquee />

      {/* Brands Cards */}
      <Brands />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Payout Options */}
      <Payouts />

      {/* Testimonials Reviews Section */}
      <Testimonials />

      {/* FAQ Accordion Section */}
      <FAQ />

      {/* CTA Section */}
      <CTA />

      {/* Page Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
