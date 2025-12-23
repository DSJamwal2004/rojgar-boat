import React from "react";

function BoatLoader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      
      {/* Reused Homepage Boat (scaled, no drift) */}
      <div className="boat-loader-wrapper">
        <div className="boat-container">
          <svg
            className="boat"
            width="80"
            height="60"
            viewBox="0 0 80 60"
            fill="none"
          >
            {/* Boat body */}
            <path
              d="M10 35 L70 35 L60 50 L20 50 Z"
              fill="#8B4513"
              stroke="#654321"
              strokeWidth="2"
            />

            {/* Mast */}
            <line
              x1="40"
              y1="10"
              x2="40"
              y2="35"
              stroke="#654321"
              strokeWidth="3"
            />

            {/* Sail */}
            <path
              d="M40 12 L40 35 L55 35 Z"
              fill="#FF6B6B"
              stroke="#CC5555"
              strokeWidth="2"
            />

            {/* Flag */}
            <path
              d="M40 10 L45 12 L40 14 Z"
              fill="#FFD93D"
            />
          </svg>
        </div>

        {/* Curved Wave */}
        <div className="loader-wave">
          <svg viewBox="0 0 120 24" preserveAspectRatio="none">
            <path
              d="M0 12 
                 Q 15 6, 30 12 
                 T 60 12 
                 T 90 12 
                 T 120 12"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      <p className="mt-6 text-sm text-gray-600 font-medium">
        {label}
      </p>
    </div>
  );
}

export default BoatLoader;



