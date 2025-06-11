import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../utlis/firebase'; // Adjust path based on your firebase.js location
import { checkSubscriptionStatus } from '../utils/subscriptionService'; // Adjust path
import { toast } from 'react-toastify'; //

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Helper for development mode
const isDevMode = () => process.env.NODE_ENV === 'development';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user object
  const [email, setEmail] = useState(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true); // Initial loading for Firebase Auth
  const [loadingUserData, setLoadingUserData] = useState(false); // Loading for Firestore user data
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState({ hasAccess: false, message: '', status: 'loading', prompts: 0 });

  useEffect(() => {
    // --- AUTH LISTENER ---
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setEmail(currentUser.email);
        setEmailAddress(currentUser.email);
        setLoadingUserData(true); // Start loading user data from Firestore
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setIsAdmin(userData.isAdmin || false);

            const statusResult = await checkSubscriptionStatus(currentUser.uid); //
            setSubscriptionInfo(statusResult);
            setIsSubscribed(statusResult.hasAccess);

            // Display toast messages based on detailed status
            if (statusResult.status === 'past_due') {
              toast.error(statusResult.message);
            } else if (statusResult.status === 'canceled' && !statusResult.hasAccess) {
              toast.error(statusResult.message);
            } else if (statusResult.status === 'free' && statusResult.prompts <= 5) {
              toast.warning(`You have ${statusResult.prompts} free prompts remaining. Consider upgrading!`);
            }

            // Check for subscription expiration (similar to your old logic)
            const now = new Date();
            const subscriptionExpiresDate = statusResult.subscriptionExpires?.toDate();
            if (subscriptionExpiresDate && now > subscriptionExpiresDate && statusResult.status !== 'canceled' && statusResult.status !== 'past_due' && statusResult.status !== 'expired') {
              await updateDoc(userRef, {
                subscriptionStatus: "expired", // Set to 'expired' explicitly
                isSubscribed: false,
                freePrompts: 12, // Revert to free prompts
                chatPrompts: 0,
                imagePrompts: 0,
                updatedAt: now,
              });
              setSubscriptionInfo(prev => ({ ...prev, hasAccess: false, status: 'expired', message: 'Your subscription has expired.' }));
              setIsSubscribed(false);
              toast.error("Your subscription has expired. Please renew to continue accessing premium features.");
            }

          } else {
            // New user document in Firestore - handle initial state
            setEmail(null);
            setEmailAddress("");
            setIsAdmin(false);
            setIsSubscribed(false);
            setSubscriptionInfo({ hasAccess: false, message: 'No user data found. Please subscribe.', status: 'none', prompts: 0 });
            toast.info("Welcome! Please check out our plans to get started.");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        } finally {
          setLoadingUserData(false); // Done loading user data
        }
      } else {
        // No authenticated user
        setEmail(null);
        setEmailAddress("");
        setIsAdmin(false);
        setIsSubscribed(false);
        setSubscriptionInfo({ hasAccess: false, message: 'Please log in.', status: 'none', prompts: 0 });
        setLoadingUserData(false); // No user data to load
      }
      setLoadingAuth(false); // Firebase Auth listener has completed its initial check
    });

    // --- DEVELOPMENT MODE BYPASS ---
    if (isDevMode()) {
      console.log("Development mode active: Bypassing subscription checks");
      setIsSubscribed(true);
      setLoadingAuth(false);
      setLoadingUserData(false);
      setSubscriptionInfo({ hasAccess: true, message: 'Dev mode active', status: 'active', prompts: 999999 });
      return; // Exit useEffect early in dev mode
    }

    return () => unsubscribe(); // Cleanup Firebase listener
  }, []); // Empty dependency array means this runs once on mount

  const value = {
    user,
    email,
    emailAddress,
    isAdmin,
    isSubscribed,
    subscriptionInfo,
    loading: loadingAuth || loadingUserData,
    setUser,
    setEmail,
    setEmailAddress,
    setIsAdmin,
    setIsSubscribed,
    setSubscriptionInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};