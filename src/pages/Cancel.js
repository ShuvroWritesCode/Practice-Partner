import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Payment was canceled. You can try again."); //
  }, []);

  return (
    <div className="bg-primary-container flex justify-center items-center h-svh text-center w-full">
      <div>
        <h1 className="text-3xl font-bold text-primary-text mb-4">Payment Canceled</h1>
        <p className="text-lg text-secondary-text">Your payment was not completed. You can try again or check our plans.</p>
        <button
          onClick={() => navigate('/plan')}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go to Plans
        </button>
      </div>
    </div>
  );
};

export default CancelPage;