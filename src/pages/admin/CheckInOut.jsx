import { useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';

export default function CheckInOut() {
  const { reservations, checkIn, checkOut, loading } = useHotel();
  const today = new Date().toISOString().split('T')[0];

  const pendingCheckins = useMemo(() =>
    reservations.filter(r => r.status === 'approved' && r.checkIn <= today),
    [reservations, today]
  );

  const pendingCheckouts = useMemo(() =>
    reservations.filter(r => r.status === 'checked-in' && r.checkOut <= today),
    [reservations, today]
  );

  const currentGuests = useMemo(() =>
    reservations.filter(r => r.status === 'checked-in' && r.checkOut > today),
    [reservations, today]
  );

  const nightCount = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
  };

  const formatDate = (d) => {
    if (!d) return 'â€”';
    return new Date(d + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const GuestRow = ({ res, action, actionLabel, actionColor, actionBg, actionBorder, actionIcon }) => (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.05)', gap: '12px', flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1, minWidth: '200px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
          background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className="ti ti-user" style={{ fontSize: '20px', color: '#60a5fa' }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 700, margin: '0 0 4px' }}>{res.guestName}</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '13px' }}>
              <i className="ti ti-door" style={{ fontSize: '13px' }} />
              Oda {res.roomNumber}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '13px' }}>
              <i className="ti ti-calendar" style={{ fontSize: '13px' }} />
              {formatDate(res.checkIn)} â€” {formatDate(res.checkOut)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '13px' }}>
              <i className="ti ti-moon" style={{ fontSize: '13px' }} />
              {nightCount(res.checkIn, res.checkOut)} gece
            </span>
            <span style={{ color: '#34d399', fontSize: '13px', fontWeight: 700 }}>
              &#8378;{(res.totalPrice || 0).toLocaleString('tr-TR')}
            </span>
          </div>
          {res.notes && (
            <p style={{ color: '#64748b', fontSize: '12px', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="ti ti-notes" style={{ fontSize: '12px' }} />
              {res.notes}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => action(res.id)}
        style={{
          padding: '10px 20px', background: actionBg,
          border: `1px solid ${actionBorder}`, color: actionColor,
          borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
          transition: 'filter 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
      >
        <i className={actionIcon} />
        {actionLabel}
      </button>
    </div>
  );

  const SectionCard = ({ title, icon, iconColor, iconBg, count, countColor, countBg, emptyMsg, children }) => (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className={icon} style={{ fontSize: '18px', color: iconColor }} />
          </div>
          <h2 style={{ color: '#e2e8f0', fontSize: '17px', fontWeight: 700, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
        </div>
        <span style={{ background: countBg, color: countColor, borderRadius: '20px', padding: '4px 14px', fontSize: '14px', fontWeight: 700 }}>
          {count}
        </span>
      </div>
      <div style={{ padding: '20px 24px' }}>
        {count === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px' }}>
            <i className="ti ti-checks" style={{ fontSize: '40px', color: '#334155', display: 'block', marginBottom: '12px' }} />
            <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>{emptyMsg}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="ti ti-loader-2" style={{ fontSize: '40px', color: '#3b82f6', display: 'block', marginBottom: '12px' }} />
          <p style={{ color: '#94a3b8', margin: 0 }}>Veriler yukleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: '#e2e8f0', fontSize: '24px', fontWeight: 700, margin: '0 0 6px', fontFamily: "'Outfit', sans-serif" }}>Check-in / Check-out</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
          BugÃ¼n: {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Bekleyen Check-in', value: pendingCheckins.length, color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: 'ti-door-enter' },
          { label: 'Bekleyen Check-out', value: pendingCheckouts.length, color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', icon: 'ti-door-exit' },
          { label: 'Su An Konaklayan', value: currentGuests.length, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: 'ti-users' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: '22px', color: s.color }} />
            </div>
            <div>
              <p style={{ color: s.color, fontSize: '26px', fontWeight: 800, margin: 0, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>{s.value}</p>
              <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0', fontWeight: 500 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Pending Check-ins */}
        <SectionCard
          title="Bekleyen Check-in'ler" icon="ti-door-enter" iconColor="#10b981" iconBg="rgba(16,185,129,0.15)"
          count={pendingCheckins.length} countColor="#10b981" countBg="rgba(16,185,129,0.15)"
          emptyMsg="Bekleyen check-in islemi bulunmuyor"
        >
          {pendingCheckins.map(res => (
            <GuestRow key={res.id} res={res} action={checkIn}
              actionLabel="Check-in Yap" actionColor="#10b981"
              actionBg="rgba(16,185,129,0.12)" actionBorder="rgba(16,185,129,0.3)"
              actionIcon="ti ti-login"
            />
          ))}
        </SectionCard>

        {/* Pending Check-outs */}
        <SectionCard
          title="Bekleyen Check-out'lar" icon="ti-door-exit" iconColor="#f43f5e" iconBg="rgba(244,63,94,0.15)"
          count={pendingCheckouts.length} countColor="#f43f5e" countBg="rgba(244,63,94,0.15)"
          emptyMsg="Bekleyen check-out islemi bulunmuyor"
        >
          {pendingCheckouts.map(res => (
            <GuestRow key={res.id} res={res} action={checkOut}
              actionLabel="Check-out Yap" actionColor="#f43f5e"
              actionBg="rgba(244,63,94,0.12)" actionBorder="rgba(244,63,94,0.3)"
              actionIcon="ti ti-logout"
            />
          ))}
        </SectionCard>

        {/* Current Guests */}
        <SectionCard
          title="Su An Konaklayanlar" icon="ti-users" iconColor="#f59e0b" iconBg="rgba(245,158,11,0.15)"
          count={currentGuests.length} countColor="#f59e0b" countBg="rgba(245,158,11,0.15)"
          emptyMsg="Su an konaklayan misafir bulunmuyor"
        >
          {currentGuests.map(res => {
            const daysLeft = Math.max(0, Math.round((new Date(res.checkOut) - new Date()) / 86400000));
            return (
              <div key={res.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1, minWidth: '200px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ti ti-user" style={{ fontSize: '20px', color: '#f59e0b' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <p style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 700, margin: 0 }}>{res.guestName}</p>
                      <span style={{ background: daysLeft <= 1 ? 'rgba(244,63,94,0.15)' : 'rgba(245,158,11,0.15)', color: daysLeft <= 1 ? '#f43f5e' : '#f59e0b', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>
                        {daysLeft === 0 ? 'Bugun Cikis!' : `${daysLeft} gun kaldi`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '13px' }}>
                        <i className="ti ti-door" style={{ fontSize: '13px' }} /> Oda {res.roomNumber}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '13px' }}>
                        <i className="ti ti-calendar" style={{ fontSize: '13px' }} />
                        {formatDate(res.checkIn)} â€” {formatDate(res.checkOut)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '13px' }}>
                        <i className="ti ti-moon" style={{ fontSize: '13px' }} />
                        {nightCount(res.checkIn, res.checkOut)} gece
                      </span>
                      <span style={{ color: '#34d399', fontSize: '13px', fontWeight: 700 }}>
                        &#8378;{(res.totalPrice || 0).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    {res.notes && (
                      <p style={{ color: '#64748b', fontSize: '12px', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="ti ti-notes" style={{ fontSize: '12px' }} /> {res.notes}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => checkOut(res.id)}
                  style={{ padding: '10px 18px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                >
                  <i className="ti ti-logout" /> Erken Check-out
                </button>
              </div>
            );
          })}
        </SectionCard>
      </div>
    </div>
  );
}
