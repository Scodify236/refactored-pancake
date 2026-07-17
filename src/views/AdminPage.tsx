import * as React from "react"
import { Link } from "@/components/router"
import { toast } from "sonner"
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ShieldAlert,
  CreditCard,
  RefreshCw,
  Calendar as CalendarIcon,
  MessageSquare,
  Star,
  PlusCircle,
  ArrowLeft,
  Upload,
  Loader2,
  Image as ImageIcon,
  Copy,
  Layers,
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  LogOut,
  MailCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"


interface Variant {
  id: string | number
  card_id: string | number
  name: string
  inr_rate: string | null
  usdt_rate: string | null
}

interface CardType {
  id: string | number
  name: string
  tag: string
  glow: string
  img: string
  variants: Variant[]
}

interface Payout {
  id: string | number
  submission_date: string
  payout_date: string
  amount: string
  card_type: string
  method: string
}

interface Review {
  id: string | number
  name: string
  role: string
  avatar_url: string
  quote: string
  rating: number
  trade_type: string
  proof_image_url: string
  region: string | null
  gc_received_date: string
  payment_sent_date: string
  created_at?: string
  admin_notes?: string | null
}

interface Appeal {
  id: string | number
  name: string
  phone: string
  email: string
  card_type: string
  payout_address: string
  details: string
  status: string
  adminNotes: string | null
  created_at: string
}

