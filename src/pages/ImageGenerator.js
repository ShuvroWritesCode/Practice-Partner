import React, { useState, useEffect } from "react";
import ResultCard from "../components/ResultCard";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { toast } from "react-toastify";
import { auth, db } from "../utlis/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  // onSnapshot, // <--- REMOVE: No longer needed here
} from "firebase/firestore";
import { generateImages } from "../utils/openai";
// import { isSubscribedOrDevMode, getPromptsRemaining } from "../utils/devMode"; // <--- REMOVE: Logic replaced by subscriptionInfo

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

// Accept subscriptionInfo as a prop
const ImageGenerator = ({ subscriptionInfo }) => { // <--- NEW PROP
  const [selectedValue, setSelectedValue] = useState("Generate from Text");
  const [selectedPrompt1, setSelectedPrompt1] = useState("");
  const [selectedPrompt2, setSelectedPrompt2] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [isUserSubscribed, setIsUserSubscribed] = useState(false); // <--- REMOVE: Replaced by subscriptionInfo.hasAccess
  const navigate = useNavigate();

  // <--- REMOVE THIS ENTIRE useEffect BLOCK: It's redundant now
  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   const userDocRef = doc(db, "users", user.uid);
  //   const unsubscribe = onSnapshot(userDocRef, (doc) => {
  //     if (doc.exists()) {
  //       const data = doc.data();
  //       setIsUserSubscribed(data.isSubscribed || false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!selectedPrompt1.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to continue");
        navigate("/login"); // Redirect to login if no user
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        toast.error("User data not found. Please log in again.");
        // Consider logging out user or redirecting to login/signup
        auth.signOut();
        navigate("/login");
        return;
      }

      // --- NEW SUBSCRIPTION LOGIC ---
      const { hasAccess, status, prompts } = subscriptionInfo; // Destructure from prop

      // Access check for generating
      if (!hasAccess) {
        // If hasAccess is false, determine the reason from status and prompts
        if (status === 'free' && prompts <= 0) {
          toast.error("You've reached your free limit. Please subscribe to continue!");
        } else if (status === 'past_due') {
          toast.error("Your payment is past due. Please update your payment method to continue.");
        } else if (status === 'canceled') {
          toast.error("Your subscription is canceled. Please renew to continue!");
        } else {
          toast.error("You do not have access to this feature. Please subscribe.");
        }
        navigate("/plan");
        return;
      }

      // Show warning when approaching limit - only for 'free' status
      if (status === 'free' && prompts > 0) {
        if (prompts <= 3) { // Example threshold
          toast.warning(
            `You have ${prompts} free prompts remaining. Subscribe to get unlimited access!`
          );
        }
      }

      // Update the freePrompts counter in Firestore
      // Only decrement if the user is on the free tier (status is 'free')
      if (status === 'free') {
        await updateDoc(userDocRef, {
          freePrompts: increment(-1), // Decrement by 1
        });
      }
      // For subscribed users, freePrompts is a high number and doesn't get decremented.
      // The `isDevMode()` check is handled by `subscriptionInfo.hasAccess` itself
      // because `checkSubscriptionStatus` is aware of dev mode.

      // --- END NEW SUBSCRIPTION LOGIC ---

      // Generate images using DALL-E 2
      const fullPrompt = selectedPrompt2
        ? `${selectedPrompt1}. Please avoid: ${selectedPrompt2}`
        : selectedPrompt1;

      const images = await generateImages(fullPrompt);
      setGeneratedImages(images);
    } catch (error) {
      console.error("Error:", error);
      // Backend should enforce subscription, but if a 401 happens here due to
      // an expired session or some other auth issue, navigate to plan.
      if (error.response?.status === 401) {
        toast.error("Access denied. Please check your subscription status.");
        navigate("/plan");
      } else {
        toast.error("An error occurred while generating images");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handlePrompt1Change = (event) => {
    setSelectedPrompt1(event.target.value);
  };

  const handlePrompt2Change = (event) => {
    setSelectedPrompt2(event.target.value);
  };

  return (
    <div className="w-[80%]">
      <div className="flex md:flex-row md:mx-8 md:px-28 max-md:px-4 max-md:flex-col w-full">
        <div className="flex flex-col md:w-1/2 md:px-6 max-md:px-2">
          <h1 className="px-6 text-center text-3xl my-4 mb-8 font-semibold">
            Image Generator
          </h1>
          <div className="">
            <InputLabel className="" style={{ fontWeight: "bolder" }}>
              Generation Style
            </InputLabel>
            <div className="bg-white h-[40%] rounded-3xl">
              <Select
                value={selectedValue}
                onChange={handleChange}
                displayEmpty
                className="bg-white rounded-2xl w-full pb-4 h-full"
                variant="filled"
                disableUnderline
                defaultValue="Generate from Image"
                autoFocus={false}
              >
                <MenuItem value="Generate from Image">
                  Generate from Image
                </MenuItem>
                <MenuItem value="Generate from Text">
                  Generate from Text
                </MenuItem>
              </Select>
            </div>
          </div>

          {selectedValue === "Generate from Image" && (
            <div className="">
              <h1>Coming Soon.....</h1>
            </div>
          )}
          {selectedValue === "Generate from Text" && (
            <div className="flex flex-col">
              <div className="bg-transparent">
                <InputLabel className="" style={{ fontWeight: "bolder" }}>
                  What should the AI create?
                </InputLabel>
                <TextField
                  value={selectedPrompt1}
                  multiline
                  rows={4}
                  onChange={(e) => handlePrompt1Change(e)}
                  placeholder=""
                  className="bg-white rounded-xl w-full mt-1"
                  variant="filled"
                  InputProps={{
                    style: {
                      border: "none",
                      borderRadius: "0.75rem",
                      paddingBottom: "0.8rem",
                    },
                    disableUnderline: true,
                  }}
                />
              </div>
              <div className="bg-transparent mt-4">
                <InputLabel className="" style={{ fontWeight: "bolder" }}>
                  What shouldn't the AI create?
                </InputLabel>
                <TextField
                  value={selectedPrompt2}
                  multiline
                  rows={4}
                  onChange={(e) => handlePrompt2Change(e)}
                  placeholder=""
                  className="bg-white rounded-xl w-full mt-1"
                  variant="filled"
                  InputProps={{
                    style: {
                      border: "none",
                      borderRadius: "0.75rem",
                      paddingBottom: "0.8rem",
                    },
                    disableUnderline: true,
                  }}
                />
              </div>
            </div>
          )}
          <div className="flex sm:justify-center">
            <button
              onClick={handleGenerateImage}
              disabled={selectedValue === "Generate from Image" || loading}
              className={`bg-primary text-white font-bold text-sm rounded-2xl mt-4 px-4 py-4 w-full hover:bg-primary-light
                transition-colors duration-300 flex justify-center`}
            >
              {selectedValue === "Generate from Image" ? (
                "Coming Soon"
              ) : loading ? (
                <FadeLoader
                  color={"#ffffff"}
                  loading={loading}
                  cssOverride={override}
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Generate"
              )}
            </button>
          </div>
          {selectedValue === "Generate from Text" && (
            <Link
              to="/generate"
              className={`bg-transparent text-black font-semibold text-sm mt-2 px-4 py-4 w-full hover:bg-primary-light
                transition-colors duration-300 flex justify-start`}
            >
              Advanced Mode
            </Link>
          )}
        </div>
        {selectedValue === "Generate from Text" && (
          <div className="flex flex-col md:px-6 max-md:px-2">
            <h1 className="px-6 text-center text-3xl font-semibold my-4">
              Results
            </h1>
            <div className="flex flex-col md:px-6 max-md:px-2">
              {loading ? (
                <div className="flex p-44 justify-center items-center w-full h-full">
                  <FadeLoader
                    color="#006590"
                    loading={loading}
                    cssOverride={override}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                generatedImages.length > 0 && (
                  <div className="grid md:grid-cols-2">
                    {generatedImages.map((imageUrl, index) => (
                      <ResultCard key={index} imageUrl={imageUrl} />
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;