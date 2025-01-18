import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/subscribe-email`,
        { email: email },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
          credentials: "include",
        }
      );

      if (response.status === 200) {
        toast.success("Email Successfully Subscribed!");
        setEmail("");
      } else {
        // Subscription failed
        toast.error("Could not Subscribe Email!");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Email is already subscribed!");
      } else {
        toast.error("Could not Subscribe Email! Please try Later!");
      }
    }
  };

  return (
    <form
      className="flex flex-col items-center text-base space-y-4 mb-48 mt-16"
      onSubmit={handleSubmit}
    >
      <header className="text-6xl leading-[63.84px] text-zinc-900 max-md:max-w-full max-md:text-4xl">
        Stay Ahead with Practice Partner
      </header>
      <div className="self-stretch mt-4 w-full leading-6 text-center text-zinc-900 max-md:max-w-full">
        Be the first to receive exclusive insights, tips, and updates tailored
        for entrepreneurs. Our newsletter brings you the latest on business
        strategies, Practice Partner features, and special offers directly to
        your inbox.
      </div>
      <div className="flex items-center justify-between py-1 px-1 bg-white border border-primary rounded-full md:w-[60%] max-md:w-[85%]">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="flex-grow px-4 py-2 bg-transparent border-none focus:outline-none text-gray-700 w-[80%] placeholder-black"
        />
        <button
          className="px-6 py-3 bg-primary text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
          type="submit"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}

export default NewsletterForm;
