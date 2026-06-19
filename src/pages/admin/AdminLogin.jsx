import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { adminLogin, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Admin Girisi — Antalya Hotel';
  }, []);

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('E-posta ve sifre alanlari zorunludur.');
      return;
    }
    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Gecersiz e-posta veya sifre. Lutfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #080d1a 0%, #0c1a3a 50%, #0a1628 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px', width: '400px', height: '400px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px', width: '350px', height: '350px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,78,216,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', padding: '44px 40px', width: '420px', maxWidth: '100%',
        position: 'relative', backdropFilter: 'blur(20px)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px', boxShadow: '0 8px 32px rgba(37,99,235,0.4)',
          }}>
            <i className="ti ti-building-hotel" style={{ fontSize: '32px', color: '#fff' }} />
          </div>
          <h1 style={{
            color: '#e2e8f0', fontSize: '22px', fontWeight: 700, margin: 0,
            fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px',
          }}>Antalya Hotel</h1>
          <span style={{
            color: '#64748b', fontSize: '13px', fontWeight: 500, marginTop: '4px',
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>Admin Paneli</span>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500, textAlign: 'center', marginBottom: '28px', marginTop: 0 }}>
          Hesabiniza giris yapin
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '12px 14px', color: '#f87171',
            fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <i className="ti ti-alert-circle" style={{ fontSize: '16px', flexShrink: 0 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', fontWeight: 500, marginBottom: '8px', letterSpacing: '0.3px' }}>
              E-POSTA ADRESİ
            </label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-mail" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '16px', pointerEvents: 'none' }} />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hotel.com"
                style={{
                  width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0', borderRadius: '10px', padding: '11px 14px 11px 42px',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(37,99,235,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', fontWeight: 500, marginBottom: '8px', letterSpacing: '0.3px' }}>
              ŞİFRE
            </label>
            <div style={{ position: 'relative' }}>
              <i className="ti ti-lock" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '16px', pointerEvents: 'none' }} />
              <input
                type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                style={{
                  width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0', borderRadius: '10px', padding: '11px 42px 11px 42px',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(37,99,235,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button type="button"
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                <i className={showPassword ? 'ti ti-eye-off' : 'ti ti-eye'} style={{ fontSize: '16px' }} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <input
              id="remember" type="checkbox" checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563eb' }}
            />
            <label htmlFor="remember" style={{ color: '#94a3b8', fontSize: '13px', cursor: 'pointer', userSelect: 'none' }}>
              Beni Hatırla
            </label>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
          }}>
            {loading ? (
              <><i className="ti ti-loader-2" style={{ fontSize: '18px' }} /> Giris yapiliyor...</>
            ) : (
              <><i className="ti ti-login" style={{ fontSize: '18px' }} /> Giriş Yap</>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '24px', background: 'rgba(37,99,235,0.07)',
          border: '1px solid rgba(37,99,235,0.18)', borderRadius: '10px', padding: '12px 14px',
          display: 'flex', alignItems: 'flex-start', gap: '8px',
        }}>
          <i className="ti ti-info-circle" style={{ fontSize: '15px', color: '#3b82f6', flexShrink: 0, marginTop: '1px' }} />
          <div style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.6 }}>
            Demo giris bilgileri:<br />
            <span style={{ color: '#93c5fd', fontFamily: 'monospace' }}>admin@hotel.com</span>{' '}
            / <span style={{ color: '#93c5fd', fontFamily: 'monospace' }}>admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
