import { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const FEATURES = [
  'Ucretsiz WiFi','Klima','LED TV','Mini Bar','Balkon',
  'Deniz Manzarasi','Jakuzi','Kahvalti Dahil','Kasa',
  'Oturma Odasi','Ozel Havuz','Butler Servisi',
];

const ROOM_TYPES = ['Standard','Deluxe','Suite','Economy'];
const STATUSES = ['available','occupied','reserved','cleaning'];
const STATUS_LABELS = { available:'Bos', occupied:'Dolu', reserved:'Rezerveli', cleaning:'Temizlik' };

const FILTERS = [
  { key: 'all', label: 'Tumu' },
  { key: 'available', label: 'Bos' },
  { key: 'occupied', label: 'Dolu' },
  { key: 'reserved', label: 'Rezerveli' },
  { key: 'cleaning', label: 'Temizlik' },
];

const EMPTY_FORM = {
  number: '', floor: '', type: 'Standard', capacity: '', pricePerNight: '',
  status: 'available', description: '', features: [], image: '',
};

export default function Rooms() {
  const { rooms, addRoom, updateRoom, deleteRoom, loading } = useHotel();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  const filtered = useMemo(() => {
    let list = rooms;
    if (filter !== 'all') list = list.filter(r => r.status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r =>
        String(r.number).toLowerCase().includes(q) ||
        (r.type || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [rooms, filter, search]);

  const openAdd = () => {
    setEditRoom(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditRoom(room);
    setForm({
      number: room.number || '',
      floor: room.floor || '',
      type: room.type || 'Standard',
      capacity: room.capacity || '',
      pricePerNight: room.pricePerNight || '',
      status: room.status || 'available',
      description: room.description || '',
      features: room.features || [],
      image: room.image || '',
    });
    setModalOpen(true);
  };

  const handleFeatureToggle = (f) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f],
    }));
  };

  const handleSave = async () => {
    if (!form.number || !form.floor || !form.capacity || !form.pricePerNight) return;
    setSaving(true);
    try {
      const data = {
        number: form.number,
        floor: Number(form.floor),
        type: form.type,
        capacity: Number(form.capacity),
        pricePerNight: Number(form.pricePerNight),
        status: form.status,
        description: form.description,
        features: form.features,
        image: form.image,
      };
      if (editRoom) {
        await updateRoom(editRoom.id, data);
      } else {
        await addRoom(data);
      }
      setModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    await deleteRoom(confirmId);
    setConfirmId(null);
  };

  const typeColors = { Standard: '#3b82f6', Deluxe: '#8b5cf6', Suite: '#f59e0b', Economy: '#10b981' };

  const inputStyle = {
    width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
    color: '#e2e8f0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif",
  };
  const labelStyle = { display: 'block', fontSize: '12px', color: '#94a3b8', fontWeight: 500, marginBottom: '6px' };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <i className="ti ti-loader-2" style={{ fontSize: '40px', color: '#3b82f6' }} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#e2e8f0', fontSize: '24px', fontWeight: 700, margin: '0 0 4px', fontFamily: "'Outfit', sans-serif" }}>Oda Yonetimi</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>{rooms.length} oda kayitli</p>
        </div>
        <button onClick={openAdd} style={{
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
          border: 'none', borderRadius: '10px', padding: '11px 20px', fontSize: '14px', fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
        }}>
          <i className="ti ti-plus" />
          Oda Ekle
        </button>
      </div>

      {/* Filters + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s',
              background: filter === f.key ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'rgba(255,255,255,0.05)',
              color: filter === f.key ? '#fff' : '#94a3b8',
              borderColor: filter === f.key ? 'transparent' : 'rgba(255,255,255,0.08)',
            }}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '15px' }} />
          <input
            type="text" placeholder="Oda ara..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '36px', width: '220px' }}
          />
        </div>
      </div>

      {/* Room Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <i className="ti ti-building-off" style={{ fontSize: '48px', color: '#334155', display: 'block', marginBottom: '16px' }} />
          <p style={{ color: '#475569', fontSize: '16px', margin: '0 0 8px', fontWeight: 500 }}>Oda bulunamadi</p>
          <p style={{ color: '#334155', fontSize: '14px', margin: 0 }}>Filtreleri degistirmeyi veya yeni oda eklemeyi deneyin</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {filtered.map(room => (
            <div key={room.id} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Image */}
              <div style={{ height: '130px', background: 'linear-gradient(135deg,#0f172a,#1e293b)', position: 'relative', overflow: 'hidden' }}>
                {room.image && !imgErrors[room.id] ? (
                  <img
                    src={room.image} alt={`Oda ${room.number}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setImgErrors(p => ({ ...p, [room.id]: true }))}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <i className="ti ti-bed" style={{ fontSize: '40px', color: '#334155' }} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <StatusBadge status={room.status} size="sm" />
                </div>
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: typeColors[room.type] || '#3b82f6', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                  {room.type}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 700, margin: '0 0 2px', fontFamily: "'Outfit', sans-serif" }}>
                      Oda {room.number}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{room.floor}. Kat</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#34d399', fontSize: '16px', fontWeight: 700, margin: 0 }}>
                      &#8378;{(room.pricePerNight || 0).toLocaleString('tr-TR')}
                    </p>
                    <p style={{ color: '#475569', fontSize: '11px', margin: '2px 0 0' }}>/gece</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="ti ti-users" style={{ fontSize: '14px', color: '#64748b' }} />
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>{room.capacity} kisi</span>
                  </div>
                  {room.features && room.features.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="ti ti-star" style={{ fontSize: '14px', color: '#64748b' }} />
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>{room.features.length} ozellik</span>
                    </div>
                  )}
                </div>

                {room.description && (
                  <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {room.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button onClick={() => openEdit(room)} style={{
                    flex: 1, padding: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    color: '#60a5fa', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  }}>
                    <i className="ti ti-edit" />
                    Duzenle
                  </button>
                  <button onClick={() => setConfirmId(room.id)} style={{
                    flex: 1, padding: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  }}>
                    <i className="ti ti-trash" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editRoom ? `Oda ${editRoom.number} - Duzenle` : 'Yeni Oda Ekle'} width={620}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>ODA NUMARASI</label>
            <input style={inputStyle} value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} placeholder="101" />
          </div>
          <div>
            <label style={labelStyle}>KAT</label>
            <input style={inputStyle} type="number" value={form.floor} onChange={e => setForm(p => ({ ...p, floor: e.target.value }))} placeholder="1" />
          </div>
          <div>
            <label style={labelStyle}>TIP</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
              {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>KAPASİTE</label>
            <input style={inputStyle} type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} placeholder="2" />
          </div>
          <div>
            <label style={labelStyle}>GECELİK FİYAT (TL)</label>
            <input style={inputStyle} type="number" value={form.pricePerNight} onChange={e => setForm(p => ({ ...p, pricePerNight: e.target.value }))} placeholder="1500" />
          </div>
          <div>
            <label style={labelStyle}>DURUM</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>AÇIKLAMA</label>
          <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Oda hakkinda kisa aciklama..." />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>RESİM URL</label>
          <input style={inputStyle} value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ ...labelStyle, marginBottom: '10px' }}>OZELLİKLER</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {FEATURES.map(f => {
              const active = form.features.includes(f);
              return (
                <button key={f} type="button" onClick={() => handleFeatureToggle(f)} style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                  background: active ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)',
                  color: active ? '#60a5fa' : '#64748b',
                  border: active ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.15s',
                }}>
                  {active && <i className="ti ti-check" style={{ marginRight: '4px', fontSize: '11px' }} />}
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => setModalOpen(false)} style={{
            padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
          }}>
            Vazgec
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '10px 24px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
            border: 'none', color: '#fff', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {saving ? <><i className="ti ti-loader-2" /> Kaydediliyor...</> : <><i className="ti ti-device-floppy" /> {editRoom ? 'Guncelle' : 'Ekle'}</>}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete}
        message="Bu odayi silmek istediginizden emin misiniz? Bu islem geri alinamaz."
        confirmLabel="Sil" confirmColor="#ef4444" icon="ti-trash"
      />
    </div>
  );
}