import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sendVerificationLink } from "../api/AuthClient";
import BrandPanel from "../components/BrandPanel";
import "../styles/AuthPage.css";

export default function VerifyFailurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [resendState, setResendState] = useState("idle"); // idle | sending | sent | error

  const handleResend = async () => {
    if (!email || resendState === "sending") return;
    setResendState("sending");
    try {
      await sendVerificationLink(email);
      setResendState("sent");
    } catch (err) {
      console.error(err);
      setResendState("error");
    }
  };

  return (
    <div className="hex-page">
      <div style={{ width: "100%", maxWidth: 1280, height: "100vh", display: "flex", margin: "0 auto", position: "relative" }}>

        {/* LEFT: brand panel */}
        <BrandPanel footer="Patch 16.12 · 168 champions catalogued">
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 38, fontWeight: 500, color: "#f0e6d2", lineHeight: 1.15, letterSpacing: "0.01em", marginBottom: 20 }}>
            The sigil did not hold.
          </div>
          <div style={{ fontSize: 15, color: "#7a8aa6", lineHeight: 1.6 }}>
            Verification links expire after 24 hours, or may have already been used. Request a new one to finish enrolling.
          </div>
        </BrandPanel>

        {/* RIGHT: failure content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 80px", position: "relative" }}>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", maxWidth: 560, margin: "0 auto", width: "100%", textAlign: "center" }}>

            {/* Seal glyph, cracked/failed */}
            <div style={{ position: "relative", marginBottom: 36 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="54" stroke="#1b2c4d" strokeWidth="1" fill="none" strokeDasharray="2 6" />
                <polygon points="60,14 100,36 100,84 60,106 20,84 20,36" stroke="#8a3a3a" strokeWidth="1.4" fill="#150a10" />
                <g className="seal-crack">
                  <polygon points="60,24 90,40 90,80 60,96 30,80 30,40" stroke="#c66a5a" strokeWidth="1" fill="none" opacity="0.6" />
                  <circle cx="60" cy="60" r="20" fill="#1a0d0f" stroke="#c66a5a" strokeWidth="1.4" />
                  <path className="seal-crack-line" d="M60 42 L55 58 L64 62 L52 78" stroke="#c66a5a" strokeWidth="2" fill="none" strokeLinecap="square" />
                  <path className="seal-crack-line" d="M46 50 L52 58" stroke="#c66a5a" strokeWidth="1.4" fill="none" strokeLinecap="square" />
                </g>
              </svg>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: "#c66a5a" }}></div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.28em", color: "#c66a5a" }}>SIGIL BROKEN</div>
              <div style={{ width: 24, height: 1, background: "#c66a5a" }}></div>
            </div>

            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 32, fontWeight: 500, color: "#f0e6d2", margin: "0 0 14px 0", letterSpacing: "0.02em", lineHeight: 1.2 }}>
              This link no longer works
            </h2>

            <div style={{ fontSize: 15, color: "#a0b0cc", lineHeight: 1.6, marginBottom: 8, maxWidth: 440 }}>
              The verification link is either expired or has already been used.
            </div>
            <div style={{ fontSize: 14, color: "#7a8aa6", lineHeight: 1.6, marginBottom: 44, maxWidth: 440 }}>
              {email ? (
                <>Request a fresh one below and we'll send it to <span style={{ color: "#c8aa6e" }}>{email}</span>.</>
              ) : (
                "Sign in to request a fresh verification link."
              )}
            </div>

            {email && (
              <>
                <button
                  type="button"
                  className="hex-btn-primary"
                  onClick={handleResend}
                  disabled={resendState === "sending"}
                  style={{ maxWidth: 360, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: resendState === "sending" ? 0.6 : 1 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12a8 8 0 0114-5.3L20 4v6h-6M20 12a8 8 0 01-14 5.3L4 20v-6h6" stroke="#0a1428" strokeWidth="2.4" />
                  </svg>
                  {resendState === "sending" ? "SENDING…" : resendState === "sent" ? "SIGIL SENT" : "RESEND MAIL"}
                </button>
                {resendState === "error" && (
                  <div style={{ fontSize: 12, color: "#e84057", marginBottom: 14 }}>
                    Couldn't send the link. Please try again.
                  </div>
                )}
              </>
            )}

            <div style={{ fontSize: 13, color: "#7a8aa6" }}>
              Wrong account?
              <span
                onClick={() => navigate("/login")}
                style={{ color: "#c8aa6e", marginLeft: 6, fontWeight: 500, cursor: "pointer" }}
              >
                Return to sign in
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
