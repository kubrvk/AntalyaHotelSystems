import { useHotel } from "../context/HotelContext";

export default function CheckInOut() {
  const { reservations, checkIn, checkOut } = useHotel();

  const today = new Date().toISOString().split("T")[0];
  const pendingCheckIns = reservations.filter(r => r.status === "confirmed" && r.checkIn <= today);
  const pendingCheckOuts = reservations.filter(r => r.status === "checked-in" && r.checkOut <= today);
  const currentlyIn = reservations.filter(r => r.status === "checked-in" && r.checkOut > today);

  function GuestRow({ r, action, actionLabel, actionColor, actionBg }) {
    const nights = Math.max(0, Math.round((new Date(r.checkOut) - new Date(r.checkIn)) / 86400000));
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#0c2340" }}>{r.guestName}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
            Oda {r.roomNumber} · {r.checkIn} → {r.checkOut} · {nights} gece · ₺{Number(r.totalPrice || 0).toLocaleString("tr-TR")}
          </p>
          {r.notes && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#60a5fa", fontStyle: "italic" }}>Not: {r.notes}</p>}
        </div>
        <button onClick={() => action(r.id)} style={{
          marginLeft: 12, padding: "7px 16px", borderRadius: 7, border: "none",
          background: actionBg, color: actionColor,
          fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
        }}>
          {actionLabel}
        </button>
      </div>
    );
  }

  function Section({ title, icon, items, action, actionLabel, actionColor, actionBg, emptyText, accentColor }) {
    return (
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: accentColor + "22", color: accentColor, borderRadius: 6, padding: "4px 6px", display: "flex" }}>
            <i className={`ti ${icon}`} style={{ fontSize: 16 }} />
          </span>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0c2340" }}>{title}</h2>
          <span style={{ marginLeft: "auto", background: accentColor + "22", color: accentColor, fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>{items.length}</span>
        </div>
        {items.length === 0 ? (
          <p style={{ padding: "20px 16px", color: "#94a3b8", fontSize: 13, margin: 0 }}>{emptyText}</p>
        ) : (
          items.map(r => (
            <GuestRow key={r.id} r={r} action={action} actionLabel={actionLabel} actionColor={actionColor} actionBg={actionBg} />
          ))
        )}
      </div>
    );
  }

  return (
    <div>
      <Section
        title="Bekleyen Check-in'ler"
        icon="ti-door-enter"
        items={pendingCheckIns}
        action={checkIn}
        actionLabel="Check-in Yap"
        actionColor="#fff"
        actionBg="#1e40af"
        accentColor="#1d4ed8"
        emptyText="Bugün için bekleyen check-in yok."
      />
      <Section
        title="Bekleyen Check-out'lar"
        icon="ti-door-exit"
        items={pendingCheckOuts}
        action={checkOut}
        actionLabel="Check-out Yap"
        actionColor="#fff"
        actionBg="#dc2626"
        accentColor="#dc2626"
        emptyText="Bugün için bekleyen check-out yok."
      />
      <Section
        title="Şu An Konaklayanlar"
        icon="ti-users"
        items={currentlyIn}
        action={checkOut}
        actionLabel="Erken Check-out"
        actionColor="#dc2626"
        actionBg="#fee2e2"
        accentColor="#0f766e"
        emptyText="Şu an konaklamakta olan misafir yok."
      />
    </div>
  );
}
