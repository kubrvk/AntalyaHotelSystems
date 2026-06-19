import { useState, useMemo } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHotel } from '../../context/HotelContext';
import StatusBadge from '../../components/admin/StatusBadge';

const STATUS_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Bekliyor' },
  { key: 'approved', label: 'Onaylı' },
  { key: 'checked-in', label: 'Check-in' },
  { key: 'checked-out', label: 'Check-out' },
  { key: 'cancelled', label: 'İptal' },
];

function diffDays(a, b) {
  if (!a || !b) return 0;
  const da = new Date(a), db = new Date(b);
  return Math.max(0, Math.round((db - da) / (1000 * 60 * 60 * 24)));
}

function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function memberSince(user) {
  if (!user?.metadata?.creationTime) return '-';
  return new Date(user.metadata.creationTime).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
}

export default function UserProfile() {
  const { currentUser, userLogout } = useAuth();
  const { reservations } = useHotel();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [loggingOut, setLoggingOut] = useState(false);

  if (!currentUser) return <Navigate to="/login" replace />;

  const userEmail = currentUser.email;

  const myReservations = useMemo(() => {
    return reservations.filter(r => r.userEmail === userEmail || r.guestEmail === userEmail)
      .sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
  }, [reservations, userEmail]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return myReservations;
    return myReservations.filter(r => r.status === activeTab);
  }, [myReservations, activeTab]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await userLogout();
      navigate('/');
    } catch {
      setLoggingOut(false);
    }
  };

  const STATUS_COLORS = {
    pending: '#d97706', approved: '#16a34a', 'checked-in': '#2563eb',
    'checked-out': '#475569', cancelled: '#dc2626',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f1c2e, #1e3a5f)', padding: '48px 40px 40px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,99,235,0.4)', flexShrink: 0 }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800, color: '#fff' }}>
                {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 4px' }}>Hoş Geldiniz</p>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800, color: '#fff', margin: 0 }}>
                {currentUser.displayName || 'Misafir'}
              </h1>
            </div>
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
            {loggingOut ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              : <i className="ti ti-logout" style={{ fontSize: 16 }} />}
            Çıkış Yap
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start' }}>

          {/* User info card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="ti ti-user-circle" style={{ color: '#2563eb' }} /> Hesap Bilgileri
              </h3>
              {[
                { icon: 'ti-user', label: 'Ad Soyad', value: currentUser.displayName || '-' },
                { icon: 'ti-mail', label: 'E-posta', value: currentUser.email || '-' },
                { icon: 'ti-calendar', label: 'Üyelik', value: memberSince(currentUser) },
              ].map(({ icon, label, value }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', alignItems: 'flex-start' }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 16, color: '#94a3b8', marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: 0.5, marginBottom: 2 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 14, color: '#1e293b', fontWeight: 600, wordBreak: 'break-all' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats summary */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="ti ti-chart-bar" style={{ color: '#2563eb' }} /> Özet
              </h3>
              {[
                { label: 'Toplam Rezervasyon', value: myReservations.length, color: '#1d4ed8' },
                { label: 'Bekleyen', value: myReservations.filter(r => r.status === 'pending').length, color: '#d97706' },
                { label: 'Onaylı', value: myReservations.filter(r => r.status === 'approved').length, color: '#16a34a' },
                { label: 'Tamamlanan', value: myReservations.filter(r => r.status === 'checked-out').length, color: '#475569' },
              ].map(({ label, value, color }, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color, fontFamily: "'Outfit', sans-serif" }}>{value}</span>
                </div>
              ))}
            </div>

            <Link to="/reservation"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', borderRadius: 14, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
              <i className="ti ti-calendar-plus" style={{ fontSize: 16 }} /> Yeni Rezervasyon
            </Link>
          </div>

          {/* Reservations */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Rezervasyonlarım
              </h2>
              <span style={{ color: '#64748b', fontSize: 13 }}>{filtered.length} kayıt</span>
            </div>

            {/* Status tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {STATUS_TABS.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  style={{ padding: '7px 16px', borderRadius: 50, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.18s', background: activeTab === tab.key ? 'linear-gradient(135deg, #1e3a5f, #2563eb)' : '#f1f5f9', color: activeTab === tab.key ? '#fff' : '#64748b', boxShadow: activeTab === tab.key ? '0 2px 8px rgba(37,99,235,0.3)' : 'none' }}>
                  {tab.label}
                  {tab.key === 'all' ? ` (${myReservations.length})` : ''}
                </button>
              ))}
            </div>

            {/* Reservation cards */}
            {filtered.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '60px 40px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <i className="ti ti-calendar-off" style={{ fontSize: 36, color: '#cbd5e1' }} />
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
                  Rezervasyon Bulunamadı
                </h3>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                  {activeTab === 'all' ? 'Henüz rezervasyonunuz bulunmuyor.' : 'Bu filtreye uygun rezervasyon yok.'}
                </p>
                {activeTab === 'all' && (
                  <Link to="/reservation" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    <i className="ti ti-plus" style={{ fontSize: 16 }} /> İlk Rezervasyonunuzu Yapın
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filtered.map(res => {
                  const nights = diffDays(res.checkIn, res.checkOut);
                  return (
                    <div key={res.id}
                      style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="ti ti-door" style={{ fontSize: 18, color: '#2563eb' }} />
                            </div>
                            <div>
                              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
                                Oda {res.roomNumber}
                              </div>
                              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                                {res.guestCount} kişi · {nights} gece
                              </div>
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={res.status} size="md" />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                        {[
                          { icon: 'ti-calendar-event', label: 'Giriş', value: formatDate(res.checkIn) },
                          { icon: 'ti-calendar-event', label: 'Çıkış', value: formatDate(res.checkOut) },
                          { icon: 'ti-moon', label: 'Gece', value: `${nights} gece` },
                          { icon: 'ti-coin', label: 'Toplam', value: res.totalPrice ? `₺${res.totalPrice.toLocaleString('tr-TR')}` : '-' },
                        ].map(({ icon, label, value }, i) => (
                          <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 3 }}>
                              <i className={`ti ${icon}`} style={{ fontSize: 13 }} /> {label.toUpperCase()}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{value}</div>
                          </div>
                        ))}
                      </div>

                      {res.notes && (
                        <div style={{ marginTop: 12, padding: '10px 14px', background: '#fffbeb', borderRadius: 10, border: '1px solid #fde68a', display: 'flex', gap: 8 }}>
                          <i className="ti ti-notes" style={{ fontSize: 15, color: '#d97706', flexShrink: 0, marginTop: 1 }} />
                          <p style={{ color: '#78350f', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{res.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}