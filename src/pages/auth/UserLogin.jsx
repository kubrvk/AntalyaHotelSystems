import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserLogin() {
  const { currentUser, userLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (currentUser) return <Navigate to="/profile" replace />;

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Lütfen tüm alanları doldurun.'); return; }
    setLoading(true);
    try {
      await userLogin(form.email, form.password);
      navigate('/profile');
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'
        ? 'E-posta veya şifre hatalı.'
        : err.code === 'auth/too-many-requests'
        ? 'Çok fazla başarısız giriş denemesi. Lütfen bir süre bekleyin.'
        : 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasErr) => ({
    width: '100%', padding: '12px 14px', borderRadius: 11, fontSize: 15, color: '#1e293b', outline: 'none',
    boxSizing: 'border-box', border: hasErr ? '1.5px solid #ef4444' : '1px solid #e2e8f0', background: '#f8fafc',
    fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff, #e8f0fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}>
              <i className="ti ti-building-estate" style={{ fontSize: 30, color: '#fff' }} />
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Antalya Hotel</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, color: '#1e293b', margin: '0 0 6px', textAlign: 'center' }}>
            Hoş Geldiniz
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', marginBottom: 32, marginTop: 0 }}>
            Hesabınıza giriş yapın
          </p>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#dc2626', fontSize: 14 }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 18, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, letterSpacing: 0.3 }}>
                E-POSTA ADRESİ
              </label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-mail" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 17 }} />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ornek@email.com"
                  style={{ ...inputStyle(false), paddingLeft: 40 }} autoComplete="email" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, letterSpacing: 0.3 }}>
                ŞİFRE
              </label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-lock" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 17 }} />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••"
                  style={{ ...inputStyle(false), paddingLeft: 40, paddingRight: 44 }} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}>
                  <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: 17 }} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ padding: '13px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, boxShadow: loading ? 'none' : '0 4px 16px rgba(37,99,235,0.35)', transition: 'all 0.2s' }}>
              {loading ? (
                <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Giriş yapılıyor...</>
              ) : (
                <><i className="ti ti-login" style={{ fontSize: 17 }} /> Giriş Yap</>
              )}
            </button>
          </form>

          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 28, paddingTop: 20, textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
              Hesabınız yok mu?{' '}
              <Link to="/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                Kayıt olun
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#94a3b8', fontSize: 13 }}>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            <i className="ti ti-arrow-left" style={{ fontSize: 13, marginRight: 4 }} />Ana Sayfaya Dön
          </Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}