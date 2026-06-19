/**
 * Modal — reusable dark-themed modal wrapper for admin panel.
 * Click backdrop to close. Scrollable content.
 */
export default function Modal({ open, onClose, title, children, width = 500 }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 28,
        width: '100%',
        maxWidth: width,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              border: 'none', background: 'rgba(255,255,255,0.08)',
              color: '#94a3b8', cursor: 'pointer', borderRadius: 8,
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, lineHeight: 1, transition: 'all 0.15s',
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
