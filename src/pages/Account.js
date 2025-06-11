import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utlis/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { PropagateLoader } from "react-spinners";

function TextInputField({ label, id, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col flex-1">
      <label htmlFor={id} className="">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-xl text-black px-2 bg-slate-50 h-[43px]"
        aria-label={label}
      />
    </div>
  );
}

function PlanDetails({ plan, startDate, endDate }) {
  // Format the dates if they exist
  const formatDate = (date) => {
    if (!date) return "";
    // Check if date is a Firestore Timestamp
    if (date && typeof date.toDate === 'function') { // More robust check for Timestamp
      date = date.toDate();
    }
    // Ensure it's a valid Date object before formatting
    if (date instanceof Date && !isNaN(date)) {
      return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return ""; // Return empty string if date is not valid
  };

  return (
    <section className="flex flex-col items-center pt-4 pr-20 pb-9 pl-7 whitespace-nowrap w-[90%] rounded-xl bg-secondary text-slate-50">
      <header className="self-start text-3xl leading-9 max-md:max-w-full">
        Subscription
      </header>
      <div className="flex md:flex-row flex-col gap-5 justify-between mt-6 ml-14 text-center w-3/4">
        <article className="flex flex-col flex-1 py-4 rounded-xl bg-on-primary-container">
          <h2 className="text-base font-medium leading-6">Your Plan</h2>
          <p className="text-sm leading-5">{plan || "No active plan"}</p>
        </article>
        <article className="flex flex-col flex-1 px-7 py-4 rounded-xl bg-on-primary-container max-md:px-5">
          <h2 className="self-center text-base font-medium leading-6">
            Start Date
          </h2>
          <p className="text-sm leading-5">{formatDate(startDate)}</p>
        </article>
        <article className="flex flex-col flex-1 py-4 rounded-xl bg-on-primary-container">
          <h2 className="text-base font-medium leading-6">Expiration Date</h2>
          <p className="self-center text-sm leading-5">{formatDate(endDate)}</p>
        </article>
      </div>
      <Link
        to="/plan"
        className="flex justify-center items-center px-16 py-4 mt-6 max-w-full text-base font-semibold bg-primary rounded-xl text-slate-50 w-[250px] max-md:px-5"
        tabIndex="0"
      >
        Upgrade
      </Link>
    </section>
  );
}

const CancellationStep = ({ stepNumber, title, description }) => (
  <li>
    <span className="font-bold">{title}:</span> {description}
  </li>
);

function AccountCancellationInfo() {
  const cancellationSteps = [
    {
      title: "Loss of Access",
      description:
        "Once your account cancellation is initiated, you will lose access to all features and functionalities within the platform.",
    },
    {
      title: "Data Deletion",
      description:
        "All data associated with your account, including settings, documents, and usage history, will be permanently deleted. We do not retain or recover this data after cancellation.",
    },
    {
      title: "Permanent Action",
      description:
        "Account cancellation is irreversible and permanent. If you ever wish to use PracticePartner.ai again, you will need to signup again.",
    },
    {
      title: "Forfeiture of Paid Time",
      description:
        "PracticePartner.ai charges customers on a time-span basis, and any time remaining on your plan will be forfeited upon cancellation. Refunds not provided for unused time.",
    },
  ];

  return (
    <section className="flex flex-col px-7 pt-4 pb-10 rounded-xl bg-secondary w-[90%] text-slate-50">
      <header className="text-3xl leading-9 max-md:max-w-full">
        Cancel Your Account
      </header>
      <article className="mt-5 text-sm leading-5 max-md:max-w-full">
        If you decide to cancel your PracticePartner.ai account, please follow
        the steps below. It's important to understand the consequences of
        cancellation before proceeding:
        <br />
        <br />
        <ol>
          {cancellationSteps.map((step, index) => (
            <CancellationStep
              key={index}
              stepNumber={index + 1}
              title={step.title}
              description={step.description}
            />
          ))}
        </ol>
        <br />
        <p>
          If you understand and accept these terms and still wish to cancel your
          account, please contact a support representative at{" "}
          <a
            href="mailto:Info@PracticePartner.ai"
            className="text-blue-300 hover:text-blue-500"
          >
            Info@PracticePartner.ai
          </a>
          . Our support team will guide you to cancel your account and address
          any questions or concerns.
        </p>
        <br />
        <p>
          Please note that we are here to assist you, and your satisfaction is
          important to us. If you have any issues or need further assistance, do
          not hesitate to reach out to our support team.
        </p>
      </article>
    </section>
  );
}

// Accept subscriptionInfo as a prop
function Account({ subscriptionInfo }) {
  const [pageLoading, setPageLoading] = useState(true);
  // REMOVE: subscriptionTerm, startDate, endDate states as they will come from props
  // const [subscriptionTerm, setSubscriptionTerm] = useState("");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // REMOVED: Subscription data setting from here.
          // It will now come from the subscriptionInfo prop.
          // if (!userData.isSubscribed) {
          //   setSubscriptionTerm("Not subscribed");
          //   setStartDate("");
          //   setEndDate("");
          // } else {
          //   setSubscriptionTerm(userData.subscriptionTerm || "Premium");
          //   setStartDate(userData.startDate || "");
          //   setEndDate(userData.endDate || "");
          // }

          // Set business details (these are still specific to this component)
          setBusinessName(userData.businessName || "");
          setIndustry(userData.industry || "");
          setAdditionalInfo(userData.additionalInfo || "");
        } else {
          toast.error("User data not found");
          // navigate("/login"); // Consider if you want to navigate directly or just show error
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
        toast.error("Error fetching profile info");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfileInfo();
    // Add subscriptionInfo to dependencies if you want re-fetch of profile info
    // when subscriptionInfo changes (though not strictly necessary if only business details are here)
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to save details");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        businessName,
        industry,
        additionalInfo,
        updatedAt: new Date(),
      });

      toast.success("Business details saved successfully");
    } catch (error) {
      console.error("Error saving business details:", error);
      toast.error("Failed to save business details");
    }
  };

  // Render loading state if business details are still loading
  if (pageLoading) {
    return (
      <div className="bg-primary-container w-full flex justify-center items-center h-svh">
        <PropagateLoader color="#006590" loading={true} size={15} /> {/* Assuming PropagateLoader is available */}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 md:pl-12 p-4 mb-4">
      <form
        onSubmit={handleSave}
        className="flex flex-col w-[90%] p-6 text-base rounded-xl bg-secondary text-slate-50"
      >
        <header>
          <h2 className="text-3xl leading-9">Your Details</h2>
        </header>
        <section className="mt-2">
          <p className="mr-5 text-sm leading-5">
            Business Details: Tell us about your business. This information will
            be used to pre-prompt your AI business coach to provide the most
            accurate information.
          </p>
          <div className="flex md:flex-row md:w-[60%] flex-col gap-2 self-start mt-2">
            <div className="md:w-1/2 w-full">
              <TextInputField
                label="Business Name"
                id="businessName"
                value={businessName}
                onChange={setBusinessName}
              />
            </div>
            <div className="md:w-1/2 w-full">
              <TextInputField
                label="Industry"
                id="industry"
                value={industry}
                onChange={setIndustry}
              />
            </div>
          </div>
          <p className="mt-2">
            Additional Information: Add your own comments and details on your
            business that you feel are important
          </p>
          <textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="mt-1 rounded-xl text-black p-2 w-full bg-slate-50 h-[162px]"
            aria-label="Additional Information"
          />
        </section>
        <footer>
          <button
            type="submit"
            className="justify-center self-start px-10 py-4 mt-2 font-semibold whitespace-nowrap bg-primary rounded-xl"
          >
            Save
          </button>
        </footer>
      </form>
      <div className="my-8 mb-12">
        <PlanDetails
          // Use subscriptionInfo from props
          plan={subscriptionInfo?.plan || "Not subscribed"}
          startDate={subscriptionInfo?.startDate || ""}
          endDate={subscriptionInfo?.endDate || ""}
        />
      </div>
      <div>
        <AccountCancellationInfo />
      </div>
    </div>
  );
}

export default Account;