import { useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel";
import "../styles/AuthPage.css";

export default function VerifySuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="hex-page">
      <div style={{ width: "100%", maxWidth: 1280, height: "100vh", display: "flex", margin: "0 auto", position: "relative" }}>

        {/* LEFT: brand panel */}
        <BrandPanel footer="Patch 16.12 · 168 champions catalogued">
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 38, fontWeight: 500, color: "#f0e6d2", lineHeight: 1.15, letterSpacing: "0.01em", marginBottom: 20 }}>
            The archives recognize you.
          </div>
          <div style={{ fontSize: 15, color: "#7a8aa6", lineHeight: 1.6 }}>
            Your account is fully enrolled. Sign in to begin consulting the Atlas about counters, builds, and lore.
          </div>
        </BrandPanel>

        {/* RIGHT: confirmation content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 80px", position: "relative" }}>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", maxWidth: 560, margin: "0 auto", width: "100%", textAlign: "center" }}>

            {/* Seal glyph, completed */}
            <div style={{ position: "relative", marginBottom: 36 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <g className="seal-ring">
                  <circle cx="60" cy="60" r="54" stroke="#1b2c4d" strokeWidth="1" fill="none" strokeDasharray="2 6" />
                  <polygon points="60,4 62,10 58,10" fill="#c8aa6e" />
                  <polygon points="60,116 62,110 58,110" fill="#c8aa6e" />
                  <polygon points="4,60 10,58 10,62" fill="#c8aa6e" />
                  <polygon points="116,60 110,58 110,62" fill="#c8aa6e" />
                </g>
                <polygon points="60,14 100,36 100,84 60,106 20,84 20,36" stroke="#c8aa6e" strokeWidth="1.4" fill="#0a1830" />
                <g className="seal-core">
                  <polygon points="60,24 90,40 90,80 60,96 30,80 30,40" stroke="#c8aa6e" strokeWidth="1" fill="none" opacity="0.6" />
                  <circle cx="60" cy="60" r="20" fill="#0e2348" stroke="#c8aa6e" strokeWidth="1.4" />
                  <polyline className="check-mark" points="50,60 57,68 72,50" stroke="#c8aa6e" strokeWidth="3.4" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
                </g>
              </svg>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: "#c8aa6e" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.28em", color: "#c8aa6e" }}>SIGIL CONFIRMED</div>
              <div style={{ width: 24, height: 1, background: "#c8aa6e" }}></div>
            </div>

            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 32, fontWeight: 500, color: "#f0e6d2", margin: "0 0 14px 0", letterSpacing: "0.02em", lineHeight: 1.2 }}>
              Your email is verified
            </h2>

            <div style={{ fontSize: 15, color: "#a0b0cc", lineHeight: 1.6, marginBottom: 44, maxWidth: 440 }}>
              Your account is now fully active. Sign in to start consulting the Atlas about champions, matchups, and builds.
            </div>

            <button
              type="button"
              className="hex-btn-primary"
              onClick={() => navigate("/login")}
              style={{ maxWidth: 360, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}
            >
              CONTINUE TO SIGN IN
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#0a1428" strokeWidth="2.4" strokeLinecap="square" />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
