import { useHotel } from "../context/HotelContext";

const STATUS_COLOR = {
  available: { bg: "#dcfce7", color: "#15803d", label: "Boş" },
  occupied: { bg: "#dbeafe", color: "#1d4ed8", label: "Dolu" },
  reserved: { bg: "#fef9c3", color: "#a16207", label: "Rezerveli" },
  cleaning: { bg: "#f3e8ff", color: "#7e22ce", label: "Temizlik" },
};

export default function Dashboard() {
  const { rooms, reservations } = useHotel();

  const total = rooms.length;
  const occupied = rooms.filter(r => r.status === "occupied").length;
  const available = rooms.filter(r => r.status === "available").length;
  const reserved = rooms.filter(r => r.status === "reserved").length;
  const occupancyRate = total ? Math.round((occupied / total) * 100) : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayCheckIns = reservations.filter(r => r.checkIn === todayStr && r.status === "confirmed").length;
  const todayCheckOuts = reservations.filter(r => r.checkOut === todayStr && r.status === "checked-in").length;
  const activeRevenue = reservations
    .filter(r => r.status === "checked-in" || r.status === "confirmed")
    .reduce((s, r) => s + (r.totalPrice || 0), 0);

  const recent = [...reservations].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

  const stats = [
    { label: "Toplam Oda", value: total, icon: "ti-building", color: "#1e40af", bg: "#dbeafe" },
    { label: "Dolu Oda", value: occupied, icon: "ti-users", color: "#0f766e", bg: "#ccfbf1" },
    { label: "Boş Oda", value: available, icon: "ti-check", color: "#15803d", bg: "#dcfce7" },
    { label: "Doluluk Oranı", value: `${occupancyRate}%`, icon: "ti-chart-pie", color: "#7c3aed", bg: "#ede9fe" },
    { label: "Bugün Check-in", value: todayCheckIns, icon: "ti-door-enter", color: "#b45309", bg: "#fef3c7" },
    { label: "Bugün Check-out", value: todayCheckOuts, icon: "ti-door-exit", color: "#dc2626", bg: "#fee2e2" },
    { label: "Aktif Rezervasyon", value: reservations.filter(r => ["confirmed","checked-in"].includes(r.status)).length, icon: "ti-calendar", color: "#0369a1", bg: "#e0f2fe" },
    { label: "Beklenen Gelir", value: `₺${activeRevenue.toLocaleString("tr-TR")}`, icon: "ti-currency-lira", color: "#065f46", bg: "#d1fae5" },
  ];

  return (
    <div>
      {/* Stat grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 12, padding: "16px",
            border: "1px solid rgba(0,0,0,0.03)", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>{s.label}</span>
              <span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: "4px 6px", display: "flex" }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: 15 }} />
              </span>
            </div>
            <p style={{ fontSize: 22, fontWeight: 600, color: "#0c2340", margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Oda durumu */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.03)", boxShadow: "0 6px 16px rgba(0,0,0,0.04)", padding: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#0c2340", margin: "0 0 16px" }}>Oda Durumları</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(STATUS_COLOR).map(([status, cfg]) => {
              const count = rooms.filter(r => r.status === status).length;
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: "#475569" }}>{cfg.label}</span>
                    <span style={{ fontWeight: 500, color: "#0c2340" }}>{count} oda ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: cfg.color, borderRadius: 4, transition: "width 0.4s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Son rezervasyonlar */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.03)", boxShadow: "0 6px 16px rgba(0,0,0,0.04)", padding: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#0c2340", margin: "0 0 16px" }}>Son Rezervasyonlar</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recent.length === 0 && <p style={{ color: "#94a3b8", fontSize: 13 }}>Henüz rezervasyon yok.</p>}
            {recent.map(r => {
              const statusMap = {
                confirmed: { label: "Onaylı", color: "#a16207", bg: "#fef9c3" },
                "checked-in": { label: "Check-in", color: "#1d4ed8", bg: "#dbeafe" },
                "checked-out": { label: "Check-out", color: "#475569", bg: "#f1f5f9" },
              };
              const s = statusMap[r.status] || { label: r.status, color: "#475569", bg: "#f1f5f9" };
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#0c2340" }}>{r.guestName}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Oda {r.roomNumber} · {r.checkIn} → {r.checkOut}</p>
                  </div>
                  <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 5 }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
