import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, testAuth } from "../api/AuthClient";
import BrandPanel from "../components/BrandPanel";
import SocialAuthButtons from "../components/SocialAuthButtons";
import "../styles/AuthPage.css";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const updated = { ...user, [e.target.name]: e.target.value };
    setUser(updated);
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!user.email.trim()) errs.email = "Email is required.";
    if (!user.password) errs.password = "Password is required.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoginError("");
    try {
      const token = await login(user.email, user.password);
      console.log("Success:", token);
      localStorage.setItem("token", token);
      const testRes = await testAuth();
      console.log("Test Result:", testRes);
      navigate("/chat");
    } catch (err) {
      console.error(err);
      setLoginError("Invalid email or password.");
    }
  };

  return (
    <div className="hex-page">
      <div style={{ width: "100%", maxWidth: 1280, height: "100vh", display: "flex", margin: "0 auto", position: "relative" }}>

        {/* LEFT: brand panel */}
        <BrandPanel footer="Patch 16.12 · 168 champions catalogued">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div style={{ width: 36, height: 1, background: "#c8aa6e" }}></div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.28em", color: "#c8aa6e" }}>THE COMPENDIUM</div>
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 42, fontWeight: 500, color: "#f0e6d2", lineHeight: 1.15, letterSpacing: "0.01em", marginBottom: 18 }}>
            Every champion. One conversation.
          </div>
          <div style={{ fontSize: 15, color: "#7a8aa6", lineHeight: 1.6 }}>
            Counters, builds, matchups, lore. Ask anything about any of Runeterra's champions and the Atlas will answer.
          </div>
        </BrandPanel>

        {/* RIGHT: form */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 80px" }}>

          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 13, color: "#7a8aa6" }}>
            New to the Atlas?
            <span
              onClick={() => navigate("/")}
              style={{ color: "#c8aa6e", marginLeft: 8, fontWeight: 500, cursor: "pointer" }}
            >
              Create an account →
            </span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 440, margin: "0 auto", width: "100%" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 28, height: 1, background: "#c8aa6e" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.28em", color: "#c8aa6e" }}>RETURN</div>
            </div>

            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 34, fontWeight: 500, color: "#f0e6d2", margin: "0 0 10px 0", letterSpacing: "0.02em" }}>Welcome back</h2>
            <div style={{ fontSize: 14, color: "#7a8aa6", marginBottom: 36 }}>Sign in to continue your consultations.</div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="email" style={{ display: "block", fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.22em", color: "#7a8aa6", marginBottom: 8 }}>
                  EMAIL
                </label>
                <input
                  className="hex-input"
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="kayle@runeterra.gg"
                  required
                />
                {errors.email && <div style={{ fontSize: 11, color: "#e84057", marginTop: 6 }}>{errors.email}</div>}
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label htmlFor="password" style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.22em", color: "#7a8aa6" }}>
                    INCANTATION
                  </label>
                  <span style={{ fontSize: 12, color: "#c8aa6e", cursor: "pointer" }}>Forgotten?</span>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    className="hex-input"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    style={{ padding: "13px 44px 13px 14px" }}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="#5b6b87" strokeWidth="1.6"/>
                      <circle cx="12" cy="12" r="3" stroke="#5b6b87" strokeWidth="1.6"/>
                    </svg>
                  </span>
                </div>
                {errors.password && <div style={{ fontSize: 11, color: "#e84057", marginTop: 6 }}>{errors.password}</div>}
              </div>

              {loginError && <div style={{ fontSize: 12, color: "#e84057", marginBottom: 12 }}>{loginError}</div>}
              <button type="submit" className="hex-btn-primary" style={{ marginBottom: 24 }}>
                SIGN IN
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: "#1b2c4d" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.28em", color: "#5b6b87" }}>OR CONTINUE WITH</div>
              <div style={{ flex: 1, height: 1, background: "#1b2c4d" }}></div>
            </div>

            <SocialAuthButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
