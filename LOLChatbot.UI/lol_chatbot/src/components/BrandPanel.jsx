import HexLogo from "./HexLogo";

export default function BrandPanel({ children, footer }) {
  return (
    <div
      style={{
        width: "44%",
        background: "#0a1830",
        borderRight: "1px solid #1b2c4d",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 48,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        width="780"
        height="780"
        viewBox="0 0 780 780"
        style={{ position: "absolute", top: -120, right: -260, opacity: 0.08 }}
      >
        <polygon points="390,40 670,200 670,580 390,740 110,580 110,200" stroke="#c8aa6e" strokeWidth="1.4" fill="none" />
        <polygon points="390,140 590,260 590,520 390,640 190,520 190,260" stroke="#c8aa6e" strokeWidth="1.2" fill="none" />
        <polygon points="390,240 510,310 510,470 390,540 270,470 270,310" stroke="#c8aa6e" strokeWidth="1" fill="none" />
        <polygon points="390,320 450,355 450,425 390,460 330,425 330,355" stroke="#c8aa6e" strokeWidth="0.8" fill="none" />
      </svg>

      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
        <HexLogo />
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 600, color: "#f0e6d2", letterSpacing: "0.22em" }}>
          ARCANE ATLAS
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 440 }}>
        {children}
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 11,
          color: "#5b6b87",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        <div style={{ width: 6, height: 6, background: "#c8aa6e" }}></div>
        <span>{footer}</span>
      </div>
    </div>
  );
}
