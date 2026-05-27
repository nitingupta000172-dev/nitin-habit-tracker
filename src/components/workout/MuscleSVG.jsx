/** Animated muscle fallback SVG when wger has no image */
export default function MuscleSVG({ color = '#f59e0b' }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="12" fill="#111118" />
      {/* Simple dumbbell icon */}
      <g fill={color} opacity="0.85">
        {/* Bar */}
        <rect x="22" y="37" width="36" height="6" rx="3" />
        {/* Left weight plate */}
        <rect x="14" y="28" width="10" height="24" rx="5" />
        {/* Right weight plate */}
        <rect x="56" y="28" width="10" height="24" rx="5" />
      </g>
      {/* Pulsing glow */}
      <circle cx="40" cy="40" r="30" fill="none" stroke={color} strokeWidth="1.5" opacity="0.2">
        <animate attributeName="r" values="26;32;26" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
