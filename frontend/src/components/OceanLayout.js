import React from "react";

function OceanLayout({ children }) {
  return (
    <div className="ocean-page">
      {/* 🌊 BACKGROUND */}
      <div className="ocean-background">
        <div className="sky-gradient"></div>

        {/* ☀️ Sun light overlay */}
        <div className="sun-light-overlay"></div>

        {/* ☀️ Rotating Sun */}
        <div className="sun-homepage rotating-sun">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="20" fill="#FDB813" />
            <g className="sun-rays">
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="5"
                  x2="50"
                  y2="20"
                  stroke="#FDB813"
                  strokeWidth="4"
                  transform={`rotate(${i * 45} 50 50)`}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* ☁️ Clouds */}
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>

        {/* 🌊 Waves */}
        <div className="waves-container">
          <svg viewBox="0 0 1440 320">
            <path
              fill="#38bdf8"
              d="M0,224L60,202.7C120,181,240,139,360,149.3C480,160,600,224,720,240C840,256,960,224,1080,208C1200,192,1320,192,1380,192L1440,192V320H0Z"
              className="wave-animation"
            />
          </svg>
        </div>
      </div>

      {/* 📄 PAGE CONTENT */}
      <div className="content-wrapper min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}

export default OceanLayout;
