import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHotel } from '../../context/HotelContext';
import PublicRoomCard from '../../components/public/PublicRoomCard';

const SERVICES = [
  { icon: 'ti-pool', title: 'Ozel Havuz', desc: 'Panoramik deniz manzarali sonsuzluk havuzu' },
  { icon: 'ti-tools-kitchen-2', title: 'Fine Dining', desc: 'Dunyaca unlu seflerimizle gastronomi deneyimi' },
  { icon: 'ti-massage', title: 'SPA & Wellness', desc: 'Ruhunuzu ve bedeninizi yenileyin' },
  { icon: 'ti-car', title: 'VIP Transfer', desc: 'Havalimani karsilama ve transfer hizmeti' },
  { icon: 'ti-24-hours', title: '7/24 Hizmet', desc: 'Guler yuzlu resepsiyon ekibimiz her an yaniinizda' },
  { icon: 'ti-wifi', title: 'Ucretsiz WiFi', desc: 'Otel genelinde hizli internet baglantisi' },
];

const STATS = [
  { value: '12+', label: 'Oda Tipi' },
  { value: '500+', label: 'Mutlu Misafir' },
  { value: '15', label: 'Yillik Deneyim' },
  { value: '5 Yildiz', label: 'Yildizli Hizmet' },
];

export default function Home() {
  const { rooms } = useHotel();
  const [hoveredService, setHoveredService] = useState(null);

  const featuredRooms = rooms.filter(r => r.status === 'available').slice(0, 3);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          height: '85vh',
          minHeight: 540,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,13,26,0.85), rgba(30,58,95,0.7))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 800 }}>
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 18px', borderRadius: 50, marginBottom: 28 }}>
            Antalya, Turkiye
          </span>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, color: '#fff', margin: '0 0 20px', lineHeight: 1.15, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Akdeniz'in En Lux<br />
            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Deneyimi</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Turkuaz deniz, altin gunes ve essiz luks konforu bir arada sunan otelde unutulmaz bir tatil deneyimi sizi bekliyor.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/rooms" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}>
              <i className="ti ti-door-enter" style={{ fontSize: 18 }} /> Odalari Kesfet
            </Link>
            <Link to="/reservation" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              <i className="ti ti-calendar-plus" style={{ fontSize: 18 }} /> Rezervasyon Yap
            </Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 1 }}>
          <span>KESFET</span>
          <i className="ti ti-chevron-down" style={{ fontSize: 20 }} />
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: '#0f1c2e', padding: '32px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '24px 16px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>
                {s.value}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section style={{ background: '#fff', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#1d4ed8', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50, marginBottom: 16 }}>
              Seckin Odalar
            </span>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 40, fontWeight: 800, color: '#1e293b', margin: '0 0 16px' }}>
              One Cikan Odalarimiz
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Her biri ozenle tasarlanmis, konforun ve estetigin bulusugu odalarimizi kesfiedin.
            </p>
          </div>
          {rooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
              <i className="ti ti-loader-2" style={{ fontSize: 40, display: 'block', marginBottom: 12 }} />
              Odalar yukleniyor...
            </div>
          ) : featuredRooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              <i className="ti ti-bed-off" style={{ fontSize: 48, display: 'block', marginBottom: 16, color: '#cbd5e1' }} />
              <p>Su anda musait oda bulunmuyor.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
              {featuredRooms.map(room => <PublicRoomCard key={room.id} room={room} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/rooms" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
              Tum Odalari Gor <i className="ti ti-arrow-right" style={{ fontSize: 18 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ background: '#f8fafc', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#1d4ed8', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50, marginBottom: 16 }}>
              Ayricaliklar
            </span>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 40, fontWeight: 800, color: '#1e293b', margin: '0 0 16px' }}>
              Sunduğumuz Hizmetler
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Konaklamanizi unutulmaz kilacak ozel hizmetlerimizle her aniniz degerli.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {SERVICES.map((service, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', boxShadow: hoveredService === i ? '0 12px 40px rgba(37,99,235,0.15)' : '0 2px 16px rgba(0,0,0,0.06)', border: hoveredService === i ? '1px solid rgba(37,99,235,0.2)' : '1px solid rgba(0,0,0,0.04)', transition: 'all 0.25s ease', transform: hoveredService === i ? 'translateY(-4px)' : 'translateY(0)', cursor: 'default' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
                  <i className={`ti ${service.icon}`} style={{ fontSize: 26, color: '#fff' }} />
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 10px' }}>{service.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: 'linear-gradient(135deg, #0f1c2e 0%, #1e3a5f 50%, #1d4ed8 100%)', padding: '90px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#93c5fd', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50, marginBottom: 24 }}>
            <i className="ti ti-sparkles" style={{ fontSize: 14 }} /> Ozel Firsatlar
          </span>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>
            Hayalinizdeki Tatili<br />Planlayın
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>
            Erken rezervasyon avantajlarindan yararllanin, ozel paketlerimizi kesfiedin ve Akdeniz'in buyusune kapilin.
          </p>
          <Link to="/reservation" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', background: '#fff', color: '#1e3a5f', borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.2)' }}>
            <i className="ti ti-calendar-event" style={{ fontSize: 20 }} /> Hemen Rezervasyon Yap
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a1628', color: '#cbd5e1', textAlign: 'center', padding: '32px 24px', fontSize: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ margin: 0 }}>© 2018 Antalya Hotel Systems. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
