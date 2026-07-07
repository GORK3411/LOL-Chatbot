export default function FracturedSigilError({ onRetry, onDismiss }) {
  return (
    <div
      role="alert"
      style={{ display: "flex", gap: "14px", marginBottom: "22px", alignItems: "flex-start" }}
    >
      <div
        style={{
          flexShrink: 0,
          width: "30px",
          height: "30px",
          border: "1px solid #8a3a3a",
          background: "#1a0d0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <polygon points="12,3 20,8 20,16 12,21 4,16 4,8" stroke="#c66a5a" strokeWidth="1.5" />
          <path d="M8 6 L14 13 L11 15 L16 21" stroke="#c66a5a" strokeWidth="1.2" fill="none" />
        </svg>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "11px",
              letterSpacing: "0.18em",
              color: "#c66a5a",
            }}
          >
            ATLAS
          </div>
          <div style={{ width: "14px", height: "1px", background: "#8a3a3a" }} />
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: "#8a3a3a",
            }}
          >
            SIGNAL LOST
          </div>
        </div>

        <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#cdbe91" }}>
          The connection to the archives faltered. Your question did not reach the Atlas.
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
          <button
            type="button"
            onClick={onRetry}
            style={{
              background: "transparent",
              border: "1px solid #c8aa6e",
              color: "#c8aa6e",
              fontFamily: "'Cinzel', serif",
              fontSize: "10px",
              letterSpacing: "0.22em",
              fontWeight: 600,
              padding: "8px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12a8 8 0 0114-5.3L20 4v6h-6M20 12a8 8 0 01-14 5.3L4 20v-6h6"
                stroke="#c8aa6e"
                strokeWidth="2"
              />
            </svg>
            RETRY
          </button>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: "transparent",
              border: "1px solid #1b2c4d",
              color: "#7a8aa6",
              fontFamily: "'Cinzel', serif",
              fontSize: "10px",
              letterSpacing: "0.22em",
              fontWeight: 600,
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
