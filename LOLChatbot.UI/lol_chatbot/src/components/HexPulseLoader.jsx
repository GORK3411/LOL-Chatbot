import { useEffect } from "react";

const KEYFRAMES_ID = "hex-pulse-keyframes";

const CSS = `
@keyframes hex-pulse-outer { 0%,100%{ transform:rotate(0deg) scale(1); opacity:.7 } 50%{ transform:rotate(30deg) scale(1.06); opacity:1 } }
@keyframes hex-pulse-inner { 0%,100%{ transform:rotate(0deg) scale(1); opacity:1 } 50%{ transform:rotate(-30deg) scale(.88); opacity:.55 } }
@keyframes hex-core-glow   { 0%,100%{ opacity:.55; transform:scale(.85) } 50%{ opacity:1; transform:scale(1.15) } }
@keyframes hex-dot-1 { 0%,100%{ opacity:.25 } 33%{ opacity:1 } }
@keyframes hex-dot-2 { 0%,100%{ opacity:.25 } 66%{ opacity:1 } }
@keyframes hex-dot-3 { 0%,50%{ opacity:.25 } 99%{ opacity:1 } }

.hex-outer { animation: hex-pulse-outer 2.4s ease-in-out infinite; transform-origin: 20px 20px; }
.hex-inner { animation: hex-pulse-inner 2.4s ease-in-out infinite; transform-origin: 20px 20px; }
.hex-core  { animation: hex-core-glow   2.4s ease-in-out infinite; transform-origin: 20px 20px; }
.hex-d1 { animation: hex-dot-1 1.4s ease-in-out infinite; }
.hex-d2 { animation: hex-dot-2 1.4s ease-in-out infinite; }
.hex-d3 { animation: hex-dot-3 1.4s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .hex-outer, .hex-inner, .hex-core, .hex-d1, .hex-d2, .hex-d3 {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;

export default function HexPulseLoader() {
  useEffect(() => {
    if (!document.getElementById(KEYFRAMES_ID)) {
      const style = document.createElement("style");
      style.id = KEYFRAMES_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ display: "flex", gap: "14px", marginBottom: "22px" }}
    >
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        Atlas is consulting the archives
      </span>

      <div
        style={{
          flexShrink: 0,
          width: "30px",
          height: "30px",
          border: "1px solid #c8aa6e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <polygon
            points="12,3 20,8 20,16 12,21 4,16 4,8"
            stroke="#c8aa6e"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "#c8aa6e",
            marginBottom: "10px",
          }}
        >
          ATLAS
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "6px 0",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <polygon
              className="hex-outer"
              points="20,3 34,11 34,29 20,37 6,29 6,11"
              stroke="#c8aa6e"
              strokeWidth="1"
              fill="none"
              opacity="0.7"
            />
            <polygon
              className="hex-inner"
              points="20,9 29,14.5 29,25.5 20,31 11,25.5 11,14.5"
              stroke="#c8aa6e"
              strokeWidth="1.2"
              fill="none"
            />
            <polygon
              className="hex-core"
              points="20,15 25,18 25,22 20,25 15,22 15,18"
              fill="#c8aa6e"
            />
          </svg>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "11px",
              letterSpacing: "0.28em",
              color: "#c8aa6e",
            }}
          >
            CONSULTING
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <div className="hex-d1" style={{ width: "5px", height: "5px", background: "#c8aa6e" }} />
            <div className="hex-d2" style={{ width: "5px", height: "5px", background: "#c8aa6e" }} />
            <div className="hex-d3" style={{ width: "5px", height: "5px", background: "#c8aa6e" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
