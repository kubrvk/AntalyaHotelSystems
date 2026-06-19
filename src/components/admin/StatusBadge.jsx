/**
 * StatusBadge — colored pill for room or reservation status.
 * Works for both admin dark theme and public light theme.
 */

const CONFIGS = {
  // Room statuses
  available:    { label: 'Boş',         bg: 'rgba(34,197,94,0.15)',   color: '#4ade80',  dot: '#4ade80' },
  occupied:     { label: 'Dolu',        bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa',  dot: '#60a5fa' },
  reserved:     { label: 'Rezerveli',   bg: 'rgba(250,204,21,0.15)',  color: '#facc15',  dot: '#facc15' },
  cleaning:     { label: 'Temizlik',    bg: 'rgba(192,132,252,0.15)', color: '#c084fc',  dot: '#c084fc' },
  // Reservation statuses
  pending:      { label: 'Bekliyor',    bg: 'rgba(251,146,60,0.15)',  color: '#fb923c',  dot: '#fb923c' },
  approved:     { label: 'Onaylı',      bg: 'rgba(34,197,94,0.15)',   color: '#4ade80',  dot: '#4ade80' },
  'checked-in': { label: 'Check-in',    bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa',  dot: '#60a5fa' },
  'checked-out':{ label: 'Check-out',   bg: 'rgba(148,163,184,0.15)', color: '#94a3b8',  dot: '#94a3b8' },
  cancelled:    { label: 'İptal',       bg: 'rgba(248,113,113,0.15)', color: '#f87171',  dot: '#f87171' },
};

export default function StatusBadge({ status, size = 'md' }) {
  const cfg = CONFIGS[status] || { label: status, bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', dot: '#94a3b8' };
  const sizes = {
    sm: { padding: '2px 8px', fontSize: 10, dotSize: 5 },
    md: { padding: '4px 12px', fontSize: 11, dotSize: 6 },
    lg: { padding: '6px 14px', fontSize: 12, dotSize: 7 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.color}33`,
      padding: s.padding,
      borderRadius: 20,
      fontSize: s.fontSize,
      fontWeight: 600,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: s.dotSize, height: s.dotSize, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}
