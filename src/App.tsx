import { useRouter } from "./components/router"
import { Toaster } from "@/components/ui/sonner"
import LandingPage from "./views/LandingPage"
import ReviewsPage from "./views/ReviewsPage"
import AppealPage from "./views/AppealPage"
import AdminPage from "./views/AdminPage"
import PrivacyPage from "./views/PrivacyPage"
import TermsPage from "./views/TermsPage"
import SupportPage from "./views/SupportPage"

export function App() {
  const currentPath = useRouter()

  const renderPage = () => {
    switch (currentPath) {
      case "/":
        return <LandingPage />
      case "/reviews":
      case "/review":
      case "/proofs":
      case "/proof":
        return <ReviewsPage />
      case "/appeal":
        return <AppealPage />
      case "/internal/staff/admin":
        return <AdminPage />
      case "/privacy":
        return <PrivacyPage />
      case "/terms":
        return <TermsPage />
      case "/support":
        return <SupportPage />
      default:
        return (
          <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-mono">
            404 - Page Not Found
          </div>
        )
    }
  }

  return (
    <>
      {renderPage()}
      <Toaster closeButton position="top-right" />
    </>
  )
}

export default App
