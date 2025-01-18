import React from 'react';

export default function Contact() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full self-center">
    
      <header className="text-6xl whitespace-nowrap max-md:text-4xl">Contact us</header>
      <div className="mt-4 w-full text-base text-center max-md:max-w-full">
        We're here to help! Whether you have a question, concern, or just want to say hello, feel free to reach out to us
        using the email below. <br /> <br />
        <div className="email-link">
          <a href="mailto:Info@PracticePartner.AI">Info@PracticePartner.AI</a>
        </div>
        <br /> <br /> <br />
        Thank you for contacting us! We'll get back to you as soon as possible.
      </div>
    </div>
  );
}
