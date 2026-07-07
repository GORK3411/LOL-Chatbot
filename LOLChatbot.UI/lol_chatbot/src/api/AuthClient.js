import { apiRequest } from "./apiClient";

export function login(email, password) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function register(username, email, password) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
}

export function logout() {
  localStorage.removeItem("token");
}

export function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload["nameid"] ?? null;
  } catch {
    return null;
  }
}

export function testAuth() {
  return apiRequest("/api/auth/test", {
    method: "GET",
  });
}
