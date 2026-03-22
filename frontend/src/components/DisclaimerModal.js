import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DisclaimerModal = ({ onAccept }) => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => {
    onAccept();
  };

  const handleDecline = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-2xl p-6">

        <h2 className="text-2xl font-bold text-center mb-4">
          Terms & Disclaimer
        </h2>

        {/* SCROLLABLE CONTENT */}
        <div className="max-h-[300px] overflow-y-auto text-sm text-gray-700 space-y-3 pr-2">

          <p><b>Platform Role:</b> Rojgar Boat is a technology platform that connects workers and employers. We do not employ workers or guarantee job outcomes.</p>

          <p><b>No Employer-Employee Relationship:</b> Any agreement is strictly between worker and employer. The platform is not a party to any contract.</p>

          <p><b>User Responsibilities:</b></p>
          <ul className="list-disc ml-5">
            <li>Workers must provide accurate information and perform work responsibly.</li>
            <li>Employers must ensure fair wages and safe working conditions.</li>
          </ul>

          <p><b>Payments & Disputes:</b> Rojgar Boat does not process or handle payments. All transactions occur directly between workers and employers.</p>

          <p><b>Safety:</b> Users must ensure their personal safety while interacting with others.</p>

          <p><b>Data Usage:</b> Location and personal data are used for job matching and recommendations.</p>

          <p><b>Prohibited Activities:</b> Fraud, fake jobs, illegal work, or harassment are strictly prohibited.</p>

          <p><b>Age Restriction:</b> Users must be at least 18 years old.</p>

          <p><b>Limitation of Liability:</b> The platform is not liable for any damages, losses, or disputes.</p>

          <p
            onClick={() => navigate("/terms")}
            className="text-blue-600 underline cursor-pointer"
          >
            View full Terms & Conditions
          </p>

        </div>

        {/* CHECKBOX */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="mr-2"
          />
          <span className="text-sm">
            I agree to the Terms & Disclaimer
          </span>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Decline
          </button>

          <button
            onClick={handleAccept}
            disabled={!checked}
            className={`px-4 py-2 rounded-lg text-white ${
              checked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Accept & Continue
          </button>
        </div>

      </div>
    </div>
  );
};

export default DisclaimerModal;