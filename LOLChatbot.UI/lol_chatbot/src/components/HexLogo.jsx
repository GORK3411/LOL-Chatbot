export default function HexLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="#c8aa6e" strokeWidth="1.5" fill="none" />
      <polygon points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5" fill="#c8aa6e" />
    </svg>
  );
}
