import { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';
import PublicRoomCard from '../../components/public/PublicRoomCard';

const TYPE_FILTERS = ['Tümü', 'Standard', 'Deluxe', 'Suite', 'Economy'];
const PRICE_FILTERS = [
  { label: 'Tümü', min: 0, max: Infinity },
  { label: '₺0 - 1500', min: 0, max: 1500 },
  { label: '₺1500 - 3000', min: 1500, max: 3000 },
  { label: '₺3000+', min: 3000, max: Infinity },
];

export default function RoomList() {
  const { rooms, loading } = useHotel();
  const [activeType, setActiveType] = useState('Tümü');
  const [priceFilter, setPriceFilter] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const pf = PRICE_FILTERS[priceFilter];
    return rooms.filter(r => {
      const matchType = activeType === 'Tümü' || r.type === activeType;
      const matchPrice = r.pricePerNight >= pf.min && r.pricePerNight < pf.max;
      const matchSearch = search === '' || r.number?.toString().includes(search) || r.type?.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
      return matchType && matchPrice && matchSearch;
    });
  }, [rooms, activeType, priceFilter, search]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f1c2e, #1e3a5f)', padding: '64px 40px 48px', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#93c5fd', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 50, marginBottom: 20 }}>
          Konaklamak İçin
        </span>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
          Odalarımız
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
          Her bütçeye ve zevke uygun özel odalarımızdan size en uygun olanı seçin.
        </p>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '20px 40px', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Oda ara..."
              style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, color: '#1e293b', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }}
            />
          </div>

          {/* Type chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TYPE_FILTERS.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                style={{ padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.18s', background: activeType === t ? 'linear-gradient(135deg, #1e3a5f, #2563eb)' : '#f1f5f9', color: activeType === t ? '#fff' : '#64748b', boxShadow: activeType === t ? '0 2px 8px rgba(37,99,235,0.3)' : 'none' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Price filter */}
          <select
            value={priceFilter}
            onChange={e => setPriceFilter(Number(e.target.value))}
            style={{ padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, color: '#1e293b', background: '#f8fafc', cursor: 'pointer', outline: 'none' }}
          >
            {PRICE_FILTERS.map((pf, i) => (
              <option key={i} value={i}>{pf.label}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px' }}>

        {/* Results count */}
        {!loading && rooms.length > 0 && (
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
            <strong style={{ color: '#1e293b' }}>{filtered.length}</strong> oda bulundu
          </p>
        )}

        {/* Loading */}
        {loading || rooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 56, height: 56, border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
            <p style={{ color: '#94a3b8', fontSize: 16 }}>Odalar yükleniyor...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <i className="ti ti-bed-off" style={{ fontSize: 40, color: '#cbd5e1' }} />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>Oda Bulunamadı</h3>
            <p style={{ color: '#64748b', fontSize: 15, marginBottom: 24 }}>Seçtiğiniz filtrelere uygun oda bulunmuyor.</p>
            <button onClick={() => { setActiveType('Tümü'); setPriceFilter(0); setSearch(''); }}
              style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filtered.map(room => <PublicRoomCard key={room.id} room={room} />)}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}