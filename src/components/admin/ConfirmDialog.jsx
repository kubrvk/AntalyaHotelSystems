/** ConfirmDialog — delete / destructive action confirmation modal. */
export default function ConfirmDialog({
  open, onClose, onConfirm,
  message = 'Bu işlemi gerçekleştirmek istediğinize emin misiniz?',
  confirmLabel = 'Sil',
  confirmColor = '#ef4444',
  icon = 'ti-alert-triangle',
}) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 300, padding: 16,
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 32,
        width: 360,
        maxWidth: '90vw',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: `${confirmColor}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <i className={`ti ${icon}`} style={{ fontSize: 26, color: confirmColor }} />
        </div>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: '#cbd5e1', lineHeight: 1.7 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px 0', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, background: 'rgba(255,255,255,0.05)',
              color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            İptal
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            style={{
              flex: 1, padding: '10px 0', border: 'none',
              borderRadius: 10, background: confirmColor,
              color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
