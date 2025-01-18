import React from "react";

const Toolbar2 = () => {
  return (
    <div className="bg-secondary rounded-xl text-white mx-2 mt-8 w-full md:w-48 md:max-w-xs pl-4 py-8 flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-4">Tools</h2>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_272_1149"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_272_1149)">
                <path
                  d="M10 17H19V11H10V17ZM4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM4 18H20V6H4V18Z"
                  fill="#F9F9FC"
                />
              </g>
            </svg>
            <a href="#" className="hover:text-gray-600 text-md">
              User Management
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_272_1154"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_272_1154)">
                <path
                  d="M2 22V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V10H20V4H4V17.125L5.15 16H15V18H6L2 22ZM19 23V18H17V12H22L20.3 16H22.5L19 23Z"
                  fill="#F9F9FC"
                />
              </g>
            </svg>
            <a href="#" className="hover:text-gray-600 text-md">
              AI Configuration
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1 md:mt-56 sm:mt-6">
        <hr className="border-white" />
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_272_1170"
              mask-type="alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_272_1170)">
              <path
                d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H12V5H5V19H12V21H5ZM16 17L14.625 15.55L17.175 13H9V11H17.175L14.625 8.45L16 7L21 12L16 17Z"
                fill="#F9F9FC"
              />
            </g>
          </svg>
          <a href="#" className="hover:text-gray-600 text-md">
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default Toolbar2;
