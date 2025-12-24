const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    // backend might send empty response
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

