import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import HowItWorks from "@/pages/how-it-works";
import Technology from "@/pages/technology";
import Contact from "@/pages/contact";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import NewVerification from "@/pages/new-verification";
import VerifierDashboard from "@/pages/verifier-dashboard";
import OngoingVerificationDetails from "@/pages/ongoing-verifications";
import VerificationRating from "@/pages/verification-rating";
import MyReports from "@/pages/my-reports";
import { useLocation } from "wouter";
import ScrollToTop from "@/components/ScrollToTop";

function AdminDashboardPlaceholder() {
  return <div>Admin Dashboard (Coming Soon)</div>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" ><Home /></Route>
      <Route path="/about" ><About /></Route>
      <Route path="/services" ><Services /></Route>
      <Route path="/how-it-works" ><HowItWorks /></Route>
      <Route path="/technology" ><Technology /></Route>
      <Route path="/contact" ><Contact /></Route>
      <Route path="/dashboard" ><Dashboard /></Route>
      <Route path="/dashboard/new-verification" ><NewVerification /></Route>
      <Route path="/dashboard/my-reports" ><MyReports /></Route>
      <Route path="/verifier-dashboard" ><VerifierDashboard /></Route>
      <Route path="/ongoing-verifications" ><OngoingVerificationDetails /></Route>
      <Route path="/verification-rating" ><VerificationRating /></Route>
      <Route path="/admin-dashboard" ><AdminDashboardPlaceholder /></Route>
      <Route ><NotFound /></Route>
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  // Remove query string and trailing slashes for robust matching
  const normalized = location.replace(/\?.*$/, "").replace(/\/+$/, "");
  const isDashboard =
    normalized.startsWith("/dashboard") ||
    normalized.startsWith("/verifier-dashboard") ||
    normalized.startsWith("/ongoing-verifications") ||
    normalized.startsWith("/verification-rating");
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            {!isDashboard && <Navbar />}
            <main className="flex-grow">
            <ScrollToTop />
            <Router />
          </main>
            {!isDashboard && <Footer />}
            <ScrollToTop />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
