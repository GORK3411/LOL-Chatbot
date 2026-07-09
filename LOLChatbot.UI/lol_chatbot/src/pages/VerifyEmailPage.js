import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BrandPanel from "../components/BrandPanel";
import "../styles/AuthPage.css";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  if (!email) return null;

  return (
    <div className="hex-page">
      <div style={{ width: "100%", maxWidth: 1280, height: "100vh", display: "flex", margin: "0 auto", position: "relative" }}>

        {/* LEFT: brand panel */}
        <BrandPanel>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 38, fontWeight: 500, color: "#f0e6d2", lineHeight: 1.15, letterSpacing: "0.01em", marginBottom: 20 }}>
            One last rite to open the archives.
          </div>
          <div style={{ fontSize: 15, color: "#7a8aa6", lineHeight: 1.6 }}>
            Verifying your email keeps your account yours — and lets us send you patch notes, saved consultations, and account alerts.
          </div>
        </BrandPanel>

        {/* RIGHT: verification content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 80px", position: "relative" }}>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", maxWidth: 560, margin: "0 auto", width: "100%", textAlign: "center" }}>

            {/* Seal glyph */}
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
                  <polygon points="60,24 90,40 90,80 60,96 30,80 30,40" stroke="#c8aa6e" strokeWidth="1" fill="none" opacity="0.5" />
                  <rect x="40" y="48" width="40" height="26" stroke="#c8aa6e" strokeWidth="1.6" fill="none" />
                  <path d="M40 48 L60 63 L80 48" stroke="#c8aa6e" strokeWidth="1.6" fill="none" />
                  <circle cx="60" cy="63" r="3" fill="#c8aa6e" />
                </g>
              </svg>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: "#c8aa6e" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.28em", color: "#c8aa6e" }}>A SIGIL AWAITS</div>
              <div style={{ width: 24, height: 1, background: "#c8aa6e" }}></div>
            </div>

            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 32, fontWeight: 500, color: "#f0e6d2", margin: "0 0 14px 0", letterSpacing: "0.02em", lineHeight: 1.2 }}>
              Check your mailbox
            </h2>

            <div style={{ fontSize: 15, color: "#a0b0cc", lineHeight: 1.6, marginBottom: 8, maxWidth: 460 }}>
              We've sent a verification sigil to
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 600, color: "#f0e6d2", letterSpacing: "0.06em", marginBottom: 14 }}>
              {email}
            </div>
            <div style={{ fontSize: 14, color: "#7a8aa6", lineHeight: 1.6, marginBottom: 36, maxWidth: 460 }}>
              Open the message and follow the link within to complete your enrollment. The sigil expires in <span style={{ color: "#c8aa6e" }}>24 hours</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
