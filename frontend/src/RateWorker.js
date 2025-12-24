import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";

/* ✅ BACKEND BASE (Render) */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://rojgar-boat-backend.onrender.com";

function RateWorker() {
  const { workerId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("employerToken");

  const submitRating = async () => {
    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    if (!token) {
      alert("You must login as employer.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/workers/rate/${workerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ rating: Number(rating) }),
        }
      );

      const text = await res.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit rating.");
      }

      alert(data?.message || "Worker rated successfully!");
      navigate(-1); // go back to applications
    } catch (err) {
      alert(err.message || "Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OceanLayout>
      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-extrabold text-center mb-2 text-gray-900">
            Rate Worker
          </h2>

          <p className="text-center text-gray-600 text-sm mb-6">
            Share your experience to help other employers.
          </p>

          <div className="space-y-5">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ⭐
                </option>
              ))}
            </select>

            <button
              onClick={submitRating}
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </div>
      </div>
    </OceanLayout>
  );
}

export default RateWorker;




