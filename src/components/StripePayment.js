import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { auth, db } from "../utlis/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const getPlanDetails = (planType) => {
  switch (planType) {
    case "monthly":
      return { months: 1, amount: 47, term: "Monthly Premium" };
    case "biannually":
      return { months: 6, amount: 225, term: "Bi-Annual Premium" };
    case "annually":
      return { months: 12, amount: 395, term: "Annual Premium" };
    default:
      return { months: 1, amount: 47, term: "Monthly Premium" };
  }
};

const CheckoutForm = ({ planType, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to subscribe");
        return;
      }

      // Create a payment method using the card element
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

      if (paymentMethodError) {
        toast.error(paymentMethodError.message);
        return;
      }

      // Get plan details
      const plan = getPlanDetails(planType);

      // Store subscription data in Firestore
      const userRef = doc(db, "users", user.uid);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.months);

      await updateDoc(userRef, {
        isSubscribed: true,
        paymentMethodId: paymentMethod.id,
        subscriptionTerm: plan.term,
        startDate,
        endDate,
        updatedAt: new Date(),
        amount: plan.amount,
        currency: "usd",
        status: "active",
        freePrompts: 999999, // Unlimited prompts for subscribed users
      });

      toast.success("Subscription successful!");
      onSuccess();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
          className="p-3 border rounded-md bg-white"
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full bg-primary text-white rounded-md py-2 px-4 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"
        }`}
      >
        {loading ? "Processing..." : "Subscribe Now"}
      </button>
    </form>
  );
};

const StripePayment = ({ planType, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm planType={planType} onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripePayment;
