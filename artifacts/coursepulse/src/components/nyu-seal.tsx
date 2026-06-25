export function NyuSeal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="New York University Seal"
      role="img"
    >
      {/* Purple background */}
      <circle cx="100" cy="100" r="99" fill="#57068C" />

      {/* Outer decorative ring */}
      <circle cx="100" cy="100" r="96" fill="none" stroke="white" strokeWidth="1.5" />

      {/* Inner ring — defines the text band */}
      <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" />

      <defs>
        {/* Upper arc path — radius 88, centre (100,100) */}
        <path
          id="nyu-seal-top"
          d="M 12,100 A 88,88 0 0,1 188,100"
        />
        {/* Lower arc path — radius 88, sweeping the bottom */}
        <path
          id="nyu-seal-bottom"
          d="M 17,107 A 88,88 0 0,0 183,107"
        />
      </defs>

      {/* "NEW YORK UNIVERSITY" arced along the top band */}
      <text
        fontSize="10"
        fill="white"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="3.2"
        fontWeight="bold"
      >
        <textPath href="#nyu-seal-top" startOffset="50%" textAnchor="middle">
          NEW YORK UNIVERSITY
        </textPath>
      </text>

      {/* "FOUNDED · MDCCCXXXI" arced along the bottom band */}
      <text
        fontSize="7.5"
        fill="white"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="2"
        opacity="0.85"
      >
        <textPath href="#nyu-seal-bottom" startOffset="50%" textAnchor="middle">
          FOUNDED · MDCCCXXXI
        </textPath>
      </text>

      {/* ── NYU Torch ─────────────────────────────────────────── */}

      {/* Outer flame glow */}
      <ellipse cx="100" cy="70" rx="16" ry="20" fill="white" opacity="0.15" />

      {/* Main flame body */}
      <path
        d="M100,50 C106,52 114,58 113,68 C112,76 107,82 100,85 C93,82 88,76 87,68 C86,58 94,52 100,50Z"
        fill="white"
      />

      {/* Inner flame highlight */}
      <path
        d="M100,57 C103,59 107,63 106,69 C105,74 103,77 100,79 C97,77 95,74 94,69 C93,63 97,59 100,57Z"
        fill="#57068C"
        opacity="0.5"
      />

      {/* Torch neck — connects flame to body */}
      <rect x="96" y="84" width="8" height="6" fill="white" />

      {/* Torch body */}
      <rect x="94.5" y="90" width="11" height="22" rx="1.5" fill="white" />

      {/* Grip band (narrower) */}
      <rect x="96.5" y="104" width="7" height="6" rx="1" fill="white" />

      {/* Wide base / cup */}
      <path d="M86,113 L114,113 L111,119 L89,119 Z" fill="white" />

      {/* Bottom foot */}
      <rect x="89" y="119" width="22" height="4" rx="1" fill="white" />

      {/* Decorative star / dot separators either side of torch (classic seal detail) */}
      <circle cx="66" cy="100" r="2" fill="white" opacity="0.6" />
      <circle cx="134" cy="100" r="2" fill="white" opacity="0.6" />
    </svg>
  );
}
