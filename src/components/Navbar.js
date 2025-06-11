import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../utlis/firebase"; // Keep this for signOut
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext"; // <--- IMPORT useAuth here

const Navbar = () => { // <--- REMOVE all props here, as they will come from context
  const [isMenuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // <--- GET STATE FROM CONTEXT
  const { user, email, isAdmin } = useAuth(); // Now access these directly from context

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
      // No need to manually set states like setIsAdmin(false), setEmail(false), setEmailAddress("").
      // The onAuthStateChanged listener in AuthContext.js will automatically update
      // the 'user' and other related states (email, isAdmin) in the context,
      // which will then trigger re-renders in components consuming the context.
      toast.success("Logged out successfully");
      navigate("/"); // Navigate to home or login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out.");
    }
  };

  return (
    <nav className="bg-primary-container z-40 relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand - Left side */}
        <div className="flex items-center">
          <Link to="/" onClick={handleClick} className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
            <span className="text-primary-text font-bold text-lg max-md:text-base">
              Practice Partner
            </span>
          </Link>
        </div>

        {/* Navigation Links - Center (hidden on small screens, shown in menu) */}
        <div className="hidden md:flex flex-grow justify-center space-x-8">
          <Link
            to="/about-us"
            className="text-primary-text hover:text-gray-400 font-semibold"
          >
            About Us
          </Link>
          <Link
            to="/features"
            className="text-primary-text hover:text-gray-400 font-semibold"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-primary-text hover:text-gray-400 font-semibold"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="text-primary-text hover:text-gray-400 font-semibold"
          >
            Contact
          </Link>
        </div>

        {/* Conditional Buttons (Sign Up/Log In or Account/Logout) - Right side */}
        {!shouldHideRightSide && (
          <div className="hidden md:flex items-center">
            {email ? ( // Use email from context
              // Logged in state
              <div className="flex items-center space-x-4">
                <Link
                  to="/account"
                  className="text-primary text-sm font-semibold hover:text-gray-400"
                >
                  Account
                </Link>
                {isAdmin && ( // Use isAdmin from context
                  <Link
                    to="/user-management"
                    className="text-primary text-sm font-semibold hover:text-gray-400"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white font-bold text-sm rounded-3xl px-6 py-2 hover:bg-red-600 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              // Not logged in state
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
          </div>
        )}

        {/* Mobile menu toggle button */}
        <button className="md:hidden z-50" onClick={toggleMenu}>
          {!isMenuOpen && (
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-gray-800"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
            </div>
          )}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          >
            {/* Clickable area for closing menu */}
          </div>
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full bg-white shadow-lg transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out w-64 md:hidden z-50`}
        >
          <div className="flex flex-col items-start p-6 space-y-4">
            <button className="self-end" onClick={toggleMenu}>
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <Link
              to="/about-us"
              className="text-primary-text hover:text-gray-400 font-semibold text-lg"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/features"
              className="text-primary-text hover:text-gray-400 font-semibold text-lg"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-primary-text hover:text-gray-400 font-semibold text-lg"
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="text-primary-text hover:text-gray-400 font-semibold text-lg"
              onClick={toggleMenu}
            >
              Contact
            </Link>

            {/* Mobile Conditional Buttons */}
            {email ? ( // Use email from context
              <>
                <Link
                  to="/account"
                  className="text-primary-text hover:text-gray-400 font-semibold text-lg"
                  onClick={toggleMenu}
                >
                  Account
                </Link>
                {isAdmin && ( // Use isAdmin from context
                  <Link
                    to="/user-management"
                    className="text-primary-text hover:text-gray-400 font-semibold text-lg"
                    onClick={toggleMenu}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="bg-primary text-white font-bold text-lg rounded-3xl px-6 py-2 w-full text-left"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-primary text-white font-bold text-lg rounded-3xl px-6 py-2 w-full text-left"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-primary-container border font-bold border-primary text-primary text-lg rounded-3xl px-6 py-2 w-full text-left"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;