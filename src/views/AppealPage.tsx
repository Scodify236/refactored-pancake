import * as React from "react"
import { Link } from "../components/router"
import { ArrowLeft, ShieldCheck, Mail, Send, Loader2, CheckCircle2 } from "lucide-react"
import Navbar from "../components/Navbar"
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
import { toast } from "sonner"

export function AppealPage() {
  // Form states
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [cardType, setCardType] = React.useState("Amazon")
  const [email, setEmail] = React.useState("")
  const [payoutAddress, setPayoutAddress] = React.useState("")
  const [details, setDetails] = React.useState("")

  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim() || !phone.trim() || !email.trim() || !payoutAddress.trim()) {
      setError("Please fill in all mandatory fields.")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("https://api.gcx.co.in/api/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          card_type: cardType,
          email,
          payout_address: payoutAddress,
          details
        })
      })

      if (res.ok) {
        setSubmitted(true)
        toast.success("Appeal submitted successfully!")
        setName("")
        setPhone("")
        setCardType("Amazon")
        setEmail("")
        setPayoutAddress("")
        setDetails("")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to submit appeal. Please try again.")
        toast.error(data.error || "Failed to submit appeal.")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to connect to server. Check your connection.")
      toast.error("Failed to connect to server.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen pt-28 pb-16 overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-2xl px-4 z-10">
        {/* Back Link */}
        <div className="mb-6 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition font-mono font-semibold">
            <ArrowLeft size={13} /> Back to Home
          </Link>
        </div>

        {submitted ? (
          <Card className="border border-border/30 text-center shadow-2xl relative overflow-hidden bg-card liquid-glass rounded-[2.5rem] p-8 sm:p-12">
            <CardContent className="space-y-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center text-emerald-400/90 mb-2 shadow-sm">
                <CheckCircle2 size={32} />
              </div>

              <h2 className="text-xl sm:text-3xl font-black font-display text-foreground">
                Appeal Submitted
              </h2>

              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Thank you. Your complaint has been successfully registered. Our support team is currently investigating your transaction data.
              </p>

              <div className="inline-flex items-center gap-2 p-3.5 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-left max-w-sm">
                <Mail size={16} className="shrink-0" />
                <span className="text-[10px] font-mono leading-normal font-semibold">
                  You will be notified through email once the audit is complete.
                </span>
              </div>

              <div>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-xl bg-foreground/[0.04] border border-border text-foreground text-xs px-6 py-3 hover:bg-foreground/[0.08] transition font-bold font-sans"
                >
                  Back to Homepage
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border/30 shadow-2xl relative overflow-hidden bg-card liquid-glass rounded-[2.5rem]">
            <CardHeader className="text-center p-6 sm:p-10 pb-4">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-red-400 mb-4 w-fit">
                Payout Support
              </div>
              <CardTitle className="text-2xl sm:text-4xl font-black font-display tracking-tight text-foreground">
                File a <span className="text-gradient">Complaint / Appeal</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto">
                Have you submitted a card but haven't received your funds after the scheduled payout date? Let us know and we'll investigate it immediately.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-10 pb-8 sm:pb-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                </div>

                {/* Card Brand & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cardType" className="text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground">
                      Submitted Card Type *
                    </Label>
                    <Select
                      value={cardType}
                      onValueChange={(val) => setCardType(val)}
                    >
                      <SelectTrigger id="cardType" className="w-full h-9 bg-background border border-input text-left text-sm">
                        <SelectValue placeholder="Select Card Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Amazon">Amazon</SelectItem>
                        <SelectItem value="Flipkart">Flipkart</SelectItem>
                        <SelectItem value="Roblox">Roblox</SelectItem>
                        <SelectItem value="League of Legends">League of Legends</SelectItem>
                        <SelectItem value="Overwatch 2">Overwatch 2</SelectItem>
                        <SelectItem value="Sea of Thieves">Sea of Thieves</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground">
                      Email Address *
                    </Label>
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

                {/* Payout Details */}
                <div className="grid gap-2">
                  <Label htmlFor="payoutAddress" className="text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground">
                    UPI ID or Crypto Wallet Address *
                  </Label>
                  <Input
                    id="payoutAddress"
                    type="text"
                    required
                    value={payoutAddress}
                    onChange={(e) => setPayoutAddress(e.target.value)}
                    placeholder="e.g. aarav@ybl OR USDT Wallet Address"
                    className="font-mono"
                  />
                </div>

                {/* Extra Details */}
                <div className="grid gap-2">
                  <Label htmlFor="details" className="text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground">
                    Extra Details & Message (Optional)
                  </Label>
                  <Textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Enter card batch details, times, or any context regarding the delay..."
                    rows={4}
                  />
                </div>

                {/* Reassurance Badge */}
                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 text-muted-foreground">
                  <ShieldCheck size={18} className="shrink-0 text-emerald-500/80 mt-0.5" />
                  <span className="text-[10px] leading-relaxed">
                    <strong className="text-foreground font-semibold">Your data is fully secured:</strong> We use industry-standard encryption to protect your privacy and transaction data.
                  </span>
                </div>

                {/* Form Error */}
                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      <span>Submitting appeal...</span>
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Submit Appeal / Complaint</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AppealPage
