import React, { useEffect, useState } from "react";
import OceanLayout from "./components/OceanLayout";

function EmployerProfile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("employerToken");

  useEffect(() => {
    fetch("/api/employers/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => setMessage("Failed to load profile."));
  }, [token]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch("/api/employers/upload-photo", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData,
    });

    const data = await res.json();

    if (!data.error) {
      setProfile((prev) => ({
        ...prev,
        profilePhotoUrl: data.url,
      }));
      setMessage("Photo uploaded successfully.");
    }

    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    const res = await fetch("/api/employers/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    if (!data.error) setMessage("Profile updated successfully.");

    setSaving(false);
  };

  if (!profile)
    return <div className="p-10 text-center">Loading profile...</div>;

  return (
  <OceanLayout>
    <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">

      <h2 className="text-3xl font-bold mb-6 text-center">Employer Profile</h2>

      {message && <p className="text-center mb-4 text-green-600">{message}</p>}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Photo Column */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-36 h-36 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-4 border-4 border-green-500 shadow">
            {profile.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500">No Photo</span>
            )}
          </div>

          <input type="file" onChange={handlePhotoUpload} className="text-sm" />

          {uploading && (
            <p className="text-blue-600 text-sm mt-1">Uploading...</p>
          )}
        </div>

        {/* Form Column */}
        <div className="md:w-2/3 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
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
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              value={profile.phone || ""}
              disabled
              className="w-full border rounded p-2 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              name="location"
              value={profile.location || ""}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
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

