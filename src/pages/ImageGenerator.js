import React, { useState } from "react";
import ResultCard from "../components/ResultCard";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FadeLoader } from "react-spinners";
import { toast } from "react-toastify";
import { auth, db } from "../utlis/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ImageGenerator = ({ setIsSubscribed }) => {
  const [selectedValue, setSelectedValue] = useState("Generate from Text");
  const [selectedPrompt1, setSelectedPrompt1] = useState("");
  const [selectedPrompt2, setSelectedPrompt2] = useState("");
  // const [selectedFile1, setSelectedFile1] = useState(null);

  const [generatedImage, setGeneratedImage] = useState("");
  const [generatedImage1, setGeneratedImage1] = useState("");
  const [generatedImage2, setGeneratedImage2] = useState("");
  const [generatedImage3, setGeneratedImage3] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      // Make a POST request to the backend API

      // const prompt = JSON.stringify("prompt":selectedPrompt1)
      // console.log(prompt)
      const response = await axios.post(
        `${BACKEND_URL}/generate-image`,
        { prompt: selectedPrompt1 },
        {
          withCredentials: true,
          credentials: "include",
        }
      );

      // Update state with the generated image URL
      setGeneratedImage(response.data[0]);
      setGeneratedImage1(response.data[1]);
      setGeneratedImage2(response.data[2]);
      setGeneratedImage3(response.data[3]);
    } catch (error) {
      console.error("Error generating image:", error);
      if (error.response && error.response.status === 401) {
        // Redirect to the plan page
        setIsSubscribed(false);
        toast.error("Please subscribe to continue!");
        navigate("/plan");
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

  // const handleFileChange = (event, fileNumber) => {
  //   const file = event.target.files[0];
  //   setSelectedFile1(file);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPrompt1.trim()) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to continue");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);

      // Update the imagePrompts counter in Firestore
      await updateDoc(userDocRef, {
        imagePrompts: increment(1),
      });

      // Rest of your image generation logic...
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing your request");
    }
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
                //   {(e) =>
                // setUserData({ ...userData, industry: e.target.value })
                //   }
                displayEmpty
                className="bg-white rounded-2xl w-full  pb-4 h-full"
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
              {/* <InputLabel
                className="text-black font-bold"
                style={{ fontWeight: 'bolder' }}
              >
                File Upload
              </InputLabel>
              <label htmlFor="uploadInput1" className="cursor-pointer">
                <div className="bg-white h-[155px] mt-1 rounded-3xl hover:bg-gray-300 transition w-full flex flex-col items-center justify-center">
                  {selectedFile1 ? (
                    <img
                      src={URL.createObjectURL(selectedFile1)}
                      alt="Selected"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <img src="upload.png" alt="Upload" className="mb-2" />
                      <span className="text-logo mb-2">
                        Click to upload a photo
                      </span>
                    </div>
                  )}
                </div>
              </label>

              <input
                id="uploadInput1"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e)}
              /> */}

              {/* <h1>Coming Soon.....</h1> */}
            </div>
          )}
          {selectedValue === "Generate from Text" && (
            <div className="flex flex-col">
              <div className="bg-transparent">
                <InputLabel className="" style={{ fontWeight: "bolder" }}>
                  What should the AI create?
                </InputLabel>
                <TextField
                  //   value={userData["aboutAuthor"]}
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
                      // height: "2.5rem",
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
                  //   value={userData["aboutAuthor"]}
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
                      // height: "2.5rem",
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
              type="submit"
              onClick={handleGenerateImage}
              disabled={
                (selectedValue === "Generate from Image" ? true : false) ||
                loading
              }
              className={`bg-primary text-white font-bold text-sm rounded-2xl mt-4 px-4 py-4 w-full hover:bg-primary-light 
        transition-colors duration-300 flex justify-center`}
            >
              {selectedValue === "Generate from Image"
                ? "Coming Soon"
                : "Generate"}
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
                // Render ClipLoader when loading is true
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
                generatedImage && (
                  // Render the result cards when loading is false
                  <div className="grid md:grid-cols-2">
                    <ResultCard imageUrl={generatedImage} />
                    <ResultCard imageUrl={generatedImage1} />
                    <ResultCard imageUrl={generatedImage2} />
                    <ResultCard imageUrl={generatedImage3} />
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
