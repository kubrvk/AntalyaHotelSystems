import { Link } from 'react-router-dom';

const TYPE_CONFIG = {
  Standard: { bg: '#dbeafe', color: '#1d4ed8', label: 'Standard' },
  Deluxe:   { bg: '#fef3c7', color: '#d97706', label: 'Deluxe' },
  Suite:    { bg: '#fce7f3', color: '#be185d', label: 'Suite' },
  Economy:  { bg: '#dcfce7', color: '#15803d', label: 'Economy' },
};

export default function PublicRoomCard({ room }) {
  const tc = TYPE_CONFIG[room.type] || { bg: '#f1f5f9', color: '#475569', label: room.type };
  const isAvailable = room.status === 'available';

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'transform 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: '#e2e8f0' }}>
        <img
          src={room.image}
          alt={`Oda ${room.number}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop';
          }}
        />
        {/* Type badge */}
        <span style={{
          position: 'absolute', top: 14, left: 14,
          background: tc.bg, color: tc.color,
          padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
        }}>
          {tc.label}
        </span>
        {/* Availability badge */}
        <span style={{
          position: 'absolute', top: 14, right: 14,
          background: isAvailable ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.85)',
          color: '#fff',
          padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
          backdropFilter: 'blur(4px)',
        }}>
          {isAvailable ? '✓ Müsait' : '✗ Dolu'}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <h3 style={{ margin: '0 0 3px', fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
              Oda {room.number}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
              Kat {room.floor} · {room.capacity} Kişilik
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e3a5f' }}>
              ₺{Number(room.pricePerNight).toLocaleString('tr-TR')}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>/ gece</p>
          </div>
        </div>

        <p style={{
          margin: '0 0 14px', fontSize: 13, color: '#64748b', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {room.description}
        </p>

        {/* Features */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
          {room.features?.slice(0, 3).map(f => (
            <span key={f} style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 6, padding: '3px 8px', fontSize: 11, color: '#475569',
            }}>
              {f}
            </span>
          ))}
          {room.features?.length > 3 && (
            <span style={{
              background: '#f0f4ff', border: '1px solid #c7d2fe',
              borderRadius: 6, padding: '3px 8px', fontSize: 11, color: '#4f46e5',
            }}>
              +{room.features.length - 3} daha
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/rooms/${room.id}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '11px', borderRadius: 12,
            background: isAvailable
              ? 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)'
              : '#f1f5f9',
            color: isAvailable ? '#fff' : '#94a3b8',
            textDecoration: 'none', fontSize: 13, fontWeight: 600,
            transition: 'opacity 0.2s',
            boxShadow: isAvailable ? '0 4px 14px rgba(37,99,235,0.28)' : 'none',
          }}
        >
          <i className="ti ti-eye" style={{ fontSize: 15 }} />
          {isAvailable ? 'Detay & Rezervasyon' : 'Oda Detayı'}
        </Link>
      </div>
    </div>
  );
}
