import React, { useEffect, useState } from "react";
import OceanLayout from "./components/OceanLayout";

/* ✅ BACKEND BASE (Render) */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://rojgar-boat-backend.onrender.com";

function WorkerProfile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("workerToken");

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    if (!token) {
      setMessage("You must be logged in as a worker.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/workers/me`, {
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

        setProfile({
          ...data,
          skillsText: Array.isArray(data.skills)
            ? data.skills.join(", ")
            : "",
        });
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

      const res = await fetch(`${API_BASE}/api/workers/upload-photo`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });

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
    if (!token || !profile) return;

    setSaving(true);
    setMessage("");

    const payload = {
      name: profile.name,
      gender: profile.gender,
      location: profile.location,
      bio: profile.bio,
      experienceYears: profile.experienceYears,
      profilePhotoUrl: profile.profilePhotoUrl,
      skills: profile.skillsText || "",
    };

    try {
      const res = await fetch(`${API_BASE}/api/workers/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
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

      setProfile({
        ...data.worker,
        skillsText: Array.isArray(data.worker.skills)
          ? data.worker.skills.join(", ")
          : "",
      });

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
      <div className="p-10 text-center">
        <p className="text-red-500">You must be logged in as a worker.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <OceanLayout>
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

        {message && (
          <p className="text-center mb-4 text-green-600 font-medium">
            {message}
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Photo + Stats */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-36 h-36 rounded-full bg-gray-200 overflow-hidden mb-4 flex items-center justify-center border-4 border-blue-500 shadow">
              {profile.profilePhotoUrl ? (
                <img
                  src={profile.profilePhotoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">No photo</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full text-sm"
            />

            {uploading && (
              <p className="text-blue-600 text-sm mt-1">Uploading...</p>
            )}

            <div className="mt-4 text-sm text-gray-700 space-y-1 text-center">
              <p>
                ⭐ <strong>Rating:</strong>{" "}
                {profile.rating?.toFixed
                  ? profile.rating.toFixed(1)
                  : profile.rating || 0}{" "}
                / 5
              </p>
              <p>
                🧮 <strong>Ratings Count:</strong>{" "}
                {profile.ratingCount || 0}
              </p>
              <p>
                ✅ <strong>Jobs Completed:</strong>{" "}
                {profile.jobsCompleted || 0}
              </p>
            </div>
          </div>

          {/* Editable Form */}
          <div className="md:w-2/3 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender
                </label>
                <input
                  name="gender"
                  value={profile.gender || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone (read-only)
                </label>
                <input
                  value={profile.phone || ""}
                  disabled
                  className="w-full border rounded p-2 bg-gray-100 text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Skills (comma separated)
              </label>
              <input
                name="skillsText"
                value={profile.skillsText || ""}
                onChange={handleChange}
                className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Experience (years)
                </label>
                <input
                  name="experienceYears"
                  type="number"
                  min="0"
                  value={profile.experienceYears || 0}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location (City)
                </label>
                <input
                  name="location"
                  value={profile.location || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                className="w-full border rounded p-2 h-24"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </OceanLayout>
  );
}

export default WorkerProfile;



