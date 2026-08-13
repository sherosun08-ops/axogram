export function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.8, viewBox: "0 0 24 24" };
  switch (name) {
    case "home":
      return <svg {...common}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" /></svg>;
    case "users":
      return <svg {...common}><path d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" /><circle cx="9.5" cy="8" r="3" /><path d="M20 19v-1a3.5 3.5 0 0 0-2.6-3.4" /><path d="M16.5 5.2a3 3 0 0 1 0 5.6" /></svg>;
    case "download":
      return <svg {...common}><path d="M12 4v10" /><path d="m7 10 5 5 5-5" /><path d="M5 19h14" /></svg>;
    case "user-plus":
      return <svg {...common}><path d="M15 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" /><circle cx="9" cy="8" r="3" /><path d="M19 8v6M16 11h6" /></svg>;
    case "refresh":
      return <svg {...common}><path d="M20 12a8 8 0 1 1-2.3-5.6L20 8" /><path d="M20 4v4h-4" /></svg>;
    case "globe":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 3.8 6 3.8 9s-1.3 6-3.8 9c-2.5-3-3.8-6-3.8-9S9.5 6 12 3z" /></svg>;
    case "settings":
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.7.9 1.2 1.5 1.3H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case "chart":
      return <svg {...common}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-8" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" /></svg>;
    case "message":
      return <svg {...common}><path d="M5 6h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" /></svg>;
    case "megaphone":
      return <svg {...common}><path d="M4 10v4l10 4V6L4 10z" /><path d="M14 9.5v5" /><path d="M6.5 14.5 8 20h3l-1-5" /></svg>;
    case "zap":
      return <svg {...common}><path d="M13 3 5 14h6l-1 7 9-12h-6z" /></svg>;
    case "more":
      return <svg {...common}><circle cx="6" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="18" cy="12" r="1.4" fill="currentColor" /></svg>;
    case "bell":
      return <svg {...common}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>;
    case "menu":
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "user":
      return <svg {...common}><circle cx="12" cy="8" r="3.2" /><path d="M5 19c1.4-3 3.8-4.5 7-4.5S17.6 16 19 19" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
}
