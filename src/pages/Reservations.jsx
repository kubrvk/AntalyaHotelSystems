import { useState } from "react";
import { useHotel } from "../context/HotelContext";

const EMPTY_FORM = { guestName: "", guestPhone: "", roomId: "", checkIn: "", checkOut: "", notes: "" };

const STATUS_STYLE = {
  confirmed: { label: "Onaylı", bg: "#fef9c3", color: "#a16207" },
  "checked-in": { label: "Check-in", bg: "#dbeafe", color: "#1d4ed8" },
  "checked-out": { label: "Check-out", bg: "#f1f5f9", color: "#475569" },
  cancelled: { label: "İptal", bg: "#fee2e2", color: "#dc2626" },
};

function calcNights(a, b) {
  if (!a || !b) return 0;
  const diff = (new Date(b) - new Date(a)) / 86400000;
  return Math.max(0, diff);
}

export default function Reservations() {
  const { rooms, reservations, addReservation, deleteReservation, updateReservation } = useHotel();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirm, setConfirm] = useState(null);

  const availableRooms = rooms.filter(r => r.status === "available" || r.status === "reserved");
  const selectedRoom = rooms.find(r => r.id === form.roomId);
  const nights = calcNights(form.checkIn, form.checkOut);
  const totalPrice = selectedRoom ? nights * selectedRoom.pricePerNight : 0;

  const filtered = filterStatus === "all" ? reservations : reservations.filter(r => r.status === filterStatus);

  function handleSave() {
    if (!form.guestName || !form.roomId || !form.checkIn || !form.checkOut) return;
    const room = rooms.find(r => r.id === form.roomId);
    addReservation({ ...form, roomNumber: room?.number, totalPrice });
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "confirmed", "checked-in", "checked-out"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer",
              border: "1px solid",
              borderColor: filterStatus === s ? "#1e40af" : "#e2e8f0",
              background: filterStatus === s ? "#1e40af" : "#fff",
              color: filterStatus === s ? "#fff" : "#475569",
            }}>
              {s === "all" ? "Tümü" : STATUS_STYLE[s]?.label}
            </button>
          ))}
        </div>
        <button onClick={() => { setShowModal(true); setForm(EMPTY_FORM); }} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 8, border: "none",
          background: "#1e40af", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} /> Yeni Rezervasyon
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Misafir", "Telefon", "Oda", "Giriş", "Çıkış", "Toplam", "Durum", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontWeight: 500, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>Rezervasyon bulunamadı.</td></tr>
              )}
              {filtered.map(r => {
                const ss = STATUS_STYLE[r.status] || { label: r.status, bg: "#f1f5f9", color: "#475569" };
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500, color: "#0c2340" }}>{r.guestName}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{r.guestPhone || "-"}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>Oda {r.roomNumber}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{r.checkIn}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{r.checkOut}</td>
                    <td style={{ padding: "12px 16px", color: "#0c2340", fontWeight: 500 }}>₺{Number(r.totalPrice || 0).toLocaleString("tr-TR")}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5 }}>{ss.label}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {r.status === "confirmed" && (
                          <button onClick={() => updateReservation(r.id, { status: "cancelled" })} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "1px solid #fecaca", background: "#fff5f5", color: "#dc2626", cursor: "pointer" }}>
                            İptal
                          </button>
                        )}
                        <button onClick={() => setConfirm(r.id)} style={{ fontSize: 11, padding: "4px 6px", borderRadius: 5, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#94a3b8", cursor: "pointer" }}>
                          <i className="ti ti-trash" style={{ fontSize: 12 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 440, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#0c2340" }}>Yeni Rezervasyon</h2>
              <button onClick={() => setShowModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20 }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Misafir Adı Soyadı", key: "guestName", type: "text" },
                { label: "Telefon", key: "guestPhone", type: "text" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Oda Seçin</label>
                <select value={form.roomId} onChange={e => setForm(p => ({ ...p, roomId: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14 }}>
                  <option value="">-- Oda seçin --</option>
                  {availableRooms.map(r => (
                    <option key={r.id} value={r.id}>Oda {r.number} — {r.type} — ₺{r.pricePerNight}/gece</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ label: "Giriş Tarihi", key: "checkIn" }, { label: "Çıkış Tarihi", key: "checkOut" }].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{f.label}</label>
                    <input type="date" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Notlar</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 14, boxSizing: "border-box", resize: "vertical" }} />
              </div>
              {nights > 0 && selectedRoom && (
                <div style={{ background: "#eff6ff", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
                  <span style={{ color: "#1d4ed8", fontWeight: 500 }}>{nights} gece × ₺{selectedRoom.pricePerNight.toLocaleString("tr-TR")} = </span>
                  <span style={{ color: "#1e40af", fontWeight: 700, fontSize: 15 }}>₺{totalPrice.toLocaleString("tr-TR")}</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "9px", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 14 }}>İptal</button>
              <button onClick={handleSave} style={{ flex: 1, padding: "9px", border: "none", borderRadius: 7, background: "#1e40af", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>Rezervasyon Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 320 }}>
            <p style={{ margin: "0 0 16px", fontWeight: 500, color: "#0c2340" }}>Bu rezervasyonu silmek istiyor musun?</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setConfirm(null)} style={{ flex: 1, padding: "8px", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer" }}>İptal</button>
              <button onClick={() => { deleteReservation(confirm); setConfirm(null); }} style={{ flex: 1, padding: "8px", border: "none", borderRadius: 7, background: "#dc2626", color: "#fff", cursor: "pointer", fontWeight: 500 }}>Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
