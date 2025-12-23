import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OceanLayout from "./components/OceanLayout";

function WorkerForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1: Request OTP
  const requestOtp = async () => {
    if (!phone) {
      setMessage("Please enter your phone number");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/worker/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        setLoading(false);
        return;
      }

      setStep(2);
      setMessage("OTP sent to your phone");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Reset password with OTP
  const resetPassword = async () => {
    if (!otp || !password || !confirmPassword) {
      setMessage("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/worker/reset-with-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, password }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        setLoading(false);
        return;
      }

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/worker-login"), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-3xl px-8 py-10 border">
        <h2 className="text-3xl font-extrabold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-center text-gray-600 mb-8">
          {step === 1
            ? "Enter your registered phone number"
            : "Enter OTP and set a new password"}
        </p>

        <div className="space-y-4">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <button
                onClick={requestOtp}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          {message && (
            <p className="text-sm text-center text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </OceanLayout>
  );
}

export default WorkerForgotPassword;

