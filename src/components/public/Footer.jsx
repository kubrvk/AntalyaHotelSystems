import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#0f1c2e', color: '#94a3b8', padding: '64px 0 28px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48,
          marginBottom: 56,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38,
                background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="ti ti-building-hotel" style={{ fontSize: 19, color: '#fff' }} />
              </div>
              <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontSize: 15 }}>Antalya Hotel</p>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 13, lineHeight: 1.8, color: '#4b5563' }}>
              Akdeniz'in incisi Antalya'da lüks ve konforun buluştuğu nokta.
              Unutulmaz bir tatil deneyimi için sizleri bekliyoruz.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: 'ti-brand-instagram', href: '#' },
                { icon: 'ti-brand-facebook', href: '#' },
                { icon: 'ti-brand-twitter', href: '#' },
              ].map(s => (
                <a
                  key={s.icon}
                  href={s.href}
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s',
                  }}
                >
                  <i className={`ti ${s.icon}`} style={{ fontSize: 16 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              margin: '0 0 18px', color: '#e2e8f0', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Hızlı Erişim
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/', label: 'Ana Sayfa' },
                { to: '/rooms', label: 'Odalarımız' },
                { to: '/reservation', label: 'Rezervasyon Yap' },
                { to: '/login', label: 'Üye Girişi' },
                { to: '/register', label: 'Kayıt Ol' },
              ].map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{ color: '#4b5563', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.target.style.color = '#60a5fa'; }}
                  onMouseLeave={e => { e.target.style.color = '#4b5563'; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{
              margin: '0 0 18px', color: '#e2e8f0', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              İletişim
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: 'ti-map-pin', text: 'Konyaaltı Cad. No:1, Antalya' },
                { icon: 'ti-phone', text: '+90 242 123 45 67' },
                { icon: 'ti-mail', text: 'info@antalyahotel.com' },
                { icon: 'ti-clock', text: '7/24 Resepsiyon Hizmeti' },
              ].map(item => (
                <div key={item.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: 15, color: '#3b82f6', marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promo */}
          <div>
            <h3 style={{
              margin: '0 0 18px', color: '#e2e8f0', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Neden Biz?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: 'ti-star', text: '5 Yıldızlı Hizmet' },
                { icon: 'ti-shield-check', text: 'Güvenli Rezervasyon' },
                { icon: 'ti-headset', text: '7/24 Müşteri Desteği' },
                { icon: 'ti-beach', text: 'Denize Sıfır Konum' },
              ].map(item => (
                <div key={item.icon} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: 15, color: '#f59e0b', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#4b5563' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ margin: 0, fontSize: 12, color: '#374151' }}>
            © {year} Antalya Hotel Systems. Tüm hakları saklıdır.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/admin/login" style={{ fontSize: 11, color: '#1f2937', textDecoration: 'none' }}>
              <i className="ti ti-lock" style={{ fontSize: 12, marginRight: 4 }} />
              Admin Paneli
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
