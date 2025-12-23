import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sailboat, Bell } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [workerLoggedIn, setWorkerLoggedIn] = useState(
    !!localStorage.getItem("workerToken")
  );
  const [employerLoggedIn, setEmployerLoggedIn] = useState(
    !!localStorage.getItem("employerToken")
  );

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // POLLING FIX: Check login + notifications smoothly every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      const workerToken = localStorage.getItem("workerToken");
      const employerToken = localStorage.getItem("employerToken");

      const isWorker = !!workerToken;
      const isEmployer = !!employerToken;

      setWorkerLoggedIn(isWorker);
      setEmployerLoggedIn(isEmployer);

      const token = workerToken || employerToken;
      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const url = isWorker
        ? "/api/workers/notifications"
        : "/api/employers/notifications";

      fetch(url, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data)) return;
          setNotifications(data);
          setUnreadCount(data.filter((n) => !n.isRead).length);
        })
        .catch(() => {});
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // --- OPTION C LOGIC ---
  const markAllRead = async () => {
    const workerToken = localStorage.getItem("workerToken");
    const employerToken = localStorage.getItem("employerToken");
    const token = workerToken || employerToken;

    if (!token) return;

    const url = workerToken
      ? "/api/workers/notifications/read"
      : "/api/employers/notifications/read";

    await fetch(url, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    // update UI immediately
    setUnreadCount(0);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const autoDeleteOld = async () => {
    const workerToken = localStorage.getItem("workerToken");
    const employerToken = localStorage.getItem("employerToken");
    const token = workerToken || employerToken;

    if (!token) return;

    // Notifications older than 7 days
    const oldNotifications = notifications.filter((n) => {
      const age = Date.now() - new Date(n.createdAt).getTime();
      return age > 7 * 24 * 60 * 60 * 1000; // 7 days
    });

    if (oldNotifications.length === 0) return;

    const url = workerToken
      ? "/api/workers/notifications/clear"
      : "/api/employers/notifications/clear";

    await fetch(url, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    // Update UI
    setNotifications((prev) =>
      prev.filter((n) => !oldNotifications.includes(n))
    );
  };

  const handleBellClick = async () => {
    setShowDropdown((prev) => !prev);

    // Step 1 — mark all notifications read
    await markAllRead();

    // Step 2 — auto delete notifications older than 7 days
    await autoDeleteOld();
  };

  const handleLogout = () => {
    localStorage.clear();
    setWorkerLoggedIn(false);
    setEmployerLoggedIn(false);
    setNotifications([]);
    setUnreadCount(0);
    navigate("/");
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <nav className="px-6 py-4 bg-gray-900 text-white flex justify-between items-center shadow-lg">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center space-x-2 font-bold text-xl hover:opacity-90 transition"
      >
        <Sailboat
          size={28}
          strokeWidth={2.2}
          className="text-blue-300 drop-shadow-md"
        />
        <span className="tracking-wide">ROJGAR Boat</span>
      </Link>

      {/* Right side items */}
      <div className="flex items-center space-x-6 text-sm font-medium">
        
        {/* Not logged in */}
        {!workerLoggedIn && !employerLoggedIn && (
          <>
            <Link className="hover:text-blue-300" to="/worker-login">
              Worker Login
            </Link>
            <Link className="hover:text-green-300" to="/employer-login">
              Employer Login
            </Link>
          </>
        )}

        {/* Worker logged in */}
        {workerLoggedIn && (
          <Link to="/worker" className="text-blue-300 hover:text-blue-200">
            Worker Dashboard
          </Link>
        )}

        {/* Employer logged in */}
        {employerLoggedIn && (
          <Link to="/employer" className="text-green-300 hover:text-green-200">
            Employer Dashboard
          </Link>
        )}

        {/* Notification bell */}
        {(workerLoggedIn || employerLoggedIn) && (
          <div className="relative">
            <button
              type="button"
              onClick={handleBellClick}
              className="relative p-2 rounded-full hover:bg-gray-800/70 transition"
            >
              <Bell size={20} className="text-blue-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1.5 py-[1px] rounded-full text-white font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 z-20">
                <div className="px-4 py-2 border-b border-gray-200 font-semibold text-sm">
                  Notifications
                </div>

                {notifications.length === 0 && (
                  <div className="px-4 py-4 text-sm text-gray-500">
                    No notifications yet.
                  </div>
                )}

                {notifications.length > 0 && (
                  <div className="max-h-64 overflow-y-auto">
                    {notifications
                      .slice()
                      .reverse()
                      .slice(0, 8)
                      .map((n, idx) => (
                        <div
                          key={idx}
                          className={`px-4 py-2 text-sm border-b border-gray-100 ${
                            !n.isRead ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="font-medium">{n.message}</div>
                          <div className="text-[11px] text-gray-500 mt-1">
                            {formatTime(n.createdAt)}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        {(workerLoggedIn || employerLoggedIn) && (
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;











