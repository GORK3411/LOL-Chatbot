const API_URL = "http://localhost:5170";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token); // Debugging line
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error("API request failed");
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
