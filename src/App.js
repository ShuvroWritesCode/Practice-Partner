import "./App.css";
import FooterNavbar from "./components/FooterNavbar";
import Navbar from "./components/Navbar";
import Toolbar from "./components/Toolbar";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"; // Added useLocation, useNavigate
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsofUse from "./pages/TermsofUse";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/Login";
import ImageGenerator from "./pages/ImageGenerator.js";
import Chat from "./pages/Chat.js";
import Account from "./pages/Account.js";
import History from "./pages/History.js";
import UserManagement from "./pages/UserManagement.js";
import AIconfiguration from "./pages/AIconfiguration.js";
import PlanUpgradePrompt from "./pages/PlanUpgradePrompt.js";
import Plan from "./pages/Plan.js";
import SuccessPage from "./pages/Success";
import CancelPage from "./pages/Cancel";
import { useEffect } from "react"; // Only useEffect needed now
import { PropagateLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import AuthProvider and useAuth from the new context file
import { AuthProvider, useAuth } from './contexts/AuthContext'; //

// ProtectedRoute component to manage access based on auth and subscription status
const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requireSubscribed = false }) => {
  const { user, loading, isAdmin, isSubscribed } = useAuth(); //
  const location = useLocation();

  if (loading) {
    return (
      <div className="bg-primary-container flex justify-center items-center h-svh">
        <PropagateLoader color="#006590" loading={true} size={15} />
      </div>
    ); // Show loading spinner while auth and user data loads
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />; // Redirect to login if not authenticated
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />; // Redirect if admin access is required but user is not admin
  }

  if (requireSubscribed && !isSubscribed) {
    return <Navigate to="/plans" state={{ from: location }} replace />; // Redirect to plans if subscription is required
  }

  return children; // Render the children component if conditions are met
};

// Main App Content component that uses the AuthContext
function AppContent() {
  const { loading, user, email, emailAddress, isAdmin, isSubscribed, subscriptionInfo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Stripe redirect on success
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get('payment_status');
    const sessionId = queryParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      // Clear query params after handling to prevent re-triggering on refresh
      const cleanUrl = location.pathname;
      navigate(cleanUrl, { replace: true }); // Remove query params from URL history

      // If user is authenticated and not loading, redirect directly to chat
      // The AuthProvider will handle the state update after a successful payment webhook
      if (user && !loading) {
        navigate('/chat', { replace: true }); // Redirect to chat
      } else if (!loading) {
        // This case should ideally not be hit if Firebase persistence is working well.
        // It means payment was successful but user is not logged in after reload.
        console.warn("Payment success, but user not immediately available. Ensure Firebase Auth persistence is working or prompt re-login.");
        // You might want to redirect to login or show a specific message here
      }
    }
  }, [location.search, user, loading, navigate, location.pathname]); // Dependencies for useEffect

  // Show a global loading indicator while authentication and user data are being loaded
  if (loading) {
    return (
      <div className="bg-primary-container flex justify-center items-center h-svh">
        <PropagateLoader color="#006590" loading={true} size={15} />
      </div>
    );
  }

  return (
    <div className="bg-primary-container min-h-screen flex flex-col ">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <Navbar />
      <div className="flex max-md:flex-col h-full pl-2">
        <Toolbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/termsofuse" element={<TermsofUse />} />
          <Route
            path="/plan"
            element={<Plan isLoggedIn={user ? true : false} emailAddress={emailAddress} />} // Use user for isLoggedIn
          />

          {/* Auth routes - redirect if already logged in */}
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <SignUp />} // Use user from context
          />
          <Route
            path="/login"
            element={
              user ? ( // Use user from context
                <Navigate to="/" />
              ) : (
                <LogIn />
              )
            }
          />

          {/* Protected routes requiring authentication */}
          <Route
            path="/generate-image"
            element={
              <ProtectedRoute requireAuth={true} requireSubscribed={true}> {/* Require subscription for Image Generator */}
                <ImageGenerator subscriptionInfo={subscriptionInfo} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute requireAuth={true}>
                <Chat subscriptionInfo={subscriptionInfo} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={<ProtectedRoute requireAuth={true}><Account /></ProtectedRoute>}
          />

          {/* Admin routes */}
          <Route
            path="/user-management"
            element={<ProtectedRoute requireAdmin={true}><UserManagement /></ProtectedRoute>}
          />
          <Route
            path="/ai-configuration"
            element={<ProtectedRoute requireAdmin={true}><AIconfiguration /></ProtectedRoute>}
          />
          <Route path="/upgrade-plan" element={<PlanUpgradePrompt />} />

          {/* Add History route */}
          <Route
            path="/history"
            element={<ProtectedRoute requireAuth={true}><History /></ProtectedRoute>}
          />

          {/* Routes for Stripe redirects - can be simple display pages */}
          <Route path="/payment-success" element={<SuccessPage />} />
          <Route path="/payment-cancel" element={<CancelPage />} />
        </Routes>
      </div>
      <FooterNavbar />
    </div>
  );
}

// Wrap the entire application with AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;