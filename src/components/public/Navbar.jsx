import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HotelLogoMark from '../HotelLogoMark';

export default function Navbar() {
  const { currentUser, userLogout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    userLogout();
    navigate('/');
    setMobileOpen(false);
  };

  const linkBase = {
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'color 0.2s',
    padding: '4px 0',
  };

  const activeStyle = ({ isActive }) => ({
    ...linkBase,
    color: isActive ? '#1e3a5f' : '#4b5563',
    borderBottom: isActive ? '2px solid #1e3a5f' : '2px solid transparent',
  });

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(30,58,95,0.08)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
            borderRadius: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
          }}>
            <HotelLogoMark size={25} style={{ color: '#fff' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: '#1e3a5f', lineHeight: 1.1 }}>
              Antalya Hotel
            </p>
            <p style={{ margin: 0, fontSize: 9, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Luxury &amp; Comfort
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <NavLink to="/" end style={activeStyle}>Ana Sayfa</NavLink>
          <NavLink to="/rooms" style={activeStyle}>Odalar</NavLink>
          <NavLink to="/reservation" style={activeStyle}>Rezervasyon</NavLink>
          {currentUser ? (
            <>
              <NavLink to="/profile" style={activeStyle}>Profilim</NavLink>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 20px', borderRadius: 8, border: '1px solid #e5e7eb',
                  background: '#f9fafb', color: '#4b5563', cursor: 'pointer',
                  fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={activeStyle}>Giriş Yap</NavLink>
              <Link
                to="/reservation"
                style={{
                  textDecoration: 'none',
                  padding: '10px 24px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                  transition: 'opacity 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                Rezervasyon Yap
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
