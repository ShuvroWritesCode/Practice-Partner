import "./App.css";
import FooterNavbar from "./components/FooterNavbar";
import Navbar from "./components/Navbar";
import Toolbar from "./components/Toolbar";
import { Navigate, Route, Routes } from "react-router-dom";
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
import PaymentSuccess from "./pages/PaymentSuccess";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "./utlis/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function App() {
  const [email, setEmail] = useState(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setEmail(user.email);
          setEmailAddress(user.email);
          setIsAdmin(userData.isAdmin || false);

          // Check subscription status
          const now = new Date();
          const endDate = userData.endDate?.toDate();
          const isExpired = endDate && now > endDate;

          // Check if subscription is about to expire in 1 day
          const timeUntilExpiration = endDate
            ? endDate.getTime() - now.getTime()
            : null;
          const isAboutToExpire =
            timeUntilExpiration && timeUntilExpiration <= 24 * 60 * 60 * 1000;

          if (isExpired) {
            // Update user document when subscription expires
            await updateDoc(userRef, {
              isSubscribed: false,
              freePrompts: 0,
              status: "inactive",
              updatedAt: now,
            });

            setIsSubscribed(false);
            toast.error(
              "Your subscription has expired. Please renew to continue accessing premium features."
            );
          } else if (isAboutToExpire) {
            toast.warning(
              `Your subscription will expire in ${Math.ceil(
                timeUntilExpiration / (1000 * 60 * 60 * 24)
              )} day(s). Renew now to maintain access!`
            );
            setIsSubscribed(userData.isSubscribed || false);
          } else {
            setIsSubscribed(userData.isSubscribed || false);
          }
        }
      } else {
        setEmail("");
        setEmailAddress("");
        setIsAdmin(false);
        setIsSubscribed(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-primary-container flex justify-center items-center h-svh">
        <PropagateLoader color="#006590" loading={true} size={15} />
      </div>
    );
  }

  return (
    <div className="bg-primary-container min-h-screen flex flex-col ">
      <ToastContainer />
      <Navbar
        loggedIn={email}
        setEmail={setEmail}
        setIsAdmin={setIsAdmin}
        setEmailAddress={setEmailAddress}
      />
      <div className="flex max-md:flex-col h-full pl-2">
        <Toolbar
          setEmail={setEmail}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          setEmailAddress={setEmailAddress}
        />
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
            element={<Plan isLoggedIn={email} emailAddress={emailAddress} />}
          />

          {/* Auth routes */}
          <Route
            path="/signup"
            element={email ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/login"
            element={
              email ? (
                <Navigate to="/" />
              ) : (
                <LogIn
                  setEmail={setEmail}
                  setEmailAddress={setEmailAddress}
                  setIsAdmin={setIsAdmin}
                  setIsSubscribed={setIsSubscribed}
                />
              )
            }
          />

          {/* Protected routes requiring authentication */}
          <Route
            path="/generate-image"
            element={
              email ? (
                <ImageGenerator setIsSubscribed={setIsSubscribed} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chat"
            element={
              email ? (
                <Chat setIsSubscribed={setIsSubscribed} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/account"
            element={email ? <Account /> : <Navigate to="/login" />}
          />

          {/* Admin routes */}
          <Route
            path="/user-management"
            element={isAdmin ? <UserManagement /> : <Navigate to="/" />}
          />
          <Route
            path="/ai-configuration"
            element={isAdmin ? <AIconfiguration /> : <Navigate to="/" />}
          />
          <Route path="/upgrade-plan" element={<PlanUpgradePrompt />} />

          {/* Add History route */}
          <Route
            path="/history"
            element={email ? <History /> : <Navigate to="/login" />}
          />

          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </div>
      <FooterNavbar />
    </div>
  );
}

export default App;
