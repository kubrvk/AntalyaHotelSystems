import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useHotel } from '../../context/HotelContext';
import { useAuth } from '../../context/AuthContext';

function diffDays(a, b) {
  const da = new Date(a), db = new Date(b);
  return Math.max(0, Math.round((db - da) / (1000 * 60 * 60 * 24)));
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function ReservationForm() {
  const { rooms, addReservation } = useHotel();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRoom = searchParams.get('room');

  const availableRooms = rooms.filter(r => r.status === 'available');

  const [form, setForm] = useState({
    guestName: currentUser?.displayName || '',
    guestEmail: currentUser?.email || '',
    guestPhone: '',
    roomNumber: preselectedRoom || (availableRooms[0]?.number?.toString() || ''),
    checkIn: today(),
    checkOut: tomorrow(),
    guestCount: 1,
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (preselectedRoom) setForm(f => ({ ...f, roomNumber: preselectedRoom }));
  }, [preselectedRoom]);

  useEffect(() => {
    if (currentUser) {
      setForm(f => ({
        ...f,
        guestName: f.guestName || currentUser.displayName || '',
        guestEmail: f.guestEmail || currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const selectedRoom = useMemo(() => rooms.find(r => r.number?.toString() === form.roomNumber?.toString()), [rooms, form.roomNumber]);
  const nights = useMemo(() => diffDays(form.checkIn, form.checkOut), [form.checkIn, form.checkOut]);
  const totalPrice = useMemo(() => (selectedRoom?.pricePerNight || 0) * nights, [selectedRoom, nights]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const validate = () => {
    const e = {};
    if (!form.guestName.trim()) e.guestName = 'Ad Soyad zorunludur.';
    if (!form.guestEmail.trim()) e.guestEmail = 'E-posta zorunludur.';
    else if (!/\S+@\S+\.\S+/.test(form.guestEmail)) e.guestEmail = 'Geçerli bir e-posta girin.';
    if (!form.guestPhone.trim()) e.guestPhone = 'Telefon zorunludur.';
    if (!form.roomNumber) e.roomNumber = 'Lütfen bir oda seçin.';
    if (!form.checkIn) e.checkIn = 'Giriş tarihi zorunludur.';
    if (!form.checkOut) e.checkOut = 'Çıkış tarihi zorunludur.';
    else if (form.checkOut <= form.checkIn) e.checkOut = 'Çıkış tarihi giriş tarihinden sonra olmalıdır.';
    if (nights < 1) e.checkOut = 'En az 1 gece rezervasyon yapılmalıdır.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const reservation = {
        ...form,
        roomNumber: form.roomNumber?.toString(),
        guestCount: Number(form.guestCount),
        totalPrice,
        status: 'pending',
        userEmail: currentUser?.email || form.guestEmail,
      };
      await addReservation(reservation);
      setSubmittedData(reservation);
      setSuccess(true);
    } catch (err) {
      setErrors({ submit: 'Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success && submittedData) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '52px 40px', maxWidth: 540, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 4px 20px rgba(22,163,74,0.25)' }}>
            <i className="ti ti-circle-check" style={{ fontSize: 44, color: '#16a34a' }} />
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, color: '#1e293b', margin: '0 0 12px' }}>Rezervasyon Talebiniz Alındı!</h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Rezervasyon talebiniz başarıyla oluşturuldu. Ekibimiz en kısa sürede onaylayacak ve size bilgi verecektir.
          </p>

          <div style={{ background: '#f8fafc', borderRadius: 16, padding: '20px 24px', textAlign: 'left', marginBottom: 32, border: '1px solid #e2e8f0' }}>
            {[
              { icon: 'ti-user', label: 'Misafir', value: submittedData.guestName },
              { icon: 'ti-door', label: 'Oda', value: `Oda ${submittedData.roomNumber}` },
              { icon: 'ti-calendar-event', label: 'Giriş', value: submittedData.checkIn },
              { icon: 'ti-calendar-event', label: 'Çıkış', value: submittedData.checkOut },
              { icon: 'ti-coin', label: 'Toplam', value: `₺${submittedData.totalPrice?.toLocaleString('tr-TR')}` },
            ].map(({ icon, label, value }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 4 ? '1px solid #e2e8f0' : 'none' }}>
                <i className={`ti ${icon}`} style={{ fontSize: 16, color: '#94a3b8', width: 20 }} />
                <span style={{ color: '#64748b', fontSize: 13, flex: 1 }}>{label}</span>
                <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/" style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
              Ana Sayfaya Dön
            </Link>
            <Link to="/profile" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
              Profilimi Gör
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = (err) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box',
    border: err ? '1.5px solid #ef4444' : '1px solid #e2e8f0', background: '#f8fafc', fontFamily: "'Inter', sans-serif",
  });
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, letterSpacing: 0.3 };
  const sectionHeader = { fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: '#1e293b', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif", padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
            <i className="ti ti-calendar-plus" style={{ fontSize: 32, color: '#fff' }} />
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, color: '#1e293b', margin: '0 0 10px' }}>Rezervasyon Talebi</h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>Bilgilerinizi doldurarak rezervasyon talebinizi oluşturun.</p>
        </div>

        {errors.submit && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12, padding: '14px 18px', marginBottom: 20, color: '#dc2626', fontSize: 14, display: 'flex', gap: 10 }}>
            <i className="ti ti-alert-circle" style={{ fontSize: 18, flexShrink: 0 }} /> {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Personal info */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={sectionHeader}><i className="ti ti-user" style={{ color: '#2563eb' }} /> Kişisel Bilgiler</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>AD SOYAD *</label>
                <input style={inputStyle(errors.guestName)} value={form.guestName} onChange={e => set('guestName', e.target.value)} placeholder="Adınız ve soyadınız" />
                {errors.guestName && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.guestName}</p>}
              </div>
              <div>
                <label style={labelStyle}>E-POSTA *</label>
                <input type="email" style={inputStyle(errors.guestEmail)} value={form.guestEmail} onChange={e => set('guestEmail', e.target.value)} placeholder="ornek@email.com" />
                {errors.guestEmail && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.guestEmail}</p>}
              </div>
              <div>
                <label style={labelStyle}>TELEFON *</label>
                <input style={inputStyle(errors.guestPhone)} value={form.guestPhone} onChange={e => set('guestPhone', e.target.value)} placeholder="+90 5xx xxx xx xx" />
                {errors.guestPhone && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.guestPhone}</p>}
              </div>
            </div>
          </div>

          {/* Reservation details */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={sectionHeader}><i className="ti ti-calendar" style={{ color: '#2563eb' }} /> Rezervasyon Detayları</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>ODA SEÇİN *</label>
                <select style={inputStyle(errors.roomNumber)} value={form.roomNumber} onChange={e => set('roomNumber', e.target.value)}>
                  <option value="">Oda seçin...</option>
                  {availableRooms.map(r => (
                    <option key={r.id} value={r.number}>{`Oda ${r.number} — ${r.type} — ₺${r.pricePerNight?.toLocaleString('tr-TR')}/gece`}</option>
                  ))}
                </select>
                {errors.roomNumber && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.roomNumber}</p>}
                {availableRooms.length === 0 && <p style={{ color: '#f59e0b', fontSize: 12, marginTop: 6 }}>Şu an müsait oda bulunmuyor.</p>}
              </div>
              <div>
                <label style={labelStyle}>GİRİŞ TARİHİ *</label>
                <input type="date" style={inputStyle(errors.checkIn)} value={form.checkIn} min={today()} onChange={e => set('checkIn', e.target.value)} />
                {errors.checkIn && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.checkIn}</p>}
              </div>
              <div>
                <label style={labelStyle}>ÇIKIŞ TARİHİ *</label>
                <input type="date" style={inputStyle(errors.checkOut)} value={form.checkOut} min={form.checkIn || today()} onChange={e => set('checkOut', e.target.value)} />
                {errors.checkOut && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.checkOut}</p>}
              </div>
              <div>
                <label style={labelStyle}>KİŞİ SAYISI</label>
                <select style={inputStyle()} value={form.guestCount} onChange={e => set('guestCount', e.target.value)}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Kişi</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={sectionHeader}><i className="ti ti-notes" style={{ color: '#2563eb' }} /> Özel İstekler</h3>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Özel isteklerinizi veya notlarınızı buraya yazabilirsiniz..." rows={4}
              style={{ ...inputStyle(), resize: 'vertical', minHeight: 100 }} />
          </div>

          {/* Price summary */}
          {selectedRoom && nights > 0 && (
            <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: 20, padding: 28, color: '#fff' }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="ti ti-receipt" style={{ fontSize: 20 }} /> Fiyat Özeti
              </h3>
              {[
                { label: `Oda ${selectedRoom.number} (${selectedRoom.type})`, value: '' },
                { label: 'Gecelik Fiyat', value: `₺${selectedRoom.pricePerNight?.toLocaleString('tr-TR')}` },
                { label: 'Konaklama Süresi', value: `${nights} gece` },
              ].map(({ label, value }, i) => value && (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', fontSize: 20, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                <span>Toplam Tutar</span>
                <span>₺{totalPrice.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={submitting}
            style={{ padding: '15px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 16, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: submitting ? 'none' : '0 4px 20px rgba(37,99,235,0.35)', transition: 'all 0.2s' }}>
            {submitting ? (
              <><div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Gönderiliyor...</>
            ) : (
              <><i className="ti ti-send" style={{ fontSize: 18 }} /> Rezervasyon Talebini Gönder</>
            )}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}