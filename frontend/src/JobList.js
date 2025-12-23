import React, { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import OceanLayout from "./components/OceanLayout";
import BoatLoader from "./components/BoatLoader";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <OceanLayout>
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl px-8 py-10 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          All Jobs
        </h2>

        {loading ? (
          <BoatLoader label="Fetching jobs..." />
        ) : (
          <div className="grid gap-8">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </OceanLayout>
  );
}

export default JobList;





