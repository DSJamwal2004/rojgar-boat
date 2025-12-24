import React, { useEffect, useState } from "react";
import OceanLayout from "./components/OceanLayout";

/* ✅ BACKEND BASE (Render) */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://rojgar-boat-backend.onrender.com";

function EmployerProfile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("employerToken");

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    if (!token) {
      setMessage("You must be logged in as an employer.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/employers/me`, {
          headers: { Authorization: "Bearer " + token },
        });

        const text = await res.text();
        let data = null;

        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load profile.");
        }

        setProfile(data);
      } catch (err) {
        setMessage(err.message || "Failed to load profile.");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ---------------- UPLOAD PHOTO ---------------- */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(
        `${API_BASE}/api/employers/upload-photo`,
        {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
          body: formData,
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
        throw new Error(data?.error || "Photo upload failed.");
      }

      setProfile((prev) => ({
        ...prev,
        profilePhotoUrl: data.url,
      }));

      setMessage("Photo uploaded successfully.");
    } catch (err) {
      setMessage(err.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/employers/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(profile),
      });

      const text = await res.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update profile.");
      }

      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- GUARDS ---------------- */
  if (!token) {
    return (
      <div className="p-10 text-center text-red-500">
        You must be logged in as an employer.
      </div>
    );
  }

  if (!profile) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  /* ---------------- UI ---------------- */
  return (
    <OceanLayout>
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Employer Profile
        </h2>

        {message && (
          <p className="text-center mb-4 text-green-600 font-medium">
            {message}
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Photo Column */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-36 h-36 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-4 border-4 border-green-500 shadow">
              {profile.profilePhotoUrl ? (
                <img
                  src={profile.profilePhotoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-500">No Photo</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="text-sm"
            />

            {uploading && (
              <p className="text-blue-600 text-sm mt-1">Uploading...</p>
            )}
          </div>

          {/* Form Column */}
          <div className="md:w-2/3 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Organization
              </label>
              <input
                name="organization"
                value={profile.organization || ""}
                onChange={handleChange}
                className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                value={profile.phone || ""}
                disabled
                className="w-full border rounded p-2 bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Location
              </label>
              <input
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
                className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </OceanLayout>
  );
}

export default EmployerProfile;


