import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard',        icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { to: '/admin/rooms',            icon: 'ti-building',         label: 'Odalar' },
  { to: '/admin/reservations',     icon: 'ti-calendar',         label: 'Rezervasyonlar' },
  { to: '/admin/checkin-checkout', icon: 'ti-door-enter',       label: 'Check-in / Out' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { adminUser, adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const sidebarW = collapsed ? 68 : 240;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080d1a', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarW,
        background: 'linear-gradient(180deg, #0c1a3a 0%, #0c2340 100%)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden', flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, height: '100vh',
      }}>

        {/* Logo */}
        <div style={{
          padding: collapsed ? '18px 0' : '18px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center',
          gap: 12, justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: 64,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          }}>
            <i className="ti ti-building-hotel" style={{ fontSize: 18, color: '#fff' }} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
                Antalya Hotel
              </p>
              <p style={{ margin: 0, color: '#3b82f6', fontSize: 10, fontWeight: 500 }}>Management System</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center',
                gap: 12,
                padding: collapsed ? '13px 0' : '13px 18px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                color: isActive ? '#60a5fa' : '#64748b',
                background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s',
                margin: '2px 0',
              })}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 18, flexShrink: 0 }} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Admin info */}
        {!collapsed && (
          <div style={{
            padding: '12px 18px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: '#fff',
            }}>
              {adminUser?.name?.[0] || 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {adminUser?.name || 'Admin'}
              </p>
              <p style={{ margin: 0, fontSize: 10, color: '#64748b' }}>Administrator</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ padding: '10px 10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              width: '100%', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              background: 'rgba(255,255,255,0.05)', color: '#64748b', cursor: 'pointer',
              padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, fontSize: 12, fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            <i className={`ti ${collapsed ? 'ti-layout-sidebar-right-collapse' : 'ti-layout-sidebar-left-collapse'}`} style={{ fontSize: 16 }} />
            {!collapsed && <span>Daralt</span>}
          </button>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8,
              background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer',
              padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, fontSize: 12, fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            <i className="ti ti-logout" style={{ fontSize: 16 }} />
            {!collapsed && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Header */}
        <header style={{
          background: 'rgba(8,13,26,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 28px', height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="ti ti-command" style={{ fontSize: 16, color: '#3b82f6' }} />
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Admin Paneli</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#334155' }}>
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 12, color: '#3b82f6', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 4,
                border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6,
                padding: '4px 10px',
              }}
            >
              <i className="ti ti-external-link" style={{ fontSize: 13 }} />
              Siteyi Görüntüle
            </a>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
