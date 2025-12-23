// frontend/src/WorkerList.js
import React, { useEffect, useState } from "react";

function WorkerList() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const res = await fetch("/api/workers");
        const data = await res.json();
        setWorkers(data);
      } catch (err) {
        console.error("Error loading workers:", err);
      }
    };

    loadWorkers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>All Workers</h2>

      {workers.length === 0 && <p>No workers found yet.</p>}

      {workers.map((worker) => (
        <div
          key={worker._id}
          style={{
            padding: 10,
            border: "1px solid #aaa",
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <h3>{worker.name}</h3>

          <p>
            <strong>Skills:</strong>{" "}
            {worker.skills && worker.skills.length > 0
              ? worker.skills.join(", ")
              : "No skills added"}
          </p>

          <p>
            <strong>Location:</strong> {worker.location || "Not specified"}
          </p>

          <p>
            <strong>Rating:</strong>{" "}
            {worker.rating
              ? worker.rating.toFixed(1) + " / 5"
              : "Not rated yet"}
          </p>

          <p>
            <strong>Number of Ratings:</strong> {worker.ratingCount || 0}
          </p>
        </div>
      ))}
    </div>
  );
}

export default WorkerList;
