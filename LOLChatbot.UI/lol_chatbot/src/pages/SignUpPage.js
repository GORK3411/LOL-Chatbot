import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/AuthClient";
import BrandPanel from "../components/BrandPanel";
import SocialAuthButtons from "../components/SocialAuthButtons";
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

const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function validate(user, agreedToTerms) {
  const errs = {};
  if (!user.username.trim()) errs.username = "Summoner name is required.";
  if (!user.email.trim()) errs.email = "Email is required.";
  if (!user.password) {
    errs.password = "Password is required.";
  } else if (!PW_REGEX.test(user.password)) {
    errs.password = "Must be 8+ characters with uppercase, lowercase, digit, and special character.";
  }
  if (!agreedToTerms) errs.terms = "You must agree to the Terms of Service.";
  return errs;
}

export default function SignUpPage() {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const updated = { ...user, [e.target.name]: e.target.value };
    setUser(updated);
    if (errors[e.target.name]) {
      const errs = validate(updated, agreedToTerms);
      setErrors((prev) => ({ ...prev, [e.target.name]: errs[e.target.name] }));
    }
  };

  const handleTermsToggle = () => {
    const next = !agreedToTerms;
    setAgreedToTerms(next);
    if (errors.terms && next) setErrors((prev) => ({ ...prev, terms: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(user, agreedToTerms);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitError("");
    try {
      const data = await register(user.username, user.email, user.password);
      console.log("Success:", data);
      navigate("/verify-email", { state: { email: user.email } });
    } catch (err) {
      console.error(err);
      setSubmitError("Registration failed. Please try again.");
    }
  };

  const strength = getStrength(user.password);

  return (
    <div className="hex-page">
      <div style={{ width: "100%", maxWidth: 1280, height: "100vh", display: "flex", margin: "0 auto", position: "relative" }}>

        {/* LEFT: brand panel */}
        <BrandPanel footer="Free forever · No credit card required">
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
                  <polygon points="7,0 13,3.5 13,10.5 7,14 1,10.5 1,3.5" stroke="#c8aa6e" strokeWidth="1" fill="none" />
                  <circle cx="7" cy="7" r="2" fill="#c8aa6e" />
                </svg>
                <div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: "#f0e6d2", letterSpacing: "0.06em", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#7a8aa6", lineHeight: 1.55 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </BrandPanel>

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
                  required
                />
                {errors.username && <div style={{ fontSize: 11, color: "#e84057", marginTop: 6 }}>{errors.username}</div>}
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
                  required
                />
                {errors.email && <div style={{ fontSize: 11, color: "#e84057", marginTop: 6 }}>{errors.email}</div>}
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
                  required
                />
                <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ flex: 1, height: 2, background: i <= strength ? "#c8aa6e" : "#1b2c4d", transition: "background 0.2s" }}></div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: "#7a8aa6" }}>8+ chars · uppercase · lowercase · digit · special</div>
                  {strength > 0 && (
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.18em", color: "#c8aa6e" }}>{STRENGTH_LABELS[strength]}</div>
                  )}
                </div>
                {errors.password && <div style={{ fontSize: 11, color: "#e84057", marginTop: 6 }}>{errors.password}</div>}
              </div>

              <div style={{ margin: "24px 0" }}>
                <div
                  onClick={handleTermsToggle}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}
                >
                  <div style={{ flexShrink: 0, width: 16, height: 16, border: `1px solid ${errors.terms ? "#e84057" : "#c8aa6e"}`, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1830", marginTop: 2 }}>
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
                {errors.terms && <div style={{ fontSize: 11, color: "#e84057", marginTop: 6, marginLeft: 26 }}>{errors.terms}</div>}
              </div>

              {submitError && <div style={{ fontSize: 12, color: "#e84057", marginBottom: 12 }}>{submitError}</div>}
              <button type="submit" className="hex-btn-primary" style={{ marginBottom: 22 }}>
                CREATE ACCOUNT
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: "#1b2c4d" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.28em", color: "#5b6b87" }}>OR SIGN UP WITH</div>
              <div style={{ flex: 1, height: 1, background: "#1b2c4d" }}></div>
            </div>

            <SocialAuthButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
