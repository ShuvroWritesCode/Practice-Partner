import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../utlis/firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

const Navbar = ({ loggedIn, setEmail, setIsAdmin, setEmailAddress }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  // Define pathnames where you want to hide the right side of the Navbar
  const hideRightSidePaths = [
    "/signup",
    "/login",
    "/generate-image",
    "/chat",
    "/account",
    "/history",
    "/ai-configuration",
    "/user-management",
  ];

  // Check if the current pathname is in the hideRightSidePaths array
  const shouldHideRightSide = hideRightSidePaths.includes(location.pathname);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      setEmail(false);
      setEmailAddress("");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <nav className="bg-primary-container text-white py-4 px-6 md:px-12 flex justify-between items-center">
      {/* Left side with app name/logo */}
      <div className="flex items-center cursor-pointer" onClick={handleClick}>
        <img src="/logo.png" alt="Logo" className="h-16 w-16 mr-2" />{" "}
        <h1 className="hidden md:block text-2xl text-black">
          Practice Partner
        </h1>
      </div>

      {/* Right side with menu options and buttons */}
      {!shouldHideRightSide && (
        <div className="flex items-center space-x-4 max-md:space-x-1">
          <ul
            className={`md:flex text-black font-semibold md:space-x-4 max-md:text-sm 
            max-md:fixed max-md:top-0 max-md:right-0 max-md:h-screen max-md:w-64 max-md:bg-white max-md:p-6 max-md:shadow-lg
            max-md:flex max-md:flex-col max-md:space-y-4 max-md:z-50 max-md:transform max-md:transition-transform max-md:duration-300 ease-in-out
            ${isMenuOpen ? "max-md:translate-x-0" : "max-md:translate-x-full"}`}
          >
            {/* Add close button for mobile menu */}
            <button
              className="md:hidden absolute top-4 right-4 text-black"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <li>
              <Link
                to="/"
                className="hover:text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="hover:text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/about-us"
                className="hover:text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="hover:text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                Pricing
              </Link>
            </li>
          </ul>

          {/* Signup and Login buttons */}
          {loggedIn ? (
            <div className="flex space-x-2">
              <button className="bg-primary text-white font-bold max-md:font-semibold text-sm max-md:text-xs rounded-3xl px-6 max-md:px-3 py-2 max-md:py-1">
                <Link to="/account" className="hover:text-gray-400">
                  Account
                </Link>
              </button>
              <button className="bg-primary-container border font-bold max-md:font-semibold border-primary text-primary text-sm max-md:text-xs rounded-3xl px-6 max-md:px-3 py-2 max-md:py-1">
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="hover:text-gray-400"
                >
                  Logout
                </Link>
              </button>
            </div>
          ) : (
            <>
              <button className="bg-primary text-white font-bold max-md:font-semibold text-sm max-md:text-xs rounded-3xl px-6 max-md:px-3 md:mx-2 py-2 max-md:py-1">
                <Link to="/signup" className="hover:text-gray-400">
                  Sign Up
                </Link>
              </button>
              <button className="bg-primary-container border font-bold max-md:font-semibold border-primary text-primary text-sm max-md:text-xs md:mx-2 rounded-3xl px-6 max-md:px-3 py-2 max-md:py-1">
                <Link to="/login" className="hover:text-gray-400">
                  Log In
                </Link>
              </button>
            </>
          )}

          {/* Menu toggle button for small screens */}
          <button className="md:hidden z-50" onClick={toggleMenu}>
            {!isMenuOpen && (
              <div className="space-y-1.5">
                <span className="block w-6 h-0.5 bg-gray-800"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
              </div>
            )}
          </button>

          {/* Add overlay when menu is open */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={toggleMenu}
            ></div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
