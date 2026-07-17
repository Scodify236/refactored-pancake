import * as React from "react"
import { ArrowLeft, Mail, HelpCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Link } from "../components/router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SupportPage() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [subject, setSubject] = React.useState("General Inquiry")
  const [message, setMessage] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all required fields.")
      return
    }

    setSubmitting(true)

    // Simulate server call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setSuccess(true)
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setError("Failed to send support ticket. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen pt-32 pb-12 overflow-hidden flex flex-col justify-between bg-background">
      <Navbar />

      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-5xl px-4 z-10 w-full flex-grow">
        {/* Back Link */}
        <div className="mb-6 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition font-sans font-semibold">
            <ArrowLeft size={13} /> Back to Home
          </Link>
        </div>

        {/* Title */}
        <div className="mb-12 text-left border-b border-border/40 pb-6">
          <p className="text-[10px] font-bold font-sans uppercase tracking-wider text-primary mb-2">Help Center</p>
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground">
            GCX Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 font-sans">
            Need assistance with a trade, payout schedule, or dispute? We are online 24/7.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-start mb-12">
          {/* Left panel: Quick contacts */}
          <div className="md:col-span-2 space-y-6">
            <div className="liquid-glass rounded-[2rem] p-6 border border-border/60 space-y-5">
              <h3 className="text-sm font-bold text-foreground font-display mb-1 flex items-center gap-2">
                <HelpCircle size={16} className="text-primary" /> Contact Channels
              </h3>
              
              {/* WhatsApp card */}
              <a
                href="https://wa.me/919120138828"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-2xl bg-foreground/[0.015] border border-border hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
                    <svg
                      viewBox="0 0 32 32"
                      className="w-[15px] h-[15px] fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider group-hover:text-emerald-400 transition">WhatsApp Live Support</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                      Chat directly with our verification operators. Typical response time under 5 minutes.
                    </p>
                  </div>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:support@gcx.co.in"
                className="block p-4 rounded-2xl bg-foreground/[0.015] border border-border hover:border-primary/45 hover:bg-primary/[0.02] transition duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition">
                    <Mail size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider group-hover:text-primary transition">Email Support</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                      Send us details or business proposals. Checked continuously: <span className="font-semibold">support@gcx.co.in</span>
                    </p>
                  </div>
                </div>
              </a>
            </div>

            {/* Quick action banners */}
            <div className="liquid-glass rounded-[2rem] p-6 border border-border/60 space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">Delayed Payout?</h4>
              <p className="text-[11px] text-muted-foreground leading-normal">
                If your submission dates have elapsed and payment hasn't arrived, please file an official complaint immediately for manual intervention.
              </p>
              <Link
                to="/appeal"
                className="w-full text-center rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 text-[11px] transition block cursor-pointer"
              >
                File an Appeal / Dispute ➔
              </Link>
            </div>
          </div>

          {/* Right panel: Support ticketing form using shadcn Card */}
          <Card className="md:col-span-3 border border-border/60 liquid-glass rounded-[2rem]">
            <CardHeader className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
              <CardTitle className="text-sm sm:text-base font-bold text-foreground font-display">Send a Message</CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground font-sans">Fill out the form below, and we'll open a ticket to assist you.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                    />
                  </div>
                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aarav@gmail.com"
                    />
                  </div>
                </div>

                {/* Subject dropdown */}
                <div className="grid gap-2">
                  <Label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Inquiry Type *</Label>
                    <Select
                      value={subject}
                      onValueChange={(val) => setSubject(val)}
                    >
                      <SelectTrigger id="subject" className="w-full h-9 bg-background border border-input text-left text-sm">
                        <SelectValue placeholder="Select Inquiry Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        <SelectItem value="Exchange Rates">Rate Inquiry</SelectItem>
                        <SelectItem value="Payout Issue">Payout / Transaction Issue</SelectItem>
                        <SelectItem value="Partnership">Partnership Proposal</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                {/* Message */}
                <div className="grid gap-2">
                  <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Message / Details *</Label>
                  <Textarea
                    id="message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Detail your inquiry, specify card values, variant names, or transaction numbers if applicable..."
                    rows={5}
                  />
                </div>

                {/* Status messages */}
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                
                {success && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2 animate-pulse">
                    <CheckCircle size={14} className="shrink-0 mt-0.5" />
                    <span>Your support ticket has been sent! Check your inbox for updates.</span>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin h-3.5 w-3.5" />
                      <span>Sending Ticket...</span>
                    </>
                  ) : (
                    <span>Send Ticket</span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SupportPage
