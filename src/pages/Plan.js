import React, { useState, useEffect } from "react"; // <--- Add useEffect here
import { getAuth, onAuthStateChanged } from "firebase/auth"; // <--- NEW: Import Firebase Auth functions
import PlanInfoCard from "../components/PlanInfoCard";

const Plan = ({ isLoggedIn }) => {
  // State to hold the Firebase user object
  const [user, setUser] = useState(null);
  const auth = getAuth(); // Initialize Firebase Auth

  // Effect to listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update the user state
      // The isLoggedIn prop is already passed, so no need to update it here unless
      // you want Plan component to strictly manage its own isLoggedIn state based on Firebase.
      // For now, we'll assume isLoggedIn prop comes from an even higher parent or context.
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [auth]); // Re-run effect if auth instance changes (though it typically won't)

  const planFeatures = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bec32ef0adf8fc7537a8f83e965d41ef4ff6e36dd1877c1f65671cc33c0f6c73?apiKey=9a29bea2c99f43cc9fe59f79b667536e&",
      text: "Unlimited queries to Practice Partner",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bec32ef0adf8fc7537a8f83e965d41ef4ff6e36dd1877c1f65671cc33c0f6c73?apiKey=9a29bea2c99f43cc9fe59f79b667536e&",
      text: "Custom image/logo generation",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bec32ef0adf8fc7537a8f83e965d41ef4ff6e36dd1877c1f65671cc33c0f6c73?apiKey=9a29bea2c99f43cc9fe59f79b667536e&",
      text: "Expert advice on-demand",
    },
  ];

  return (
    <div className="md:px-32 max-md:px-8 pb-16">
      <section className="flex flex-col justify-center text-center text-zinc-900 my-12">
        <header className="w-full text-6xl leading-[63.84px] max-md:max-w-full max-md:text-4xl">
          Transparent, Flexible Pricing
        </header>
        <div className="mt-6 w-full text-base leading-6 max-md:max-w-full">
          <h2 className="text-2xl leading-7 text-zinc-900">
            Empower Your Practice with Always-On, Affordable Expertise
          </h2>
          <div className="leading-6 text-zinc-900">
            Discover the power of having an always-accessible business coach
            with Practice Partner. Our platform offers you the unique advantage
            of round-the-clock business guidance and unlimited resources, all at
            a fraction of the cost of traditional coaching. With Practice
            Partner, you're not just saving on expenses; you're investing in a
            tool that's always ready when you are, providing tailored advice and
            solutions for your private practice.
          </div>
          <br />
          <br />
          <div className="leading-6 text-zinc-900">
            Embrace the future of entrepreneurship with Practice Partner – where
            expert guidance is always just a click away.
          </div>
        </div>
      </section>
      <div className="flex justify-center">
        <PlanInfoCard
          planFeatures={planFeatures}
          isLoggedIn={isLoggedIn}
          firebaseUserUid={user ? user.uid : null}
        />
      </div>
    </div>
  );
};

export default Plan;