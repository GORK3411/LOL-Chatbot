import DiamondDot from "./icons/DiamondDot";

export default function Modal({
  title,
  onClose,
  onConfirm,
  confirmLabel,
  confirmDisabled = false,
  confirmDanger = false,
  children,
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6,16,31,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0a1830",
          border: `1px solid ${confirmDanger ? "#1b2c4d" : "#c8aa6e"}`,
          padding: "32px",
          minWidth: "400px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {!confirmDanger && <DiamondDot />}
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "#f0e6d2",
              letterSpacing: "0.14em",
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ height: "1px", background: "#1b2c4d", marginBottom: "20px" }} />

        {children}

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 18px",
              background: "transparent",
              border: "1px solid #1b2c4d",
              color: "#a09b8c",
              fontFamily: "'Cinzel', serif",
              fontSize: "11px",
              letterSpacing: "0.18em",
              cursor: "pointer",
            }}
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            style={
              confirmDanger
                ? {
                    padding: "9px 18px",
                    background: "transparent",
                    border: "1px solid #c8503a",
                    color: "#c8503a",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    cursor: "pointer",
                  }
                : {
                    padding: "9px 18px",
                    background: "#c8aa6e",
                    border: "none",
                    color: "#0a1428",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    cursor: confirmDisabled ? "default" : "pointer",
                    opacity: confirmDisabled ? 0.4 : 1,
                  }
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
