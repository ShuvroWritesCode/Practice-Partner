import React from 'react';
import LogInComp from '../components/LogInComp';
import { useAuth } from '../contexts/AuthContext'; // Assuming your AuthContext is located here

const LogIn = () => {
  // Access the state setters from your authentication context
  const { setEmail, setEmailAddress, setIsAdmin } = useAuth();

  return (
    <div className="flex justify-center items-center w-screen">
      <LogInComp
        setEmail={setEmail}
        setEmailAddress={setEmailAddress}
        setIsAdmin={setIsAdmin}
      />
    </div>
  );
};

export default LogIn;