import React from 'react';
import { Link } from 'react-router-dom';

const SectionWithText = ({ title, text, buttonText, buttonLink, centerAligned, buttonwidth }) => {
  return (
    <div className="flex justify-center my-20">
      <div className="max-w-xl w-full px-4 py-6 rounded-lg">
        <h2 className={`text-4xl font-medium mb-4 ${centerAligned ? 'text-center' : ''}`}>{title}</h2>
        <p className={`mb-4 ${centerAligned ? 'text-center' : ''}`}>{text}</p>
        <div className='flex justify-start max-sm:justify-center'>
        <Link to={buttonLink} className={`bg-primary text-white font-bold text-sm rounded-full ${buttonwidth? 'w-full':''} px-4 py-2 hover:bg-primary-light 
        transition-colors duration-300 ${centerAligned ? 'flex justify-center items-center' : ''}`}>{buttonText}</Link>
        </div>
      </div>
    </div>
  );
};

export default SectionWithText;
