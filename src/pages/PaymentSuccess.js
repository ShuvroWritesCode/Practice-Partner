import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, db } from "../utlis/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const verifyPaymentAndUpdateSubscription = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error("User not found");
          navigate("/login");
          return;
        }

        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          toast.error("Invalid payment session");
          navigate("/plan");
          return;
        }

        // Update Firestore with subscription details
        const userRef = doc(db, "users", user.uid);
        const startDate = new Date();
        const endDate = new Date();

        // Get payment type from URL params
        const paymentType = searchParams.get("payment_type");
        let subscriptionDetails;

        switch (paymentType) {
          case "monthly":
            subscriptionDetails = {
              months: 1,
              amount: 47,
              term: "Monthly Premium",
            };
            break;
          case "biannually":
            subscriptionDetails = {
              months: 6,
              amount: 225,
              term: "Bi-Annual Premium",
            };
            break;
          case "annually":
            subscriptionDetails = {
              months: 12,
              amount: 395,
              term: "Annual Premium",
            };
            break;
          default:
            throw new Error("Invalid payment type");
        }

        endDate.setMonth(endDate.getMonth() + subscriptionDetails.months);

        await updateDoc(userRef, {
          isSubscribed: true,
          subscriptionTerm: subscriptionDetails.term,
          startDate,
          endDate,
          updatedAt: new Date(),
          amount: subscriptionDetails.amount,
          currency: "usd",
          status: "active",
          freePrompts: 999999,
          paymentSessionId: sessionId,
        });

        toast.success("Subscription activated successfully!");
        navigate("/chat");
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Failed to verify payment. Please contact support.");
        navigate("/plan");
      } finally {
        setIsProcessing(false);
      }
    };

    verifyPaymentAndUpdateSubscription();
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isProcessing ? (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700">
            Verifying your payment...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we activate your subscription.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Redirecting you to the chat...
          </h2>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
