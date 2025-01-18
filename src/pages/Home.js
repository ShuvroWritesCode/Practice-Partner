import React from "react";
import SectionWithTextAndPicture from "../components/SectionWithTextAndPicture";
import SectionWithText from "../components/SectionWithText";
import PriceInfoCard from "../components/PriceInfoCard";
import NewsletterForm from "../components/NewsletterForm";

export default function Home() {
  return (
    <div className="flex-col md:px-4 py-4 mx-4 my-4">
      <SectionWithTextAndPicture
        title="Your virtual business coach for private practice entrepreneurs"
        subtitle="Embark on Your Private Practice Journey with Confidence"
        text="At Practice Partner, we understand the challenges of starting a private practice.
        Our Al-driven platform is designed to be your reliable guide through every step,
        offering personalized advice, tools, and resources tailored to your unique business needs."
        buttonText="Get Started"
        buttonLink="/chat"
        imageSource="chat.png"
        imageAlt="Chatting Picture"
        textOnLeft={true}
      />
      <SectionWithTextAndPicture
        // className="my-6"
        title="Your Virtual Business Coach"
        subtitle="Expert Advice at Your Fingertips"
        text="Powered by advanced Al similar to ChatGPT, our virtual coach is trained to provide expert guidance on crucial aspects of running a private practice,
         from incorporation to marketing strategies. Get answers to your business questions anytime, anywhere."
        buttonText="Talk to your coach"
        buttonLink="/chat"
        imageSource="ai.png"
        imageAlt="Chatting Picture"
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
        title="Logo Generation"
        subtitle="Unleash Your Brand's Identity"
        text={
          <>
            <p>
              Discover the future of logo design for your practice with Practice
              Partner. Our AI Business Strategist streamlines logo creation,
              offering personalized, AI-generated designs that capture the
              essence of your brand.
            </p>
            <br />
            <p>
              <strong>How It Works:</strong>
            </p>

            <ol>
              <li>
                <strong>Tailored Interaction:</strong> Share your style, colors,
                and vision through an engaging dialogue with Practice Partner.
              </li>
              <li>
                <strong>Customized Designs:</strong> Receive a variety of
                AI-crafted logo options, each reflecting your unique brand
                identity.
              </li>
              <li>
                <strong>Easy Revisions:</strong> Fine-tune your favorite design
                with simple, guided modifications.
              </li>
              <li>
                <strong>Seamless Web Integration:</strong> Effortlessly
                incorporate your new logo into your online presence.
              </li>
            </ol>
            <br />
            <p>
              <strong>Why Choose Us?</strong>
            </p>

            <ul>
              <li>
                <strong>Fast & Cost-Effective:</strong> Save time and money with
                streamlined, AI-powered design processes.
              </li>
              <li>
                <strong>Personalized For Private Practices:</strong> Specially
                tailored for entrepreneurs like you building a private practice,
                ensuring relevance and impact.
              </li>
              <li>
                <strong>Quality and Precision:</strong> Leverage AI for
                professional, high-quality logo options.
              </li>
            </ul>
            <br />
            <p>
              Transform your practice's branding with Practice Partner - where
              AI meets creativity.
            </p>
          </>
        }
        buttonText="Create your own logo now"
        buttonLink="/generate-image"
        imageSource="Logos.png"
        imageAlt="Logos Picture"
        textOnLeft={false}
      />
      <SectionWithText
        title="Comprehensive Business Advisor"
        text={
          <>
            <p style={{ fontSize: "1.5em" }}>
              All-in-One Entrepreneurial Support
            </p>
            <ul>
              <li>
                <strong>Incorporation Guidance:</strong> Navigate the
                complexities of setting up your practice.
              </li>
              <li>
                <strong>Pricing Strategies:</strong> Learn how to effectively
                price your services.
              </li>
              <li>
                <strong>Website Creation Tips:</strong> Establish a strong
                online presence.
              </li>
              <li>
                <strong>Effective Marketing Strategies:</strong> Reach your
                target audience and grow your client base.
              </li>
              <li>
                <strong>Operational Tools Suggestions:</strong> Streamline your
                day-to-day management.
              </li>
              <li>
                <strong>Tax and Legal Compliance:</strong> Stay informed about
                your fiscal responsibilities.
              </li>
            </ul>
          </>
        }
        buttonText="See More of Our Features"
        buttonLink="/logo-design"
      />
      <section className="flex flex-col justify-center text-center text-zinc-900 my-12 mt-48">
      <header className="w-full text-6xl leading-[63.84px] max-md:max-w-full max-md:text-4xl">
        Transparent, Flexible Pricing
      </header>
      <div className="mt-6 w-full text-base leading-6 max-md:max-w-full">
        <h2 className="text-2xl leading-7 text-zinc-900">
          Empower Your Practice with Always-On, Affordable Expertise
        </h2>
        <div className="leading-6 text-zinc-900">
          Discover the power of having an always-accessible business coach with Practice Partner. Our platform offers you the unique advantage of round-the-clock business guidance and unlimited resources, all at a fraction of the cost of traditional coaching. With Practice Partner, you're not just saving on expenses; you're investing in a tool that's always ready when you are, providing tailored advice and solutions for your private practice.
        </div>
        <br />
        <br />
        <div className="leading-6 text-zinc-900">
          Embrace the future of entrepreneurship with Practice Partner – where expert guidance is always just a click away.
        </div>
      </div>
    </section>
      <div className="flex md:flex-row flex-col max-md:space-y-6">
        <div className="md:flex-1">
          <div className="h-full">
            <PriceInfoCard
              title="Free Trial"
              subtitle="Explore what you can achieve"
              text="Dive into the world of Practice Partner with our Trial Plan. You'll get access to 12 queries  per month with our generative AI,
         giving you a glimpse into the expert advice and insights available at your fingertips. 
         It's a perfect way to experience firsthand how our AI can assist in your journey."
              buttonText="Get Started"
              link="/plan"
            />
          </div>
        </div>
        <div className="md:flex-1">
          <div className="h-full">
            <PriceInfoCard
              title="Practice Accelerator"
              subtitle="Operate with expertise at your fingertips"
              text="Your comprehensive toolkit for establishing a successful practice. Unlimited access to Practice Partner's capabilities 
        equipping you with essential tools and support for building a strong, sustainable business."
              pricing={["$47", "$225", "$395"]}
              months={["per Month", "6 months", "12 months"]}
              discounts={["", "20% discount", "30% discount"]}
              buttonText="Get Started"
              link="/plan"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 mb-48">
        <PriceInfoCard
          title="A Personal Touch"
          subtitle=""
          text={
            <>
              <p>
                Designed for those seeking a human touch in their
                entrepreneurial journey. Gain direct access to experienced
                business experts who provide personalized, one-on-one guidance
                going beyond AI capabilities, offering immediate best practices
                and experiential knowledge tailored to your specific needs. Our
                experts will work closely with you, helping to navigate the
                complex business landscape with insights and strategies that are
                both time-tested and innovative. <br />
                Unlock the potential of your private practice with our team of
                seasoned experts, who bring years of firsthand experience in
                launching and growing successful practices. As practitioners
                themselves, they deeply understand the challenges and
                opportunities. Embrace our unique 'Ready-Set-Treat' methodology,
                designed to accelerate your practice launch in a way that's not
                just rapid, but also effective and efficient. Partner with us to
                transform your vision into a thriving practice.
              </p>
              <br />
              <p>Navigate with Confidence: Your Personal Expert Awaits</p>
            </>
          }
          buttonText="Contact Us Today"
        />
      </div>
      <div className="mb-48 mt-16">
      <SectionWithText 
      title="Ready to Start Your Journey?"
      text="Join Practice Partner today and transform your entrepreneurial dream into reality. Our platform is here to guide
       you every step of the way."
        buttonText="Begin Your Success Story"
        buttonLink="/chat"
        centerAligned={true}
        buttonwidth={true}
      />
      </div>
      <NewsletterForm />
    </div>
  );
}
