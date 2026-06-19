import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHotel } from '../../context/HotelContext';

const FEATURE_ICONS = {
  'WiFi': 'ti-wifi',
  'Klima': 'ti-wind',
  'TV': 'ti-device-tv',
  'Balkon': 'ti-building',
  'Deniz': 'ti-wave',
  'Jakuzi': 'ti-droplet',
  'Kahvalti': 'ti-coffee',
  'Kahvaltı': 'ti-coffee',
  'Bar': 'ti-bottle',
  'Kasa': 'ti-lock',
  'Havuz': 'ti-pool',
  'Teras': 'ti-sun',
};

const STATUS_CONFIG = {
  available: { label: 'Müsait', color: '#16a34a', bg: '#dcfce7', icon: 'ti-circle-check' },
  occupied: { label: 'Dolu', color: '#dc2626', bg: '#fee2e2', icon: 'ti-circle-x' },
  reserved: { label: 'Rezerveli', color: '#d97706', bg: '#fef3c7', icon: 'ti-clock' },
  cleaning: { label: 'Temizleniyor', color: '#7c3aed', bg: '#ede9fe', icon: 'ti-sparkles' },
};

const TYPE_COLORS = {
  Standard: { bg: '#eff6ff', color: '#1d4ed8' },
  Deluxe: { bg: '#fef9c3', color: '#854d0e' },
  Suite: { bg: '#fdf4ff', color: '#7e22ce' },
  Economy: { bg: '#f0fdf4', color: '#166534' },
};

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, loading } = useHotel();

  const room = rooms.find(r => r.id === id);

  if (loading || rooms.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 56, height: 56, border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#64748b', fontSize: 16, fontFamily: "'Inter', sans-serif" }}>Oda bilgileri yükleniyor...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <i className="ti ti-door-off" style={{ fontSize: 44, color: '#dc2626' }} />
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Oda Bulunamadı</h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 28 }}>Aradığınız oda mevcut değil veya kaldırılmış olabilir.</p>
          <Link to="/rooms" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            <i className="ti ti-arrow-left" style={{ fontSize: 16 }} /> Tüm Odalara Dön
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[room.status] || STATUS_CONFIG.available;
  const typeColor = TYPE_COLORS[room.type] || { bg: '#f1f5f9', color: '#475569' };
  const isAvailable = room.status === 'available';

  const getFeatureIcon = (feature) => {
    const match = Object.entries(FEATURE_ICONS).find(([key]) => feature.toLowerCase().includes(key.toLowerCase()));
    return match ? match[1] : 'ti-check';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>

      {/* Hero Image */}
      <div style={{ position: 'relative', height: 400, overflow: 'hidden', background: '#0f1c2e' }}>
        {room.image ? (
          <img src={room.image} alt={`Oda ${room.number}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f1c2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-bed" style={{ fontSize: 80, color: 'rgba(255,255,255,0.15)' }} />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,13,26,0.85) 0%, rgba(8,13,26,0.3) 60%, transparent 100%)' }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: 24, left: 40, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13 }}>Ana Sayfa</Link>
          <i className="ti ti-chevron-right" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }} />
          <Link to="/rooms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13 }}>Odalar</Link>
          <i className="ti ti-chevron-right" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }} />
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Oda {room.number}</span>
        </div>

        {/* Room overlay info */}
        <div style={{ position: 'absolute', bottom: 32, left: 40, display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 14px', background: typeColor.bg, color: typeColor.color, borderRadius: 50, fontSize: 12, fontWeight: 700 }}>
                {room.type}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 14px', background: status.bg, color: status.color, borderRadius: 50, fontSize: 12, fontWeight: 700 }}>
                <i className={`ti ${status.icon}`} style={{ fontSize: 13 }} /> {status.label}
              </span>
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
              Oda {room.number}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Description */}
            {room.description && (
              <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="ti ti-info-circle" style={{ color: '#2563eb' }} /> Oda Hakkında
                </h3>
                <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.8, margin: 0 }}>{room.description}</p>
              </div>
            )}

            {/* Features */}
            {room.features && room.features.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: '#1e293b', marginTop: 0, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="ti ti-list-check" style={{ color: '#2563eb' }} /> Oda Özellikleri
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {room.features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`ti ${getFeatureIcon(feature)}`} style={{ fontSize: 16, color: '#2563eb' }} />
                      </div>
                      <span style={{ color: '#374151', fontSize: 13, fontWeight: 500 }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div style={{ background: isAvailable ? '#f0fdf4' : '#fff8f0', borderRadius: 20, padding: 28, border: `1px solid ${isAvailable ? '#bbf7d0' : '#fed7aa'}`, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: isAvailable ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`ti ${status.icon}`} style={{ fontSize: 28, color: status.color }} />
              </div>
              <div>
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: '#1e293b', margin: '0 0 4px' }}>
                  Oda Durumu: {status.label}
                </h4>
                <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
                  {isAvailable ? 'Bu oda şu anda rezervasyon için müsaittir.' : 'Bu oda şu anda müsait değil. Lütfen başka bir oda seçin.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right column — Info card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 24 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#1e293b', marginTop: 0, marginBottom: 20 }}>
                Oda Detayları
              </h3>

              {[
                { icon: 'ti-door', label: 'Oda Numarası', value: room.number },
                { icon: 'ti-star', label: 'Oda Tipi', value: room.type },
                { icon: 'ti-building', label: 'Kat', value: `${room.floor}. Kat` },
                { icon: 'ti-users', label: 'Kapasite', value: `${room.capacity} Kişi` },
              ].map(({ icon, label, value }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: 14 }}>
                    <i className={`ti ${icon}`} style={{ fontSize: 16, color: '#94a3b8' }} /> {label}
                  </div>
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{value}</span>
                </div>
              ))}

              <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: 14, padding: '16px 20px', marginTop: 20, marginBottom: 24, textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>Gecelik Fiyat</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, color: '#1d4ed8' }}>
                  ₺{room.pricePerNight?.toLocaleString('tr-TR')}
                </div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>vergiler dahil</div>
              </div>

              <button
                onClick={() => isAvailable && navigate(`/reservation?room=${room.number}`)}
                disabled={!isAvailable}
                style={{ width: '100%', padding: '14px', background: isAvailable ? 'linear-gradient(135deg, #1e3a5f, #2563eb)' : '#e2e8f0', color: isAvailable ? '#fff' : '#94a3b8', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: isAvailable ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: isAvailable ? '0 4px 16px rgba(37,99,235,0.3)' : 'none', transition: 'all 0.2s' }}>
                <i className="ti ti-calendar-plus" style={{ fontSize: 18 }} />
                {isAvailable ? 'Bu Odayı Rezerve Et' : 'Şu An Müsait Değil'}
              </button>

              {!isAvailable && (
                <Link to="/rooms" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: '#2563eb', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Diğer Odaları İncele →
                </Link>
              )}
            </div>

            <Link to="/rooms" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <i className="ti ti-arrow-left" style={{ fontSize: 16 }} /> Tüm Odalara Dön
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}