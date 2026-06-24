import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/AuthClient";
import "../styles/AuthPage.css";

const getStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const STRENGTH_LABELS = ["", "WEAK", "FAIR", "GOOD", "STRONG"];

const FEATURES = [
  { title: "COUNTER-PICK ENGINE", desc: "Counters and matchup advice for every champion in every role." },
  { title: "BUILD CONSULTANT", desc: "Item paths, runes, and skill order tuned to your situation." },
  { title: "LORE COMPENDIUM", desc: "Deep-dive into Runeterra's history, factions, and characters." },
];

export default function SignUpPage() {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(user.username, user.email, user.password);
      console.log("Success:", data);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const strength = getStrength(user.password);

  return (
    <div className="hex-page">
      <div style={{ width: "100%", maxWidth: 1280, height: "100vh", display: "flex", margin: "0 auto", position: "relative" }}>

        {/* LEFT: brand panel */}
        <div style={{ width: "44%", background: "#0a1830", borderRight: "1px solid #1b2c4d", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48, position: "relative", overflow: "hidden" }}>

          <svg width="780" height="780" viewBox="0 0 780 780" style={{ position: "absolute", top: -120, right: -260, opacity: 0.08 }}>
            <polygon points="390,40 670,200 670,580 390,740 110,580 110,200" stroke="#c8aa6e" strokeWidth="1.4" fill="none"/>
            <polygon points="390,140 590,260 590,520 390,640 190,520 190,260" stroke="#c8aa6e" strokeWidth="1.2" fill="none"/>
            <polygon points="390,240 510,310 510,470 390,540 270,470 270,310" stroke="#c8aa6e" strokeWidth="1" fill="none"/>
          </svg>

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="#c8aa6e" strokeWidth="1.5" fill="none"/>
              <polygon points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5" fill="#c8aa6e"/>
            </svg>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 600, color: "#f0e6d2", letterSpacing: "0.22em" }}>ARCANE ATLAS</div>
          </div>

          <div style={{ position: "relative", maxWidth: 440 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 36, height: 1, background: "#c8aa6e" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.28em", color: "#c8aa6e" }}>JOIN THE ATLAS</div>
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 36, fontWeight: 500, color: "#f0e6d2", lineHeight: 1.18, letterSpacing: "0.01em", marginBottom: 32 }}>
              Your strategist for every champion.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {FEATURES.map(({ title, desc }) => (
                <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0, marginTop: 4 }}>
                    <polygon points="7,0 13,3.5 13,10.5 7,14 1,10.5 1,3.5" stroke="#c8aa6e" strokeWidth="1" fill="none"/>
                    <circle cx="7" cy="7" r="2" fill="#c8aa6e"/>
                  </svg>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: "#f0e6d2", letterSpacing: "0.06em", marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, color: "#7a8aa6", lineHeight: 1.55 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "#5b6b87", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <div style={{ width: 6, height: 6, background: "#c8aa6e" }}></div>
            <span>Free forever · No credit card required</span>
          </div>
        </div>

        {/* RIGHT: form */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 80px" }}>

          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 13, color: "#7a8aa6" }}>
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#c8aa6e", marginLeft: 8, fontWeight: 500, cursor: "pointer" }}
            >
              Sign in →
            </span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 440, margin: "0 auto", width: "100%" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 28, height: 1, background: "#c8aa6e" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.28em", color: "#c8aa6e" }}>SUMMONING</div>
            </div>

            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 34, fontWeight: 500, color: "#f0e6d2", margin: "0 0 10px 0", letterSpacing: "0.02em" }}>Create your account</h2>
            <div style={{ fontSize: 14, color: "#7a8aa6", marginBottom: 30 }}>Takes less than a minute.</div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="username" style={{ display: "block", fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.22em", color: "#7a8aa6", marginBottom: 8 }}>
                  SUMMONER NAME
                </label>
                <input
                  className="hex-input"
                  id="username"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  placeholder="Pick a name for the rift"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
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
                  placeholder="you@runeterra.gg"
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label htmlFor="password" style={{ display: "block", fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.22em", color: "#7a8aa6", marginBottom: 8 }}>
                  INCANTATION
                </label>
                <input
                  className="hex-input"
                  id="password"
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                />
                <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ flex: 1, height: 2, background: i <= strength ? "#c8aa6e" : "#1b2c4d", transition: "background 0.2s" }}></div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: "#7a8aa6" }}>8+ characters, mix of letters &amp; numbers</div>
                  {strength > 0 && (
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.18em", color: "#c8aa6e" }}>{STRENGTH_LABELS[strength]}</div>
                  )}
                </div>
              </div>

              <div
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "24px 0", cursor: "pointer" }}
              >
                <div style={{ flexShrink: 0, width: 16, height: 16, border: "1px solid #c8aa6e", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1830", marginTop: 2 }}>
                  {agreedToTerms && (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#c8aa6e" strokeWidth="1.6" fill="none"/>
                    </svg>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#7a8aa6", lineHeight: 1.5 }}>
                  I agree to the <span style={{ color: "#c8aa6e" }}>Terms of Service</span> and <span style={{ color: "#c8aa6e" }}>Privacy Policy</span>.
                </div>
              </div>

              <button type="submit" className="hex-btn-primary" style={{ marginBottom: 22 }}>
                CREATE ACCOUNT
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: "#1b2c4d" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.28em", color: "#5b6b87" }}>OR SIGN UP WITH</div>
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
