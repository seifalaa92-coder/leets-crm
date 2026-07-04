// Leets Logo - Exact recreation from user uploaded image
// Geometric angular wordmark with sharp corners

export function LeetsLogo({ 
  className = "w-40 h-auto",
  color = "white",
  bgColor = "transparent"
}: { 
  className?: string;
  color?: string;
  bgColor?: string;
}) {
  return (
    <svg 
      viewBox="0 0 200 60" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ backgroundColor: bgColor }}
    >
      {/* L - tall with angular top */}
      <path 
        d="M10 8L10 52L34 52L34 44L18 44L18 16L22 8L10 8Z" 
        fill={color}
      />
      
      {/* First E - geometric with diagonal cut */}
      <path 
        d="M36 8L36 52L60 52L60 44L44 44L44 36L56 28L44 20L44 16L60 16L60 8L36 8Z" 
        fill={color}
      />
      
      {/* Second E - same geometric style */}
      <path 
        d="M62 8L62 52L86 52L86 44L70 44L70 36L82 28L70 20L70 16L86 16L86 8L62 8Z" 
        fill={color}
      />
      
      {/* T - angular with wide crossbar */}
      <path 
        d="M88 8L88 16L100 16L100 52L108 52L108 16L120 16L120 8L88 8Z" 
        fill={color}
      />
      
      {/* S - most geometric, angular cuts */}
      <path 
        d="M122 8L122 20L130 20L130 12L138 12L138 20L122 20L122 52L138 52L138 40L130 40L130 48L122 48L122 36L138 36L138 8L122 8Z" 
        fill={color}
      />
    </svg>
  );
}

// Icon version - Just the stylized L for small spaces
export function LeetsIcon({ 
  className = "w-10 h-10",
  bgColor = "#EA553B",
  letterColor = "white"
}: { 
  className?: string;
  bgColor?: string;
  letterColor?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      {/* Background */}
      <rect width="48" height="48" rx="8" fill={bgColor}/>
      {/* Angular L matching the wordmark style */}
      <path 
        d="M14 12L14 36H34V30H20V18H24L22 12H14Z" 
        fill={letterColor}
      />
    </svg>
  );
}

// Full logo with tagline
export function LeetsLogoFull({ 
  className = "w-48 h-auto",
  darkMode = true
}: { 
  className?: string;
  darkMode?: boolean;
}) {
  const textColor = darkMode ? "white" : "#111111";
  const accentColor = "#EA553B";
  
  return (
    <svg viewBox="0 0 240 80" fill="none" className={className}>
      {/* LEETS wordmark */}
      <g fill={textColor}>
        {/* L */}
        <path d="M12 8L12 52L36 52L36 44L20 44L20 16L24 8L12 8Z"/>
        {/* E */}
        <path d="M38 8L38 52L62 52L62 44L46 44L46 36L58 28L46 20L46 16L62 16L62 8L38 8Z"/>
        {/* E */}
        <path d="M64 8L64 52L88 52L88 44L72 44L72 36L84 28L72 20L72 16L88 16L88 8L64 8Z"/>
        {/* T */}
        <path d="M90 8L90 16L102 16L102 52L110 52L110 16L122 16L122 8L90 8Z"/>
        {/* S */}
        <path d="M124 8L124 20L132 20L132 12L140 12L140 20L124 20L124 52L140 52L140 40L132 40L132 48L124 48L124 36L140 36L140 8L124 8Z"/>
      </g>
      
      {/* Tagline */}
      <text 
        x="12" 
        y="72" 
        fill={accentColor} 
        fontFamily="system-ui, sans-serif" 
        fontSize="10" 
        fontWeight="600"
        letterSpacing="0.15em"
      >
        PRACTICE &gt; ACHIEVE &gt; INSPIRE
      </text>
    </svg>
  );
}
