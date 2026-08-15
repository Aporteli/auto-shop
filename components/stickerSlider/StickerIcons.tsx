import type { StickerIconName, StickerItem } from './types';

function AlertIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 4.5c.8 0 1.45.65 1.45 1.45v7.1a1.45 1.45 0 0 1-2.9 0v-7.1c0-.8.65-1.45 1.45-1.45Z"
        fill={color}
      />
      <circle cx="14" cy="18.4" r="1.6" fill={color} />
      <path
        d="M8.2 9.7c.63-.36 1.43-.16 1.8.47l1.25 2.16a1.3 1.3 0 1 1-2.26 1.3L7.74 11.5c-.37-.62-.15-1.43.46-1.8Zm11.6 0c.62.37.83 1.18.47 1.8L19 13.63a1.3 1.3 0 0 1-2.25-1.3L18 10.17c.36-.63 1.17-.83 1.8-.47Z"
        fill={color}
      />
      <path
        d="M10 22.2c0-2.21 1.79-4 4-4s4 1.79 4 4v.3H10v-.3Z"
        fill={color}
        opacity=".9"
      />
    </svg>
  );
}

function SparkleIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="m14 4 1.7 4.6L20.3 10l-4.6 1.4L14 16l-1.7-4.6L7.7 10l4.6-1.4L14 4Z"
        fill={color}
      />
      <path d="m21.2 4.8.75 2.02L24 7.57l-2.05.64-.75 2.02-.74-2.02-2.06-.75 2.06-.75.74-2.02Z" fill={color} />
      <path d="m7 16.6 1 2.68 2.68 1-2.68 1-1 2.68-1-2.68-2.68-1 2.68-1 1-2.68Z" fill={color} opacity=".9" />
    </svg>
  );
}

function CarIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M8.3 10.2c.35-1.03 1.31-1.72 2.4-1.72h6.6c1.1 0 2.06.7 2.4 1.72l1.02 3.05c1.34.33 2.33 1.54 2.33 2.98v2.45c0 .8-.65 1.45-1.45 1.45h-1.15a1.8 1.8 0 0 1-1.79 1.45h-9.4a1.8 1.8 0 0 1-1.79-1.45H6.35c-.8 0-1.45-.65-1.45-1.45v-2.45c0-1.44.98-2.65 2.33-2.98l1.07-3.05Z"
        fill={color}
      />
      <circle cx="9.9" cy="17.1" r="1.35" fill="#232636" />
      <circle cx="18.1" cy="17.1" r="1.35" fill="#232636" />
      <path d="M9.6 10.95h8.8l.98 2.9H8.62l.98-2.9Z" fill="#232636" opacity=".2" />
    </svg>
  );
}

function HistoryIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 6.25a7.75 7.75 0 1 1-6.52 3.56H5.7a1.1 1.1 0 1 1 0-2.2h4.15a1.1 1.1 0 0 1 1.1 1.1v4.15a1.1 1.1 0 1 1-2.2 0V11.4A5.55 5.55 0 1 0 14 8.45a1.1 1.1 0 0 1 0-2.2Z"
        fill={color}
      />
      <path d="M14 10.1c.61 0 1.1.49 1.1 1.1v3.18h2.88a1.1 1.1 0 1 1 0 2.2H14a1.1 1.1 0 0 1-1.1-1.1v-4.28c0-.61.49-1.1 1.1-1.1Z" fill={color} />
    </svg>
  );
}

function UsaIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="10" fill="#fff" />
      <path d="M4 14a10 10 0 0 1 10-10v20A10 10 0 0 1 4 14Z" fill="#0f7dc6" />
      <path d="M14 4a10 10 0 0 1 0 20c5.52 0 10-4.48 10-10S19.52 4 14 4Z" fill="#fff" />
      <path d="M14 4h.22C19.62 4.12 24 8.57 24 14s-4.38 9.88-9.78 10H14v-2h.22A8 8 0 0 0 22 14a8 8 0 0 0-7.78-8H14V4Z" fill="#e64949" />
      <path d="M14 8h9.24a9.91 9.91 0 0 1 .61 2H14V8Zm0 5h10a10 10 0 0 1-.14 2H14v-2Zm0 5h9.24a9.91 9.91 0 0 1-.99 2H14v-2Z" fill="#e64949" />
      <path d="M6.5 9.2h6.2v5.6H6.5V9.2Z" fill="#0f7dc6" />
      <path d="m7.7 10.25.3.62.68.1-.5.49.12.68-.6-.32-.6.32.12-.68-.5-.49.68-.1.3-.62Zm2.3 1 .3.62.68.1-.5.49.12.68-.6-.32-.6.32.12-.68-.5-.49.68-.1.3-.62Zm2.3-1 .3.62.68.1-.5.49.12.68-.6-.32-.6.32.12-.68-.5-.49.68-.1.3-.62Z" fill="#fff" />
    </svg>
  );
}

function CenterIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M7.25 10.55c.33-1.17 1.4-1.98 2.62-1.98h8.26c1.22 0 2.29.8 2.62 1.98l.77 2.72c1.1.37 1.9 1.42 1.9 2.64v3.05a1.4 1.4 0 0 1-1.4 1.4h-1.08a2.35 2.35 0 0 1-2.28 1.75H9.34a2.35 2.35 0 0 1-2.28-1.75H5.98a1.4 1.4 0 0 1-1.4-1.4v-3.05c0-1.22.8-2.27 1.9-2.64l.77-2.72Z"
        fill={color}
      />
      <path d="M9.1 11.1h9.8l.9 3.1H8.2l.9-3.1Z" fill="#232636" opacity=".18" />
      <circle cx="10.2" cy="17.2" r="1.35" fill="#232636" />
      <circle cx="17.8" cy="17.2" r="1.35" fill="#232636" />
      <path d="M14 5.8 15.1 8h2.45l-1.98 1.45.76 2.33L14 10.45l-2.33 1.33.76-2.33L10.45 8h2.45L14 5.8Z" fill={color} />
    </svg>
  );
}

function EcoIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M10.2 6.2h6.25c.9 0 1.63.73 1.63 1.63v12.34a1.63 1.63 0 0 1-1.63 1.63H10.2a1.63 1.63 0 0 1-1.63-1.63V7.83c0-.9.73-1.63 1.63-1.63Z"
        fill={color}
      />
      <path d="M11.6 8.6h3.9v.9h-3.9v-.9Zm0 2.2h3.9v.9h-3.9v-.9Z" fill="#232636" opacity=".22" />
      <path
        d="M18.9 10.1h2.02c.4 0 .73.33.73.73v6.34c0 .4-.33.73-.73.73H18.9v-7.8Z"
        fill={color}
        opacity=".72"
      />
      <path d="M13.95 15.15c1.1-1.47 2.93-1.95 4.42-1.95-.2 1.95-1.54 4.3-4.42 4.8-2.88-.5-4.22-2.85-4.42-4.8 1.49 0 3.32.48 4.42 1.95Z" fill="#fff" />
    </svg>
  );
}

export function StickerIcon({ icon, color }: Pick<StickerItem, 'icon' | 'color'>) {
  switch (icon) {
    case 'alert':
      return <AlertIcon color={color} />;
    case 'sparkle':
      return <SparkleIcon color={color} />;
    case 'car':
      return <CarIcon color={color} />;
    case 'history':
      return <HistoryIcon color={color} />;
    case 'usa':
      return <UsaIcon />;
    case 'center':
      return <CenterIcon color={color} />;
    case 'eco':
      return <EcoIcon color={color} />;
    default:
      return null;
  }
}
