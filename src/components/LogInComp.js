import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../utlis/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useState } from "react";

const LogInComp = ({
  setEmail,
  setEmailAddress,
  setIsAdmin,
  setIsSubscribed,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleClick = async (e) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist in Firestore, create a new document
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
          isFree: true,
          freePrompts: 10,
          isAdmin: false,
          isSubscribed: false,
        });
      }

      const userData = userDoc.data();
      setIsSubscribed(userData.isSubscribed);
      setEmail(true);
      setIsAdmin(userData.isAdmin);
      setEmailAddress(userData.email);

      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Error occurred during Google Sign-in. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in");
        return;
      }

      // Get user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        toast.error("User data not found");
        return;
      }

      const userData = userDoc.data();
      setIsSubscribed(userData.isSubscribed);
      setEmail(true);
      setIsAdmin(userData.isAdmin);
      setEmailAddress(userData.email);

      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Invalid email or password");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed login attempts. Please try again later.");
      } else {
        toast.error("Error logging in. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col p-4 max-w-[603px] text-zinc-900">
      <div className="self-center text-6xl whitespace-nowrap leading-[63.84px] max-md:text-4xl pb-5">
        Log In
      </div>
      <div className=" flex justify-center mt-2 text-slate-900">
        <span className="md:mr-2 max-md:mr-1">New to Practice Partner?</span>
        <Link to="/signup">
          <span className="font-bold"> Sign Up here!</span>
        </Link>
      </div>
      <div className="flex flex-col p-6 mt-2 text-base font-semibold rounded-xl bg-slate-600 max-md:px-5 max-md:max-w-full">
        <form onSubmit={handleSubmit}>
          <div className="justify-center items-start py-4 pr-16 pl-6 mt-4 whitespace-nowrap rounded-xl bg-slate-50 max-md:px-5 max-md:max-w-full">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="appearance-none border-none bg-transparent w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            />
          </div>
          <div className="justify-center items-start py-4 pr-16 pl-6 mt-4 whitespace-nowrap rounded-xl bg-slate-50 max-md:px-5 max-md:max-w-full">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="appearance-none border-none bg-transparent w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="justify-center items-center px-60 py-4 mt-4 whitespace-nowrap bg-sky-700 rounded-xl text-slate-50 max-md:px-5 max-md:max-w-full"
          >
            Log In
          </button>
        </form>
        <div className="self-center mt-4 text-white whitespace-nowrap">
          Already have an account?
        </div>
        <div className="self-center mt-4 text-white">Or</div>
        <div className="flex justify-center">
          <button
            onClick={handleClick}
            className="flex justify-between items-center px-10 py-4 mt-4 max-w-full text-sm leading-5 text-gray-600 whitespace-nowrap rounded-3xl bg-slate-50 w-[250px]"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7bcbda48d513fc320a691c4d0e398b0243566d8ca042c74c734fa30ed102de3b?apiKey=56eb52f6aee94ff2b3f01637cae0192d&"
              className="my-auto w-3.5 aspect-square"
              alt="Google Logo"
            />
            <div className="grow text-left pl-4">Sign Up with Google</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogInComp;
