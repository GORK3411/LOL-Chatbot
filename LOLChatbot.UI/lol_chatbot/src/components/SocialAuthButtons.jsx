export default function SocialAuthButtons() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <button type="button" className="hex-btn-social">
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path fill="#5865F2" d="M20 4H4a2 2 0 00-2 2v14l4-4h14a2 2 0 002-2V6a2 2 0 00-2-2zM9 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
        Discord
      </button>
      <button type="button" className="hex-btn-social">
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path fill="#fff" d="M21.35 11.1H12v2.92h5.35c-.23 1.55-1.74 4.54-5.35 4.54-3.22 0-5.84-2.67-5.84-5.96s2.62-5.96 5.84-5.96c1.83 0 3.05.78 3.76 1.46l2.56-2.47C16.7 4.07 14.54 3 12 3 6.93 3 2.85 7.08 2.85 12.15S6.93 21.3 12 21.3c6.92 0 9.5-4.86 9.5-7.4 0-.5-.05-.88-.15-2.8z" />
        </svg>
        Google
      </button>
    </div>
  );
}
