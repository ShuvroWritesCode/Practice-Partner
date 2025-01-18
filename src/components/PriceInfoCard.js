import React from "react";
import { Link } from "react-router-dom";

const PriceInfoCard = ({
  title,
  subtitle,
  text,
  pricing,
  months,
  discounts,
  buttonText,
  link
}) => {

  const sendEmail = () => {
    window.open('mailto:info@practicepartner.ai', '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mx-4 h-full">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
      <div className="border-b border-gray-300 mb-4"></div>
      <h3 className="text-lg font-bold mb-2 text-center">{subtitle}</h3>
      <p className="mb-4 text-center">{text}</p>
      <div className="flex justify-around">
        <div className="grid grid-cols-3 gap-12 mb-4">
          {pricing && (
            <>
              <div className="">
                <h4 className="text-4xl font-semibold text-center mb-2">{pricing[0]}</h4>
                {months && <p className="text-gray-500 text-center">{months[0]}</p>}
                {discounts && <p className="text-gray-500 max-sm:text-center">{discounts[0]}</p>}
              </div>
              <div>
                <h4 className="text-4xl font-semibold text-center mb-2">{pricing[1]}</h4>
                {months && <p className="text-gray-500 text-center">{months[1]}</p>}
                {discounts && <p className="text-gray-500 max-sm:text-center">{discounts[1]}</p>}
              </div>
              <div>
                <h4 className="text-4xl font-semibold text-center mb-2">{pricing[2]}</h4>
                {months && <p className="text-gray-500 text-center">{months[2]}</p>}
                {discounts && <p className="text-gray-500 max-sm:text-center">{discounts[2]}</p>}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center">
      {link ? (
        <Link 
          to={link}
          className="bg-primary text-white font-bold text-sm rounded-full px-6 py-3 hover:bg-primary-light transition-colors duration-300"
        >
          {buttonText}
        </Link>
      ) : (
        <button 
          className="bg-primary text-white font-bold text-sm rounded-full px-6 py-3 hover:bg-primary-light transition-colors duration-300"
          onClick={sendEmail}
        >
          {buttonText}
        </button>
      )}
      </div>
    </div>
  );
};

export default PriceInfoCard;
