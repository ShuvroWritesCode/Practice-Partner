import React from 'react';
import LogInComp from '../components/LogInComp';

const LogIn = ({setEmail,setEmailAddress, setIsAdmin, setIsSubscribed}) => {
  return (
    <div className="flex justify-center items-center w-screen">
      <LogInComp setEmail={setEmail} setEmailAddress={setEmailAddress} setIsAdmin={setIsAdmin} setIsSubscribed={setIsSubscribed} />
    </div>
  );
};

export default LogIn;
