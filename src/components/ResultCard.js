import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa'; // Import the download icon from Font Awesome
import saveAs from 'file-saver';
import axios from 'axios';

const ResultCard = ({ imageUrl }) => {
  const [isBlurred, setIsBlurred] = useState(true); // State to track the blur effect

  const Upscale = () => {
    setIsBlurred(false); // Remove the blur effect
  };
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/${imageUrl}`
      );
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      saveAs(blob, 'image.png');
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <img
        loading="eager"
        src={imageUrl}
        alt="Result"
        className={`w-full h-auto mb-4 ${isBlurred ? 'blur-sm' : ''}`} // Apply blur conditionally
      />
      <div className="flex justify-center gap-4">
        <button
          className="border border-primary hover:bg-blue-100 text-primary font-bold px-2 rounded"
          onClick={Upscale}
        >
          Upscale
        </button>
        <button className="border border-primary hover:bg-blue-100 text-primary font-bold px-2 rounded">
          Variations
        </button>
        <button
          className=" hover:bg-blue-100 text-white font-bold px-2 rounded flex items-center"
          onClick={handleDownload}
        >
          <FaDownload className="mr-1" /> {/* Download icon */}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
