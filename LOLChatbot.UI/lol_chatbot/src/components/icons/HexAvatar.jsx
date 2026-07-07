export default function HexAvatar() {
  return (
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
  );
}
