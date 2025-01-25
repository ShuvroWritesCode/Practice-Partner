import React, { useState, useRef, useEffect } from "react";
import { FaDownload } from "react-icons/fa"; // Import the download icon from Font Awesome
import axios from "axios";

const ResultCard = ({ imageUrl }) => {
  const [isBlurred, setIsBlurred] = useState(false); // State to track the blur effect
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      img.crossOrigin = "anonymous";
    }
  }, []);

  const Upscale = () => {
    setIsBlurred(false); // Remove the blur effect
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      // Use a different CORS proxy
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        imageUrl
      )}`;

      const response = await axios.get(proxyUrl, {
        responseType: "blob",
        headers: {
          Accept: "image/*, */*",
        },
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      // Fallback to opening in new tab
      window.open(imageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          ref={imgRef}
          loading="eager"
          src={imageUrl}
          alt="Generated Result"
          crossOrigin="anonymous"
          className={`w-full h-full object-cover ${isBlurred ? "blur-sm" : ""}`} // Apply blur conditionally
          onError={(e) => {
            // If CORS fails, remove crossOrigin
            e.target.removeAttribute("crossorigin");
          }}
        />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="border border-primary hover:bg-blue-100 text-primary font-bold px-4 py-2 rounded transition-colors"
          onClick={Upscale}
        >
          Upscale
        </button>
        <button className="border border-primary hover:bg-blue-100 text-primary font-bold px-4 py-2 rounded transition-colors">
          Variations
        </button>
        <button
          className="border border-primary hover:bg-blue-100 text-primary font-bold px-4 py-2 rounded transition-colors flex items-center"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <span className="animate-pulse">Downloading...</span>
          ) : (
            <FaDownload className="mr-2" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
