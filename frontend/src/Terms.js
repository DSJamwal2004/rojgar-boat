import React from "react";
import OceanLayout from "./components/OceanLayout";

function Terms() {
  return (
    <OceanLayout>
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Terms & Conditions
        </h1>

        <div className="space-y-4 text-sm text-gray-700">

          <p>
            <b>1. Platform Role:</b> Rojgar Boat is a technology platform that connects workers and employers. We do not employ workers or guarantee job outcomes.
          </p>

          <p>
            <b>2. No Employer-Employee Relationship:</b> Any agreement is strictly between worker and employer.
          </p>

          <p>
            <b>3. User Responsibilities:</b>
          </p>
          <ul className="list-disc ml-5">
            <li>Workers must provide accurate information.</li>
            <li>Employers must ensure fair wages and safe conditions.</li>
          </ul>

          <p>
            <b>4. Payments:</b> Rojgar Boat does not handle payments. All transactions occur directly between users.
          </p>

          <p>
            <b>5. Safety:</b> Users are responsible for their own safety.
          </p>

          <p>
            <b>6. Data Usage:</b> Location and profile data are used for job matching.
          </p>

          <p>
            <b>7. Prohibited Activities:</b> Fraud, illegal work, and harassment are strictly prohibited.
          </p>

          <p>
            <b>8. Age Restriction:</b> Users must be 18 years or older.
          </p>

          <p>
            <b>9. Limitation of Liability:</b> The platform is not liable for any disputes or damages.
          </p>

        </div>
      </div>
    </OceanLayout>
  );
}

export default Terms;