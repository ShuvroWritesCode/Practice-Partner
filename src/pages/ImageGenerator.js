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
  onSnapshot,
} from "firebase/firestore";
import { generateImages } from "../utils/openai";
import { isSubscribedOrDevMode, getPromptsRemaining } from "../utils/devMode";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const ImageGenerator = ({ setIsSubscribed }) => {
  const [selectedValue, setSelectedValue] = useState("Generate from Text");
  const [selectedPrompt1, setSelectedPrompt1] = useState("");
  const [selectedPrompt2, setSelectedPrompt2] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const navigate = useNavigate();

  // Listen to user's subscription status
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setIsUserSubscribed(data.isSubscribed || false);
      }
    });

    return () => unsubscribe();
  }, []);

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
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        toast.error("User data not found");
        return;
      }

      // Check if user has reached the free limit
      const currentPrompts = userDoc.data().imagePrompts || 0;
      const isSubscribed = userDoc.data().isSubscribed || false;

      if (currentPrompts >= 12 && !isSubscribedOrDevMode(isSubscribed)) {
        setIsSubscribed(false);
        toast.error(
          "You've reached your free limit. Please subscribe to continue!"
        );
        navigate("/plan");
        return;
      }

      // Show warning when approaching limit - only if not in dev mode or subscribed
      if (!isSubscribedOrDevMode(isSubscribed)) {
        const promptsRemaining = getPromptsRemaining(currentPrompts);
        
        if (promptsRemaining === 3) {
          toast.warning(
            "You have 3 free prompts remaining. Subscribe to get unlimited access!"
          );
        } else if (promptsRemaining === 1) {
          toast.warning(
            "This is your last free prompt. Subscribe to continue generating images!"
          );
        }
      }

      // Update the imagePrompts counter in Firestore - still track usage even in dev mode
      await updateDoc(userDocRef, {
        imagePrompts: increment(1),
      });

      // Generate images using DALL-E 2
      const fullPrompt = selectedPrompt2
        ? `${selectedPrompt1}. Please avoid: ${selectedPrompt2}`
        : selectedPrompt1;

      const images = await generateImages(fullPrompt);
      setGeneratedImages(images);
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        setIsSubscribed(false);
        toast.error("Please subscribe to continue!");
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
