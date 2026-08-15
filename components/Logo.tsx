'use client';

import { useId } from 'react';

type LogoProps = React.SVGProps<SVGSVGElement>;

export default function Logo({ className, ...props }: LogoProps) {
  const id = useId().replace(/:/g, '');
  const badgeGradient = `${id}-badge`;

  return (
    <svg
      className={className}
      viewBox="0 0 188 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AutoShop"
      {...props}>
      <defs>
        <linearGradient id={badgeGradient} x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a1a2e" />
          <stop offset="1" stopColor="#2d3561" />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="38" height="38" rx="10" fill={`url(#${badgeGradient})`} />
      <rect x="1" y="1" width="38" height="38" rx="10" stroke="#f97316" strokeOpacity="0.35" strokeWidth="1" />

      <path
        d="M7 25.5c0-.83.67-1.5 1.5-1.5h1.1l2.4-4.3c.38-.65 1.07-1.05 1.82-1.05h6.8c.75 0 1.44.4 1.82 1.05l2.4 4.3h1.1c.83 0 1.5.67 1.5 1.5v.5H7v-.5z"
        fill="#ffffff"
      />
      <path d="M11.8 18.2h5.2l1.7 3h-8.6l1.7-3z" fill="#f97316" />
      <path
        d="M13.2 18.8l1.1 2.2h2.9l1.4-2.2"
        stroke="#1a1a2e"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="12.2" cy="26" r="2.1" fill="#1a1a2e" />
      <circle cx="12.2" cy="26" r="0.95" fill="#f97316" />
      <circle cx="25.8" cy="26" r="2.1" fill="#1a1a2e" />
      <circle cx="25.8" cy="26" r="0.95" fill="#f97316" />

      <path d="M5 31h30" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.75" />
      <path
        d="M34 20.5l4 2.5-4 2.5"
        stroke="#f97316"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x="50"
        y="27.5"
        fill="currentColor"
        fontFamily="inherit"
        fontSize="22"
        fontWeight="700"
        letterSpacing="-0.02em">
        Auto
      </text>
      <text
        x="108"
        y="27.5"
        fill="#f97316"
        fontFamily="inherit"
        fontSize="22"
        fontWeight="700"
        letterSpacing="-0.02em">
        Shop
      </text>
    </svg>
  );
}
