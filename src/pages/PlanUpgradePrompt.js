import React from "react";

// Reusable Component for Benefits Section
const BenefitItem = ({ src, alt, description }) => (
  <div className="flex gap-4 justify-between mt-5">
    <img src={src} alt={alt} className="aspect-square fill-sky-700 w-[22px]" loading="lazy" />
    <div className="flex-auto self-start mt-1.5">{description}</div>
  </div>
);

// Main Component
const PlanUpgradePrompt = () => {
  const benefits = [
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b383a57c00cd34005e8a2435e1ffc7c21a7bb56e4946ac65929ba7df2f30e7a0?apiKey=9a29bea2c99f43cc9fe59f79b667536e&", alt: "Unlimited queries icon", description: "Unlimited queries to Practice Partner" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b383a57c00cd34005e8a2435e1ffc7c21a7bb56e4946ac65929ba7df2f30e7a0?apiKey=9a29bea2c99f43cc9fe59f79b667536e&", alt: "Custom image/logo generation icon", description: "Custom image/logo generation" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b383a57c00cd34005e8a2435e1ffc7c21a7bb56e4946ac65929ba7df2f30e7a0?apiKey=9a29bea2c99f43cc9fe59f79b667536e&", alt: "Expert advice icon", description: "Expert advice on-demand" }
  ];

  return (
    <div className="flex justify-center">
    <section className="flex flex-col p-5 text-base text-sky-700 bg-white rounded-3xl shadow-2xl w-[75%]">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/462127adda4fe2f08151ebcb90e6af3fb2522543140c6dca3bcd3f06f4530a37?apiKey=9a29bea2c99f43cc9fe59f79b667536e&" alt="Upgrade banner" className="self-center max-w-full aspect-[1.49] w-[252px]" loading="lazy" />
      <div className="self-center mt-5 text-3xl font-semibold leading-8 text-center whitespace-nowrap">Upgrade your plan</div>
      <p className="self-center mt-5 text-center">
        Oooops! Looks like you’ve reached your limits :( To continue, <span className="font-bold">please upgrade</span>
      </p>
      <div className="mt-11 text-xl font-medium">What You’ll get</div>
      {benefits.map((benefit, index) => (
        <BenefitItem key={index} src={benefit.src} alt={benefit.alt} description={benefit.description} />
      ))}
      <button className="justify-center items-center px-16 py-5 mt-5 font-bold whitespace-nowrap bg-sky-700 rounded-xl text-slate-50">See Available Plans</button>
    </section>
    </div>
  );
};

export default PlanUpgradePrompt;