/** StatCard — metric card for admin dashboard. */
export default function StatCard({ label, value, icon, color = '#60a5fa', bg = 'rgba(59,130,246,0.15)' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className={`ti ${icon}`} style={{ fontSize: 22, color }} />
        </div>
      </div>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: '#e2e8f0', lineHeight: 1 }}>
          {value}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</p>
      </div>
    </div>
  );
}
