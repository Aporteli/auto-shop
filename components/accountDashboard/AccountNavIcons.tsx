import styles from '../AccountDashboard.module.css';

export function Icon({ name }: { name: string }) {
  const common = {
    className: styles.icon,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'listings':
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case 'won':
      return (
        <svg {...common}>
          <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM7 4H5a3 3 0 003 5M17 4h2a3 3 0 01-3 5" />
        </svg>
      );
    case 'vin':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9h4M7 13h10" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.4-7-10a4 4 0 017-2 4 4 0 017 2c0 5.6-7 10-7 10z" />
        </svg>
      );
    case 'leasing':
      return (
        <svg {...common}>
          <path d="M4 19V5h10v14H4zM14 8h4l2 3v8h-6" />
        </svg>
      );
    case 'compare':
      return (
        <svg {...common}>
          <path d="M7 7h10M7 12h6M7 17h10M4 7h.01M4 12h.01M4 17h.01" />
        </svg>
      );
    case 'subscribe':
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4zM4 8l8 6 8-6" />
        </svg>
      );
    case 'messages':
      return (
        <svg {...common}>
          <path d="M4 6h16v10H8l-4 4V6z" />
        </svg>
      );
    case 'news':
      return (
        <svg {...common}>
          <path d="M4 5h12v14H4zM16 8h4v11a2 2 0 01-2 2H6M7 9h6M7 13h6" />
        </svg>
      );
    case 'photos':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M4 8h3l2-2h6l2 2h3v10H4V8z" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...common}>
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      );
    case 'company':
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
        </svg>
      );
    case 'wallet':
      return (
        <svg {...common}>
          <path d="M3 7h18v12H3zM3 7l2.5-3h13L21 7M16 13h2" />
        </svg>
      );
    case 'transfer':
      return (
        <svg {...common}>
          <path d="M7 7h13l-3-3M17 17H4l3 3M4 7h3M17 17h3" />
        </svg>
      );
    case 'cards':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    case 'transactions':
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h10M4 18h16" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
