import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HotelLogoMark from '../../components/HotelLogoMark';

export default function UserRegister() {
  const { currentUser, userRegister } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ displayName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (currentUser) return <Navigate to="/profile" replace />;

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const validate = () => {
    const e = {};
    if (!form.displayName.trim()) e.displayName = 'Ad Soyad zorunludur.';
    if (!form.email.trim()) e.email = 'E-posta zorunludur.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Geçerli bir e-posta girin.';
    if (!form.password) e.password = 'Şifre zorunludur.';
    else if (form.password.length < 6) e.password = 'Şifre en az 6 karakter olmalıdır.';
    if (!form.confirmPassword) e.confirmPassword = 'Şifre tekrarı zorunludur.';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Şifreler eşleşmiyor.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await userRegister(form.email, form.password, form.displayName, form.phone);
      navigate('/profile');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'Bu e-posta adresi zaten kullanılıyor.'
        : err.code === 'auth/weak-password'
        ? 'Şifre çok zayıf. Daha güçlü bir şifre seçin.'
        : 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasErr) => ({
    width: '100%', padding: '12px 14px', borderRadius: 11, fontSize: 15, color: '#1e293b', outline: 'none',
    boxSizing: 'border-box', border: hasErr ? '1.5px solid #ef4444' : '1px solid #e2e8f0', background: '#f8fafc',
    fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s',
  });
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, letterSpacing: 0.3 };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff, #e8f0fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}>
              <HotelLogoMark size={38} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Antalya Hotel</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, color: '#1e293b', margin: '0 0 6px', textAlign: 'center' }}>
            Hesap Oluşturun
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', marginBottom: 32, marginTop: 0 }}>
            Kolayca kayıt olun ve ayrıcalıkların keyfini çıkarın
          </p>

          {errors.submit && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#dc2626', fontSize: 14 }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 18, flexShrink: 0 }} />
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>AD SOYAD *</label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-user" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 17 }} />
                <input value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="Adınız ve soyadınız"
                  style={{ ...inputStyle(errors.displayName), paddingLeft: 40 }} />
              </div>
              {errors.displayName && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.displayName}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>E-POSTA ADRESİ *</label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-mail" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 17 }} />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ornek@email.com"
                  style={{ ...inputStyle(errors.email), paddingLeft: 40 }} autoComplete="email" />
              </div>
              {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>TELEFON (İSTEĞE BAĞLI)</label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-phone" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 17 }} />
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+90 5xx xxx xx xx"
                  style={{ ...inputStyle(false), paddingLeft: 40 }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>ŞİFRE *</label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-lock" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 17 }} />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="En az 6 karakter"
                  style={{ ...inputStyle(errors.password), paddingLeft: 40, paddingRight: 44 }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}>
                  <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: 17 }} />
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label style={labelStyle}>ŞİFRE TEKRAR *</label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-lock-check" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 17 }} />
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Şifrenizi tekrar girin"
                  style={{ ...inputStyle(errors.confirmPassword), paddingLeft: 40, paddingRight: 44 }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}>
                  <i className={`ti ${showConfirm ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: 17 }} />
                </button>
              </div>
              {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading}
              style={{ padding: '13px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, boxShadow: loading ? 'none' : '0 4px 16px rgba(37,99,235,0.35)', transition: 'all 0.2s' }}>
              {loading ? (
                <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Hesap oluşturuluyor...</>
              ) : (
                <><i className="ti ti-user-plus" style={{ fontSize: 17 }} /> Hesap Oluştur</>
              )}
            </button>
          </form>

          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 28, paddingTop: 20, textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
              Zaten hesabınız var mı?{' '}
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                Giriş yapın
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
