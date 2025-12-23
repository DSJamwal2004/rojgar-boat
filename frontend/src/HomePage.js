import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, User, Rocket } from "lucide-react";

function HomePage() {
  return (
    <div className="ocean-page">
      {/* Ocean Background with Waves */}
      <div className="ocean-background">
        {/* Sky Gradient */}
        <div className="sky-gradient"></div>
        
        {/* Sun Light Overlay - creates illumination effect */}
        <div className="sun-light-overlay"></div>
        
        {/* Animated Waves */}
        <div className="waves-container">
          <svg className="wave-animation" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '200px', width: '100%' }}>
            <path fill="#0099ff" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="wave-animation-2" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '180px', width: '100%', marginTop: '-150px' }}>
            <path fill="#0099ff" fillOpacity="0.5" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,138.7C960,117,1056,107,1152,117.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="wave-animation-3" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '160px', width: '100%', marginTop: '-130px' }}>
            <path fill="#0066cc" fillOpacity="0.7" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Rotating Sun - positioned below navbar boat icon */}
        <div className="sun-homepage">
          <svg className="rotating-sun" width="70" height="70" viewBox="0 0 100 100">
            {/* Sun rays */}
            <g className="sun-rays">
              <line x1="50" y1="5" x2="50" y2="18" stroke="#FDB813" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="50" y1="82" x2="50" y2="95" stroke="#FDB813" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="5" y1="50" x2="18" y2="50" stroke="#FDB813" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="82" y1="50" x2="95" y2="50" stroke="#FDB813" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="15" y1="15" x2="25" y2="25" stroke="#FDB813" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="75" y1="75" x2="85" y2="85" stroke="#FDB813" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="85" y1="15" x2="75" y2="25" stroke="#FDB813" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="25" y1="75" x2="15" y2="85" stroke="#FDB813" strokeWidth="3.5" strokeLinecap="round"/>
            </g>
            {/* Sun circle with gradient */}
            <circle cx="50" cy="50" r="22" fill="url(#sunGradient)" stroke="#F59E0B" strokeWidth="2.5"/>
            <defs>
              <radialGradient id="sunGradient">
                <stop offset="0%" stopColor="#FEF08A"/>
                <stop offset="50%" stopColor="#FDE047"/>
                <stop offset="100%" stopColor="#FBBF24"/>
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Boat Animation */}
        <div className="boat-container">
          <svg className="boat" width="80" height="60" viewBox="0 0 80 60" fill="none">
            <path d="M10 35 L70 35 L60 50 L20 50 Z" fill="#8B4513" stroke="#654321" strokeWidth="2"/>
            <path d="M40 10 L40 35 L55 35 Z" fill="#FF6B6B" stroke="#CC5555" strokeWidth="2"/>
            <line x1="40" y1="10" x2="40" y2="35" stroke="#654321" strokeWidth="3"/>
            <path d="M40 10 L45 12 L40 14 Z" fill="#FFD93D"/>
          </svg>
        </div>

        {/* Cloud Decorations */}
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper mt-10 flex flex-col items-center text-center px-6 pb-20">
        
        {/* Hero Section */}
        <div className="max-w-3xl bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-2 border-blue-200">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            Find Jobs. Hire Skilled Workers.<br />
            <span className="text-blue-600 drop-shadow-sm">
              Fast and Effortlessly.
            </span>
          </h1>

          <p className="text-gray-600 text-lg mb-10">
            ROJGAR Boat connects daily-wage workers and employers using
            <span className="font-semibold"> AI skills matching</span> and
            <span className="font-semibold"> GPS-based job recommendations.</span>
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 max-w-3xl w-full">
          
          {/* Worker Card */}
          <Link
            to="/worker"
            className="transform hover:scale-105 transition-all duration-300"
          >
            <div className="p-8 bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-blue-200 hover:shadow-2xl hover:border-blue-400">
              <User
                size={46}
                className="mx-auto text-blue-600 mb-4 drop-shadow-sm icon-bounce"
              />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                I am a Worker
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Register, get AI + GPS job recommendations, and apply instantly.
              </p>
            </div>
          </Link>

          {/* Employer Card */}
          <Link
            to="/employer"
            className="transform hover:scale-105 transition-all duration-300"
          >
            <div className="p-8 bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-green-200 hover:shadow-2xl hover:border-green-400">
              <Briefcase
                size={46}
                className="mx-auto text-green-600 mb-4 drop-shadow-sm icon-bounce"
              />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                I am an Employer
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Post jobs, review workers, and hire skilled people instantly.
              </p>
            </div>
          </Link>
        </div>

        {/* Footer Tagline */}
        <div className="mt-14 flex items-center space-x-3 text-gray-800 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <Rocket size={22} className="text-indigo-600 animate-pulse" />
          <span className="text-sm font-medium">
            Empowering rural workforce using technology 🚀
          </span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;












