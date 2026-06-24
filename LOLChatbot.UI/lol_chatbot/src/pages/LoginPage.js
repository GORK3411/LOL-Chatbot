import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, testAuth } from "../api/AuthClient";
import "../styles/AuthPage.css";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(user.email, user.password);
      console.log("Success:", token);
      localStorage.setItem("token", token);
      const testRes = await testAuth();
      console.log("Test Result:", testRes);
      navigate("/chat");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="hex-page">
      <div style={{ width: "100%", maxWidth: 1280, height: "100vh", display: "flex", margin: "0 auto", position: "relative" }}>

        {/* LEFT: brand panel */}
        <div style={{ width: "44%", background: "#0a1830", borderRight: "1px solid #1b2c4d", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48, position: "relative", overflow: "hidden" }}>

          <svg width="780" height="780" viewBox="0 0 780 780" style={{ position: "absolute", top: -120, right: -260, opacity: 0.08 }}>
            <polygon points="390,40 670,200 670,580 390,740 110,580 110,200" stroke="#c8aa6e" strokeWidth="1.4" fill="none"/>
            <polygon points="390,140 590,260 590,520 390,640 190,520 190,260" stroke="#c8aa6e" strokeWidth="1.2" fill="none"/>
            <polygon points="390,240 510,310 510,470 390,540 270,470 270,310" stroke="#c8aa6e" strokeWidth="1" fill="none"/>
            <polygon points="390,320 450,355 450,425 390,460 330,425 330,355" stroke="#c8aa6e" strokeWidth="0.8" fill="none"/>
          </svg>

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="#c8aa6e" strokeWidth="1.5" fill="none"/>
              <polygon points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5" fill="#c8aa6e"/>
            </svg>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 600, color: "#f0e6d2", letterSpacing: "0.22em" }}>ARCANE ATLAS</div>
          </div>

          <div style={{ position: "relative", maxWidth: 420 }}>
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
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "#5b6b87", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <div style={{ width: 6, height: 6, background: "#c8aa6e" }}></div>
            <span>Patch 16.12 · 168 champions catalogued</span>
          </div>
        </div>

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
                  SUMMONER NAME OR EMAIL
                </label>
                <input
                  className="hex-input"
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="kayle@runeterra.gg"
                />
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
              </div>

              <div
                onClick={() => setRememberMe(!rememberMe)}
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, cursor: "pointer" }}
              >
                <div style={{ width: 16, height: 16, border: "1px solid #c8aa6e", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1830", flexShrink: 0 }}>
                  {rememberMe && (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#c8aa6e" strokeWidth="1.6" fill="none"/>
                    </svg>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#cdbe91" }}>Keep me signed in</div>
              </div>

              <button type="submit" className="hex-btn-primary" style={{ marginBottom: 24 }}>
                SIGN IN
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: "#1b2c4d" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.28em", color: "#5b6b87" }}>OR CONTINUE WITH</div>
              <div style={{ flex: 1, height: 1, background: "#1b2c4d" }}></div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" className="hex-btn-social">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="#5865F2" d="M20 4H4a2 2 0 00-2 2v14l4-4h14a2 2 0 002-2V6a2 2 0 00-2-2zM9 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                </svg>
                Discord
              </button>
              <button type="button" className="hex-btn-social">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="#fff" d="M21.35 11.1H12v2.92h5.35c-.23 1.55-1.74 4.54-5.35 4.54-3.22 0-5.84-2.67-5.84-5.96s2.62-5.96 5.84-5.96c1.83 0 3.05.78 3.76 1.46l2.56-2.47C16.7 4.07 14.54 3 12 3 6.93 3 2.85 7.08 2.85 12.15S6.93 21.3 12 21.3c6.92 0 9.5-4.86 9.5-7.4 0-.5-.05-.88-.15-2.8z"/>
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
