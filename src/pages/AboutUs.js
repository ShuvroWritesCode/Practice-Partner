import * as React from "react";

function AboutUs() {
  return (
    <div className="flex flex-col md:px-56 md:pb-32 max-md:px-8 max-md:py-4 text-base text-zinc-900">
      <header className="self-center text-6xl text-center leading-[63.84px] max-md:text-4xl">
        About Us
      </header>
      <div className="mt-10 w-full max-md:max-w-full">
        At PracticePartner.AI, innovation meets expertise to redefine business coaching for private practice owners. Our journey began in the hands of a diverse team of founders—private practice owners themselves, seasoned entrepreneurs, and professional business coaches. United by a common vision, we embarked on a mission to democratize access to expert business advice, making it available anytime, without the hefty price tag of traditional consulting.{" "}
        <br />
        <br />
        With this goal in mind, PracticePartner.AI was born—a conversational artificial intelligence meticulously designed to serve as your personal business coach. Our AI isn't just any digital assistant; it's a distillation of decades of real-world experience and best practices in business coaching. We've poured our collective wisdom into PracticePartner, ensuring it understands the nuances of starting and growing a private practice just as well as we do.
        <br />
      </div>

      <div className="mt-14 w-full max-md:mt-10 max-md:max-w-full flex md:flex-row max-md:flex-col">
      <div className="md:w-1/2 sm:w-full flex flex-col">
        But we didn't stop there. PracticePartner.AI is powered by our proprietary &quot;Ready, Set, Treat!&quot; methodology—a proven framework to fast-track the launch and growth of your private practice. This unique approach ensures that PracticePartner doesn't just offer advice; it provides actionable strategies tailored to the specific needs of private practitioners.
        <br />
        <br />
        Whether you're taking your first steps into private practice or looking to scale your existing business, PracticePartner.AI stands ready to guide you. Our AI leverages the latest in artificial intelligence technology to provide you with real-time, expert-level coaching. It's like having a team of experienced business coaches at your fingertips, but without the scheduling hassles or the expense.
        <br />
        </div>
        <div className="md:w-1/3 sm:w-full md:pl-4 sm:my-4">
            <img src="about.png" alt="About Us" className="w-full h-auto" />
          </div>
      </div>

      <div className="my-6 w-full max-md:max-w-full">
        Join us in revolutionizing the way private practice owners access business coaching. With PracticePartner.AI, empower your practice with the expertise it needs to thrive in today's competitive landscape. Because we believe that the best business advice should be accessible to everyone, everywhere, at any time.
      </div>
    </div>
  );
}

export default AboutUs;