import React, { useState } from "react";
import { login, testAuth } from "../api/AuthClient";
export default function LoginForm() {
  const [user, setUser] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const token = await login(user.email, user.password);
      console.log("Success:", token);
      localStorage.setItem("token", token);
      const testRes = await testAuth();
      console.log("Test Result:", testRes);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={user.email}
        onChange={handleChange}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={user.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
}
