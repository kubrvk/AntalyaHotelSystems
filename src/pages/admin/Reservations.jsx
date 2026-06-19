import { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const FILTERS = [
  { key: 'all', label: 'Tumu' },
  { key: 'pending', label: 'Bekliyor' },
  { key: 'approved', label: 'Onaylanmis' },
  { key: 'checked-in', label: 'Check-in' },
  { key: 'checked-out', label: 'Check-out' },
  { key: 'cancelled', label: 'Iptal' },
];

const EMPTY_FORM = {
  guestName: '', guestEmail: '', guestPhone: '', roomNumber: '',
  checkIn: '', checkOut: '', guestCount: 1, notes: '',
};

export default function Reservations() {
  const { rooms, reservations, addReservation, updateReservation, deleteReservation, approveReservation, cancelReservation } = useHotel();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRes, setEditRes] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  const filteredReservations = useMemo(() => {
    let list = reservations;
    if (filter !== 'all') list = list.filter(r => r.status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r =>
        (r.guestName || '').toLowerCase().includes(q) ||
        (r.guestEmail || '').toLowerCase().includes(q) ||
        String(r.roomNumber || '').toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const da = a.createdAt?.seconds || 0;
      const db = b.createdAt?.seconds || 0;
      return db - da;
    });
  }, [reservations, filter, search]);

  const filterCounts = useMemo(() => {
    const counts = {};
    FILTERS.forEach(f => {
      counts[f.key] = f.key === 'all' ? reservations.length : reservations.filter(r => r.status === f.key).length;
    });
    return counts;
  }, [reservations]);

  const calcTotal = useMemo(() => {
    if (!form.checkIn || !form.checkOut || !form.roomNumber) return 0;
    const room = rooms.find(r => String(r.number) === String(form.roomNumber));
    if (!room) return 0;
    const d1 = new Date(form.checkIn);
    const d2 = new Date(form.checkOut);
    const nights = Math.max(0, Math.round((d2 - d1) / 86400000));
    return nights * (room.pricePerNight || 0);
  }, [form.checkIn, form.checkOut, form.roomNumber, rooms]);

  const openAdd = () => {
    setEditRes(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (res) => {
    setEditRes(res);
    setForm({
      guestName: res.guestName || '',
      guestEmail: res.guestEmail || '',
      guestPhone: res.guestPhone || '',
      roomNumber: res.roomNumber || '',
      checkIn: res.checkIn || '',
      checkOut: res.checkOut || '',
      guestCount: res.guestCount || 1,
      notes: res.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.guestName || !form.roomNumber || !form.checkIn || !form.checkOut) return;
    setSaving(true);
    try {
      const data = { ...form, totalPrice: calcTotal, guestCount: Number(form.guestCount) };
      if (editRes) {
        await updateReservation(editRes.id, data);
      } else {
        await addReservation({ ...data, status: 'pending' });
      }
      setModalOpen(false);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    await deleteReservation(confirmId);
    setConfirmId(null);
  };

  const nights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
  };

  const inputStyle = {
    width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
    color: '#e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif",
  };
  const labelStyle = { display: 'block', fontSize: '12px', color: '#94a3b8', fontWeight: 500, marginBottom: '6px' };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#e2e8f0', fontSize: '24px', fontWeight: 700, margin: '0 0 4px', fontFamily: "'Outfit', sans-serif" }}>Rezervasyonlar</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>{reservations.length} toplam rezervasyon</p>
        </div>
        <button onClick={openAdd} style={{
          background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff',
          border: 'none', borderRadius: '10px', padding: '11px 20px', fontSize: '14px', fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
        }}>
          <i className="ti ti-plus" /> Rezervasyon Ekle
        </button>
      </div>

      {/* Filter Tabs + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s',
              background: filter === f.key ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'rgba(255,255,255,0.05)',
              color: filter === f.key ? '#fff' : '#94a3b8',
              borderColor: filter === f.key ? 'transparent' : 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {f.label}
              <span style={{ background: filter === f.key ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: 700 }}>
                {filterCounts[f.key]}
              </span>
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '15px' }} />
          <input
            type="text" placeholder="Misafir, oda ara..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '36px', width: '230px' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
        {filteredReservations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <i className="ti ti-calendar-off" style={{ fontSize: '48px', color: '#334155', display: 'block', marginBottom: '16px' }} />
            <p style={{ color: '#475569', fontSize: '16px', margin: '0 0 8px', fontWeight: 500 }}>Rezervasyon bulunamadi</p>
            <p style={{ color: '#334155', fontSize: '14px', margin: 0 }}>Farkli bir filtre secin veya yeni rezervasyon ekleyin</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Misafir', 'Telefon', 'Oda', 'Tarihler', 'Kisi', 'Toplam', 'Durum', 'Islemler'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: '11px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.07)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((res, i) => (
                  <tr key={res.id} style={{ borderBottom: i < filteredReservations.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600, margin: 0 }}>{res.guestName}</p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: '3px 0 0' }}>{res.guestEmail}</p>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>{res.guestPhone || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.07)', padding: '4px 10px', borderRadius: '7px', color: '#e2e8f0', fontWeight: 700, fontSize: '14px' }}>{res.roomNumber}</span>
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', margin: 0, fontWeight: 500 }}>{res.checkIn} <span style={{ color: '#475569' }}>→</span> {res.checkOut}</p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: '3px 0 0' }}>{nights(res.checkIn, res.checkOut)} gece</p>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '14px' }}>{res.guestCount || 1}</td>
                    <td style={{ padding: '14px 16px', color: '#34d399', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      &#8378;{(res.totalPrice || 0).toLocaleString('tr-TR')}
                    </td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={res.status} size="sm" /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                        {res.status === 'pending' && (
                          <>
                            <button onClick={() => approveReservation(res.id)} title="Onayla" style={{ padding: '6px 10px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                              <i className="ti ti-check" /> Onayla
                            </button>
                            <button onClick={() => cancelReservation(res.id)} title="Iptal" style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                              <i className="ti ti-x" /> Iptal
                            </button>
                          </>
                        )}
                        {res.status === 'approved' && (
                          <>
                            <span style={{ padding: '6px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', borderRadius: '7px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                              <i className="ti ti-calendar-check" /> Onaylandi
                            </span>
                            <button onClick={() => cancelReservation(res.id)} title="Iptal" style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                              <i className="ti ti-x" /> Iptal
                            </button>
                          </>
                        )}
                        {(res.status === 'checked-in' || res.status === 'checked-out' || res.status === 'cancelled') && (
                          <span style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#475569', borderRadius: '7px', fontSize: '12px', whiteSpace: 'nowrap' }}>Islem yok</span>
                        )}
                        <button onClick={() => openEdit(res)} title="Duzenle" style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                          <i className="ti ti-edit" />
                        </button>
                        <button onClick={() => setConfirmId(res.id)} title="Sil" style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                          <i className="ti ti-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editRes ? 'Rezervasyon Duzenle' : 'Yeni Rezervasyon'} width={580}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>MİSAFİR ADI SOYADI</label>
              <input style={inputStyle} value={form.guestName} onChange={e => setForm(p => ({ ...p, guestName: e.target.value }))} placeholder="Ad Soyad" />
            </div>
            <div>
              <label style={labelStyle}>TELEFON</label>
              <input style={inputStyle} value={form.guestPhone} onChange={e => setForm(p => ({ ...p, guestPhone: e.target.value }))} placeholder="+90 5xx xxx xx xx" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>E-POSTA</label>
            <input style={inputStyle} type="email" value={form.guestEmail} onChange={e => setForm(p => ({ ...p, guestEmail: e.target.value }))} placeholder="misafir@email.com" />
          </div>
          <div>
            <label style={labelStyle}>ODA SEÇİN</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.roomNumber} onChange={e => setForm(p => ({ ...p, roomNumber: e.target.value }))}>
              <option value="">-- Oda Secin --</option>
              {rooms.filter(r => r.status === 'available' || String(r.number) === String(form.roomNumber)).map(r => (
                <option key={r.id} value={r.number}>
                  Oda {r.number} — {r.type} — &#8378;{r.pricePerNight}/gece
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>GİRİŞ TARİHİ</label>
              <input style={inputStyle} type="date" value={form.checkIn} onChange={e => setForm(p => ({ ...p, checkIn: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>ÇIKIŞ TARİHİ</label>
              <input style={inputStyle} type="date" value={form.checkOut} onChange={e => setForm(p => ({ ...p, checkOut: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>KİŞİ SAYISI</label>
              <input style={inputStyle} type="number" min={1} value={form.guestCount} onChange={e => setForm(p => ({ ...p, guestCount: e.target.value }))} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>NOT</label>
            <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Ozel istek veya not..." />
          </div>

          {calcTotal > 0 && (
            <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Tahmini Toplam</span>
              <span style={{ color: '#34d399', fontSize: '20px', fontWeight: 700 }}>&#8378;{calcTotal.toLocaleString('tr-TR')}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
              Vazgec
            </button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', border: 'none', color: '#fff', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {saving ? <><i className="ti ti-loader-2" /> Kaydediliyor...</> : <><i className="ti ti-device-floppy" /> {editRes ? 'Guncelle' : 'Ekle'}</>}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete}
        message="Bu rezervasyonu silmek istediginizden emin misiniz? Bu islem geri alinamaz."
        confirmLabel="Sil" confirmColor="#ef4444" icon="ti-trash"
      />
    </div>
  );
}