export function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [token, setToken] = React.useState(localStorage.getItem("adminToken") || "")
  const [otpSent, setOtpSent] = React.useState(false)
  const [otp, setOtp] = React.useState("")
  const [authLoading, setAuthLoading] = React.useState(false)
  const [sessionVerifying, setSessionVerifying] = React.useState(true)

  // Tab state
  const [activeTab, setActiveTab] = React.useState("cards")

  // --- API WRAPPER WITH AUTO-LOGOUT ON 401 ---
  const adminFetch = React.useCallback(async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
      "Authorization": `Bearer ${token}`
    }
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    try {
      const res = await fetch(url, { ...options, headers })
      if (res.status === 401) {
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminTokenExpiry")
        setToken("")
        setIsAuthenticated(false)
        toast.error("Session expired. Please log in again.")
        throw new Error("Unauthorized")
      }
      return res
    } catch (err: any) {
      if (err.message !== "Unauthorized") {
        console.error("Fetch error:", err)
      }
      throw err
    }
  }, [token])

  // --- DATA STATES ---
  const [cards, setCards] = React.useState<CardType[]>([])
  const [loadingCards, setLoadingCards] = React.useState(true)
  const [newCardName, setNewCardName] = React.useState("")
  const [newCardTag, setNewCardTag] = React.useState("Shopping")
  const [newCardGlow, setNewCardGlow] = React.useState("rgba(14, 165, 233, 0.2)")
  const [newCardImg, setNewCardImg] = React.useState("amazon")

  // Variant editing/adding
  const [newVariantName, setNewVariantName] = React.useState("")
  const [newVariantInrRate, setNewVariantInrRate] = React.useState("")
  const [newVariantUsdtRate, setNewVariantUsdtRate] = React.useState("")
  const [addingVariantCardId, setAddingVariantCardId] = React.useState<string | number | null>(null)

  const [editingVariantId, setEditingVariantId] = React.useState<string | number | null>(null)
  const [editingVariantName, setEditingVariantName] = React.useState("")
  const [editingVariantInrRate, setEditingVariantInrRate] = React.useState("")
  const [editingVariantUsdtRate, setEditingVariantUsdtRate] = React.useState("")

  // Payouts state
  const [payouts, setPayouts] = React.useState<Payout[]>([])
  const [loadingPayouts, setLoadingPayouts] = React.useState(true)
  const [payoutSearch, setPayoutSearch] = React.useState("")
  const [payoutFormMode, setPayoutFormMode] = React.useState<"single" | "batch">("single")

  // Single payout run form
  const [singleSubmissionDate, setSingleSubmissionDate] = React.useState("")
  const [singlePayoutDate, setSinglePayoutDate] = React.useState("")
  const [singleAmount] = React.useState("N/A")
  const [singleCardType] = React.useState("All Cards")
  const [singleMethod] = React.useState("Any")

  // Batch payouts form rows
  interface BatchRow {
    submission_date: string
    payout_date: string
    amount: string
    card_type: string
    method: string
  }
  const [batchPayouts, setBatchPayouts] = React.useState<BatchRow[]>([])

  // Editing payout schedules
  const [editingPayoutId, setEditingPayoutId] = React.useState<string | number | null>(null)
  const [editingPayoutSubDate, setEditingPayoutSubDate] = React.useState("")
  const [editingPayoutPayDate, setEditingPayoutPayDate] = React.useState("")

  // Reviews state
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = React.useState(true)
  const [zoomedImgUrl, setZoomedImgUrl] = React.useState<string | null>(null)

  // Add Review Form States
  const [adminNewName, setAdminNewName] = React.useState("")
  const [adminNewRole, setAdminNewRole] = React.useState("Customer")
  const [adminNewCardType, setAdminNewCardType] = React.useState("Amazon")
  const [adminNewTradeType, setAdminNewTradeType] = React.useState("Amazon ➔ UPI")
  const [adminNewRegion, setAdminNewRegion] = React.useState("")
  const [adminNewGcReceivedDate, setAdminNewGcReceivedDate] = React.useState("")
  const [adminNewPaymentSentDate, setAdminNewPaymentSentDate] = React.useState("")
  const [adminNewRating, setAdminNewRating] = React.useState(5)
  const [adminNewQuote, setAdminNewQuote] = React.useState("")
  const [adminNewProofUrls, setAdminNewProofUrls] = React.useState<string[]>([])
  const [adminNewUploading, setAdminNewUploading] = React.useState(false)
  const [adminNewAmount, setAdminNewAmount] = React.useState<number>(0)
  const [adminNewAdminNotes, setAdminNewAdminNotes] = React.useState("")

  // Edit Review Form States
  const [editingReviewId, setEditingReviewId] = React.useState<string | number | null>(null)
  const [editingReviewName, setEditingReviewName] = React.useState("")
  const [editingReviewRole, setEditingReviewRole] = React.useState("")
  const [editingReviewCardType, setEditingReviewCardType] = React.useState("Amazon")
  const [editingReviewTradeType, setEditingReviewTradeType] = React.useState("")
  const [editingReviewRegion, setEditingReviewRegion] = React.useState("")
  const [editingReviewGcReceivedDate, setEditingReviewGcReceivedDate] = React.useState("")
  const [editingReviewPaymentSentDate, setEditingReviewPaymentSentDate] = React.useState("")
  const [editingReviewRating, setEditingReviewRating] = React.useState(5)
  const [editingReviewQuote, setEditingReviewQuote] = React.useState("")
  const [editingReviewProofUrls, setEditingReviewProofUrls] = React.useState<string[]>([])
  const [editingReviewUploading, setEditingReviewUploading] = React.useState(false)
  const [editingReviewAmount, setEditingReviewAmount] = React.useState<number>(0)
  const [editingReviewAdminNotes, setEditingReviewAdminNotes] = React.useState("")

  // Appeals state
  const [appeals, setAppeals] = React.useState<Appeal[]>([])
  const [loadingAppeals, setLoadingAppeals] = React.useState(true)
  const [appealFilterStatus, setAppealFilterStatus] = React.useState("All")

  // Appeal prompt modal states
  const [showAppealActionModal, setShowAppealActionModal] = React.useState(false)
  const [appealActionTarget, setAppealActionTarget] = React.useState<{ id: string | number, status: string } | null>(null)
  const [appealActionNotes, setAppealActionNotes] = React.useState("")
  const [appealActionSubmitLoading, setAppealActionSubmitLoading] = React.useState(false)

  // Fetch all dashboard data
  const fetchAllData = React.useCallback(async () => {
    setLoadingCards(true)
    setLoadingPayouts(true)
    setLoadingReviews(true)
    setLoadingAppeals(true)

    try {
      // Fetch cards
      const cardsRes = await adminFetch("https://api.gcx.co.in/api/cards")
      const cardsData = await cardsRes.json()
      setCards(cardsData)
      setLoadingCards(false)

      // Fetch payouts
      const payoutsRes = await adminFetch("https://api.gcx.co.in/api/payouts")
      const payoutsData = await payoutsRes.json()
      setPayouts(payoutsData)
      setLoadingPayouts(false)

      // Fetch reviews
      const reviewsRes = await adminFetch("https://api.gcx.co.in/api/reviews")
      const reviewsData = await reviewsRes.json()
      const processedReviews = reviewsData.map((r: any) => {
        const createdAt = r.created_at || new Date().toISOString()
        return {
          ...r,
          gc_received_date: r.gc_received_date || new Date(new Date(createdAt).getTime() - 3600 * 1000 * 24 * 3).toISOString(),
          payment_sent_date: r.payment_sent_date || createdAt
        }
      })
      setReviews(processedReviews)
      setLoadingReviews(false)

      // Fetch appeals
      const appealsRes = await adminFetch("https://api.gcx.co.in/api/appeals")
      const appealsData = await appealsRes.json()
      setAppeals(appealsData)
      setLoadingAppeals(false)
    } catch (err) {
      console.error("Error loading dashboard data:", err)
      toast.error("Error loading dashboard data.")
    }
  }, [adminFetch])

  // Verify active session on load
  React.useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem("adminToken")
      const storedExpiry = localStorage.getItem("adminTokenExpiry")

      if (!storedToken || !storedExpiry || Date.now() > parseInt(storedExpiry, 10)) {
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminTokenExpiry")
        setSessionVerifying(false)
        return
      }

      try {
        const res = await fetch("https://api.gcx.co.in/api/auth/verify-session", {
          headers: { "Authorization": `Bearer ${storedToken}` }
        })
        const data = await res.json()
        if (res.ok && data.valid) {
          setIsAuthenticated(true)
          setToken(storedToken)
        } else {
          localStorage.removeItem("adminToken")
          localStorage.removeItem("adminTokenExpiry")
        }
      } catch (err) {
        console.error("Session check failed:", err)
      } finally {
        setSessionVerifying(false)
      }
    }

    checkSession()
  }, [])

  // Once authenticated, fetch dashboard details
  React.useEffect(() => {
    if (isAuthenticated && token) {
      fetchAllData()
      const now = new Date()
      const subStr = now.toISOString().slice(0, 10)
      const payStr = new Date(now.getTime() + 7 * 24 * 3600000).toISOString().slice(0, 10)
      setSingleSubmissionDate(subStr)
      setSinglePayoutDate(payStr)
    }
  }, [isAuthenticated, token, fetchAllData])

  // Setup theme
  React.useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)")
    const applyTheme = () => {
      if (mediaQuery.matches) {
        root.classList.add("light")
      } else {
        root.classList.remove("light")
      }
    }
    applyTheme()
    mediaQuery.addEventListener("change", applyTheme)
    return () => mediaQuery.removeEventListener("change", applyTheme)
  }, [])

  // --- AUTH METHODS ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    try {
      const res = await fetch("https://api.gcx.co.in/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setOtpSent(true)
        toast.success(data.message || "Verification code sent to email.")
      } else {
        toast.error(data.error || "Failed to send OTP.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to connect to backend server.")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) return
    setAuthLoading(true)
    try {
      const res = await fetch("https://api.gcx.co.in/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.trim() })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        localStorage.setItem("adminToken", data.token)
        localStorage.setItem("adminTokenExpiry", data.expiresAt.toString())
        setToken(data.token)
        setIsAuthenticated(true)
        toast.success("Authenticated successfully!")
      } else {
        toast.error(data.error || "Invalid or expired OTP code.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Error verifying code.")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminTokenExpiry")
    setToken("")
    setIsAuthenticated(false)
    setOtpSent(false)
    setOtp("")
    toast.success("Logged out successfully.")
  }

  // --- CARDS CRUD ACTIONS ---
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCardName || !newCardImg || !newCardTag) return
    try {
      const res = await adminFetch("https://api.gcx.co.in/api/cards", {
        method: "POST",
        body: JSON.stringify({ name: newCardName, img: newCardImg, tag: newCardTag, glow: newCardGlow })
      })
      if (res.ok) {
        toast.success("Card brand successfully saved.")
        setNewCardName("")
        const data = await adminFetch("https://api.gcx.co.in/api/cards")
        setCards(await data.json())
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to add brand.")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteCard = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this card brand and all its rates?")) return
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/cards/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Card brand successfully deleted.")
        const data = await adminFetch("https://api.gcx.co.in/api/cards")
        setCards(await data.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  // --- VARIANTS CRUD ACTIONS ---
  const handleAddVariant = async (cardId: string | number) => {
    if (!newVariantName) return
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/cards/${cardId}/variants`, {
        method: "POST",
        body: JSON.stringify({
          name: newVariantName,
          inr_rate: newVariantInrRate || null,
          usdt_rate: newVariantUsdtRate || null
        })
      })
      if (res.ok) {
        toast.success("Variant successfully added.")
        setNewVariantName("")
        setNewVariantInrRate("")
        setNewVariantUsdtRate("")
        setAddingVariantCardId(null)
        const data = await adminFetch("https://api.gcx.co.in/api/cards")
        setCards(await data.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateVariant = async (variantId: string | number) => {
    if (!editingVariantName) return
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/variants/${variantId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editingVariantName,
          inr_rate: editingVariantInrRate || null,
          usdt_rate: editingVariantUsdtRate || null
        })
      })
      if (res.ok) {
        toast.success("Variant updated.")
        setEditingVariantId(null)
        const data = await adminFetch("https://api.gcx.co.in/api/cards")
        setCards(await data.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteVariant = async (variantId: string | number) => {
    if (!confirm("Are you sure you want to delete this variant?")) return
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/variants/${variantId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Variant removed.")
        const data = await adminFetch("https://api.gcx.co.in/api/cards")
        setCards(await data.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  // --- PAYOUT TIMELINE ACTIONS ---
  const handleAddSinglePayout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!singleSubmissionDate || !singlePayoutDate) {
      toast.error("Please select valid timeline dates.")
      return
    }
    try {
      const res = await adminFetch("https://api.gcx.co.in/api/payouts", {
        method: "POST",
        body: JSON.stringify({
          submission_date: singleSubmissionDate,
          payout_date: singlePayoutDate,
          amount: singleAmount,
          card_type: singleCardType,
          method: singleMethod
        })
      })
      if (res.ok) {
        toast.success("Payout schedule logged!")
        const data = await adminFetch("https://api.gcx.co.in/api/payouts")
        setPayouts(await data.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  const addBatchRow = () => {
    const now = new Date()
    const subStr = now.toISOString().slice(0, 10)
    const payStr = new Date(now.getTime() + 7 * 24 * 3600000).toISOString().slice(0, 10)

    setBatchPayouts(prev => [
      ...prev,
      {
        submission_date: subStr,
        payout_date: payStr,
        amount: "N/A",
        card_type: "All Cards",
        method: "Any"
      }
    ])
  }

  const removeBatchRow = (idx: number) => {
    setBatchPayouts(prev => prev.filter((_, i) => i !== idx))
  }

  const handleBatchRowChange = (idx: number, field: keyof BatchRow, val: string) => {
    setBatchPayouts(prev => {
      const updated = [...prev]
      updated[idx] = {
        ...updated[idx],
        [field]: val
      }
      return updated
    })
  }

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (batchPayouts.length === 0) return
    const invalid = batchPayouts.some(b => !b.submission_date || !b.payout_date)
    if (invalid) {
      toast.error("Ensure dates are set for all batch items.")
      return
    }

    try {
      const res = await adminFetch("https://api.gcx.co.in/api/payouts/batch", {
        method: "POST",
        body: JSON.stringify({ payouts: batchPayouts })
      })
      if (res.ok) {
        const data = await res.json()
        toast.success(`Batch timeline success! Created ${data.count} items.`)
        setBatchPayouts([])
        const pData = await adminFetch("https://api.gcx.co.in/api/payouts")
        setPayouts(await pData.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  const startEditingPayout = (p: Payout) => {
    setEditingPayoutId(p.id)
    setEditingPayoutSubDate(p.submission_date ? p.submission_date.slice(0, 10) : "")
    setEditingPayoutPayDate(p.payout_date ? p.payout_date.slice(0, 10) : "")
  }

  const handleUpdatePayout = async (id: string | number) => {
    if (!editingPayoutSubDate || !editingPayoutPayDate) {
      toast.error("Please select valid dates.")
      return
    }
    const payout = payouts.find(p => p.id === id)
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/payouts/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          submission_date: editingPayoutSubDate,
          payout_date: editingPayoutPayDate,
          amount: payout?.amount || "N/A",
          card_type: payout?.card_type || "All Cards",
          method: payout?.method || "Any"
        })
      })
      if (res.ok) {
        toast.success("Payout schedule dates updated.")
        setEditingPayoutId(null)
        const data = await adminFetch("https://api.gcx.co.in/api/payouts")
        setPayouts(await data.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeletePayout = async (id: string | number) => {
    if (!confirm("Delete this timeline record?")) return
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/payouts/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Payout timeline record removed.")
        const data = await adminFetch("https://api.gcx.co.in/api/payouts")
        setPayouts(await data.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  // --- REVIEWS MODERATION ACTIONS ---
  const handleAdminImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (isEdit) setEditingReviewUploading(true)
    else setAdminNewUploading(true)

    try {
      const urls: string[] = []
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("https://veltrixcode-vscode.hf.space/upload", {
          method: "POST",
          body: formData
        })
        const data = await res.json()
        if (data.success && data.url) {
          urls.push(data.url)
        } else {
          toast.error(`Upload failed for ${file.name}`)
        }
      }
      if (urls.length > 0) {
        if (isEdit) setEditingReviewProofUrls(prev => [...prev, ...urls])
        else setAdminNewProofUrls(prev => [...prev, ...urls])
        toast.success(`${urls.length} image(s) uploaded!`)
      }
    } catch (err) {
      console.error(err)
      toast.error("Upload connection error.")
    } finally {
      if (isEdit) setEditingReviewUploading(false)
      else setAdminNewUploading(false)
      e.target.value = ""
    }
  }

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminNewName || !adminNewQuote || !adminNewTradeType || adminNewProofUrls.length === 0) {
      toast.error("Name, proof description, route, and at least one proof image are required.")
      return
    }

    const computedLabel = adminNewAmount >= 50000 ? '₹50k+' : adminNewAmount >= 25000 ? '₹25k+' : adminNewAmount >= 10000 ? '₹10k+' : adminNewAmount >= 5000 ? '₹5k+' : ''

    try {
      const res = await adminFetch("https://api.gcx.co.in/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          name: adminNewName,
          role: adminNewRole,
          avatar_url: "",
          quote: adminNewQuote,
          rating: adminNewRating,
          trade_type: adminNewTradeType,
          proof_image_url: adminNewProofUrls.join("|||"),
          region: adminNewRegion || null,
          gc_received_date: adminNewGcReceivedDate || null,
          payment_sent_date: adminNewPaymentSentDate || null,
          amount: adminNewAmount || 0,
          amount_label: computedLabel,
          admin_notes: adminNewAdminNotes || null
        })
      })
      if (res.ok) {
        toast.success("Proof successfully logged!")
        setAdminNewName("")
        setAdminNewQuote("")
        setAdminNewProofUrls([])
        setAdminNewRegion("")
        setAdminNewGcReceivedDate("")
        setAdminNewPaymentSentDate("")
        setAdminNewRating(5)
        setAdminNewAmount(0)
        const rRes = await adminFetch("https://api.gcx.co.in/api/reviews")
        const rData = await rRes.json()
        setReviews(rData.map((r: any) => ({
          ...r,
          gc_received_date: r.gc_received_date || new Date().toISOString(),
          payment_sent_date: r.payment_sent_date || new Date().toISOString()
        })))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateReview = async (id: string | number) => {
    if (!editingReviewName || !editingReviewQuote || !editingReviewTradeType || editingReviewProofUrls.length === 0) {
      toast.error("All review fields are required.")
      return
    }
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/reviews/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editingReviewName,
          role: editingReviewRole,
          avatar_url: "",
          quote: editingReviewQuote,
          rating: editingReviewRating,
          trade_type: editingReviewTradeType,
          proof_image_url: editingReviewProofUrls.join("|||"),
          region: editingReviewRegion || null,
          gc_received_date: editingReviewGcReceivedDate || null,
          payment_sent_date: editingReviewPaymentSentDate || null,
          admin_notes: editingReviewAdminNotes || null
        })
      })
      if (res.ok) {
        toast.success("Review updated.")
        setEditingReviewId(null)
        const rRes = await adminFetch("https://api.gcx.co.in/api/reviews")
        const rData = await rRes.json()
        setReviews(rData.map((r: any) => ({
          ...r,
          gc_received_date: r.gc_received_date || new Date().toISOString(),
          payment_sent_date: r.payment_sent_date || new Date().toISOString()
        })))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteReview = async (id: string | number) => {
    if (!confirm("Permanently delete this testimonial?")) return
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/reviews/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Review removed.")
        const rRes = await adminFetch("https://api.gcx.co.in/api/reviews")
        const rData = await rRes.json()
        setReviews(rData.map((r: any) => ({
          ...r,
          gc_received_date: r.gc_received_date || new Date().toISOString(),
          payment_sent_date: r.payment_sent_date || new Date().toISOString()
        })))
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to remove review.")
    }
  }

  // --- APPEALS ACTIONS ---
  const handleUpdateAppealStatus = async (id: string | number, status: string, notes: string | null = null) => {
    if ((status === "Resolved" || status === "Rejected") && notes === null) {
      setAppealActionTarget({ id, status })
      setAppealActionNotes("")
      setShowAppealActionModal(true)
      return
    }

    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/appeals/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status, adminNotes: notes })
      })
      if (res.ok) {
        toast.success(`Appeal status updated to ${status}.`)
        const appRes = await adminFetch("https://api.gcx.co.in/api/appeals")
        setAppeals(await appRes.json())
        setShowAppealActionModal(false)
        setAppealActionTarget(null)
      } else {
        const errData = await res.json()
        toast.error(errData.error || "Failed to update appeal status.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to update appeal status.")
    }
  }

  const handleConfirmAppealAction = async (e: React.FormEvent) => {
    e.preventDefault()
    const target = appealActionTarget
    if (!target) return

    const notes = appealActionNotes.trim()
    if (!notes) {
      toast.error("Explanation is required.")
      return
    }

    setAppealActionSubmitLoading(true)
    try {
      await handleUpdateAppealStatus(target.id, target.status, notes)
    } finally {
      setAppealActionSubmitLoading(false)
    }
  }

  const handleDeleteAppeal = async (id: string | number) => {
    if (!confirm("Delete this appeal log permanently?")) return
    try {
      const res = await adminFetch(`https://api.gcx.co.in/api/appeals/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Appeal deleted successfully.")
        const appRes = await adminFetch("https://api.gcx.co.in/api/appeals")
        setAppeals(await appRes.json())
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete appeal.")
    }
  }

  // --- RENDER AUTHENTICATION VIEW ---
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-25" />

      {sessionVerifying ? (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center relative z-10">
          <RefreshCw className="animate-spin text-primary h-10 w-10 mb-4" />
          <p className="text-sm font-mono text-muted-foreground">Verifying staff credentials...</p>
        </div>
      ) : !isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md border border-border/80 shadow-2xl relative z-10 text-center liquid-glass rounded-[2rem]">
            <CardHeader className="p-8 pb-4 flex flex-col items-center">
              <div className="mx-auto w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-4 text-primary shadow-inner">
                <KeyRound size={24} />
              </div>
              <CardTitle className="text-xl font-black font-display tracking-tight text-foreground">
                GCX Staff <span className="text-gradient">Verification</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-2 px-4 leading-relaxed font-semibold">
                {!otpSent
                  ? "Generate a dynamic passcode to unlock administrative rate configuration and client appeal controls."
                  : "Enter the security code emailed to veltrix620@gmail.com. Expires in 1 hour."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-0">
              <div className="mt-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <Button
                      type="submit"
                      disabled={authLoading}
                      className="w-full rounded-full cursor-pointer flex items-center justify-center gap-2"
                    >
                      {authLoading ? <Loader2 size={14} className="animate-spin" /> : <MailCheck size={14} />}
                      Send Security Verification OTP
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 flex flex-col items-center">
                    <div className="grid gap-2 w-full justify-items-center">
                      <Label htmlFor="otp" className="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-1.5 self-start">Verification Code</Label>
                      <InputOTP
                        id="otp"
                        maxLength={6}
                        value={otp}
                        onChange={(val) => setOtp(val)}
                      >
                        <InputOTPGroup className="w-full justify-center">
                          <InputOTPSlot index={0} className="w-12 h-12 text-lg font-bold font-mono" />
                          <InputOTPSlot index={1} className="w-12 h-12 text-lg font-bold font-mono" />
                          <InputOTPSlot index={2} className="w-12 h-12 text-lg font-bold font-mono" />
                          <InputOTPSlot index={3} className="w-12 h-12 text-lg font-bold font-mono" />
                          <InputOTPSlot index={4} className="w-12 h-12 text-lg font-bold font-mono" />
                          <InputOTPSlot index={5} className="w-12 h-12 text-lg font-bold font-mono" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      type="submit"
                      disabled={authLoading || otp.length < 6}
                      className="w-full rounded-full cursor-pointer"
                    >
                      {authLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Verify Code & Access Dashboard
                    </Button>

                    <div className="text-center pt-2">
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleSendOtp}
                        disabled={authLoading}
                        className="text-[10px] font-mono text-muted-foreground hover:text-primary transition bg-transparent border-0 cursor-pointer"
                      >
                        Resend Code
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border/40 text-center">
                <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-semibold">
                  <ArrowLeft size={13} /> Return to Exchange Site
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* --- STAFF DASHBOARD --- */
        <div className="py-12 px-4 sm:px-6 relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/50 pb-8 mb-8 gap-4">
            <div>
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-3 transition font-mono font-semibold uppercase tracking-wider">
                <ArrowLeft size={13} /> Back to Exchange Website
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black font-display flex items-center gap-2.5 tracking-tight">
                <ShieldAlert className="text-primary h-8 w-8" />
                GCX Staff <span className="text-gradient">Admin Center</span>
              </h1>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
              {/* Navigation Tabs */}
              <div className="relative liquid-glass p-0.5 rounded-full flex gap-0.5 border border-border/60 overflow-x-auto no-scrollbar whitespace-nowrap">
                {[
                  { id: "cards", label: "Cards & Rates", icon: CreditCard },
                  { id: "payouts", label: "Payout Logs", icon: CalendarIcon },
                  { id: "reviews", label: "Proofs Moderation", icon: MessageSquare },
                  { id: "appeals", label: "Appeals Center", icon: ShieldAlert },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 z-10 ${
                        activeTab === tab.id
                          ? "text-primary font-semibold bg-primary/10 border border-primary/20"
                          : "text-muted-foreground hover:text-primary border border-transparent bg-transparent"
                      }`}
                    >
                      <Icon size={13} /> {tab.label}
                    </button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="rounded-full cursor-pointer bg-transparent h-9 w-9"
                title="Log Out Session"
              >
                <LogOut size={14} />
              </Button>
            </div>
          </div>

          {/* Stats Summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="relative overflow-hidden liquid-glass rounded-2xl p-5 border border-border/50 shadow-md flex flex-col justify-between group cursor-default transition-all duration-300 border-t-2 border-t-primary">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold font-mono uppercase text-muted-foreground tracking-wider">Brands Managed</span>
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Layers size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">{cards.length}</span>
                <span className="text-[9px] text-positive font-mono font-bold bg-positive/5 px-2 py-0.5 rounded-[4px] border border-positive/15">LIVE</span>
              </div>
            </div>

            <div className="relative overflow-hidden liquid-glass rounded-2xl p-5 border border-border/50 shadow-md flex flex-col justify-between group cursor-default transition-all duration-300 border-t-2 border-t-accent">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold font-mono uppercase text-muted-foreground tracking-wider">Timeline Runs</span>
                <div className="p-2 rounded-lg bg-accent/5 border border-accent/15 text-accent">
                  <Clock size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">{payouts.length}</span>
                <span className="text-[9px] text-accent font-mono font-bold bg-accent/5 px-2 py-0.5 rounded-[4px] border border-accent/15">BATCHES</span>
              </div>
            </div>

            <div className="relative overflow-hidden liquid-glass rounded-2xl p-5 border border-border/50 shadow-md flex flex-col justify-between group cursor-default transition-all duration-300 border-t-2 border-t-positive">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold font-mono uppercase text-muted-foreground tracking-wider">Reviews Logged</span>
                <div className="p-2 rounded-lg bg-positive/5 border border-positive/15 text-positive">
                  <CheckCircle2 size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">{reviews.length}</span>
                <span className="text-[9px] text-positive font-mono font-bold bg-positive/5 px-2 py-0.5 rounded-[4px] border border-positive/15">VERIFIED</span>
              </div>
            </div>

            <div className="relative overflow-hidden liquid-glass rounded-2xl p-5 border border-border/50 shadow-md flex flex-col justify-between group cursor-default transition-all duration-300 border-t-2 border-t-negative">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold font-mono uppercase text-muted-foreground tracking-wider">Open Appeals</span>
                <div className="p-2 rounded-lg bg-negative/5 border border-negative/15 text-negative">
                  <AlertTriangle size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                  {appeals.filter(a => a.status === "Pending" || !a.status).length}
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-[4px] border ${
                  appeals.filter(a => a.status === "Pending" || !a.status).length > 0
                    ? "text-negative bg-negative/5 border-negative/15 animate-pulse"
                    : "text-muted-foreground bg-foreground/[0.04] border-border"
                }`}>
                  TICKETS
                </span>
              </div>
            </div>
          </div>

          {/* --- TAB CONTENT switcher --- */}
          {activeTab === "cards" && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Create brand card form using shadcn Card */}
              <div className="lg:col-span-4">
                <Card className="liquid-glass rounded-2xl border border-border/60 shadow-lg relative overflow-hidden text-left">
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-base font-bold font-display text-foreground">Add Card Brand</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Configure new brand and categories</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <form onSubmit={handleAddCard} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="brandName" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Brand Name</Label>
                        <Input
                          id="brandName"
                          type="text"
                          required
                          value={newCardName}
                          onChange={(e) => setNewCardName(e.target.value)}
                          placeholder="e.g. Steam, Apple, Razer Gold"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="cardTag" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Category Tag</Label>
                        <Select
                          value={newCardTag}
                          onValueChange={(val) => setNewCardTag(val)}
                        >
                          <SelectTrigger id="cardTag" className="w-full h-9 bg-background border border-input">
                            <SelectValue placeholder="Select Category Tag" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Shopping">Shopping</SelectItem>
                            <SelectItem value="Gaming">Gaming</SelectItem>
                            <SelectItem value="Crypto">Crypto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="neonGlow" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Brand Neon Glow Effect</Label>
                        <Input
                          id="neonGlow"
                          type="text"
                          required
                          value={newCardGlow}
                          onChange={(e) => setNewCardGlow(e.target.value)}
                          placeholder="rgba(14, 165, 233, 0.2)"
                          className="font-mono"
                        />

                        {/* Predefined glow presets */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {[
                            { name: "Orange", value: "rgba(249, 115, 22, 0.2)", color: "bg-[#f97316]" },
                            { name: "Rose", value: "rgba(244, 63, 94, 0.2)", color: "bg-[#f43f5e]" },
                            { name: "Emerald", value: "rgba(16, 185, 129, 0.2)", color: "bg-[#10b981]" },
                            { name: "Blue", value: "rgba(14, 165, 233, 0.2)", color: "bg-[#0ea5e9]" },
                            { name: "Indigo", value: "rgba(99, 102, 241, 0.2)", color: "bg-[#6366f1]" }
                          ].map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => setNewCardGlow(preset.value)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-foreground/[0.03] border border-border hover:bg-foreground/[0.06] rounded-full transition text-[9px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <span className={`w-2 h-2 rounded-full ${preset.color} inline-block`} />
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="imageIdent" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Image Identifier / URL</Label>
                        <Input
                          id="imageIdent"
                          type="text"
                          required
                          value={newCardImg}
                          onChange={(e) => setNewCardImg(e.target.value)}
                          placeholder="amazon, flipkart, roblox or external URL"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full rounded-full cursor-pointer mt-2"
                      >
                        <Plus size={14} className="mr-1" /> Add Card Brand
                      </Button>
                    </form>

                    {/* Live Card Preview */}
                    <div className="mt-4 border-t border-border/40 pt-4">
                      <span className="block text-[10px] font-mono font-bold uppercase text-muted-foreground mb-3 tracking-wider">Interactive Live Preview</span>
                      <div className="relative p-5 rounded-2xl border border-border transition-all duration-300 overflow-hidden flex flex-col justify-between h-36 bg-card">
                        <div className="absolute top-0 right-0 h-14 w-14 bg-foreground/[0.02] rounded-bl-2xl border-l border-b border-border/40 flex items-center justify-center text-[8px] font-bold font-mono text-primary uppercase tracking-widest">{newCardTag || "Tag"}</div>

                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center font-bold font-display text-xs text-primary shadow-inner">
                            {(newCardName || "G").charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-black font-display text-foreground tracking-tight">{newCardName || "Brand Title"}</h4>
                            <span className="text-[9px] text-muted-foreground font-mono mt-0.5 block">Submissions Active</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] border-t border-border/20 pt-3 mt-4">
                          <span className="text-muted-foreground font-semibold">Asset ID:</span>
                          <span className="font-mono text-foreground font-bold">{newCardImg || "amazon"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* List and manage variants */}
              <div className="lg:col-span-8 space-y-6 text-left">
                <h2 className="text-lg font-bold font-display text-foreground border-b border-border/50 pb-2">Active Card Brands & Rates</h2>
                {loadingCards ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="liquid-glass rounded-2xl p-6 border border-border/60 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-xl animate-pulse" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32 animate-pulse" />
                            <Skeleton className="h-3 w-20 animate-pulse" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-20 rounded-xl animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {cards.map((card) => {
                      return (
                        <div
                          key={card.id}
                          className="liquid-glass rounded-2xl p-6 border border-border/60 border-l-[3.5px] hover:border-border/80 transition flex flex-col justify-between gap-4 group"
                          style={{
                            borderLeftColor: "var(--primary)",
                            boxShadow: "none"
                          }}
                        >
                          {/* Top Header Row of Card */}
                          <div className="flex items-start justify-between border-b border-border/40 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center font-bold font-display text-xs text-primary shadow-inner">
                                {card.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                                  {card.name}
                                  <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase bg-foreground/[0.04] border border-border px-2.5 py-0.5 rounded-[4px]">{card.tag}</span>
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{card.glow}</p>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCard(card.id)}
                              className="h-8 w-8 text-negative hover:bg-negative/5 border border-negative/10 cursor-pointer"
                              title="Delete brand"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>

                          {/* Variants Grid */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Variants & Payout Rates</h4>
                              <span className="text-[9px] font-mono font-semibold bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full">
                                {card.variants?.length || 0} Variants
                              </span>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                              {(!card.variants || card.variants.length === 0) ? (
                                <div className="sm:col-span-2 text-center text-muted-foreground py-4 text-[11px] border border-dashed border-border rounded-xl">No variants configured. Add a variant below.</div>
                              ) : (
                                card.variants.map((v) => (
                                  <div key={v.id} className="flex justify-between items-center bg-foreground/[0.02] border border-border/50 hover:border-border rounded-xl px-4 py-2.5 text-xs transition duration-200">
                                    {editingVariantId === v.id ? (
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                                        <Input
                                          type="text"
                                          value={editingVariantName}
                                          onChange={(e) => setEditingVariantName(e.target.value)}
                                          className="text-xs w-full sm:w-1/3 h-8"
                                        />
                                        <Input
                                          type="text"
                                          value={editingVariantInrRate}
                                          onChange={(e) => setEditingVariantInrRate(e.target.value)}
                                          placeholder="INR Rate"
                                          className="text-xs w-full sm:w-1/4 h-8 font-mono"
                                        />
                                        <Input
                                          type="text"
                                          value={editingVariantUsdtRate}
                                          onChange={(e) => setEditingVariantUsdtRate(e.target.value)}
                                          placeholder="USDT Rate"
                                          className="text-xs w-full sm:w-1/4 h-8 font-mono"
                                        />
                                        <div className="flex gap-1.5 w-full sm:w-auto justify-end mt-1 sm:mt-0">
                                          <Button variant="ghost" size="icon" onClick={() => handleUpdateVariant(v.id)} className="h-7 w-7 text-positive hover:bg-positive/5 border border-positive/15 rounded bg-transparent"><Check size={12} /></Button>
                                          <Button variant="ghost" size="icon" onClick={() => setEditingVariantId(null)} className="h-7 w-7 text-negative hover:bg-negative/5 border border-negative/15 rounded bg-transparent"><X size={12} /></Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <span className="font-bold text-foreground">{v.name}</span>
                                        <div className="flex items-center gap-3">
                                          <div className="flex items-center gap-1.5">
                                            {v.inr_rate && (
                                              <span className="font-mono text-positive font-bold bg-positive/5 px-2.5 py-1 rounded-md border border-positive/15 text-[10px]">INR: {v.inr_rate}</span>
                                            )}
                                            {v.usdt_rate && (
                                              <span className="font-mono text-primary font-bold bg-primary/5 px-2.5 py-1 rounded-md border border-primary/15 text-[10px]">USDT: {v.usdt_rate}</span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => {
                                                setEditingVariantId(v.id)
                                                setEditingVariantName(v.name)
                                                setEditingVariantInrRate(v.inr_rate || "")
                                                setEditingVariantUsdtRate(v.usdt_rate || "")
                                              }}
                                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                              title="Edit variant"
                                            >
                                              <Edit2 size={11} />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => handleDeleteVariant(v.id)}
                                              className="h-7 w-7 text-negative hover:bg-negative/5 hover:border-negative/15 rounded"
                                              title="Delete variant"
                                            >
                                              <Trash2 size={11} />
                                            </Button>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Add Variant Form Inline */}
                            {addingVariantCardId === card.id ? (
                              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border/20">
                                <Input
                                  type="text"
                                  required
                                  value={newVariantName}
                                  onChange={(e) => setNewVariantName(e.target.value)}
                                  placeholder="Variant Name (e.g. arena20)"
                                  className="w-full sm:w-1/3 h-8"
                                />
                                <Input
                                  type="text"
                                  value={newVariantInrRate}
                                  onChange={(e) => setNewVariantInrRate(e.target.value)}
                                  placeholder="INR Rate (e.g. 20)"
                                  className="w-full sm:w-1/4 h-8 font-mono"
                                />
                                <Input
                                  type="text"
                                  value={newVariantUsdtRate}
                                  onChange={(e) => setNewVariantUsdtRate(e.target.value)}
                                  placeholder="USDT Rate (e.g. 0.18)"
                                  className="w-full sm:w-1/4 h-8 font-mono"
                                />
                                <div className="flex gap-2 w-full sm:w-auto">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddVariant(card.id)}
                                    className="px-4 py-1 h-8 cursor-pointer"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setAddingVariantCardId(null)}
                                    className="px-4 py-1 h-8 cursor-pointer"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                onClick={() => setAddingVariantCardId(card.id)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary/80 transition cursor-pointer mt-1 h-8 p-0 bg-transparent"
                              >
                                <PlusCircle size={12} /> Add Variant & Payout Rate
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Create payouts form using shadcn Card */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <Card className="liquid-glass rounded-2xl border border-border/60 shadow-lg relative overflow-hidden">
                  <CardHeader className="flex flex-row justify-between items-center mb-2 pb-2 p-6">
                    <div>
                      <CardTitle className="text-base font-bold font-display text-foreground">Timeline Log Generator</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">Manage single/batch runs</CardDescription>
                    </div>

                    {/* Mode Switcher capsule */}
                    <div className="flex p-0.5 bg-foreground/[0.03] border border-border/80 rounded-full shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPayoutFormMode("single")}
                        className={`h-7 px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                          payoutFormMode === "single"
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Single Run
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPayoutFormMode("batch")}
                        className={`h-7 px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                          payoutFormMode === "batch"
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Batch Timelines
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    {payoutFormMode === "single" ? (
                      <div>
                        <form onSubmit={handleAddSinglePayout} className="space-y-4">
                          <div className="grid gap-2">
                            <Label className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Scope Coverage</Label>
                            <Input
                              type="text"
                              readOnly
                              value="All Cards"
                              className="bg-foreground/[0.02] text-muted-foreground font-mono"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Submission Date</Label>
                              <Input
                                type="date"
                                required
                                value={singleSubmissionDate}
                                onChange={(e) => setSingleSubmissionDate(e.target.value)}
                                className="font-mono [color-scheme:light-dark]"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Payout Deadline</Label>
                              <Input
                                type="date"
                                required
                                value={singlePayoutDate}
                                onChange={(e) => setSinglePayoutDate(e.target.value)}
                                className="font-mono [color-scheme:light-dark]"
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full rounded-full cursor-pointer mt-2"
                          >
                            <Plus size={14} className="mr-1" /> Log Payout Schedule
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <div>
                        <form onSubmit={handleBatchSubmit} className="space-y-4">
                          {batchPayouts.length === 0 ? (
                            <div className="p-8 border border-dashed border-border rounded-xl text-center">
                              <Clock className="mx-auto text-muted-foreground/50 h-8 w-8 mb-2 animate-pulse" />
                              <p className="text-muted-foreground text-[11px] mb-3 font-sans">No batch timeline rows configured.</p>
                              <Button
                                type="button"
                                onClick={addBatchRow}
                                className="rounded-full cursor-pointer text-[10px] px-5 py-2 font-bold"
                              >
                                <PlusCircle size={13} className="mr-1" /> Add Timeline Row
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                              {batchPayouts.map((row, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-foreground/[0.01] border border-border/80 relative space-y-3 shadow-sm">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeBatchRow(idx)}
                                    className="absolute top-3 right-3 text-muted-foreground hover:text-negative h-7 w-7 cursor-pointer"
                                  >
                                    <X size={13} />
                                  </Button>

                                  <span className="inline-block text-[9px] font-bold font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Timeline #{idx + 1}</span>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                      <Label className="text-[8px] font-mono uppercase text-muted-foreground">Submission Date</Label>
                                      <Input
                                        type="date"
                                        required
                                        value={row.submission_date}
                                        onChange={(e) => handleBatchRowChange(idx, "submission_date", e.target.value)}
                                        className="h-8 px-3.5 py-1 text-xs font-mono [color-scheme:light-dark]"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label className="text-[8px] font-mono uppercase text-muted-foreground">Payout Deadline</Label>
                                      <Input
                                        type="date"
                                        required
                                        value={row.payout_date}
                                        onChange={(e) => handleBatchRowChange(idx, "payout_date", e.target.value)}
                                        className="h-8 px-3.5 py-1 text-xs font-mono [color-scheme:light-dark]"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {batchPayouts.length > 0 && (
                            <div className="flex gap-2 pt-2 border-t border-border/30">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={addBatchRow}
                                className="w-1/2 rounded-full cursor-pointer text-[10.5px] h-9"
                              >
                                Add Row
                              </Button>
                              <Button
                                type="submit"
                                className="w-1/2 rounded-full cursor-pointer text-[10.5px] h-9"
                              >
                                <CheckCircle2 size={12} className="mr-1" /> Submit ({batchPayouts.length})
                              </Button>
                            </div>
                          )}
                        </form>
                      </div>
                    )}
                    </CardContent>
                  </Card>
              </div>

              {/* List of logged payout schedules */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-2 gap-4">
                  <h2 className="text-lg font-bold font-display text-foreground">Schedules and Deadline Timeline Logs</h2>

                  {/* Search and Filters */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                      <Input
                        type="text"
                        placeholder="Search dates..."
                        value={payoutSearch}
                        onChange={(e) => setPayoutSearch(e.target.value)}
                        className="pl-7 pr-3 py-1.5 text-xs focus:outline-none w-36 sm:w-44 h-8"
                      />
                    </div>
                  </div>
                </div>

                {loadingPayouts ? (
                  <div className="liquid-glass rounded-2xl border border-border/60 overflow-hidden bg-card p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40 animate-pulse" />
                          <Skeleton className="h-3 w-28 animate-pulse" />
                        </div>
                        <Skeleton className="h-8 w-16 rounded-xl animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="liquid-glass rounded-2xl border border-border/60 overflow-hidden shadow-inner bg-card">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-foreground/[0.03] border-b border-border text-[9px] font-mono uppercase tracking-wider text-muted-foreground/90">
                            <th className="px-5 py-3">Submission / Payout Deadline</th>
                            <th className="px-5 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payouts
                            .filter(p => {
                              const subDateStr = p.submission_date ? new Date(p.submission_date).toLocaleDateString('en-GB') : ""
                              const payDateStr = p.payout_date ? new Date(p.payout_date).toLocaleDateString('en-GB') : ""
                              const query = payoutSearch.toLowerCase()

                              return (!payoutSearch || subDateStr.toLowerCase().includes(query) || payDateStr.toLowerCase().includes(query))
                            })
                            .map((p) => {
                              const subDate = new Date(p.submission_date)
                              const payDate = new Date(p.payout_date)
                              const diffDays = Math.ceil(Math.abs(payDate.getTime() - subDate.getTime()) / (1000 * 60 * 60 * 24))

                              return (
                                <tr key={p.id} className="border-b border-border/40 hover:bg-foreground/[0.02] transition duration-150">
                                  {editingPayoutId === p.id ? (
                                    <>
                                      <td className="px-5 py-3.5">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-mono text-muted-foreground uppercase">Sub:</span>
                                            <Input
                                              type="date"
                                              value={editingPayoutSubDate}
                                              onChange={(e) => setEditingPayoutSubDate(e.target.value)}
                                              className="h-7 px-2 py-0.5 text-xs font-mono [color-scheme:light-dark]"
                                            />
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-mono text-muted-foreground uppercase">Pay:</span>
                                            <Input
                                              type="date"
                                              value={editingPayoutPayDate}
                                              onChange={(e) => setEditingPayoutPayDate(e.target.value)}
                                              className="h-7 px-2 py-0.5 text-xs font-mono [color-scheme:light-dark]"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-5 py-3.5 text-right">
                                        <div className="flex justify-end gap-1.5">
                                          <Button variant="ghost" size="icon" onClick={() => handleUpdatePayout(p.id)} className="h-7 w-7 text-positive hover:bg-positive/5 border border-positive/15 cursor-pointer bg-transparent"><Check size={12} /></Button>
                                          <Button variant="ghost" size="icon" onClick={() => setEditingPayoutId(null)} className="h-7 w-7 text-negative hover:bg-negative/5 border border-negative/15 cursor-pointer bg-transparent"><X size={12} /></Button>
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="px-5 py-3.5 space-y-1">
                                        <div className="text-foreground font-semibold flex flex-wrap gap-x-2 text-[11px]">
                                          <span>Sub: {subDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                          <span className="text-muted-foreground">➔</span>
                                          <span>Pay: {payDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="text-[10px] text-positive font-mono font-bold">
                                          <span>Settle: {diffDays} days</span>
                                        </div>
                                      </td>
                                      <td className="px-5 py-3.5 text-right">
                                        <div className="flex justify-end gap-1.5">
                                          <Button variant="ghost" size="icon" onClick={() => startEditingPayout(p)} className="h-7 w-7 text-primary hover:bg-primary/10 transition border border-primary/10"><Edit2 size={12} /></Button>
                                          <Button variant="ghost" size="icon" onClick={() => handleDeletePayout(p.id)} className="h-7 w-7 text-negative hover:bg-negative/5 border border-negative/10"><Trash2 size={12} /></Button>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              )
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Create review form using shadcn Card */}
              <div className="lg:col-span-4 text-left">
                <Card className="liquid-glass rounded-2xl border border-border/60 shadow-lg relative overflow-hidden">
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-base font-bold font-display text-foreground">Add Client Review</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Create direct verified testimonial entry</CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    <form onSubmit={handleAddReview} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="reviewClient" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Client Name</Label>
                        <Input
                          id="reviewClient"
                          type="text"
                          required
                          value={adminNewName}
                          onChange={(e) => setAdminNewName(e.target.value)}
                          placeholder="e.g. Rahul Verma"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="adminCardType" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Gift Card Type</Label>
                          <Select
                            value={adminNewCardType}
                            onValueChange={(val) => {
                              setAdminNewCardType(val)
                              setAdminNewTradeType(`${val} ➔ UPI`)
                              if (val !== 'Amazon') setAdminNewRegion('')
                            }}
                          >
                            <SelectTrigger id="adminCardType" className="w-full h-9 bg-background border border-input">
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
                          <Label htmlFor="adminTrade" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Trade Route</Label>
                          <Input
                            id="adminTrade"
                            type="text"
                            required
                            value={adminNewTradeType}
                            onChange={(e) => setAdminNewTradeType(e.target.value)}
                            placeholder="e.g. Amazon ➔ UPI"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="adminRole" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Role / Tag</Label>
                          <Input
                            id="adminRole"
                            type="text"
                            required
                            value={adminNewRole}
                            onChange={(e) => setAdminNewRole(e.target.value)}
                            placeholder="e.g. Casual Gamer"
                          />
                        </div>
                      </div>

                      {/* Amazon region selectors */}
                      {(adminNewCardType === 'Amazon' || adminNewTradeType.toLowerCase().includes('amazon')) && (
                        <div className="grid gap-2">
                          <Label className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Amazon Region Badge</Label>
                          <div className="flex gap-2">
                            {['US', 'UK', 'None'].map((reg) => (
                              <button
                                key={reg}
                                type="button"
                                onClick={() => setAdminNewRegion(reg === 'None' ? '' : reg)}
                                className={`flex-1 py-2 rounded-xl border font-mono text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                                  (reg === 'None' ? !adminNewRegion : adminNewRegion === reg)
                                    ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_12px_rgba(14,165,233,0.1)] font-extrabold'
                                    : 'bg-foreground/[0.02] text-muted-foreground border-border/80 hover:bg-foreground/[0.04]'
                                }`}
                              >
                                {reg === 'US' ? '🇺🇸 US' : reg === 'UK' ? '🇬🇧 UK' : '❌ None'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fallback Dates */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <CalendarIcon size={11} /> GC Received Date
                          </Label>
                          <Input
                            type="date"
                            value={adminNewGcReceivedDate}
                            onChange={(e) => setAdminNewGcReceivedDate(e.target.value)}
                            className="[color-scheme:light-dark]"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <CalendarIcon size={11} /> Payment Sent Date
                          </Label>
                          <Input
                            type="date"
                            value={adminNewPaymentSentDate}
                            onChange={(e) => setAdminNewPaymentSentDate(e.target.value)}
                            className="[color-scheme:light-dark]"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Rating (1-5)</Label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setAdminNewRating(star)}
                              className="focus:outline-none transition-transform duration-200 hover:scale-125 bg-transparent border-0 p-0"
                            >
                              <Star
                                size={18}
                                className={`${
                                  star <= adminNewRating
                                    ? "fill-[var(--primary)] text-[var(--primary)]"
                                    : "text-muted-foreground/35"
                                } transition-all duration-200`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="reviewDescription" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Proof Description</Label>
                        <Textarea
                          id="reviewDescription"
                          required
                          value={adminNewQuote}
                          onChange={(e) => setAdminNewQuote(e.target.value)}
                          placeholder="Write proof details..."
                          rows={3}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="adminAmount" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Payout Amount (INR) *</Label>
                        <Input
                          id="adminAmount"
                          type="number"
                          min={0}
                          required
                          value={adminNewAmount ?? ""}
                          onChange={(e) => setAdminNewAmount(Number(e.target.value))}
                          placeholder="e.g. 5000"
                        />
                        {adminNewAmount > 0 && (
                          <span className="text-[9px] text-emerald-400 font-bold font-mono">
                            Category: {adminNewAmount >= 50000 ? '₹50k+' : adminNewAmount >= 25000 ? '₹25k+' : adminNewAmount >= 10000 ? '₹10k+' : adminNewAmount >= 5000 ? '₹5k+' : 'Below ₹5k'}
                          </span>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="adminNotes" className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Admin Verification Note</Label>
                        <Textarea
                          id="adminNotes"
                          value={adminNewAdminNotes}
                          onChange={(e) => setAdminNewAdminNotes(e.target.value)}
                          placeholder="e.g. Voucher confirmed and payout completed..."
                          rows={2}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-[10px] font-mono font-bold uppercase text-muted-foreground">
                          Proof Receipt Images * {adminNewProofUrls.length > 0 && <span className="text-positive">({adminNewProofUrls.length} added)</span>}
                        </Label>
                        {adminNewProofUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {adminNewProofUrls.map((url, i) => (
                              <div key={i} className="relative rounded-xl overflow-hidden border border-border bg-background w-20 h-20 shrink-0">
                                <img src={url} alt={`Proof ${i + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setAdminNewProofUrls(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute top-0.5 right-0.5 p-0.5 bg-negative text-white rounded-full hover:bg-red-600 transition z-30 cursor-pointer border-0"
                                >
                                  <X size={9} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="relative border-2 border-dashed border-border/80 rounded-2xl p-4 flex flex-col items-center justify-center bg-foreground/[0.01] hover:bg-foreground/[0.02] hover:border-primary/45 transition duration-300 group overflow-hidden">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleAdminImageUpload(e, false)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                            disabled={adminNewUploading}
                          />
                          {adminNewUploading ? (
                            <div className="flex flex-col items-center py-2 z-20">
                              <Loader2 className="animate-spin text-primary h-6 w-6 mb-2" />
                              <span className="text-[10px] text-muted-foreground font-mono">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-3 text-center z-20 group-hover:scale-105 transition-transform duration-300">
                              <Upload className="text-muted-foreground/80 group-hover:text-primary h-6 w-6 mb-2 transition-colors duration-300" />
                              <span className="text-xs font-bold text-foreground">Add More Images</span>
                              <span className="text-[9px] text-muted-foreground mt-1 font-mono">Select multiple files</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full rounded-full cursor-pointer mt-2"
                      >
                        <Plus size={14} className="mr-1" /> Add Proof
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Testimonials List */}
              <div className="lg:col-span-8 space-y-6 text-left">
                <h2 className="text-lg font-bold font-display text-foreground border-b border-border/50 pb-2">Verified Client Proofs</h2>

                {loadingReviews ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="liquid-glass rounded-2xl p-5 border border-border/60 bg-card flex flex-col justify-between h-[280px]">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, s) => (
                                <Skeleton key={s} className="h-3 w-3 rounded-full animate-pulse" />
                              ))}
                            </div>
                            <Skeleton className="h-3 w-12 animate-pulse" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-3.5 w-full animate-pulse" />
                            <Skeleton className="h-3.5 w-5/6" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Skeleton className="h-10 w-full rounded-xl animate-pulse" />
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-6 rounded-full animate-pulse" />
                              <Skeleton className="h-3 w-16 animate-pulse" />
                            </div>
                            <Skeleton className="h-5 w-12 rounded-full animate-pulse" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="liquid-glass rounded-2xl p-12 text-center border border-border/60 text-muted-foreground">No review submissions found.</div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {reviews.map((review) => {
                      const diffDays = (() => {
                        if (!review.gc_received_date || !review.payment_sent_date) return null
                        try {
                          const gcDate = new Date(review.gc_received_date)
                          const payDate = new Date(review.payment_sent_date)
                          if (isNaN(gcDate.getTime()) || isNaN(payDate.getTime())) return null
                          return Math.ceil(Math.abs(payDate.getTime() - gcDate.getTime()) / (1000 * 60 * 60 * 24))
                        } catch {
                          return null
                        }
                      })()

                      return (
                        <div
                          key={review.id}
                          className="liquid-glass rounded-2xl p-6 border border-border/60 flex flex-col justify-between hover:border-border/80 transition-all duration-300 relative overflow-hidden text-left bg-card"
                        >
                          <div className="absolute right-6 top-6 text-primary/[0.03] text-7xl select-none font-serif pointer-events-none font-black z-0">“</div>

                          {editingReviewId === review.id ? (
                            <div className="space-y-4 text-xs w-full z-10 relative">
                              <div className="flex justify-between items-center border-b border-border/40 pb-2 mb-2">
                                <span className="font-bold font-display text-primary">Edit Review ID #{review.id}</span>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleUpdateReview(review.id)} className="h-8 w-8 text-positive hover:bg-positive/5 border border-positive/15 rounded-lg cursor-pointer bg-transparent"><Check size={13} /></Button>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingReviewId(null)} className="h-8 w-8 text-negative hover:bg-negative/5 border border-negative/15 rounded-lg cursor-pointer bg-transparent"><X size={13} /></Button>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <Label className="text-[9px] font-mono text-muted-foreground">Name</Label>
                                <Input
                                  type="text"
                                  value={editingReviewName}
                                  onChange={(e) => setEditingReviewName(e.target.value)}
                                  className="h-8"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                  <Label className="text-[9px] font-mono text-muted-foreground">Card Type</Label>
                                  <Select
                                    value={editingReviewCardType}
                                    onValueChange={(val) => {
                                      setEditingReviewCardType(val)
                                      setEditingReviewTradeType(`${val} ➔ UPI`)
                                      if (val !== 'Amazon') setEditingReviewRegion('')
                                    }}
                                  >
                                    <SelectTrigger className="w-full h-8 bg-background border border-input text-xs">
                                      <SelectValue placeholder="Card Type" />
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
                                  <Label className="text-[9px] font-mono text-muted-foreground">Route</Label>
                                  <Input
                                    type="text"
                                    value={editingReviewTradeType}
                                    onChange={(e) => setEditingReviewTradeType(e.target.value)}
                                    className="h-8"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                  <Label className="text-[9px] font-mono text-muted-foreground">Role</Label>
                                  <Input
                                    type="text"
                                    value={editingReviewRole}
                                    onChange={(e) => setEditingReviewRole(e.target.value)}
                                    className="h-8"
                                  />
                                </div>
                                {(editingReviewCardType === 'Amazon' || editingReviewTradeType.toLowerCase().includes('amazon')) && (
                                  <div className="grid gap-2">
                                    <Label className="text-[9px] font-mono text-muted-foreground">Region</Label>
                                    <Select
                                      value={editingReviewRegion || "None"}
                                      onValueChange={(val) => setEditingReviewRegion(val === "None" ? "" : val)}
                                    >
                                      <SelectTrigger className="w-full h-8 bg-background border border-input text-xs">
                                        <SelectValue placeholder="Region" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="None">None</SelectItem>
                                        <SelectItem value="US">🇺🇸 US</SelectItem>
                                        <SelectItem value="UK">🇬🇧 UK</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                  <Label className="text-[9px] font-mono text-muted-foreground">GC Received Date</Label>
                                  <Input
                                    type="date"
                                    value={editingReviewGcReceivedDate}
                                    onChange={(e) => setEditingReviewGcReceivedDate(e.target.value)}
                                    className="h-8 [color-scheme:light-dark]"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label className="text-[9px] font-mono text-muted-foreground">Payment Sent Date</Label>
                                  <Input
                                    type="date"
                                    value={editingReviewPaymentSentDate}
                                    onChange={(e) => setEditingReviewPaymentSentDate(e.target.value)}
                                    className="h-8 [color-scheme:light-dark]"
                                  />
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <Label className="text-[9px] font-mono text-muted-foreground">Rating (1-5)</Label>
                                <div className="flex items-center gap-1.5 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setEditingReviewRating(star)}
                                      className="focus:outline-none bg-transparent border-0 p-0 cursor-pointer"
                                    >
                                      <Star
                                        size={16}
                                        className={`${
                                          star <= editingReviewRating
                                            ? "fill-[var(--primary)] text-[var(--primary)]"
                                            : "text-muted-foreground/45"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <Label className="text-[9px] font-mono text-muted-foreground">Quote Description</Label>
                                <Textarea
                                  value={editingReviewQuote}
                                  onChange={(e) => setEditingReviewQuote(e.target.value)}
                                  rows={3}
                                />
                              </div>

                              <div className="grid gap-2">
                                <Label className="text-[9px] font-mono text-muted-foreground">Admin Verification Note</Label>
                                <Textarea
                                  value={editingReviewAdminNotes}
                                  onChange={(e) => setEditingReviewAdminNotes(e.target.value)}
                                  placeholder="e.g. Voucher confirmed and payout completed..."
                                  rows={2}
                                />
                              </div>

                              <div className="grid gap-2">
                                <Label className="text-[9px] font-mono text-muted-foreground">Proof Image URL</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="text"
                                    value={editingReviewProofUrl}
                                    onChange={(e) => setEditingReviewProofUrl(e.target.value)}
                                    className="font-mono h-8"
                                  />
                                  <div className="relative shrink-0 border border-dashed border-border rounded-lg px-3 py-1 flex items-center justify-center bg-foreground/[0.01] hover:bg-foreground/[0.02] cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleAdminImageUpload(e, true)}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {editingReviewUploading ? (
                                      <Loader2 size={12} className="animate-spin text-primary" />
                                    ) : (
                                      <Upload size={12} className="text-muted-foreground" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-between h-full z-10 w-full relative">
                              <div>
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <Star key={i} size={13} className="fill-[var(--primary)] text-[var(--primary)]" />
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setEditingReviewId(review.id)
                                        setEditingReviewName(review.name)
                                        setEditingReviewRole(review.role)
                                        setEditingReviewTradeType(review.trade_type)
                                        setEditingReviewRating(review.rating)
                                        setEditingReviewQuote(review.quote)
                                        setEditingReviewProofUrl(review.proof_image_url)
                                        setEditingReviewRegion(review.region || "")
                                        const parsedCard = review.trade_type.split(" ")[0] || "Amazon"
                                        setEditingReviewCardType(parsedCard)
                                        setEditingReviewGcReceivedDate(review.gc_received_date ? new Date(review.gc_received_date).toISOString().split('T')[0] : "")
                                        setEditingReviewPaymentSentDate(review.payment_sent_date ? new Date(review.payment_sent_date).toISOString().split('T')[0] : "")
                                      }}
                                      className="h-8 w-8 text-primary hover:bg-primary/10 border border-primary/10"
                                      title="Edit review"
                                    >
                                      <Edit2 size={12} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteReview(review.id)}
                                      className="h-8 w-8 text-negative hover:bg-negative/5 border border-negative/10"
                                    >
                                      <Trash2 size={12} />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-muted-foreground text-[12px] leading-relaxed mb-6 font-medium whitespace-pre-wrap">"{review.quote}"</p>
                              </div>

                              <div>
                                {review.proof_image_url && (
                                  <div className="mb-5">
                                    <p className="text-[8px] font-bold font-mono uppercase tracking-wider text-muted-foreground mb-2">Verification Certificate</p>
                                    <button
                                      onClick={() => setZoomedImgUrl(review.proof_image_url)}
                                      className="flex items-center gap-3 p-2.5 rounded-xl bg-foreground/[0.015] border border-border/60 hover:border-primary/50 hover:bg-foreground/[0.03] transition-all duration-300 group cursor-pointer w-full text-left bg-transparent"
                                    >
                                      <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-border group-hover:border-primary/30 transition bg-black/40">
                                        <img src={review.proof_image_url} alt="Proof Thumbnail" className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                          <ImageIcon size={16} className="text-white" />
                                        </div>
                                      </div>
                                      <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-1 mb-0.5">
                                          <span className="text-[8px] font-bold font-mono text-primary flex items-center gap-0.5"><CheckCircle2 size={8} /> SECURE</span>
                                          <span className="h-1 w-1 rounded-full bg-border" />
                                          <span className="text-[7.5px] font-mono text-muted-foreground uppercase">Proof</span>
                                        </div>
                                        <h5 className="text-[9px] font-black font-display text-foreground truncate uppercase tracking-tight group-hover:text-primary transition-colors">View Receipt Verification</h5>
                                        <p className="text-[7.5px] text-muted-foreground truncate font-semibold">Click to inspect receipt overlay</p>
                                      </div>
                                    </button>
                                  </div>
                                )}

                                {/* Dates / Payout Timeline Widget */}
                                <div className="relative flex items-center justify-between mt-3 mb-6 px-4 py-2 rounded-2xl bg-foreground/[0.015] border border-border/40">
                                  <div className="relative z-10 flex flex-col text-left">
                                    <span className="text-[8px] font-mono font-bold uppercase text-amber-400/90 tracking-wider flex items-center gap-1">
                                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                      Received
                                    </span>
                                    <span className="text-[10px] font-bold font-display text-foreground mt-0.5">{new Date(review.gc_received_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                  </div>

                                  <div className="absolute left-[28%] right-[28%] top-1/2 -translate-y-1/2 flex items-center justify-center">
                                    <div className="w-full h-0 border-t border-dashed border-border/60" />
                                    <span className="absolute px-2.5 py-0.5 rounded-full bg-background border border-border/60 text-[7px] font-mono font-bold text-muted-foreground uppercase whitespace-nowrap">
                                      {diffDays === 0 ? "⚡ Instant" : `${diffDays}d Settlement`}
                                    </span>
                                  </div>

                                  <div className="relative z-10 flex flex-col items-end text-right">
                                    <span className="text-[8px] font-mono font-bold uppercase text-emerald-400/90 tracking-wider flex items-center gap-1">
                                      Paid Out
                                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    </span>
                                    <span className="text-[10px] font-bold font-display text-foreground mt-0.5">{new Date(review.payment_sent_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                  </div>
                                </div>

                                <div className="w-full h-[1px] bg-border/40 mb-4" />

                                <div className="flex justify-between items-center text-xs">
                                  <div>
                                    <div className="font-bold text-foreground font-display text-[11px]">{review.name}</div>
                                    <div className="text-[10px] text-muted-foreground">{review.role}</div>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {review.region && (
                                      <span className={`text-[8px] font-black font-mono uppercase tracking-wider rounded-full px-2 py-0.5 border ${
                                        review.region === 'US'
                                          ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                                          : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                      }`}>
                                        {review.region === 'US' ? '🇺🇸 US' : '🇬🇧 UK'}
                                      </span>
                                    )}
                                    <span className="text-[9px] font-bold font-mono text-primary bg-primary/10 border border-primary/25 rounded-[2px] px-2.5 py-0.5">
                                      {review.trade_type}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "appeals" && (
            <div className="space-y-6 text-left">
              <div className="liquid-glass rounded-2xl p-6 border border-border/60 shadow-lg relative overflow-hidden bg-card">
                <div className="absolute top-0 right-0 h-12 w-12 bg-primary/5 rounded-bl-xl flex items-center justify-center text-primary">
                  <ShieldAlert className="text-primary" size={16} />
                </div>

                <h2 className="text-base font-bold font-display text-foreground mb-1">User Payment Appeals & Complaints</h2>
                <p className="text-xs text-muted-foreground mb-6 font-sans">Manage complaints filed by users regarding delayed payouts. Investigate card details and modify resolution status.</p>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2 mb-6 bg-muted/50 border border-border p-1.5 rounded-full max-w-full overflow-x-auto no-scrollbar">
                  {[
                    { label: "All", count: appeals.length },
                    { label: "Pending", count: appeals.filter(a => a.status === "Pending" || !a.status).length, color: "text-accent bg-accent/10 border-accent/15" },
                    { label: "Under Investigation", count: appeals.filter(a => a.status === "Under Investigation").length, color: "text-secondary bg-secondary/5 border-blue-500/20" },
                    { label: "Resolved", count: appeals.filter(a => a.status === "Resolved").length, color: "text-positive bg-positive/5 border-positive/15" },
                    { label: "Rejected", count: appeals.filter(a => a.status === "Rejected").length, color: "text-negative bg-negative/5 border-negative/15" }
                  ].map((tab) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setAppealFilterStatus(tab.label)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 border bg-transparent ${
                        appealFilterStatus === tab.label
                          ? "bg-primary/15 border-primary/30 text-primary"
                          : "bg-foreground/[0.01] border-border text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        appealFilterStatus === tab.label
                          ? "bg-primary/10 text-primary"
                          : tab.count > 0
                          ? (tab.color?.replace("rounded-md", "rounded-full") || "text-foreground bg-foreground/10 border-border rounded-full")
                          : "text-muted-foreground bg-foreground/[0.04] border-transparent rounded-full"
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {loadingAppeals ? (
                  <div className="grid gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="liquid-glass rounded-2xl p-6 border border-border/60 bg-card space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <Skeleton className="h-5.5 w-36 animate-pulse" />
                            <Skeleton className="h-3 w-24 animate-pulse" />
                          </div>
                          <Skeleton className="h-6 w-16 rounded-full animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-3.5 w-full animate-pulse" />
                          <Skeleton className="h-3.5 w-2/3 animate-pulse" />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Skeleton className="h-9 w-24 rounded-xl animate-pulse" />
                          <Skeleton className="h-9 w-24 rounded-xl animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : appeals.filter(a => {
                    if (appealFilterStatus === "All") return true
                    if (appealFilterStatus === "Pending") return a.status === "Pending" || !a.status
                    return a.status === appealFilterStatus
                  }).length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                    No active appeals found matching status: <strong className="text-primary">{appealFilterStatus}</strong>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {appeals
                      .filter(a => {
                        if (appealFilterStatus === "All") return true
                        if (appealFilterStatus === "Pending") return a.status === "Pending" || !a.status
                        return a.status === appealFilterStatus
                      })
                      .map((appeal) => {
                        const filedDate = new Date(appeal.created_at)
                        const currentStatus = appeal.status || "Pending"
                        return (
                          <div
                            key={appeal.id}
                            className="liquid-glass rounded-2xl p-5 sm:p-6 border border-border/60 relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 hover:border-border/80 transition duration-300 text-left bg-card"
                            style={{
                              borderLeft: `4px solid ${
                                currentStatus === "Resolved"
                                  ? "#10b981"
                                  : currentStatus === "Rejected"
                                  ? "#ef4444"
                                  : currentStatus === "Under Investigation"
                                  ? "#3b82f6"
                                  : "#f59e0b"
                              }`
                            }}
                          >
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-mono text-muted-foreground font-bold uppercase bg-foreground/[0.03] border border-border/60 rounded px-2.5 py-0.5">TICKET #{appeal.id}</span>
                                <span className="text-[10px] font-mono text-muted-foreground">Filed: {filedDate.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-[2px] font-mono text-[9px] font-bold">{appeal.card_type}</span>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-4 bg-foreground/[0.01] border border-border/40 rounded-xl p-4">
                                <div className="space-y-1.5">
                                  <span className="text-[9px] font-mono uppercase text-muted-foreground block">Client Profile</span>
                                  <div className="font-bold text-foreground text-xs sm:text-sm">{appeal.name}</div>
                                  <div className="flex items-center text-[10px] text-muted-foreground font-mono">
                                    <span>Phone: {appeal.phone}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        navigator.clipboard.writeText(appeal.phone)
                                        toast.success("Phone number copied!")
                                      }}
                                      className="h-6 w-6 text-muted-foreground hover:text-primary transition shrink-0 ml-1 cursor-pointer bg-transparent border-0"
                                    >
                                      <Copy size={10} />
                                    </Button>
                                  </div>
                                  <div className="flex items-center text-[10px] text-primary font-mono">
                                    <span className="truncate max-w-[170px]">Email: {appeal.email}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        navigator.clipboard.writeText(appeal.email)
                                        toast.success("Email copied!")
                                      }}
                                      className="h-6 w-6 text-muted-foreground hover:text-primary transition shrink-0 ml-1 cursor-pointer bg-transparent border-0"
                                    >
                                      <Copy size={10} />
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-border/40 pt-3 sm:pt-0 sm:pl-4">
                                  <span className="text-[9px] font-mono uppercase text-muted-foreground block">Payout Wallet / Address</span>
                                  <div className="flex items-center text-[11px] font-mono text-foreground select-all bg-foreground/[0.02] border border-border/60 rounded-md px-2.5 py-1.5 justify-between">
                                    <span className="truncate max-w-[130px] font-semibold text-positive" title={appeal.payout_address}>{appeal.payout_address}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        navigator.clipboard.writeText(appeal.payout_address)
                                        toast.success("Address copied!")
                                      }}
                                      className="h-6 w-6 text-muted-foreground hover:text-primary transition shrink-0 ml-1.5 cursor-pointer bg-transparent border-0"
                                    >
                                      <Copy size={11} />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[9px] font-mono uppercase text-muted-foreground block">Client Context Message</span>
                                <div className="relative p-4 rounded-xl bg-foreground/[0.02] border border-border/40 text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap select-text font-sans">
                                  {appeal.details || <em className="opacity-30">No details provided.</em>}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col justify-between items-start md:items-end gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAppeal(appeal.id)}
                                className="h-8 w-8 text-negative hover:bg-negative/5 border border-negative/10 cursor-pointer self-end bg-transparent"
                              >
                                <Trash2 size={13} />
                              </Button>

                              <div className="w-full space-y-2">
                                <span className="text-[9px] font-mono uppercase text-muted-foreground block md:text-right">Set Resolution</span>
                                <div className="flex flex-wrap md:justify-end gap-1.5">
                                  {[
                                    { label: "Pending", style: "bg-accent/10 border-accent/15 text-accent hover:bg-accent/20" },
                                    { label: "Under Investigation", style: "bg-secondary/5 border-blue-500/20 text-secondary hover:bg-secondary/20" },
                                    { label: "Resolved", style: "bg-positive/5 border-positive/15 text-positive hover:bg-positive/20" },
                                    { label: "Rejected", style: "bg-negative/5 border-negative/15 text-negative hover:bg-negative/20" }
                                  ].map((opt) => {
                                    const isSel = currentStatus === opt.label
                                    return (
                                      <button
                                        key={opt.label}
                                        onClick={() => handleUpdateAppealStatus(appeal.id, opt.label)}
                                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition duration-200 cursor-pointer ${
                                          isSel
                                            ? opt.style + " ring-1 ring-offset-1 ring-offset-background ring-primary/20 scale-102 font-black"
                                            : "bg-foreground/[0.01] border-border/80 text-muted-foreground hover:text-foreground bg-transparent"
                                        }`}
                                      >
                                        {opt.label}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Photo Lightbox Overlay */}
      {zoomedImgUrl && (
        <div
          onClick={() => setZoomedImgUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-background p-2"
          >
            <img src={zoomedImgUrl} alt="Zoomed Receipt" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            <button
              onClick={() => setZoomedImgUrl(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition shadow-md border border-white/10 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Appeal Action Reason Prompt Modal - formatted with Card inside Dialog content */}
      {showAppealActionModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <Card
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background/95 border border-border/80 rounded-2xl shadow-2xl backdrop-blur-md relative transform scale-100 transition duration-300 text-left animate-in fade-in zoom-in duration-200"
          >
            <CardAction>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAppealActionModal(false)
                  setAppealActionTarget(null)
                }}
                className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground transition rounded-full bg-transparent border-0 cursor-pointer h-7 w-7"
              >
                <X size={16} />
              </Button>
            </CardAction>

            <CardHeader className="p-6 pb-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {appealActionTarget?.status === "Resolved" ? "✅" : "🚫"}
                </span>
                <CardTitle className="text-base font-bold text-foreground">
                  {appealActionTarget?.status === "Resolved"
                    ? "Resolve Appeal & Document Findings"
                    : "Reject Appeal & State Reason"}
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed font-sans mt-2">
                {appealActionTarget?.status === "Resolved"
                  ? "Describe the processing mistake identified and findings. This explanation will be sent as an official resolution email to the user."
                  : "State the reason for rejecting this appeal. Be precise, as this information will be emailed directly to the user."}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0">
              <form onSubmit={handleConfirmAppealAction} className="space-y-4">
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="appealNotes" className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                    {appealActionTarget?.status === "Resolved"
                      ? "Explain Mistake & Findings (Required)"
                      : "Rejection Reason (Required)"}
                  </Label>
                  <Textarea
                    id="appealNotes"
                    value={appealActionNotes}
                    onChange={(e) => setAppealActionNotes(e.target.value)}
                    placeholder={
                      appealActionTarget?.status === "Resolved"
                        ? "e.g., We identified a script error that skipped processing for this card. We have manually verified the card and correction payout has been sent..."
                        : "e.g., The card code provided was verified as already redeemed prior to your transaction submission..."
                    }
                    required
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/40">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAppealActionModal(false)
                      setAppealActionTarget(null)
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-full transition cursor-pointer font-sans bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={appealActionSubmitLoading}
                    className="px-5 py-2 disabled:opacity-50 text-xs font-bold rounded-full transition cursor-pointer flex items-center gap-1.5 font-sans"
                  >
                    {appealActionSubmitLoading && (
                      <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    )}
                    Confirm Status Change
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminPage
