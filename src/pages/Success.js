import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SuccessPage = () => {
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    toast.success("Payment successful! Please wait while we prepare your chat access.");

    // Redirect to /chat after 1 second
    const timer = setTimeout(() => {
      navigate('/chat');
    }, 1000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]); // Add navigate to the dependency array

  return (
    <div className="bg-primary-container flex justify-center items-center h-svh text-center w-full">
      <div>
        <h1 className="text-3xl font-bold text-primary-text mb-4">Payment Successful!</h1>
        <p className="text-lg text-secondary-text">Thank you for your subscription. You'll be redirected to chat shortly.</p>
      </div>
    </div>
  );
};

export default SuccessPage;