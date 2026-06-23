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

export function testAuth() {
  return apiRequest("/api/auth/test", {
    method: "GET",
  });
}
