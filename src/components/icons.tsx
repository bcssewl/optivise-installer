export function ExcelIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="excel_a" x1="4.494" y1="-2092.086" x2="13.832" y2="-2075.914" gradientTransform="translate(0 2100)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#18884f"/>
          <stop offset="0.5" stopColor="#117e43"/>
          <stop offset="1" stopColor="#0b6631"/>
        </linearGradient>
      </defs>
      <path d="M19.581,15.35,8.512,13.4V27.809A1.192,1.192,0,0,0,9.705,29h19.1A1.192,1.192,0,0,0,30,27.809h0V22.5Z" fill="#185c37"/>
      <path d="M19.581,3H9.705A1.192,1.192,0,0,0,8.512,4.191h0V9.5L19.581,16l5.861,1.95L30,16V9.5Z" fill="#21a366"/>
      <path d="M8.512,9.5H19.581V16H8.512Z" fill="#107c41"/>
      <path d="M16.434,8.2H8.512V24.45h7.922a1.2,1.2,0,0,0,1.194-1.191V9.391A1.2,1.2,0,0,0,16.434,8.2Z" opacity="0.1"/>
      <path d="M15.783,8.85H8.512V25.1h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" opacity="0.2"/>
      <path d="M15.783,8.85H8.512V23.8h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" opacity="0.2"/>
      <path d="M15.132,8.85H8.512V23.8h6.62a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.132,8.85Z" opacity="0.2"/>
      <path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" fill="url(#excel_a)"/>
      <path d="M5.7,19.873l2.511-3.884-2.3-3.862H7.758L9.013,14.6c.116.234.2.408.238.524h.017c.082-.188.169-.369.26-.546l1.342-2.447h1.7l-2.359,3.84,2.419,3.905H10.821l-1.45-2.711A2.355,2.355,0,0,1,9.2,16.8H9.176a1.688,1.688,0,0,1-.168.351L7.515,19.873Z" fill="#fff"/>
      <path d="M28.806,3H19.581V9.5H30V4.191A1.192,1.192,0,0,0,28.806,3Z" fill="#33c481"/>
      <path d="M19.581,16H30v6.5H19.581Z" fill="#107c41"/>
    </svg>
  );
}

export function WordIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="2" width="24" height="28" rx="2" fill="url(#paint0_linear_word)"/>
      <path d="M8 23H32V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V23Z" fill="url(#paint1_linear_word)"/>
      <rect x="8" y="16" width="24" height="7" fill="url(#paint2_linear_word)"/>
      <rect x="8" y="9" width="24" height="7" fill="url(#paint3_linear_word)"/>
      <path d="M8 12C8 10.3431 9.34315 9 11 9H17C18.6569 9 20 10.3431 20 12V24C20 25.6569 18.6569 27 17 27H8V12Z" fill="#000000" fillOpacity="0.3"/>
      <rect y="7" width="18" height="18" rx="2" fill="url(#paint4_linear_word)"/>
      <path d="M15 11.0142H13.0523L11.5229 17.539L9.84967 11H8.20261L6.51634 17.539L5 11.0142H3L5.60131 21H7.3268L9 14.6879L10.6732 21H12.3987L15 11.0142Z" fill="white"/>
      <defs>
        <linearGradient id="paint0_linear_word" x1="8" y1="6.66667" x2="32" y2="6.66667" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2B78B1"/><stop offset="1" stopColor="#338ACD"/>
        </linearGradient>
        <linearGradient id="paint1_linear_word" x1="8" y1="27.375" x2="32" y2="27.375" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1B366F"/><stop offset="1" stopColor="#2657B0"/>
        </linearGradient>
        <linearGradient id="paint2_linear_word" x1="18.5" y1="20" x2="32" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#20478B"/><stop offset="1" stopColor="#2D6FD1"/>
        </linearGradient>
        <linearGradient id="paint3_linear_word" x1="18.5" y1="13" x2="32" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#215295"/><stop offset="1" stopColor="#2E84D3"/>
        </linearGradient>
        <linearGradient id="paint4_linear_word" x1="3.31137e-08" y1="17" x2="19" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#223E74"/><stop offset="1" stopColor="#215091"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PowerPointIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="16" r="14" fill="url(#paint0_linear_ppt)"/>
      <mask id="mask0_ppt" style={{ maskType: 'alpha' as const }} maskUnits="userSpaceOnUse" x="3" y="2" width="28" height="28">
        <circle cx="17" cy="16" r="14" fill="#C4C4C4"/>
      </mask>
      <g mask="url(#mask0_ppt)">
        <rect x="18" width="17" height="17" fill="url(#paint1_linear_ppt)"/>
        <path d="M6 12C6 10.3431 7.34315 9 9 9H17C18.6569 9 20 10.3431 20 12V24C20 25.6569 18.6569 27 17 27H6V12Z" fill="#000000" fillOpacity="0.3"/>
        <rect x="1" width="17" height="17" fill="#EB6C4D"/>
      </g>
      <rect y="7" width="18" height="18" rx="2" fill="url(#paint2_linear_ppt)"/>
      <path d="M13 14.4571C13 12.3 11.5799 11 9.32787 11H6V21H8.06557V17.9571H9.2418C11.3504 17.9571 13 16.7571 13 14.4571ZM10.9057 14.5C10.9057 15.4714 10.2889 16.1 9.28484 16.1H8.06557V12.8714H9.27049C10.2746 12.8714 10.9057 13.4 10.9057 14.5Z" fill="white"/>
      <defs>
        <linearGradient id="paint0_linear_ppt" x1="3" y1="17.931" x2="31" y2="17.931" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A73A24"/><stop offset="1" stopColor="#F75936"/>
        </linearGradient>
        <linearGradient id="paint1_linear_ppt" x1="31.5" y1="10" x2="18" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDB8A3"/><stop offset="1" stopColor="#F1876D"/>
        </linearGradient>
        <linearGradient id="paint2_linear_ppt" x1="7.38325e-08" y1="17.2414" x2="18" y2="17.2414" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A73A24"/><stop offset="1" stopColor="#F75936"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function OptiviseLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
