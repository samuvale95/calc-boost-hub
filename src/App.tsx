import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import TokenExpiredModal from "@/components/TokenExpiredModal";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/legal/CookieConsent";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import FinishSignIn from "./pages/FinishSignIn";
import ResetPassword from "@/pages/ResetPassword";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Donate from "./pages/Donate";
import Publications from "./pages/Publications";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
          <Header />
          <TokenExpiredModal />
          <CookieConsent />
          <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/finish-signin" element={<FinishSignIn />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/privacy-policy" element={<LegalPage kind="privacy" />} />
            <Route path="/cookie-policy" element={<LegalPage kind="cookie" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </main>
          <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
