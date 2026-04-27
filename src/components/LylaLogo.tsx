import type { ReactElement } from "react";

export default function LylaLogo(): ReactElement {
  return (
    <div className="logoWrap">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="16" fill="#111827" />
        <circle cx="18" cy="18" r="8" fill="#60a5fa" />
      </svg>
      <span>Lyla</span>
    </div>
  );
}
