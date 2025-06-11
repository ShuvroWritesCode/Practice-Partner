import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { detectAnyAdblocker } from "just-detect-adblock";
import axios from "axios"; // <--- NEW: Import axios for making API calls

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// IMPORTANT: Ensure firebaseUserUid is passed as a prop from the component where Firebase Auth is managed.
function PlanInfoCard({ planFeatures, isLoggedIn, firebaseUserUid }) {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkForAdBlocker = async () => {
      try {
        console.log("Checking for ad blocker...");
        const isDetected = await detectAnyAdblocker();
        console.log("Ad blocker detected:", isDetected);
        setIsAdBlockerDetected(isDetected);

        if (isDetected) {
          toast.error(
            "⚠️ Ad Blocker Detected! Payment processing requires disabling your ad-blocker or whitelisting our website. Please update your settings to continue.",
            {
              position: "top-center",
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              style: {
                background: "#fee2e2",
                color: "#991b1b",
                fontSize: "1rem",
                padding: "16px",
                borderRadius: "8px",
              },
            }
          );
        }
      } catch (error) {
        console.error("Error detecting ad blocker:", error);
        // Assume ad blocker is present if detection fails
        setIsAdBlockerDetected(true);
      }
    };

    // Run the check immediately
    checkForAdBlocker();

    // Also run it after a short delay to ensure proper detection (optional, but can help)
    const timeoutId = setTimeout(checkForAdBlocker, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleClick = (period) => {
    setSelectedPeriod(period);
  };

  const getPlanPrice = (period) => {
    switch (period) {
      case "monthly":
        return { price: "$47", discount: "" };
      case "biannually":
        return { price: "$225", discount: "20% Discount" };
      case "annually":
        return { price: "$395", discount: "30% Discount" };
      default:
        return { price: "$47", discount: "" };
    }
  };

  const handleSubscribe = async () => {
    // 1. Check if user is logged in
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // 2. Ensure Firebase UID is available for backend
    if (!firebaseUserUid) {
      toast.error("User ID not available. Please log in again.");
      return;
    }

    // 3. Check for ad blocker before proceeding with payment
    if (isAdBlockerDetected) {
      toast.error(
        "🛑 Subscription Blocked: Please disable your ad-blocker or whitelist our website first.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: "#fee2e2",
            color: "#991b1b",
            fontSize: "1rem",
            padding: "16px",
            borderRadius: "8px",
          },
        }
      );
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      // Get the Stripe Price ID based on the selected period
      const priceId = getPriceId(selectedPeriod);

      // Define your backend URL (from .env.local)
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

      // Make an API call to your Express.js backend to create the Stripe Checkout Session
      const response = await axios.post(`${BACKEND_URL}/create-checkout-session`, {
        priceId: priceId,
        userId: firebaseUserUid, // Pass the Firebase user's UID to your backend
      });

      // Check for errors returned by your backend
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Ensure the backend returned a session URL
      if (!response.data.url) {
        throw new Error("No checkout URL received from backend.");
      }

      // Redirect the user to the Stripe Checkout page
      // Stripe recommends using window.location.href for redirection when you have the session.url
      window.location.href = response.data.url;

    } catch (error) {
      console.error("Error initiating checkout:", error);
      toast.error(`Failed to initiate checkout: ${error.message || "Please try again."}`);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const getPriceId = (period) => {
    switch (period) {
      case "monthly":
        return process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID;
      case "biannually":
        return process.env.REACT_APP_STRIPE_BIANNUAL_PRICE_ID;
      case "annually":
        return process.env.REACT_APP_STRIPE_ANNUAL_PRICE_ID;
      default:
        return process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID;
    }
  };

  const { price, discount } = getPlanPrice(selectedPeriod);

  return (
    <article className="flex flex-col items-center p-5 mx-4 bg-white rounded-xl shadow-2xl md:max-w-[901px]">
      <header className="flex flex-col w-full text-center text-sky-700 md:max-w-[808px] max-md:max-w-full">
        <div className="flex gap-3 justify-center py-3 px-2 text-2xl leading-8 whitespace-nowrap bg-sky-50 rounded-xl max-md:flex-wrap max-md:max-w-full">
          <div
            className={`flex flex-col flex-1 justify-center font-bold ${selectedPeriod === "monthly" ? "text-slate-50" : "text-secondary"
              }`}
          >
            <button
              className={`justify-center px-16 py-5 rounded-xl max-md:px-5 ${selectedPeriod === "monthly"
                ? "bg-primary"
                : "bg-secondary-container"
                }`}
              onClick={() => handleClick("monthly")}
            >
              Monthly
            </button>
          </div>
          <div
            className={`flex flex-col flex-1 justify-center font-bold ${selectedPeriod === "biannually"
              ? "text-slate-50"
              : "text-secondary"
              }`}
          >
            <button
              className={`justify-center px-14 py-5 rounded-xl max-md:px-5 ${selectedPeriod === "biannually"
                ? "bg-primary"
                : "bg-secondary-container"
                }`}
              onClick={() => handleClick("biannually")}
            >
              Bi-Annually
            </button>
          </div>
          <div
            className={`flex flex-col flex-1 justify-center font-bold ${selectedPeriod === "annually" ? "text-slate-50" : "text-secondary"
              }`}
          >
            <button
              className={`justify-center items-center px-16 py-5 rounded-xl max-md:px-5 ${selectedPeriod === "annually"
                ? "bg-primary"
                : "bg-secondary-container"
                }`}
              onClick={() => handleClick("annually")}
            >
              Annually
            </button>
          </div>
        </div>
        <h1 className="mt-5 text-3xl leading-9 max-md:max-w-full">
          Practice Partner{" "}
          <span className="font-extrabold">
            {selectedPeriod === "monthly" && "1 month"}
            {selectedPeriod === "biannually" && "6 months"}
            {selectedPeriod === "annually" && "12 months"}
          </span>{" "}
          plan
        </h1>
      </header>
      <p className="mt-5 text-base leading-6 text-zinc-700 max-md:max-w-full">
        Your comprehensive toolkit for establishing a successful practice.
        Unlimited access to Practice Partner's capabilities equipping you with
        essential tools and support for building a strong, sustainable business.
      </p>
      <section className="self-stretch mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[62%] max-md:ml-0 max-md:w-full">
            <ul className="flex flex-col grow mt-11 text-2xl leading-7 text-black max-md:mt-10">
              {planFeatures.map(({ icon, text }) => (
                <li key={text} className="flex gap-4 py-1 mt-2 first:mt-0">
                  <img
                    loading="lazy"
                    src={icon}
                    alt=""
                    className="shrink-0 self-start w-5 aspect-[1.43] mt-2 fill-emerald-500"
                  />
                  <span className="flex-auto">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col ml-5 w-[38%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow max-md:mt-10">
              <div className="flex flex-col md:self-end max-md:self-center md:text-right max-md:text-center">
                <div className="text-6xl text-sky-700 leading-[64px] max-md:text-4xl">
                  {price}
                </div>
                <p className="self-start mt-2 ml-4 text-sm leading-5 text-zinc-700 max-md:ml-2.5">
                  Paid every {selectedPeriod === "monthly" && "month"}
                  {selectedPeriod === "biannually" && "6 months"}
                  {selectedPeriod === "annually" && "12 months"}
                </p>
                {discount && (
                  <p className="self-center mt-2 ml-4 text-sm leading-5 text-zinc-700 max-md:ml-2.5">
                    {discount}
                  </p>
                )}
              </div>
              <button
                onClick={handleSubscribe}
                disabled={isLoading || isAdBlockerDetected}
                className={`justify-center items-center px-16 py-5 mt-2 text-base font-bold whitespace-nowrap bg-sky-700 rounded-xl text-slate-50 max-md:px-5 ${isLoading || isAdBlockerDetected
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-sky-800"
                  }`}
              >
                {isLoading ? "Processing..." : "Subscribe"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default PlanInfoCard;