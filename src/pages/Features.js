import React from "react";
import SectionWithTextAndPicture from "../components/SectionWithTextAndPicture";
import NewsletterForm from "../components/NewsletterForm";

const Features = () => {
  return (
    <div className="flex flex-col items-center md:pl-4 md:pr-12 max-md:px-4">
      <h1 className="text-6xl font-semibold mb-24 mt-8">Features</h1>
      <SectionWithTextAndPicture
        title="How can Practice Partner help me start my practice?"
        subtitle=""
        text=""
        buttonText=""
        buttonLink="/feature1"
        imageSource="/feature1.png"
        imageAlt="Feature 1"
        textOnLeft={true}
      />
      <h2 className="font-semibold md:text-5xl max-sm:text-3xl sm:mb-16 max-sm:mb-12 text-center">
        Innovative AI Note Assistant Browser Extension
      </h2>
      <SectionWithTextAndPicture
        title=""
        subtitle="HIPAA Compliant AI Note Solution"
        text="Experience a new era in medical documentation with our Innovative AI Note Assistant Browser Extension for Google Chrome.
        Designed specifically for health providers, our cutting-edge tool seamlessly integrates into your workflow, transforming the way you create clinical notes.
        This HIPAA-compliant extension leverages advanced artificial intelligence to summarize your medical notes efficiently, generating comprehensive and accurate
        notes ready for immediate insertion into patient charts.

        Join the future of healthcare documentation today with our Innovative AI Note Assistant Browser Extension, and watch your practice thrive."
        buttonText="Get Started"
        buttonLink="/plan"
        imageSource="prompt.png"
        imageAlt="Prompt Picture"
        textOnLeft={true}
      />
      <SectionWithTextAndPicture
        title="How would Practice Partner help me create a logo, website, or other technology I need for my practice?"
        subtitle=""
        text=""
        buttonText=""
        buttonLink="/feature2"
        imageSource="/feature2.png"
        imageAlt="Feature 2"
        textOnLeft={true}
      />
      <SectionWithTextAndPicture
        title="Can Practice Partner help me with pricing my services?"
        subtitle=""
        text=""
        buttonText=""
        buttonLink="/feature3"
        imageSource="/feature3.png"
        imageAlt="Feature 3"
        textOnLeft={true}
      />
      <NewsletterForm />
    </div>
  );
};

export default Features;
