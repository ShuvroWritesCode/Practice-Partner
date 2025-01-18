import React from 'react';
import PriceInfoCard from '../components/PriceInfoCard'

export default function Pricing() {
  return (
    <div className='md:px-32 sm:px-8 pb-16'>
      <section className="flex flex-col justify-center text-center text-zinc-900 my-12">
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
      <div className="flex md:flex-row max-md:flex-col md:space-y-0 max-md:space-y-6">
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
    </div>
  )
}
