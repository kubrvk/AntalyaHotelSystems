import { useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';

export default function Dashboard() {
  const { rooms, reservations, loading } = useHotel();
  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const total = rooms.length;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const available = rooms.filter(r => r.status === 'available').length;
    const reserved = rooms.filter(r => r.status === 'reserved').length;
    const cleaning = rooms.filter(r => r.status === 'cleaning').length;
    const occupancyRate = total > 0 ? Math.round(((occupied + reserved) / total) * 100) : 0;
    const todayCheckins = reservations.filter(r => r.status === 'approved' && r.checkIn === today).length;
    const todayCheckouts = reservations.filter(r => r.status === 'checked-in' && r.checkOut === today).length;
    const active = reservations.filter(r => r.status === 'approved' || r.status === 'checked-in').length;
    const revenue = reservations
      .filter(r => r.status === 'approved' || r.status === 'checked-in')
      .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    return { total, occupied, available, reserved, cleaning, occupancyRate, todayCheckins, todayCheckouts, active, revenue };
  }, [rooms, reservations, today]);

  const recentReservations = useMemo(() =>
    [...reservations].sort((a, b) => {
      const da = a.createdAt?.seconds || 0;
      const db = b.createdAt?.seconds || 0;
      return db - da;
    }).slice(0, 5),
    [reservations]
  );

  const todayArrivals = useMemo(() =>
    reservations.filter(r => r.status === 'approved' && r.checkIn === today),
    [reservations, today]
  );

  const todayDepartures = useMemo(() =>
    reservations.filter(r => r.status === 'checked-in' && r.checkOut === today),
    [reservations, today]
  );

  const statusBars = [
    { label: 'Boş', key: 'available', count: stats.available, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { label: 'Dolu', key: 'occupied', count: stats.occupied, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    { label: 'Rezerveli', key: 'reserved', count: stats.reserved, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Temizlik', key: 'cleaning', count: stats.cleaning, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  ];

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '24px',
  };

  const sectionTitle = {
    color: '#e2e8f0', fontSize: '16px', fontWeight: 700,
    margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="ti ti-loader-2" style={{ fontSize: '40px', color: '#3b82f6', display: 'block', marginBottom: '12px' }} />
          <p style={{ color: '#94a3b8', margin: 0 }}>Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: '#e2e8f0', fontSize: '26px', fontWeight: 700, margin: '0 0 6px 0', fontFamily: "'Outfit', sans-serif" }}>
          Dashboard
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Toplam Oda" value={stats.total} icon="ti-building" color="#3b82f6" bg="rgba(59,130,246,0.12)" />
        <StatCard label="Dolu Oda" value={stats.occupied} icon="ti-users" color="#10b981" bg="rgba(16,185,129,0.12)" />
        <StatCard label="Boş Oda" value={stats.available} icon="ti-door-open" color="#f59e0b" bg="rgba(245,158,11,0.12)" />
        <StatCard label="Doluluk Oranı" value={`%${stats.occupancyRate}`} icon="ti-chart-pie" color="#8b5cf6" bg="rgba(139,92,246,0.12)" />
        <StatCard label="Bugün Giriş" value={stats.todayCheckins} icon="ti-door-enter" color="#06b6d4" bg="rgba(6,182,212,0.12)" />
        <StatCard label="Bugün Çıkış" value={stats.todayCheckouts} icon="ti-door-exit" color="#f43f5e" bg="rgba(244,63,94,0.12)" />
        <StatCard label="Aktif Rezervasyon" value={stats.active} icon="ti-calendar" color="#a78bfa" bg="rgba(167,139,250,0.12)" />
        <StatCard label="Beklenen Gelir" value={`₺${stats.revenue.toLocaleString('tr-TR')}`} icon="ti-currency-lira" color="#34d399" bg="rgba(52,211,153,0.12)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Room Status Bars */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>
            <i className="ti ti-building" style={{ color: '#3b82f6' }} />
            Oda Durumları
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {statusBars.map(bar => {
              const pct = stats.total > 0 ? Math.round((bar.count / stats.total) * 100) : 0;
              return (
                <div key={bar.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: bar.color }} />
                      <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}>{bar.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>{bar.count} oda</span>
                      <span style={{ color: bar.color, fontSize: '13px', fontWeight: 600, minWidth: '36px', textAlign: 'right' }}>%{pct}</span>
                    </div>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`, background: bar.color,
                      borderRadius: '100px', transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Arrivals */}
          <div style={{ ...cardStyle, flex: 1 }}>
            <h2 style={{ ...sectionTitle, marginBottom: '14px' }}>
              <i className="ti ti-door-enter" style={{ color: '#10b981' }} />
              Bugünün Girişleri
              <span style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: '20px', padding: '2px 10px', fontSize: '13px', fontWeight: 600 }}>
                {todayArrivals.length}
              </span>
            </h2>
            {todayArrivals.length === 0 ? (
              <p style={{ color: '#475569', fontSize: '13px', textAlign: 'center', margin: '12px 0' }}>Bugün beklenen giriş yok</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {todayArrivals.slice(0, 3).map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600, margin: 0 }}>{r.guestName}</p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>Oda {r.roomNumber}</p>
                    </div>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Departures */}
          <div style={{ ...cardStyle, flex: 1 }}>
            <h2 style={{ ...sectionTitle, marginBottom: '14px' }}>
              <i className="ti ti-door-exit" style={{ color: '#f43f5e' }} />
              Bugünün Çıkışları
              <span style={{ marginLeft: 'auto', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', borderRadius: '20px', padding: '2px 10px', fontSize: '13px', fontWeight: 600 }}>
                {todayDepartures.length}
              </span>
            </h2>
            {todayDepartures.length === 0 ? (
              <p style={{ color: '#475569', fontSize: '13px', textAlign: 'center', margin: '12px 0' }}>Bugün beklenen çıkış yok</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {todayDepartures.slice(0, 3).map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600, margin: 0 }}>{r.guestName}</p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>Oda {r.roomNumber}</p>
                    </div>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div style={cardStyle}>
        <h2 style={sectionTitle}>
          <i className="ti ti-calendar" style={{ color: '#8b5cf6' }} />
          Son Rezervasyonlar
        </h2>
        {recentReservations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
            <i className="ti ti-calendar-off" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }} />
            <p style={{ margin: 0 }}>Henüz rezervasyon bulunmuyor</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Misafir', 'Oda', 'Giriş', 'Çıkış', 'Tutar', 'Durum'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#64748b', fontSize: '12px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.07)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < recentReservations.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '12px' }}>
                      <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600, margin: 0 }}>{r.guestName}</p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>{r.guestEmail}</p>
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '14px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: '6px', fontWeight: 600, color: '#e2e8f0' }}>{r.roomNumber}</span>
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px' }}>{r.checkIn}</td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px' }}>{r.checkOut}</td>
                    <td style={{ padding: '12px', color: '#34d399', fontSize: '14px', fontWeight: 600 }}>₺{(r.totalPrice || 0).toLocaleString('tr-TR')}</td>
                    <td style={{ padding: '12px' }}><StatusBadge status={r.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}