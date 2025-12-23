import React, { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import OceanLayout from "./components/OceanLayout";
import BoatLoader from "./components/BoatLoader";

function GPSRecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // UI controls
  const [radius, setRadius] = useState("all"); // km
  const [sortBy, setSortBy] = useState("distance");

  const token = localStorage.getItem("workerToken");

  // -----------------------------
  // Update worker GPS (stable)
  // -----------------------------
  const updateWorkerLocation = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await fetch("/api/workers/location", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }),
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        reject,
        {
          enableHighAccuracy: false,
          maximumAge: 60000,
          timeout: 10000,
        }
      );
    });
  };

  // -----------------------------
  // Fetch GPS jobs
  // -----------------------------
  const fetchGpsJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs/recommend/gps", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setJobs(data);
        setMessage("");
      } else {
        setMessage(data.error || "No nearby jobs found.");
      }
    } catch {
      setMessage("Failed to fetch nearby jobs.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Initial load
  // -----------------------------
  useEffect(() => {
    if (!token) {
      setMessage("You must login as worker.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        await updateWorkerLocation();
        await fetchGpsJobs();
      } catch {
        setMessage("Unable to access your location.");
        setLoading(false);
      }
    })();
  }, [token]);

  // -----------------------------
  // Apply filters & sorting
  // -----------------------------
  useEffect(() => {
    let result = [...jobs];

    // Radius filter
    if (radius !== "all") {
      const maxMeters = Number(radius) * 1000;
      result = result.filter(
        (job) => typeof job.distance === "number" && job.distance <= maxMeters
      );
    }

    // Sorting
    if (sortBy === "distance") {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === "salary") {
      result.sort((a, b) => b.salary - a.salary);
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setFilteredJobs(result);
  }, [jobs, radius, sortBy]);

  // -----------------------------
  // Job freshness label
  // -----------------------------
  const getFreshness = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 5) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)} hours ago`;
    if (mins < 2880) return "Yesterday";
    return `${Math.floor(mins / 1440)} days ago`;
  };

  return (
    <OceanLayout>
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-gray-900">
          Nearby Jobs (GPS)
        </h2>

        <p className="text-center text-gray-600 mb-6 text-sm">
          Jobs sorted by distance from your current location.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-between mb-8">
          <div className="flex gap-3">
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All distances</option>
              <option value="2">Within 2 km</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="distance">Nearest first</option>
              <option value="salary">Highest salary</option>
              <option value="newest">Newest jobs</option>
            </select>
          </div>

          <button
            onClick={async () => {
              await updateWorkerLocation();
              await fetchGpsJobs();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            🔄 Refresh Location
          </button>
        </div>

        {loading && <BoatLoader label="Finding jobs near you..." />}

        {!loading && message && (
          <p className="text-center text-red-500 mb-6">{message}</p>
        )}

        {!loading && filteredJobs.length === 0 && (
          <p className="text-center text-gray-500">
            No jobs found for selected filters.
          </p>
        )}

        {!loading && filteredJobs.length > 0 && (
          <div className="grid gap-8">
            {filteredJobs.map((job) => {
              let label = null;

              if (job.distance < 500) label = "Very close to you";
              else if (job.distance < 3000) label = "Nearby";
              else if (job.distance < 10000) label = "A bit far";
              else label = "Far away";

              return (
                <div key={job._id}>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>📍 Approximately {label}</span>
                    <span>🕒 {getFreshness(job.createdAt)}</span>
                  </div>
                  <JobCard job={job} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </OceanLayout>
  );
}

export default GPSRecommendedJobs;




















