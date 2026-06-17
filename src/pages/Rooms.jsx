import { useState } from "react";
import { useHotel } from "../context/HotelContext";

const STATUS_OPTS = ["available", "occupied", "reserved", "cleaning"];
const STATUS_LABELS = { available: "Boş", occupied: "Dolu", reserved: "Rezerveli", cleaning: "Temizlik" };
const STATUS_STYLE = {
  available: { bg: "#dcfce7", color: "#15803d" },
  occupied: { bg: "#dbeafe", color: "#1d4ed8" },
  reserved: { bg: "#fef9c3", color: "#a16207" },
  cleaning: { bg: "#f3e8ff", color: "#7e22ce" },
};
const ROOM_TYPES = ["Standart", "Deluxe", "Suite", "Ekonomi"];

const EMPTY_FORM = { number: "", type: "Standart", capacity: 2, pricePerNight: 800, floor: 1, status: "available" };

export default function Rooms() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useHotel();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirm, setConfirm] = useState(null);

  const filtered = filterStatus === "all" ? rooms : rooms.filter(r => r.status === filterStatus);

  function openAdd() { setForm(EMPTY_FORM); setEditing(null); setShowModal(true); }
  function openEdit(room) { setForm({ ...room }); setEditing(room.id); setShowModal(true); }
  function handleSave() {
    if (!form.number.trim()) return;
    if (editing) updateRoom(editing, form);
    else addRoom(form);
    setShowModal(false);
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", ...STATUS_OPTS].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer",
              border: "1px solid",
              borderColor: filterStatus === s ? "#1e40af" : "#e2e8f0",
              background: filterStatus === s ? "#1e40af" : "#fff",
              color: filterStatus === s ? "#fff" : "#475569",
              fontWeight: filterStatus === s ? 500 : 400,
            }}>
              {s === "all" ? "Tümü" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <button onClick={openAdd} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 8, border: "none",
          background: "#1e40af", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} /> Oda Ekle
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {filtered.map(room => {
          const ss = STATUS_STYLE[room.status];
          return (
            <div key={room.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0c2340" }}>Oda {room.number}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Kat {room.floor}</p>
                </div>
                <span style={{ background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 5 }}>
                  {STATUS_LABELS[room.status]}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>Tip</span>
                  <span style={{ fontWeight: 500, color: "#0c2340" }}>{room.type}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>Kapasite</span>
                  <span style={{ fontWeight: 500, color: "#0c2340" }}>{room.capacity} kişi</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>Gecelik</span>
                  <span style={{ fontWeight: 500, color: "#0c2340" }}>₺{Number(room.pricePerNight).toLocaleString("tr-TR")}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(room)} style={{
                  flex: 1, padding: "6px", border: "1px solid #e2e8f0", borderRadius: 6,
                  background: "#f8fafc", color: "#475569", fontSize: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                }}>
                  <i className="ti ti-edit" style={{ fontSize: 14 }} /> Düzenle
                </button>
                <button onClick={() => setConfirm(room.id)} style={{
                  padding: "6px 10px", border: "1px solid #fecaca", borderRadius: 6,
                  background: "#fff5f5", color: "#dc2626", fontSize: 12, cursor: "pointer",
                  display: "flex", alignItems: "center",
                }}>
                  <i className="ti ti-trash" style={{ fontSize: 14 }} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "#94a3b8" }}>
            <i className="ti ti-building-off" style={{ fontSize: 32, display: "block", marginBottom: 8 }} />
            Bu durumda oda bulunamadı.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 400, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#0c2340" }}>{editing ? "Odayı Düzenle" : "Yeni Oda Ekle"}</h2>
              <button onClick={() => setShowModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20 }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Oda Numarası", key: "number", type: "text" },
                { label: "Kat", key: "floor", type: "number" },
                { label: "Kapasite (kişi)", key: "capacity", type: "number" },
                { label: "Gecelik Fiyat (₺)", key: "pricePerNight", type: "number" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Oda Tipi</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14 }}>
                  {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Durum</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14 }}>
                  {STATUS_OPTS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "9px", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", color: "#475569", cursor: "pointer", fontSize: 14 }}>İptal</button>
              <button onClick={handleSave} style={{ flex: 1, padding: "9px", border: "none", borderRadius: 7, background: "#1e40af", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                {editing ? "Kaydet" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 320 }}>
            <p style={{ margin: "0 0 16px", fontWeight: 500, color: "#0c2340" }}>Bu odayı silmek istediğine emin misin?</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setConfirm(null)} style={{ flex: 1, padding: "8px", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer" }}>İptal</button>
              <button onClick={() => { deleteRoom(confirm); setConfirm(null); }} style={{ flex: 1, padding: "8px", border: "none", borderRadius: 7, background: "#dc2626", color: "#fff", cursor: "pointer", fontWeight: 500 }}>Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
